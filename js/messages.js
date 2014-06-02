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
 * @private
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
    Message.apply(this, [type, responseType, data, true]);
}

ResponseMessage.prototype = Object.create(Message.prototype);
/**
 * @augments Message
 * @constructor
 */
function ResponseMessage(type, requestType, data, success) {
    Message.apply(this, [type, requestType, {success: success, data: data}, false]);
}

ErrorMessage.prototype = Object.create(ResponseMessage.prototype);
/**
 * @augments ResponseMessage
 * @constructor
 */
function ErrorMessage(error) {
    ResponseMessage.apply(this, [Message.type.ERROR, null, error, false]);
}

InitializeMessage.prototype = Object.create(RequestMessage.prototype);
/**
 * @augments RequestMessage
 * @constructor
 */
function InitializeMessage(settings) {
    RequestMessage.apply(this, [Message.type.INITIALIZE, Message.type.INITIALIZED, settings]);
    this.setBlocking('Starting...', 'Started', 'Start Failed');
}

InitializedMessage.prototype = Object.create(ResponseMessage.prototype);
/**
 * @augments ResponseMessage
 * @constructor
 */
function InitializedMessage(success, settings) {
    ResponseMessage.apply(this, [Message.type.INITIALIZED, Message.type.INITIALIZE, settings, success]);
}

UpdateMessage.prototype = Object.create(RequestMessage.prototype);
/**
 * @augments RequestMessage
 * @constructor
 */
function UpdateMessage(settings) {
    RequestMessage.apply(this, [Message.type.UPDATE, Message.type.UPDATED, settings]);
    this.setBlocking('Updating...', 'Updated', 'Update Failed');
}

UpdatedMessage.prototype = Object.create(ResponseMessage.prototype);
/**
 * @augments ResponseMessage
 * @constructor
 */
function UpdatedMessage(success, settings) {
    ResponseMessage.apply(this, [Message.type.UPDATED, Message.type.UPDATE, settings, success]);
}

SettingsMessage.prototype = Object.create(ResponseMessage.prototype);
/**
 * @augments ResponseMessage
 * @constructor
 */
function SettingsMessage(settings) {
    ResponseMessage.apply(this, [Message.type.SETTINGS, null, settings, true]);
    this.successStatus = 'Updated';
    this.errorStatus = 'Pull Update Failed';
}