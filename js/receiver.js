rcvr = {};

rcvr.clock = null;

rcvr.namespace = 'urn:x-cast:me.geniusburger.cast.wordclock';
rcvr.intialized = false;

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
    window.messageBus = window.castReceiverManager.getCastMessageBus(rcvr.namespace);

    // handler for the CastMessageBus message event
    window.messageBus.onMessage = rcvr.onMessage;

    // initialize the CastReceiverManager with an application status message
    window.castReceiverManager.start({statusText: "Application is starting"});
    rcvr.log('Receiver Manager started');
};

rcvr.onMessage = function (event) {
    rcvr.log('Message [' + event.senderId + ']: ' + event.data);

    var message = JSON.parse(event.data);
    if( message.hasOwnProperty('type')) {
        switch(message.type) {
            case Message.type.INITIALIZE:
                // Only init if not initialized, otherwise don't respond
                if( !rcvr.intialized) {
                    rcvr.clock.updateSettings(message.settings);
                    window.castReceiverManager.setApplicationState('Initialized');
                    rcvr.sendMessage(new InitializedMessage(true, rcvr.clock.settings));
                } else {
                    window.castReceiverManager.setApplicationState('Ignored init message');
                }
                break;
            case Message.type.UPDATE:
                rcvr.clock.updateSettings(message.settings);
                window.castReceiverManager.setApplicationState('Updated');
                rcvr.sendMessage(new UpdatedMessage(true, rcvr.clock.settings));
                rcvr.broadcast(new SettingsMessage(rcvr.clock.settings));
                break;
            default:
                window.castReceiverManager.setApplicationState('Received message with odd type');
                rcvr.sendMessage(new ErrorMessage('Unexpected message type'));
                break;
        }
    } else {
        window.castReceiverManager.setApplicationState('Received message without type');
        rcvr.sendMessage(new ErrorMessage('Missing message type'));
    }
};

rcvr.sendMessage = function(event, message) {
    window.messageBus.send(event.senderId, JSON.stringify(message));
};

rcvr.broadcast = function(message) {
    window.messageBus.broadcast(JSON.stringify(message));
};

rcvr.log = function(message) {
    console.log(message);
    var dw = document.getElementById("debugmessage");
    if( typeof message === 'object') {
        message = JSON.stringify(message);
    }
    dw.innerHTML += '\n' + message;
    dw.scrollTop = dw.scrollHeight;
};

rcvr.receiverInit = function () {
    rcvr.clock = new Clock(document.getElementById('clock'));
    rcvr.castInit();
};

rcvr.addEvent = function (el, evnt, func) {
    if (el.addEventListener) {
        el.addEventListener(evnt, func, false);
    } else if (el.attachEvent) {
        el.attachEvent('on' + evnt, func);
    }
};

rcvr.addEvent(window, 'load', rcvr.receiverInit);