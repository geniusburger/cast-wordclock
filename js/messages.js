function Message(type) {
    this.type = type;
}

Message.type = {
    INITIALIZE: 'initialize',
    INITIALIZED: 'initialized',
    UPDATE: 'update',
    UPDATED: 'updated',
    SETTINGS: 'settings',
    ERROR: 'error'
};

ErrorMessage.prototype = Object.create(Message.prototype);

function ErrorMessage(error) {
    Message.apply(this, [Message.ERROR]);
    this.error = error;
}

InitializeMessage.prototype = Object.create(Message.prototype);

function InitializeMessage(settings) {
    Message.apply(this, [Message.INITIALIZE]);
    this.settings = settings;
}

InitializedMessage.prototype = Object.create(Message.prototype);

function InitializedMessage(success, settings) {
    Message.apply(this, [Message.INITIALIZED]);
    this.settings = settings;
    this.success = success;
}

UpdateMessage.prototype = Object.create(Message.prototype);

function UpdateMessage(settings) {
    Message.apply(this, [Message.UPDATE]);
    this.settings = settings;
}

UpdatedMessage.prototype = Object.create(Message.prototype);

function UpdatedMessage(success, settings) {
    Message.apply(this [Message.UPDATED]);
    this.settings = settings;
    this.success = success;
}

SettingsMessage.prototype = Object.create(Message.prototype);

function SettingsMessage(settings) {
    Message.apply(this, [Message.SETTINGS]);
    this.settings = settings;
}