sender = {};
sender.applicationID = '8D74C526';
sender.namespace = 'urn:x-cast:me.geniusburger.cast.wordclock';
sender.session = null;
sender.lastCookie = null;

/**
 * initialization
 */
sender.initializeCastApi = function () {
    sender.setStatus('Initializing');
    var sessionRequest = new chrome.cast.SessionRequest(sender.applicationID);
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
    sender.session.addMessageListener(sender.namespace, sender.receiverMessage);
    sender.sendMessage(sender.lastCookie);
};

/**
 * listener for session updates
 */
sender.sessionUpdateListener = function (isAlive) {
    var message = (isAlive ? 'Session Updated' : 'Session Removed') + ': ' + sender.session.sessionId;
    sender.log(message);
    if( !isAlive) {
        sender.setStatus('Disconnected');
        sender.session = null;
        sender.disableControls(true);
    }
};

/**
 * utility function to log messages from the receiver
 * @param {string} namespace The namespace of the message
 * @param {string} message A message string
 */
sender.receiverMessage = function (namespace, message) {
    sender.log("receiverMessage: " + namespace + ", " + message);
    if (namespace === sender.namespace) {
        var test = JSON.parse(message);
        if (util.isValidObject(test, Clock.defaults, sender)) {
            util.setCookie('settings', message);
            sender.loadSettings(test);
        }
    }
};

sender.loadSettings = function (settings) {
    sender.lastCookie = settings;
    sender.disableControls(false, settings);
    document.getElementById('backgroundColor').value = settings.display.color.background;
    document.getElementById('activeColor').value = settings.display.color.active;
    document.getElementById('inactiveColor').value = settings.display.color.inactive;
    document.getElementById('duration').value = settings.time.duration;
    document.getElementById('run').innerHTML = settings.time.run ? 'Stop' : 'Run';
};

sender.disableControls = function (disable, settings) {
    document.getElementById('backgroundColor').disabled = disable;
    document.getElementById('activeColor').disabled = disable;
    document.getElementById('inactiveColor').disabled = disable;
    document.getElementById('updateColors').disabled = disable;
    document.getElementById('duration').disabled = disable;
    document.getElementById('updateDuration').disabled = disable;
    document.getElementById('run').disabled = disable;
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
 * @param {string} message A message string
 */
sender.sendMessage = function (message) {
    if (sender.session != null) {
        sender.session.sendMessage(sender.namespace, message, sender.onSuccess.bind(this, "Message sent: " + message), sender.onError);
    }
    else {
        chrome.cast.requestSession(function (e) {
            sender.session = e;
            sender.session.sendMessage(sender.namespace, message, sender.onSuccess.bind(this, "Message sent: " + message), sender.onError);
        }, sender.onError);
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

    sender.sendMessage(settings);
};

sender.updateRunOrStop = function () {
    var settings = {
        time: {
            run: !sender.lastCookie.time.run
        }
    };

    sender.sendMessage(settings);
};

sender.updateDuration = function () {
    var settings = {
        time: {
            duration: document.getElementById('duration').value
        }
    };

    sender.sendMessage(settings);
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
    var label = document.getElementById('status');
    label.innerHTML = status;
    label.parentNode.classList.remove('error');
    label.parentNode.classList.remove('success');
    if( type === 'error') {
        label.parentNode.classList.add('error');
    } else if (type === 'success') {
        label.parentNode.classList.add('success');
    }
};


sender.init = function () {
    sender.log('init');
    sender.setStatus('Loading');
    var cookie = util.getCookie('settings');
    if (cookie == null) {
        cookie = Clock.defaults;
    } else {
        cookie = JSON.parse(cookie);
    }
    sender.loadSettings(cookie);
    sender.disableControls(true);
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
