/**
 * Build a message to be sent.
 * @param {Message.type} type The type of this message.
 * @param {Message.type|null} otherType The type of the matching message.
 * @param {Object} data The data to be sent.
 * @constructor
 */
function Message(type, otherType, data) {
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
    ERROR: 'error',
    TIME: 'time'
};

BroadcastMessage.prototype = Object.create(Message.prototype);
/**
 * Build a broadcast message to be sent.
 * @param {Message.type} type The type of this message.
 * @param {object} data The data to be sent.
 * @augments Message
 * @constructor
 */
function BroadcastMessage(type, data) {
    Message.call(this, type, null, data);
}

ResponseMessage.prototype = Object.create(Message.prototype);
/**
 * Build a response to be sent.
 * @param {Message.type} type The type of this message.
 * @param {Message.type|null} requestType The type of the matching request.
 * @param {object} data The data to be sent.
 * @augments Message
 * @constructor
 */
function ResponseMessage(type, requestType, data) {
    Message.call(this, type, requestType, {success: true, reason: null, data: data});
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

InitializeMessage.prototype = Object.create(Message.prototype);
/**
 * @param {object} settings The settings to initialize with.
 * @augments Message
 * @constructor
 */
function InitializeMessage(settings) {
    Message.call(this, Message.type.INITIALIZE, Message.type.INITIALIZED, settings);
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

UpdateMessage.prototype = Object.create(Message.prototype);
/**
 * @param {object} settings The settings to update with.
 * @augments Message
 * @constructor
 */
function UpdateMessage(settings) {
    Message.call(this, Message.type.UPDATE, Message.type.UPDATED, settings);
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

SettingsMessage.prototype = Object.create(BroadcastMessage.prototype);
/**
 * @param {string} senderId ID of the request sender
 * @param {object} settings The current settings.
 * @augments BroadcastMessage
 * @constructor
 */
function SettingsMessage(senderId, settings) {
    BroadcastMessage.call(this, Message.type.SETTINGS, settings);
    this.data.senderId = senderId;
    this.successStatus = 'Remote Updated';
    this.errorStatus = 'Remote Update Failed';
}

TimeMessage.prototype = Object.create(BroadcastMessage.prototype);
/**
 * Broadcasts the current time being displayed.
 * @param {number} time The time in milliseconds
 * @augments BroadcastMessage
 * @constructor
 */
function TimeMessage(time) {
    BroadcastMessage.call(this, Message.type.TIME, time);
    this.successStatus = 'Tick';
    this.errorStatus = 'Tick Failed';
}

