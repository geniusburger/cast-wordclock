
function Clock() {
    this.interval = null;
}

Clock.defaults = {
    time: {
        now: new Date(),		    // Date, set the current time
        duration: 60000,		    // Number, [1,9007199254740992], set the duration of a minute
        run: true				    // Boolean, start/stop the clock
    },
    display: {
        color: {
            background: "000000",	// String, 3 or 6 digit hex RGB color with optional '#'
            active: "FFFFFF",		// String, 3 or 6 digit hex RGB color with optional '#'
            inactive: "444444"		// String, 3 or 6 digit hex RGB color with optional '#'
        },
        animate: false,			    // Boolean, enable/disable animation when changing time
        summary: false			    // Boolean, show/hide summary of current time
    },
    sound: {
        minute: null,			    // String, url to use for the minute sound, null to disable
        hour: null,				    // String, url to use for the hour sound, null to disable
        day: null				    // String, url to use for the day sound, null to disable
    }
};

Clock.prototype.updateSettings = function (updates) {
    console.log('updateSettings', updates);

    if (!updates) {
        return;
    }

    if (updates.time) {
        this.stop();
        if (updates.time.now instanceof Date) {
            this.settings.time.now = updates.time.now;
            this.setTime();
        }
        if (typeof updates.time.duration == 'number') {
            var duration = parseInt(updates.time.duration);
            if (!isNaN(duration) && duration > 0) {
                this.settings.time.duration = duration;
            }
        }
        if (typeof updates.time.run == 'boolean') {
            this.settings.time.run = updates.time.run;
        }
        this.start();
    }

    if (updates.display) {
        if (updates.display.color) {
            var reColor = false;

            var color = this.isValidColor(updates.display.color.background);
            if (color) {
                this.settings.display.color.background = color;
                reColor = true;
            }

            color = this.isValidColor(updates.display.color.active);
            if (color) {
                this.settings.display.color.active = color;
                reColor = true;
            }

            color = this.isValidColor(updates.display.color.inactive);
            if (color) {
                this.settings.display.color.inactive = color;
                reColor = true;
            }

            if (reColor) {
                this.updateColors();
            }
        }
        if (typeof updates.display.animate == 'boolean') {
            // TODO
        }
        if (typeof updates.display.summary == 'boolean') {
            // TODO
        }
    }

    if (updates.sound) {
        if (typeof updates.sound.minute == 'string') {
            // TODO
        }
        if (typeof updates.sound.hour == 'string') {
            // TODO
        }
        if (typeof updates.sound.day == 'string') {
            // TODO
        }
    }
};

/**
 * Check if an object represents a valid color string.
 * @param  {String}  color The object to check.
 * @return {String|null} The extracted color string, or null.
 */
Clock.prototype.isValidColor = function (color) {
    if (typeof color !== 'string') {
        return null;
    }
    var colors = /^#?([0-9A-Fa-f]{3}){1,2}$/.exec(color);
    if (Array.isArray(colors)) {
        color = '#' + colors[0];
    }
    return color;
};

Clock.prototype.updateColors = function () {
    var sheet = document.styleSheets[0];

    sheet.deleteRule(0);
    sheet.deleteRule(0);

    var bodyRule = 'body { background-color: ' + settings.display.color.background + '; color: ' + settings.display.color.inactive + '; }';
    var activeRule = '.active { color: ' + settings.display.color.active + '; }';

    sheet.insertRule(bodyRule, 0);
    sheet.insertRule(activeRule, 1);
};

Clock.prototype.stop = function () {
    clearInterval(this.interval);
    this.interval = null;
};

Clock.prototype.start = function () {
    if (this.settings.time.run) {
        if (this.interval == null) {
            console.error("can't start, interval is not null");
        } else {
            setInterval(this.tick.bind(this), settings.time.duration);
        }
    }
};

Clock.prototype.setTime = function () {
    // TODO
};

Clock.prototype.tick = function () {
    // TODO
};

Clock.prototype.initialize = function () {
    settings = JSON.parse(JSON.stringify(Clock.defaults));

    this.setTime(settings.time.now);
    this.start(settings.time.run);
};