
//////////////////////////////////////////////////////////////////////////////////
////////     Utilities
//////////////////////////////////////////////////////////////////////////////////

var util = {};

/**
 * Retrieve a cookie from the browser.
 * @param  {string} name The name of the cookie to retrieve.
 * @return {string} Value of the cookie or null if not found.
 */ 
util.getCookie = function(name) {
    var name = name + "=";
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
 * @param {string} value The value fo the cookie to set.
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

util.isValidObject = function(test, valid, logger, tab) {
    if( typeof tab === 'undefined') {
        tab = '';
    }
    if( typeof test !== 'string' && typeof valid !== 'string') {
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

util.getNumberWithCommas = function(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};