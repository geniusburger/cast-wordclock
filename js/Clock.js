function Clock(root) {
    this.interval = null;

    this.ITS = root.querySelector('#textITS');
    this.THREEHOUR = root.querySelector('#textTHREEHOUR');
    this.SIXHOUR = root.querySelector('#textSIXHOUR');
    this.ELEVENHOUR = root.querySelector('#textELEVENHOUR');
    this.SEVENHOUR = root.querySelector('#textSEVENHOUR');
    this.TENHOUR = root.querySelector('#textTENHOUR');
    this.FIVEHOUR = root.querySelector('#textFIVEHOUR');
    this.ONEHOUR = root.querySelector('#textONEHOUR');
    this.NINEHOUR = root.querySelector('#textNINEHOUR');
    this.TWOHOUR = root.querySelector('#textTWOHOUR');
    this.EIGHTHOUR = root.querySelector('#textEIGHTHOUR');
    this.TWELVEHOUR = root.querySelector('#textTWELVEHOUR');
    this.FOURHOUR = root.querySelector('#textFOURHOUR');
    this.OCLOCK = root.querySelector('#textOCLOCK');
    this.FIFTY = root.querySelector('#textFIFTY');
    this.THIRTY = root.querySelector('#textTHIRTY');
    this.FORTY = root.querySelector('#textFORTY');
    this.TWENTY = root.querySelector('#textTWENTY');
    this.OSEVEN = root.querySelector('#textOSEVEN');
    this.SEVEN = root.querySelector('#textSEVEN');
    this.SEVENTEEN = root.querySelector('#textSEVENTEEN');
    this.TWELVE = root.querySelector('#textTWELVE');
    this.OONE = root.querySelector('#textOONE');
    this.ONE = root.querySelector('#textONE');
    this.ELEVEN = root.querySelector('#textELEVEN');
    this.OFOUR = root.querySelector('#textOFOUR');
    this.FOUR = root.querySelector('#textFOUR');
    this.FOURTEEN = root.querySelector('#textFOURTEEN');
    this.OFIVE = root.querySelector('#textOFIVE');
    this.FIVE = root.querySelector('#textFIVE');
    this.OSIX = root.querySelector('#textOSIX');
    this.SIX = root.querySelector('#textSIX');
    this.SIXTEEN = root.querySelector('#textSIXTEEN');
    this.OEIGHT = root.querySelector('#textOEIGHT');
    this.EIGHT = root.querySelector('#textEIGHT');
    this.EEN = root.querySelector('#textEEN');
    this.THIRTEEN = root.querySelector('#textTHIRTEEN');
    this.FIFTEEN = root.querySelector('#textFIFTEEN');
    this.ONINE = root.querySelector('#textONINE');
    this.NINE = root.querySelector('#textNINE');
    this.TEEN = root.querySelector('#textTEEN');
    this.OTWO = root.querySelector('#textOTWO');
    this.TWO = root.querySelector('#textTWO');
    this.TEN = root.querySelector('#textTEN');
    this.OTHREE = root.querySelector('#textOTHREE');
    this.THREE = root.querySelector('#textTHREE');
    this.IN = root.querySelector('#textIN');
    this.AT = root.querySelector('#textAT');
    this.THE = root.querySelector('#textTHE');
    this.MID = root.querySelector('#textMID');
    this.NIGHT = root.querySelector('#textNIGHT');
    this.AFTER = root.querySelector('#textAFTER');
    this.NOON = root.querySelector('#textNOON');
    this.MORNING = root.querySelector('#textMORNING');
    this.THU = root.querySelector('#textTHU');
    this.SA = root.querySelector('#textSA');
    this.T = root.querySelector('#textT');
    this.UE = root.querySelector('#textUE');
    this.WED = root.querySelector('#textWED');
    this.SUN = root.querySelector('#textSUN');
    this.FRI = root.querySelector('#textFRI');
    this.MON = root.querySelector('#textMON');
    this.JAN = root.querySelector('#textJAN');
    this.FEB = root.querySelector('#textFEB');
    this.MAR = root.querySelector('#textMAR');
    this.APR = root.querySelector('#textAPR');
    this.MAY = root.querySelector('#textMAY');
    this.OCT = root.querySelector('#textOCT');
    this.JUL = root.querySelector('#textJUL');
    this.AUG = root.querySelector('#textAUG');
    this.SEP = root.querySelector('#textSEP');
    this.NOV = root.querySelector('#textNOV');
    this.JUN = root.querySelector('#textJUN');
    this.DEC = root.querySelector('#textDEC');
    this.D2TEN = root.querySelector('#text2TEN');
    this.D1TEN = root.querySelector('#text1TEN');
    this.D3TEN = root.querySelector('#text3TEN');
    this.D2 = root.querySelector('#text2');
    this.D5 = root.querySelector('#text5');
    this.D8 = root.querySelector('#text8');
    this.D3 = root.querySelector('#text3');
    this.D4 = root.querySelector('#text4');
    this.D0 = root.querySelector('#text0');
    this.D6 = root.querySelector('#text6');
    this.D9 = root.querySelector('#text9');
    this.D1 = root.querySelector('#text1');
    this.D7 = root.querySelector('#text7');

    // Replace the underscores
    ['B','Z','R','J','M','P','A','S','C','T','L','7'].forEach(function(replacement, i) {
        root.querySelector('#text_' + (i+1)).innerHTML = replacement;
    });

    this.all = Array.prototype.slice.call(root.querySelectorAll('span'));
    this.settings = JSON.parse(JSON.stringify(Clock.defaults));
    this.now = null;
    this.leadIn = 0;
}

/**
 * @type {string}
 * @readonly
 */
Clock.APP_ID = '8D74C526';

/**
 * @type {string}
 * @readonly
 */
Clock.NAMESPACE = 'urn:x-cast:me.geniusburger.cast.wordclock';

Clock.defaults = {
    time: {
        start: new Date().getTime(),// Number, set the start time in milliseconds since midnight Jan 1, 1970
        duration: 60000,		    // Number, [1,60000], set the duration of a minute
        run: true				    // Boolean, start/stop the clock
    },
    display: {
        color: {
            background: "000000",	// String, 3 or 6 digit hex RGB color with optional '#'
            active: "FFFFFF",		// String, 3 or 6 digit hex RGB color with optional '#'
            inactive: "333333"		// String, 3 or 6 digit hex RGB color with optional '#'
        }
    }
};

Clock.prototype.updateSettings = function (updates) {
    console.log('updateSettings', updates);

    if (!updates) {
        return;
    }

    if (updates.hasOwnProperty('time')) {
        this.stop();
        if (typeof updates.time.start === 'number') {
            this.settings.time.start = updates.time.start;
            this.now = this.settings.time.start;
            this.updateClock();
        }
        if (typeof updates.time.duration === 'number') {
            this.settings.time.duration = updates.time.duration;
        }
        if (typeof updates.time.run === 'boolean') {
            this.settings.time.run = updates.time.run;
        }
        this.start();
    }

    if (updates.hasOwnProperty('display')) {
        if (updates.display.hasOwnProperty('color')) {
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
        color = colors[0];
    }
    return color;
};

Clock.prototype.updateColors = function () {
    var sheet = document.styleSheets[0];

    sheet.deleteRule(0);
    sheet.deleteRule(0);

    var bodyRule = 'body { background-color: #' + this.settings.display.color.background + '; color: #' + this.settings.display.color.inactive + '; }';
    var activeRule = '.active { color: #' + this.settings.display.color.active + '; }';

    sheet.insertRule(bodyRule, 0);
    sheet.insertRule(activeRule, 1);
};

Clock.prototype.stop = function () {
    clearInterval(this.interval);
    this.interval = null;
};

Clock.prototype.finishLeadIn = function() {
    console.log("starting after lead-in");
    this.now += this.leadIn;
    this.updateClock();
    this.interval = setInterval(this.tick.bind(this), this.settings.time.duration);
};

Clock.prototype.start = function () {
    if (this.settings.time.run) {
        if (this.interval == null) {
            if(this.settings.time.duration === 60000) {
                var secondsInMilliseconds = new Date(this.now).getSeconds() * 1000;
                this.leadIn = this.settings.time.duration - secondsInMilliseconds;
                console.log('leading in ' + this.leadIn);
                this.interval = setTimeout(this.finishLeadIn.bind(this), this.leadIn);
            } else {
                this.leadIn = 0;
                console.log("starting without lead-in");
                this.interval = setInterval(this.tick.bind(this), this.settings.time.duration);
            }
        } else {
            console.error("can't start, interval is not null");
        }
    }
};

Clock.prototype.on = function (el) {
    el.classList.add('active');
};

Clock.prototype.tick = function () {
    this.now += 60000;
    this.updateClock();
};

/**
 * Update the clock display
 */
Clock.prototype.updateClock = function () {
    var date = new Date(this.now);
    console.log("updateClock", date);
    this.allOff();
    this.on(this.ITS);
    this.setTime(date.getHours(), date.getMinutes());
    this.setDayOfWeek(date.getDay());
    this.setDayOfMonth(date.getDate());
    this.setMonth(date.getMonth());
};

Clock.prototype.allOff = function() {
    this.all.forEach(function(el){ el.classList.remove('active');});
};

Clock.prototype.setMonth = function(month) {
    switch(month) {
        case 0:
            this.on(this.JAN);
            break;
        case 1:
            this.on(this.FEB);
            break;
        case 2:
            this.on(this.MAR);
            break;
        case 3:
            this.on(this.APR);
            break;
        case 4:
            this.on(this.MAY);
            break;
        case 5:
            this.on(this.JUN);
            break;
        case 6:
            this.on(this.JUL);
            break;
        case 7:
            this.on(this.AUG);
            break;
        case 8:
            this.on(this.SEP);
            break;
        case 9:
            this.on(this.OCT);
            break;
        case 10:
            this.on(this.NOV);
            break;
        case 11:
            this.on(this.DEC);
            break;
    }
};

Clock.prototype.setDayOfMonth = function(day) {
    if( day >= 30) {
        this.on(this.D3TEN);
    } else if( day >= 20) {
        this.on(this.D2TEN);
    } else if( day >= 10) {
        this.on(this.D1TEN);
    }

    switch(day % 10) {
        case 0:
            this.on(this.D0);
            break;
        case 1:
            this.on(this.D1);
            break;
        case 2:
            this.on(this.D2);
            break;
        case 3:
            this.on(this.D3);
            break;
        case 4:
            this.on(this.D4);
            break;
        case 5:
            this.on(this.D5);
            break;
        case 6:
            this.on(this.D6);
            break;
        case 7:
            this.on(this.D7);
            break;
        case 8:
            this.on(this.D8);
            break;
        case 9:
            this.on(this.D9);
            break;
    }
};

Clock.prototype.setDayOfWeek = function(day) {
    switch(day) {
        case 0:
            this.on(this.SUN);
            break;
        case 1:
            this.on(this.MON);
            break;
        case 2:
            this.on(this.T);
            this.on(this.UE);
            break;
        case 3:
            this.on(this.WED);
            break;
        case 4:
            this.on(this.THU);
            break;
        case 5:
            this.on(this.FRI);
            break;
        case 6:
            this.on(this.SA);
            this.on(this.T);
            break;
    }
};

Clock.prototype.setTime = function (hour, minute) {
    var am = true;
    if (hour >= 12) {
        hour -= 12;
        am = false;
    }

    switch (hour) {
        case 0:
            this.on(this.TWELVEHOUR);
            if (minute == 0) {
                if (am) {
                    this.on(this.MID);
                    this.on(this.NIGHT);
                } else {
                    this.on(this.NOON);
                }
                return;
            }
            break;
        case 1:
            this.on(this.ONEHOUR);
            break;
        case 2:
            this.on(this.TWOHOUR);
            break;
        case 3:
            this.on(this.THREEHOUR);
            break;
        case 4:
            this.on(this.FOURHOUR);
            break;
        case 5:
            this.on(this.FIVEHOUR);
            break;
        case 6:
            this.on(this.SIXHOUR);
            break;
        case 7:
            this.on(this.SEVENHOUR);
            break;
        case 8:
            this.on(this.EIGHTHOUR);
            break;
        case 9:
            this.on(this.NINEHOUR);
            break;
        case 10:
            this.on(this.TENHOUR);
            break;
        case 11:
            this.on(this.ELEVENHOUR);
            break;
    }

    if (am) {
        this.on(this.IN);
        this.on(this.THE);
        this.on(this.MORNING);
    } else {
        if (hour < 5) {
            this.on(this.IN);
            this.on(this.THE);
            this.on(this.AFTER);
            this.on(this.NOON);
        } else {
            this.on(this.AT);
            this.on(this.NIGHT);
        }
    }

    if (minute == 0) {
        this.on(this.OCLOCK);
    } else if (minute == 1) {
        this.on(this.OONE);
        this.on(this.ONE);
    } else if (minute == 2) {
        this.on(this.OTWO);
        this.on(this.TWO);
    } else if (minute == 3) {
        this.on(this.OTHREE);
        this.on(this.THREE);
    } else if (minute == 4) {
        this.on(this.OFOUR);
        this.on(this.FOUR);
    } else if (minute == 5) {
        this.on(this.OFIVE);
        this.on(this.FIVE);
    } else if (minute == 6) {
        this.on(this.OSIX);
        this.on(this.SIX);
    } else if (minute == 7) {
        this.on(this.OSEVEN);
        this.on(this.SEVEN);
    } else if (minute == 8) {
        this.on(this.OEIGHT);
        this.on(this.EIGHT);
    } else if (minute == 9) {
        this.on(this.ONINE);
        this.on(this.NINE);
    } else if (minute == 10) {
        this.on(this.TEN);
    } else if (minute == 11) {
        this.on(this.ELEVEN);
    } else if (minute == 12) {
        this.on(this.TWELVE);
    } else if (minute == 13) {
        this.on(this.THIRTEEN);
    } else if (minute == 14) {
        this.on(this.FOUR);
        this.on(this.FOURTEEN);
    } else if (minute == 15) {
        this.on(this.FIFTEEN);
    } else if (minute == 16) {
        this.on(this.SIX);
        this.on(this.SIXTEEN);
    } else if (minute == 17) {
        this.on(this.SEVEN);
        this.on(this.SEVENTEEN);
    } else if (minute == 18) {
        this.on(this.EIGHT);
        this.on(this.EEN);
    } else if (minute == 19) {
        this.on(this.NINE);
        this.on(this.TEEN);
    } else {
        if (minute >= 50) {
            this.on(this.FIFTY);
        } else if (minute >= 40) {
            this.on(this.FORTY);
        } else if (minute >= 30) {
            this.on(this.THIRTY);
        } else {
            this.on(this.TWENTY);
        }

        switch (minute % 10) {
            case 1:
                this.on(this.ONE);
                break;
            case 2:
                this.on(this.TWO);
                break;
            case 3:
                this.on(this.THREE);
                break;
            case 4:
                this.on(this.FOUR);
                break;
            case 5:
                this.on(this.FIVE);
                break;
            case 6:
                this.on(this.SIX);
                break;
            case 7:
                this.on(this.SEVEN);
                break;
            case 8:
                this.on(this.EIGHT);
                break;
            case 9:
                this.on(this.NINE);
                break;
        }
    }
};