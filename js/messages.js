/**
 * Build a message to be sent.
 * @param {Message.id} id The id of this message.
 * @param {Message.id|null} otherId The id of the matching message.
 * @param {Object} data The data to be sent.
 * @param {Message.type} [type=Message.type.REQUEST] The type of this message.
 * @constructor
 */
function Message(id, otherId, data, type) {
    /**
     * @type {Message.id}
     */
    this.id = id;
    /**
     * @type {Object}
     */
    this.data = data;
    /**
     * @type {Message.type}
     */
    this.type = typeof type === 'undefined' ? Message.type.REQUEST : type;
    /**
     * @type {Message.id|null}
     */
    this.otherId = otherId;
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
 * Builds a simple object to send as a message.
 * @returns {{type: Message.type, id: Message.id, data: *}}
 */
Message.prototype.buildObjectToSend = function() {
    return {type: this.type, id: this.id, data: this.data};
};

/**
 * Enum for message IDs.
 * @readonly
 * @enum {string}
 */
Message.id = {
    INITIALIZE: 'Initialize',
    INITIALIZED: 'Initialized',
    UPDATE: 'Update',
    UPDATED: 'Updated',
    SETTINGS: 'Settings',
    ERROR: 'Error',
    TIME: 'Time'
};

/**
 * Enum for message types.
 * @readonly
 * @enum {string}
 */
Message.type = {
    REQUEST: 'request',
    RESPONSE: 'response',
    BROADCAST: 'broadcast'
};

BroadcastMessage.prototype = Object.create(Message.prototype);
/**
 * Build a broadcast message to be sent.
 * @param {Message.id} id The id of this message.
 * @param {object} data The data to be sent.
 * @augments Message
 * @constructor
 */
function BroadcastMessage(id, data) {
    Message.call(this, id, null, data, Message.type.BROADCAST);
}

ResponseMessage.prototype = Object.create(Message.prototype);
/**
 * Build a response to be sent.
 * @param {Message.id} id The id of this message.
 * @param {Message.id|null} requestId The id of the matching request.
 * @param {object} data The data to be sent.
 * @augments Message
 * @constructor
 */
function ResponseMessage(id, requestId, data) {
    Message.call(this, id, requestId, {success: true, reason: null, data: data}, Message.type.RESPONSE);
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
    ResponseMessage.call(this, Message.id.ERROR, error);
}

InitializeMessage.prototype = Object.create(Message.prototype);
/**
 * @param {object} settings The settings to initialize with.
 * @augments Message
 * @constructor
 */
function InitializeMessage(settings) {
    Message.call(this, Message.id.INITIALIZE, Message.id.INITIALIZED, settings);
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
    ResponseMessage.call(this, Message.id.INITIALIZED, Message.id.INITIALIZE, settings);
    this.data.senderId = senderId;
}

UpdateMessage.prototype = Object.create(Message.prototype);
/**
 * @param {object} settings The settings to update with.
 * @augments Message
 * @constructor
 */
function UpdateMessage(settings) {
    Message.call(this, Message.id.UPDATE, Message.id.UPDATED, settings);
    this.setBlocking('Updating...', 'Updated', 'Update Failed');
}

UpdatedMessage.prototype = Object.create(ResponseMessage.prototype);
/**
 * @param {object} settings The current settings.
 * @augments ResponseMessage
 * @constructor
 */
function UpdatedMessage(settings) {
    ResponseMessage.call(this, Message.id.UPDATED, Message.id.UPDATE, settings);
}

SettingsMessage.prototype = Object.create(BroadcastMessage.prototype);
/**
 * @param {string} senderId ID of the request sender
 * @param {object} settings The current settings.
 * @augments BroadcastMessage
 * @constructor
 */
function SettingsMessage(senderId, settings) {
    BroadcastMessage.call(this, Message.id.SETTINGS, settings);
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
    BroadcastMessage.call(this, Message.id.TIME, time);
    this.successStatus = 'Tick';
    this.errorStatus = 'Tick Failed';
}

