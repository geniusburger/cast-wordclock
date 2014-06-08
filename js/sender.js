sender = {};
sender.TIMEOUT_DURATION = 7000;
sender.session = null;
sender.lastCookie = null;
sender.myId = null;

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
 * The ID of the last timeout that was set
 * @type {number|null}
 */
sender.timeoutId = null;

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
 * @param {chrome.cast.Session} session
 */
sender.sessionListener = function (session) {
    sender.setStatus('Connected', 'success');
    sender.log('New session ID:' + session.sessionId);
    sender.session = session;
    sender.session.addUpdateListener(sender.sessionUpdateListener);
    sender.session.addMessageListener(Clock.NAMESPACE, sender.receiverMessage);
    var now = new Date();
    sender.lastCookie.time.start = now.getTime() - now.getMilliseconds();
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
        if (message.hasOwnProperty('id')) {
            var process = false;

            if (sender.blocked) {
                if (sender.lastMessage.otherId === message.id) {
                    clearTimeout(sender.timeoutId);
                    sender.log('cleared timeout');
                    sender.blocked = false; // Unblock
                    sender.enableControls(true);
                    process = true;
                } else {
                    sender.log('Ignoring message id ' + message.id + ', waiting for unblocking message id ' + sender.lastMessage.otherId);
                    sender.setStatus('Blocked', 'error');
                }
            } else {
                process = true;
            }

            if (process) {
                var success = sender.processMessage(message);
                switch(message.type) {
                    case Message.type.BROADCAST:
                        // Construct an empty shell of the same message to access it's message properties
                        var shell = new window[message.id + 'Message']();
                        if (success === true) {
                            sender.setStatus(shell.successStatus, shell.isBlocking ? 'success' : null);
                        } else {
                            sender.setStatus(shell.errorStatus, 'error');
                        }
                        break;
                    case Message.type.RESPONSE:
                        if (success === true) {
                            sender.setStatus(sender.lastMessage.successStatus, sender.lastMessage.isBlocking ? 'success' : null);
                        } else {
                            sender.setStatus(sender.lastMessage.errorStatus, 'error');
                        }
                        break;
                    default:
                        sender.log('unexpected message type ' + message.type);
                        sender.setStatus('Unexpected Message', 'error');
                        break;
                }
            }
        } else {
            sender.log('Invalid message');
            sender.setStatus('Message Error', 'error');
        }
    }
};

/**
 * Process a received message.
 * @param {Message} message
 * @returns {boolean|null} true on success, false on error
 */
sender.processMessage = function (message) {
    switch (message.id) {
        case Message.id.INITIALIZED:
            sender.myId = message.data.senderId;
            if( !message.data.success && message.data.reason === ResponseMessage.reason.REINIT) {
                sender.log('app already started');
                return true;
            }
            // fall-through
        case Message.id.UPDATED:
            if (message.data.success) {
                if (util.hasValidObjectValues(message.data.data, sender.lastMessage.data, sender)) {
                    util.setCookie('settings', message.data.data);
                    sender.loadSettings(message.data.data);
                    return true;
                } else {
                    sender.log("Settings don't match {was} {should}", message.data.data, sender.lastMessage.data);
                }
            }
            return false;
        case Message.id.SETTINGS:
            if (message.data.senderId === sender.myId) {
                sender.log('ignoring our own settings update');
                return null;
            } else if (util.isValidObject(message.data.data, Clock.defaults, sender)) {
                if (util.hasValidObjectValues(message.data.data, sender.lastMessage.data, sender)) {
                    sender.log('settings match ours, ignoring');
                    return null;
                } else {
                    util.setCookie('settings', message.data.data);
                    sender.loadSettings(message.data.data);
                    return true;
                }
            } else {
                sender.log('Invalid settings object {was} {should}', message.data.data, Clock.defaults);
                return false;
            }
        case Message.id.TIME:
            sender.loadTime(message.data);
            return true;
        default:
            sender.log('Unexpected message id ' + message.id);
            return false;
    }
};

/**
 * Display settings on the screen.
 * @param {object} settings The current settings.
 */
sender.loadSettings = function (settings) {
    delete settings.senderId;
    sender.lastCookie = settings;
    sender.enableControls(true, settings);
    document.getElementById('backgroundColor').value = settings.display.color.background;
    document.getElementById('activeColor').value = settings.display.color.active;
    document.getElementById('inactiveColor').value = settings.display.color.inactive;
    document.getElementById('duration').value = settings.time.duration;
    document.getElementById('run').innerHTML = settings.time.run ? 'Pause' : 'Run';
};

sender.loadTime = function(now) {
    var d = new Date(now);
    document.getElementById('time').value = new Date(d.getTime() - (60000 * d.getTimezoneOffset())).toISOString().substring(0, 16);
};

sender.enableControls = function (enable) {
    document.getElementById('backgroundColor').disabled = !enable;
    document.getElementById('activeColor').disabled = !enable;
    document.getElementById('inactiveColor').disabled = !enable;
    document.getElementById('updateColors').disabled = !enable;
    document.getElementById('duration').disabled = !enable;
    document.getElementById('updateDuration').disabled = !enable;
    document.getElementById('time').disabled = !enable;
    document.getElementById('updateTime').disabled = !enable;
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
        if (message.isBlocking) {
            sender.log('starting timeout');
            sender.enableControls(false);
            sender.blocked = true;
            sender.timeoutId = setTimeout(sender.timeout, sender.TIMEOUT_DURATION);
        }
        var content = message.buildObjectToSend();
        console.log('sending', content);
        sender.session.sendMessage(Clock.NAMESPACE, JSON.stringify(content), sender.onSuccess.bind(this, "Message sent"), sender.onError);
    }
};

sender.timeout = function () {
    sender.log('timed out');
    sender.blocked = false;
    sender.setStatus('Timeout', 'error');
    sender.enableControls(true);
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

sender.updateTime = function() {
    var d = new Date(document.getElementById('time').value);
    var start = new Date(d.getTime() + (60000 * d.getTimezoneOffset())).getTime();
    var settings = {
        time: {
            start: start
        }
    };

    sender.sendMessage(new UpdateMessage(settings));
};

sender.updateDuration = function () {
    var durationString = document.getElementById('duration').value;
    var duration = parseInt(durationString);
    var min = 10;
    var max = 60000;
    if (!isNaN(duration) && duration >= min && duration <= max) {
        var settings = {
            time: {
                duration: duration
            }
        };
        sender.sendMessage(new UpdateMessage(settings));
    } else {
        sender.log("invalid duration '" + durationString + '"');
        sender.setStatus('Invalid Duration', 'error');
    }
};

sender.log = function (message) {
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
    sender.loadTime(new Date().getTime());
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

util.addEvent(window, 'load', sender.init);
