rcvr = {};

rcvr.clock = null;

rcvr.namespace = 'urn:x-cast:me.geniusburger.cast.wordclock';

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
        rcvr.log('Received Sender Disconnected event: ' + event.data);
        if (window.castReceiverManager.getSenders().length == 0) {
            window.close();
        }
    };

    castReceiverManager.onSystemVolumeChanged = function (event) {
        rcvr.log('Received System Volume Changed event: ' + event.data['level'] + ' ' + event.data['muted']);
    };

    // create a CastMessageBus to handle messages for a custom namespace
    window.messageBus = window.castReceiverManager.getCastMessageBus(rcvr.namespace);

    // handler for the CastMessageBus message event
    window.messageBus.onMessage = function (event) {
        rcvr.log('Message [' + event.senderId + ']: ' + event.data);
        // display the message from the sender
        rcvr.clock.updateSettings(event.data);
        window.castReceiverManager.setApplicationState(JSON.stringify(event.data));
        // inform all senders on the CastMessageBus of the incoming message event
        // sender message listener will be invoked
        window.messageBus.send(event.senderId, event.data);
    };

    // initialize the CastReceiverManager with an application status message
    window.castReceiverManager.start({statusText: "Application is starting"});
    rcvr.log('Receiver Manager started');
};

rcvr.log = function(message) {
    console.log(message);
    var dw = document.getElementById("debugmessage");
    dw.innerHTML += '\n' + JSON.stringify(message);
};

rcvr.receiverInit = function () {
    rcvr.clock = new Clock(document.getElementById('clock'));
    castInit();
};

rcvr.addEvent = function (el, evnt, func) {
    if (el.addEventListener) {
        el.addEventListener(evnt, func, false);
    } else if (el.attachEvent) {
        el.attachEvent('on' + evnt, func);
    }
};

rcvr.addEvent(window, 'load', receiverInit);