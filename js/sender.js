sender = {};
sender.session = null;
sender.lastCookie = null;
/**
 * Holds the most recently sent message.
 * @type {Message}
 */
sender.lastMessage = null;
/**
 * true if a blocking message was sent and a response hasn't been received yet.
 * @type {boolean}
 */
sender.blocked = false;

/**
 * initialization
 */
sender.initializeCastApi = function () {
    sender.setStatus('Initializing...');
    var sessionRequest = new chrome.cast.SessionRequest(Clock.APP_ID);
    var apiConfig = new chrome.cast.ApiConfig(sessionRequest, sender.sessionListener, sender.receiverListener);
    chrome.cast.initialize(apiConfig, sender.onInitSuccess, sender.onError);
};

/**
 * initialization success callback
 */
sender.onInitSuccess = function () {
    sender.log("onInitSuccess");
    sender.setStatus('Initialized');
};

/**
 * initialization error callback
 */
sender.onError = function (message) {
    sender.setStatus('Error', 'error');
    sender.log("onError: " + JSON.stringify(message));
};

/**
 * generic success callback
 */
sender.onSuccess = function (message) {
    sender.log("onSuccess: " + message);
};

/**
 * callback on success for stopping app
 */
sender.onStopAppSuccess = function () {
    sender.log('onStopAppSuccess');
};

/**
 * session listener during initialization
 */
sender.sessionListener = function (e) {
    sender.setStatus('Connected', 'success');
    sender.log('New session ID:' + e.sessionId);
    sender.session = e;
    sender.session.addUpdateListener(sender.sessionUpdateListener);
    sender.session.addMessageListener(Clock.NAMESPACE, sender.receiverMessage);
    sender.sendMessage(new InitializeMessage(sender.lastCookie));
};

/**
 * listener for session updates
 */
sender.sessionUpdateListener = function (isAlive) {
    var message = (isAlive ? 'Session Updated' : 'Session Removed') + ': ' + sender.session.sessionId;
    sender.log(message);
    if (!isAlive) {
        sender.setStatus('Disconnected');
        sender.session = null;
        sender.enableControls(false);
    }
};

/**
 * utility function to log messages from the receiver
 * @param {string} namespace The namespace of the message
 * @param {string} stringMessage A message string
 */
sender.receiverMessage = function (namespace, stringMessage) {
    sender.log("receiverMessage: " + namespace + ", " + stringMessage);
    if (namespace === Clock.NAMESPACE) {
        var message = JSON.parse(stringMessage);
        if (message.hasOwnProperty('type')) {
            var send = false;

            if (sender.blocked) {
                if (sender.lastMessage.otherType === message.type) {
                    sender.blocked = false; // Unblock
                    send = true;
                } else {
                    sender.log('Ignoring message type ' + message.type + ', waiting for unblocking message type ' + sender.lastMessage.otherType);
                    sender.setStatus('Blocked', 'error');
                }
            } else {
                send = true;
            }

            if (send) {
                if (sender.processMessage(message)) {
                    sender.setStatus(sender.lastMessage.successStatus, sender.lastMessage.isBlocking ? 'success' : null);
                } else {
                    sender.setStatus(sender.lastMessage.errorStatus, 'error');
                }
            }
        } else {
            sender.log('Invalid message');
            sender.setStatus('Message Error', 'error');
        }
    }
};

sender.processMessage = function (message) {
    switch (message.type) {
        case Message.type.INITIALIZED:
            if (message.data.success) {
                if (util.isValidObject(message.data.data, Clock.defaults, sender)) {
                    // TODO handle checking if initialized correctly
                    util.setCookie('settings', message.data.data);
                    sender.loadSettings(message.data.data);
                    return true;
                } else {
                    sender.log('Invalid settings object');
                }
            }
            break;
        case Message.type.UPDATED:
            if (message.data.success) {
                if (util.isValidObject(message.data.data, Clock.defaults, sender)) {
                    // TODO handle checking if updated correctly
                    util.setCookie('settings', message.data.data);
                    sender.loadSettings(message.data.data);
                    return true;
                } else {
                    sender.log('Invalid settings object');
                }
            }
            break;
        case Message.type.SETTINGS:
            // TODO handle current settings
            if (util.isValidObject(message.data, Clock.defaults, sender)) {
                util.setCookie('settings', message.data);
                sender.loadSettings(message.data);
                return true;
            } else {
                sender.log('Invalid settings object');
            }
            break;
    }
    return false;
};

sender.loadSettings = function (settings) {
    sender.lastCookie = settings;
    sender.enableControls(true, settings);
    document.getElementById('backgroundColor').value = settings.display.color.background;
    document.getElementById('activeColor').value = settings.display.color.active;
    document.getElementById('inactiveColor').value = settings.display.color.inactive;
    document.getElementById('duration').value = settings.time.duration;
    document.getElementById('run').innerHTML = settings.time.run ? 'Stop' : 'Run';
};

sender.enableControls = function (enable, settings) {
    document.getElementById('backgroundColor').disabled = !enable;
    document.getElementById('activeColor').disabled = !enable;
    document.getElementById('inactiveColor').disabled = !enable;
    document.getElementById('updateColors').disabled = !enable;
    document.getElementById('duration').disabled = !enable;
    document.getElementById('updateDuration').disabled = !enable;
    document.getElementById('run').disabled = !enable;
};

/**
 * receiver listener during initialization
 */
sender.receiverListener = function (e) {
    if (e === chrome.cast.ReceiverAvailability.AVAILABLE) {
        sender.log("receiver found");
        sender.setStatus('Connect Device');
        chrome.cast.requestSession(sender.sessionListener, sender.error);
    }
    else {
        sender.log("receiver list empty, " + e);
        sender.setStatus('No Devices Found', 'error');
    }
};

/**
 * stop app/session
 */
sender.stopApp = function () {
    sender.session.stop(sender.onStopAppSuccess, sender.onError);
};

/**
 * send a message to the receiver using the custom namespace
 * receiver CastMessageBus message handler will be invoked
 * @param {Message} message A message string
 */
sender.sendMessage = function (message) {
    if (sender.session == null) {
        sender.log("tried to send message without a session");
        sender.setStatus('Missing Session', 'error');
    } else if (sender.blocked) {
        sender.log('tried to send message while blocked');
        sender.setStatus('Blocked');
    } else {
        sender.setStatus(message.sendingStatus);
        sender.lastMessage = message;
        sender.blocked = message.isBlocking;
        sender.session.sendMessage(Clock.NAMESPACE, {type: message.type, data: message.data}, sender.onSuccess.bind(this, "Message sent: " + message), sender.onError);
    }
};

sender.updateColors = function () {
    var settings = {
        display: {
            color: {
                background: document.getElementById('backgroundColor').value,
                active: document.getElementById('activeColor').value,
                inactive: document.getElementById('inactiveColor').value
            }
        }
    };

    sender.sendMessage(new UpdateMessage(settings));
};

sender.updateRunOrStop = function () {
    var settings = {
        time: {
            run: !sender.lastCookie.time.run
        }
    };

    sender.sendMessage(new UpdateMessage(settings));
};

sender.updateDuration = function () {
    var settings = {
        time: {
            duration: document.getElementById('duration').value
        }
    };

    sender.sendMessage(new UpdateMessage(settings));
};

sender.log = function (message) {
    console.log(message);
    var dw = document.getElementById("debugmessage");
    if (typeof message === 'object') {
        message = JSON.stringify(message);
    }
    dw.innerHTML += '\n' + message;
    dw.scrollTop = dw.scrollHeight;
};

sender.setStatus = function (status, type) {
    if (typeof status === 'string') {
        var label = document.getElementById('status');
        label.innerHTML = status;
        label.parentNode.classList.remove('error');
        label.parentNode.classList.remove('success');
        if (type === 'error') {
            label.parentNode.classList.add('error');
        } else if (type === 'success') {
            label.parentNode.classList.add('success');
        }
    }
};


sender.init = function () {
    sender.log('init');
    sender.setStatus('Loading');
    var cookie = util.getCookie('settings');
    if (cookie == null) {
        cookie = Clock.defaults;
    }
    sender.loadSettings(cookie);
    sender.enableControls(false);
    jscolor.init();
};

window['__onGCastApiAvailable'] = function (loaded, errorInfo) {
    if (loaded) {
        sender.initializeCastApi();
    } else {
        sender.log(errorInfo);
    }
};

sender.addEvent = function (el, evnt, func) {
    if (el.addEventListener) {
        el.addEventListener(evnt, func, false);
    } else if (el.attachEvent) {
        el.attachEvent('on' + evnt, func);
    }
};

sender.addEvent(window, 'load', sender.init);
