rcvr = {};

rcvr.clock = null;
rcvr.initialized = false;
rcvr.messageQueue = [];
rcvr.isMessageDisplayed = false;
rcvr.defaultMessage = null;
rcvr.isDefaultMessageDisplayed = false;
rcvr.isDefaultMessageFading = false;

rcvr.castInit = function () {
    cast.receiver.logger.setLevelValue(0);
    window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
    rcvr.log('Starting Receiver Manager');

    castReceiverManager.onReady = function (event) {
        rcvr.log('Received Ready event: ' + JSON.stringify(event.data));
        window.castReceiverManager.setApplicationState("Application status is ready...");
    };

    castReceiverManager.onSenderConnected = function (event) {
        rcvr.log('Received Sender Connected event: ' + event.data);
        rcvr.log(window.castReceiverManager.getSender(event.data).userAgent);
    };

    castReceiverManager.onSenderDisconnected = function (event) {
        rcvr.log('Ignoring Received Sender Disconnected event: ' + event.data);
//        if (window.castReceiverManager.getSenders().length == 0) {
//            window.close();
//        }
    };

    castReceiverManager.onSystemVolumeChanged = function (event) {
        rcvr.log('Received System Volume Changed event: ' + event.data['level'] + ' ' + event.data['muted']);
    };

    // create a CastMessageBus to handle messages for a custom namespace
    window.messageBus = window.castReceiverManager.getCastMessageBus(Clock.NAMESPACE);

    // handler for the CastMessageBus message event
    window.messageBus.onMessage = rcvr.onMessage;

    // initialize the CastReceiverManager with an application status message
    window.castReceiverManager.start({statusText: "Application is starting"});
    rcvr.log('Receiver Manager started');
};

rcvr.onMessage = function (event) {
    rcvr.log('Message [' + event.senderId + ']: ' + event.data);

    var message = JSON.parse(event.data);
    if (message.hasOwnProperty('id')) {
        switch (message.id) {
            case Message.id.INITIALIZE:
                // Only init if not initialized, otherwise don't respond
                if (!rcvr.initialized) {
                    rcvr.initialized = true;
                    rcvr.clock.updateSettings(message.data);
                    window.castReceiverManager.setApplicationState('Initialized');
                    document.getElementById('clock').style.visibility = 'visible';
                    rcvr.sendMessage(event, new InitializedMessage(event.senderId, rcvr.clock.settings));
                    if (rcvr.clock.settings.time.run) {
                        rcvr.setDefaultMessage();
                        rcvr.addToMessageQueue('started');
                    } else {
                        rcvr.setDefaultMessage('paused');
                    }
                    rcvr.clock.colorUpdatedListener = function () {
                        rcvr.addToMessageQueue('updated', 'colors')
                    };
                    rcvr.clock.durationUpdatedListener = function () {
                        rcvr.addToMessageQueue('updated', 'duration')
                    };
                    rcvr.clock.startUpdatedListener = function () {
                        rcvr.addToMessageQueue('updated', 'time')
                    };
                    rcvr.clock.runUpdatedListener = function () {
                        if (rcvr.clock.settings.time.run) {
                            rcvr.setDefaultMessage();
                            rcvr.addToMessageQueue('started');
                        } else {
                            rcvr.setDefaultMessage('paused');
                        }
                    };
                } else {
                    window.castReceiverManager.setApplicationState('Ignored init message');
                    rcvr.sendMessage(event, new InitializedMessage(event.senderId, rcvr.clock.settings).failed(ResponseMessage.reason.REINIT));
                }
                break;
            case Message.id.UPDATE:
                rcvr.clock.updateSettings(message.data);
                window.castReceiverManager.setApplicationState('Updated');
                rcvr.sendMessage(event, new UpdatedMessage(rcvr.clock.settings));
                rcvr.broadcast(new SettingsMessage(event.senderId, rcvr.clock.settings));
                break;
            default:
                window.castReceiverManager.setApplicationState('Received message with odd id');
                rcvr.sendMessage(event, new ErrorMessage('Unexpected message id'));
                break;
        }
    } else {
        window.castReceiverManager.setApplicationState('Received message without id');
        rcvr.sendMessage(event, new ErrorMessage('Missing message id'));
    }
};

/**
 * Send a response message.
 * @param event The event being responded to.
 * @param {ResponseMessage} message
 */
rcvr.sendMessage = function (event, message) {
    var content = message.buildObjectToSend();
    rcvr.log('sending', content);
    window.messageBus.send(event.senderId, JSON.stringify(content));
};

/**
 * Send a broadcast message.
 * @param {BroadcastMessage} message
 */
rcvr.broadcast = function (message) {
    var content = message.buildObjectToSend();
    rcvr.log('broadcasting', content);
    window.messageBus.broadcast(JSON.stringify(content));
};

rcvr.tickListener = function (now) {
    rcvr.broadcast(new TimeMessage(now));
};

/**
 * Add a message to the message queue.
 * @param {string} left Message to display on the left side.
 * @param {string} [right] Message to display on the left side. Defaults to the left message.
 */
rcvr.addToMessageQueue = function (left, right) {
    console.log('addToMessageQueue', left, right);
    right = right || left;
    rcvr.messageQueue.push({left: left, right: right});
    if (!rcvr.isMessageDisplayed) {
        rcvr.displayQueuedMessage();
    }
};

rcvr.setDefaultMessage = function (left, right) {
    console.log('setDefaultMessage', left, right);
    right = right || left;
    if (left) {
        if (rcvr.defaultMessage) {
            console.log('updating default message');
            rcvr.defaultMessage = {left: left, right: right};
            if (!rcvr.isMessageDisplayed) {
                console.log('switching to new default');
                rcvr.hideDefaultMessage(document.getElementById('leftMessage'), document.getElementById('rightMessage'));
            }
        } else {
            console.log('new default message');
            rcvr.defaultMessage = {left: left, right: right};
            rcvr.displayQueuedMessage();
        }
    } else {
        console.log('clearing default message');
        rcvr.defaultMessage = null;
        rcvr.displayQueuedMessage();
    }
};

rcvr.hideDefaultMessage = function (left, right) {
    console.log('hideDefaultMessage');
    if (rcvr.isDefaultMessageDisplayed && !rcvr.isDefaultMessageFading) {
        console.log('hiding default');
        rcvr.isDefaultMessageFading = true;
        util.addEvent(left, 'transitionend', rcvr.doneHidingDefaultMessage);
        left.classList.remove('animate-show');
        right.classList.remove('animate-show');
    }
};

rcvr.doneHidingDefaultMessage = function () {
    console.log('done hiding default');
    util.removeEvent(document.getElementById('leftMessage'), 'transitionend', rcvr.doneHidingDefaultMessage);
    rcvr.isDefaultMessageDisplayed = false;
    rcvr.isDefaultMessageFading = false;
    rcvr.displayQueuedMessage();
};

rcvr.displayQueuedMessage = function () {
    if (rcvr.isMessageDisplayed) {
        console.log('message already displayed');
        return;
    }
    var message = rcvr.messageQueue.shift();
    console.log('displayQueuedMessage', message);
    var left = document.getElementById('leftMessage');
    var right = document.getElementById('rightMessage');

    if (message) {
        console.log('message to display');
        if (rcvr.isDefaultMessageDisplayed) {
            console.log('need to hide default');
            // fade out the default message first, need to put the message back
            rcvr.messageQueue.unshift(message);
            rcvr.hideDefaultMessage(left, right);
        } else {
            console.log('displaying message');
            rcvr.isMessageDisplayed = true;

            left.querySelector('p').innerHTML = message.left;
            right.querySelector('p').innerHTML = message.right;

            util.addEvent(left, 'transitionend', rcvr.hideMessage);

            left.classList.add('animate-show');
            right.classList.add('animate-show');
        }
    } else {
        console.log('no message to display');
        rcvr.isMessageDisplayed = false;
        if (rcvr.defaultMessage) {
            console.log('defaulting');

            rcvr.isDefaultMessageDisplayed = true;

            left.querySelector('p').innerHTML = rcvr.defaultMessage.left;
            right.querySelector('p').innerHTML = rcvr.defaultMessage.right;

            left.classList.add('animate-show');
            right.classList.add('animate-show');
        } else {
            rcvr.hideDefaultMessage(left, right);
        }
    }
};

rcvr.doneHidingMessage = function () {
    console.log('done hiding message');
    util.removeEvent(document.getElementById('leftMessage'), 'transitionend', rcvr.doneHidingMessage);
    rcvr.isMessageDisplayed = false;
    rcvr.displayQueuedMessage();
};

rcvr.hideMessage = function () {
    console.log('hiding message');
    var left = document.getElementById('leftMessage');
    var right = document.getElementById('rightMessage');

    util.removeEvent(left, 'transitionend', rcvr.hideMessage);
    util.addEvent(left, 'transitionend', rcvr.doneHidingMessage);

    left.classList.remove('animate-show');
    right.classList.remove('animate-show');
};

rcvr.log = function (message) {
    if (arguments.length > 1) {
        console.log(arguments);
    } else {
        console.log(message);
    }
    var dw = document.getElementById("debugmessage");
    if (typeof message === 'object') {
        message = JSON.stringify(message);
    }
    dw.innerHTML += '\n' + message;
    dw.scrollTop = dw.scrollHeight;
};

rcvr.getQueryVariable = function(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if( pair[0] == variable){
            return pair.length === 2 ? pair[1] : true;;
        }
    }
    return false;
};

rcvr.receiverInit = function () {
    rcvr.clock = new Clock(document.getElementById('clock'));
    rcvr.clock.setTickListener(rcvr.tickListener, 15000);
    rcvr.log(window.location.hostname);


    if (window.location.hostname === 'localhost' || rcvr.getQueryVariable('test')) {
        document.getElementById('clock').style.visibility = 'visible';
        //['test msg'].forEach(function (m) {
        //    rcvr.addToMessageQueue(m);
        //});
        rcvr.clock.now = new Date().getTime();
        var duration = rcvr.getQueryVariable('duration');
        if( duration) {
            rcvr.clock.settings.time.duration = duration;
        }
        rcvr.clock.setTickListener(null, 15000);
        rcvr.clock.updateClock();
        rcvr.clock.start();
    } else {
        rcvr.castInit();
    }
};

util.addEvent(window, 'load', rcvr.receiverInit);