chrome = chrome || {};
chrome.cast = {
	SessionRequest : function(appId, opt_capabilities) {},
	ApiConfig : function(sessionRequest, sessionListener, receiverListener, opt_autoJoinPolicy, opt_defaultActionPolicy) {},
	initialize : function(apiConfig, successCallback, errorCallback) {},
	/**
	 * Describes the state of a currently running Cast application. Normally, these objects should not be created by the client.
	 * @param {string} sessionId   The session identifier.
	 * @param {string} appId       The receiver application identifier.
	 * @param {string} displayName The display name of the application.
	 * @param {Array.<chrome.cast.Image>} appImages   Images associated with the app. Must not be null.
	 * @param {chrome.cast.Receiver} receiver    The receiver that is running the app. Must not be null.
	 * @constructor
	 * @class
	 * @property {string} sessionId
	 */
	Session	: function(sessionId, appId, displayName, appImages, receiver) {
		/**
		 * @property {string}
		 */
		this.sessionId = sessionId;
		this.addUpdateListener = function(listener) {};
		this.addMessageListener = function(listener) {};
	},
	ReceiverAvailability : {AVAILABLE : ""},
	requestSession : function(successCallback, errorCallback, opt_sessionRequest) {},
};
cast = {
	receiver : {
		logger : {setLevelValue : function(value){}},
		CastReceiverManager : {getInstance : function(){}}
	}
};
