sender = {};
sender.applicationID = '8D74C526';
sender.namespace = 'urn:x-cast:me.geniusburger.cast.wordclock';
sender.session = null;

/**
 * initialization
 */
sender.initializeCastApi = function() {
    var sessionRequest = new chrome.cast.SessionRequest(sender.applicationID);
    var apiConfig = new chrome.cast.ApiConfig(sessionRequest, sender.sessionListener, sender.receiverListener);
    chrome.cast.initialize(apiConfig, sender.onInitSuccess, sender.onError);
};

/**
 * initialization success callback
 */
sender.onInitSuccess = function() {
    sender.log("onInitSuccess");
};

/**
 * initialization error callback
 */
sender.onError = function(message) {
    sender.log("onError: " + JSON.stringify(message));
};

/**
 * generic success callback
 */
sender.onSuccess = function(message) {
    sender.log("onSuccess: " + message);
};

/**
 * callback on success for stopping app
 */
sender.onStopAppSuccess = function() {
    sender.log('onStopAppSuccess');
};

/**
 * session listener during initialization
 */
sender.sessionListener = function(e) {
    sender.log('New session ID:' + e.sessionId);
    sender.session = e;
    sender.session.addUpdateListener(sender.sessionUpdateListener);
    sender.session.addMessageListener(sender.namespace, sender.receiverMessage);
};

/**
 * listener for session updates
 */
sender.sessionUpdateListener = function(isAlive) {
    var message = isAlive ? 'Session Updated' : 'Session Removed';
    message += ': ' + sender.session.sessionId;
    sender.log(message);
    if (!isAlive) {
        sender.session = null;
    }
};

/**
 * utility function to log messages from the receiver
 * @param {string} namespace The namespace of the message
 * @param {string} message A message string
 */
sender.receiverMessage = function(namespace, message) {
    sender.log("receiverMessage: " + namespace + ", " + message);
};

/**
 * receiver listener during initialization
 */
sender.receiverListener = function(e) {
    if (e === chrome.cast.ReceiverAvailability.AVAILABLE) {
        sender.log("receiver found");
        chrome.cast.requestSession(sender.sessionListener, sender.error);
    }
    else {
        sender.log("receiver list empty, " + e);
    }
};

/**
 * stop app/session
 */
sender.stopApp = function() {
    sender.session.stop(sender.onStopAppSuccess, sender.onError);
};

/**
 * send a message to the receiver using the custom namespace
 * receiver CastMessageBus message handler will be invoked
 * @param {string} message A message string
 */
sender.sendMessage = function(message) {
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

sender.updateColor = function() {
    var settings = {
        display : {
            color : {
                background : document.getElementById('backgroundColor').value,
                active : document.getElementById('activeColor').value,
                inactive : document.getElementById('inactiveColor').value
            }
        }
    };

    sender.sendMessage(settings);
};

sender.updateRunOrStop = function(runClock) {
    var settings = {
        time : {
            run: runClock
        }
    };

    sender.sendMessage(settings);
};

sender.updateDuration = function() {
    var settings = {
        time : {
            duration : document.getElementById('duration').value
        }
    };

    sender.sendMessage(settings);
};

sender.log = function(message) {
    console.log(message);
    var dw = document.getElementById("debugmessage");
    dw.innerHTML += '\n' + JSON.stringify(message);
    dw.scrollTop = dw.scrollHeight;
};

sender.init = function() {
    sender.log("init");
    document.getElementById('backgroundColor').value = Clock.defaults.display.color.background;
    document.getElementById('activeColor').value = Clock.defaults.display.color.active;
    document.getElementById('inactiveColor').value = Clock.defaults.display.color.inactive;
    jscolor.init();
};

window['__onGCastApiAvailable'] = function(loaded, errorInfo) {
    if (loaded) {
        sender.initializeCastApi();
    } else {
        sender.log(errorInfo);
    }
}

sender.addEvent = function(el, evnt, func) {
    if(el.addEventListener) {
        el.addEventListener(evnt, func, false);
    } else if(el.attachEvent) {
        el.attachEvent('on'+evnt, func);
    }
};

sender.addEvent(window, 'load', sender.init);
