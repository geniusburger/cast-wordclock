rcvr = {};

rcvr.clock = null;
rcvr.initialized = false;

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
    if( message.hasOwnProperty('id')) {
        switch(message.id) {
            case Message.id.INITIALIZE:
                // Only init if not initialized, otherwise don't respond
                if( !rcvr.initialized) {
                    rcvr.initialized = true;
                    rcvr.clock.updateSettings(message.data);
                    window.castReceiverManager.setApplicationState('Initialized');
                    document.getElementById('clock').style.visibility = 'visible';
                    rcvr.sendMessage(event, new InitializedMessage(event.senderId, rcvr.clock.settings));
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
rcvr.sendMessage = function(event, message) {
    var content = message.buildObjectToSend();
    rcvr.log('sending', content);
    window.messageBus.send(event.senderId, JSON.stringify(content));
};

/**
 * Send a broadcast message.
 * @param {BroadcastMessage} message
 */
rcvr.broadcast = function(message) {
    var content = message.buildObjectToSend();
    rcvr.log('broadcasting', content);
    window.messageBus.broadcast(JSON.stringify(content));
};

rcvr.onTickListener = function(now) {
    rcvr.broadcast(new TimeMessage(now));
};

rcvr.log = function(message) {
    if( arguments.length > 1) {
        console.log(arguments);
    } else {
        console.log(message);
    }
    var dw = document.getElementById("debugmessage");
    if( typeof message === 'object') {
        message = JSON.stringify(message);
    }
    dw.innerHTML += '\n' + message;
    dw.scrollTop = dw.scrollHeight;
};

rcvr.receiverInit = function () {
    rcvr.clock = new Clock(document.getElementById('clock'));
    rcvr.clock.setOnTickListener(rcvr.onTickListener, 15000);
    rcvr.log(window.location.hostname);
    if( window.location.hostname === 'localhost') {
        document.getElementById('clock').style.visibility = 'visible';
    } else {
        rcvr.castInit();
    }
};

rcvr.addEvent = function (el, evnt, func) {
    if (el.addEventListener) {
        el.addEventListener(evnt, func, false);
    } else if (el.attachEvent) {
        el.attachEvent('on' + evnt, func);
    }
};

rcvr.addEvent(window, 'load', rcvr.receiverInit);