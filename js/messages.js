/**
 * Build a message to be sent.
 * @param {Message.type} type The type of this message.
 * @param {Message.type|null} otherType The type of the matching message.
 * @param {Object} data The data to be sent.
 * @param {boolean} isRequest Indicates if this message is a request or a response
 * @constructor
 */
function Message(type, otherType, data, isRequest) {
    /**
     * @type {Message.type}
     */
    this.type = type;
    /**
     * @type {Object}
     */
    this.data = data;
    /**
     * @type {Message.type|null}
     */
    this.otherType = otherType;
    /**
     * @type {string|null}
     */
    this.sendingStatus = null;
    /**
     * @type {string|null}
     */
    this.successStatus = null;
    /**
     * @type {string|null}
     */
    this.errorStatus = null;
    /**
     * @type {boolean}
     */
    this.isBlocking = false;
    /**
     * @type {boolean}
     */
    this.isRequest = isRequest;
    /**
     * @type {boolean}
     */
    this.isResponse = !isRequest;
}

/**
 * Setup this message as a blocking message.
 * @param {string} sendingStatus
 * @param {string} successStatus
 * @param {string} errorStatus
 */
Message.prototype.setBlocking = function(sendingStatus, successStatus, errorStatus) {
    this.isBlocking = true;
    this.sendingStatus = sendingStatus;
    this.successStatus = successStatus;
    this.errorStatus = errorStatus;
};

/**
 * Enum for message types.
 * @readonly
 * @enum {string}
 */
Message.type = {
    INITIALIZE: 'initialize',
    INITIALIZED: 'initialized',
    UPDATE: 'update',
    UPDATED: 'updated',
    SETTINGS: 'settings',
    ERROR: 'error'
};

RequestMessage.prototype = Object.create(Message.prototype);
/**
 * @augments Message
 * @constructor
 */
function RequestMessage(type, responseType, data) {
    Message.call(this, type, responseType, data, true);
}

ResponseMessage.prototype = Object.create(Message.prototype);
/**
 * Build a response to be sent.
 * @param {Message.type} type The type of this message.
 * @param {Message.type|null} requestType The type of the matching request.
 * @param {Object} data The data to be sent.
 * @augments Message
 * @constructor
 */
function ResponseMessage(type, requestType, data) {
    Message.call(this, type, requestType, {success: true, reason: null, data: data}, false);
}

/**
 * Mark a response message as failed.
 * @param {ResponseMessage.reason} reason The reason for failure.
 * @returns {ResponseMessage} this
 */
ResponseMessage.prototype.failed = function(reason) {
    this.data.success = false;
    this.data.reason = reason;
    return this;
};

/**
 * Enum for failure reasons.
 * @readonly
 * @enum {string}
 */
ResponseMessage.reason = {
    REINIT: 'reinit'
};

ErrorMessage.prototype = Object.create(ResponseMessage.prototype);
/**
 * Error message that doesn't have a request to respond to.
 * @param {string} error The error message.
 * @augments ResponseMessage
 * @constructor
 */
function ErrorMessage(error) {
    ResponseMessage.call(this, Message.type.ERROR, error);
}

InitializeMessage.prototype = Object.create(RequestMessage.prototype);
/**
 * @param {object} settings The settings to initialize with.
 * @augments RequestMessage
 * @constructor
 */
function InitializeMessage(settings) {
    RequestMessage.call(this, Message.type.INITIALIZE, Message.type.INITIALIZED, settings);
    this.setBlocking('Starting...', 'Started', 'Start Failed');
}

InitializedMessage.prototype = Object.create(ResponseMessage.prototype);
/**
 * @param {string} senderId ID of the request sender
 * @param {object} settings The current settings.
 * @augments ResponseMessage
 * @constructor
 */
function InitializedMessage(senderId, settings) {
    ResponseMessage.call(this, Message.type.INITIALIZED, Message.type.INITIALIZE, settings);
    this.data.senderId = senderId;
}

UpdateMessage.prototype = Object.create(RequestMessage.prototype);
/**
 * @param {object} settings The settings to update with.
 * @augments RequestMessage
 * @constructor
 */
function UpdateMessage(settings) {
    RequestMessage.call(this, Message.type.UPDATE, Message.type.UPDATED, settings);
    this.setBlocking('Updating...', 'Updated', 'Update Failed');
}

UpdatedMessage.prototype = Object.create(ResponseMessage.prototype);
/**
 * @param {object} settings The current settings.
 * @augments ResponseMessage
 * @constructor
 */
function UpdatedMessage(settings) {
    ResponseMessage.call(this, Message.type.UPDATED, Message.type.UPDATE, settings);
}

SettingsMessage.prototype = Object.create(ResponseMessage.prototype);
/**
 * @param {string} senderId ID of the request sender
 * @param {object} settings The current settings.
 * @augments ResponseMessage
 * @constructor
 */
function SettingsMessage(senderId, settings) {
    ResponseMessage.call(this, Message.type.SETTINGS, null, settings);
    this.data.senderId = senderId;
    this.successStatus = 'Updated';
    this.errorStatus = 'Pull Update Failed';
}