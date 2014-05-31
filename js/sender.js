sender = {};
sender.applicationID = '794B7BBF';
sender.namespace = 'urn:x-cast:me.geniusburger.cast.wordclock';
sender.session = null;

/**
 * initialization
 */
sender.initializeCastApi = function() {
    var sessionRequest = new chrome.cast.SessionRequest(sender.applicationID);
    var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
        sessionListener,
        receiverListener);

    chrome.cast.initialize(apiConfig, sender.onInitSuccess, sender.onError);
};

/**
 * initialization success callback
 */
sender.onInitSuccess = function() {
    sender.appendMessage("onInitSuccess");
};

/**
 * initialization error callback
 */
sender.onError = function(message) {
    sender.appendMessage("onError: " + JSON.stringify(message));
};

/**
 * generic success callback
 */
sender.onSuccess = function(message) {
    sender.appendMessage("onSuccess: " + message);
};

/**
 * callback on success for stopping app
 */
sender.onStopAppSuccess = function() {
    sender.appendMessage('onStopAppSuccess');
};

/**
 * session listener during initialization
 */
sender.sessionListener = function(e) {
    sender.appendMessage('New session ID:' + e.sessionId);
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
    sender.appendMessage(message);
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
    sender.appendMessage("receiverMessage: " + namespace + ", " + message);
};

/**
 * receiver listener during initialization
 */
sender.receiverListener = function(e) {
    if (e === 'available') {
        sender.appendMessage("receiver found");
    }
    else {
        sender.appendMessage("receiver list empty");
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

/**
 * utility function to handle text typed in by user in the input field
 */
sender.update = function() {
    sender.sendMessage(document.getElementById("input").value);
    // TODO
};

sender.init = function() {
    console.log("init");
    document.getElementById('backgroundColor').value = Clock.defaults.display.color.background;
    document.getElementById('activeColor').value = Clock.defaults.display.color.active;
    document.getElementById('inactiveColor').value = Clock.defaults.display.color.inactive;
    jscolor.init();

    if (!chrome.cast || !chrome.cast.isAvailable) {
        setTimeout(sender.initializeCastApi, 1000);
    }
};

sender.addEvent = function(el, evnt, func) {
    if(el.addEventListener) {
        el.addEventListener(evnt, func, false);
    } else if(el.attachEvent) {
        el.attachEvent('on'+evnt, func);
    }
};

sender.addEvent(window, 'load', sender.init);
