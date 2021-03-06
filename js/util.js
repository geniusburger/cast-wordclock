
//////////////////////////////////////////////////////////////////////////////////
////////     Utilities
//////////////////////////////////////////////////////////////////////////////////

var util = {};

/**
 *
 * @param el Element to add the event to.
 * @param {string} name Name of the event.
 * @param {function} func Function to call when the event fires.
 */
util.addEvent = function (el, name, func) {
    if (el.addEventListener) {
        el.addEventListener(name, func, false);
    } else if (el.attachEvent) {
        el.attachEvent('on' + name, func);
    }
};

util.removeEvent = function(el, name, func) {
    if( el.removeEventListener) {
        el.removeEventListener(name, func, false);
    } else if (el.detachEvent) {
        el.detachEvent('on' + name, func);
    }
};


/**
 * Retrieve a cookie from the browser.
 * @param  {string} name The name of the cookie to retrieve.
 * @return {string|object} Value of the cookie or null if not found.
 */ 
util.getCookie = function(name) {
    name += "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) {
            var value = c.substring(name.length, c.length);
            try {
                value = JSON.parse(value);
            } catch (e) {
                // not a JSON object, ignore
            }
            return value;
        }
    }
    return null;
};

/**
 * Set a cookie in the browser.
 * @param {string} name The name of the cookie to set.
 * @param {string|object} value The value fo the cookie to set.
 */
util.setCookie = function(name, value) {
    if( typeof value !== 'string') {
        value = JSON.stringify(value);
    }
    document.cookie = name + "=" + value;
};

/**
 * Remove all child nodes.
 * @param  {object} parent The node to remove all children from.
 */
util.removeChildren = function(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
};

util.getParentByTagName = function(tag, node) {
    tag = tag.toUpperCase();
    do {
        node = node.parentNode;
    } while (node !== null && node.nodeName !== tag )
    return node;
};

/**
 * Recursively validates that the test object contains the same properties as the valid object. Does not check values.
 * @param {object} test The object to check for properties.
 * @param {object} valid The object containing the properties representing a valid object.
 * @param {object} logger Used to log messages during validation.
 * @param {string} [tab] Holds the current tab size for logging.
 * @returns {boolean} true if the test object contains the same properties as the valid object, false otherwise.
 */
util.isValidObject = function(test, valid, logger, tab) {
    if( typeof tab === 'undefined') {
        tab = '';
    }
    if( typeof valid !== 'string') {
        for (var key in valid) {
            if (valid.hasOwnProperty(key)) {
                logger.log(tab + key);
                if (!test.hasOwnProperty(key) || !util.isValidObject(test[key], valid[key], logger, tab + '\t')) {
                    logger.log(tab + 'invalid');
                    return false;
                }
            }
        }
    }
    return true;
};

/**
 * Recursively validates that the test object contains the same properties and values as the valid object.
 * @param test The object to check for properties and values.
 * @param valid The object containing the properties and values representing a valid object.
 * @param {object} logger Used to log messages during validation.
 * @param {string} [tab] Holds the current tab size for logging.
 * @returns {boolean} true if the test object contains the same properties and values as the valid object, false otherwise.
 */
util.hasValidObjectValues = function(test, valid, logger, tab) {
    if (typeof tab === 'undefined') {
        tab = '';
    }
    if (valid instanceof Date) {
        if( typeof test === 'string') {
            test = new Date(test);
        }
         return test instanceof Date && test.getTime() === valid.getTime();
    } else if( typeof valid === 'object') {
        for (var key in valid) {
            if (valid.hasOwnProperty(key)) {
                logger.log(tab + key);
                if (!test.hasOwnProperty(key) || !util.hasValidObjectValues(test[key], valid[key], logger, tab + '\t')) {
                    logger.log(tab + 'invalid');
                    return false;
                }
            }
        }
    } else {
        return test === valid;
    }
    return true;
};

util.getNumberWithCommas = function(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};