/*
 * parse-cli-arguments
 * https://github.com/jsfi/parse-cli-arguments
 *
 * Copyright (c) 2015 Martin Sachse
 * Licensed under the MIT license.
 */

'use strict';

const _ = require('lodash');

const defaultOptions = { '_args': { defaultOption: true, multiple: true } };
const defaultConfiguration = {
    options: {},
    flagSymbol: '--',
    aliasSymbol: '-',
    argumentSymbol: '=',
    stopArgument: '--',
    restArguments: 'argv',
    debug: false
};

module.exports = function(configuration) {
    let settings = _.defaults({}, configuration, defaultConfiguration);
    settings.stop = {};

    if (!_.isObject(settings.options)) {
        throw new Error(`Options must be configured as an object.`);
    }

    setDefaultOption(settings);
    settings.flags = getFlags(settings.options);
    settings.aliases = getAliases(settings.options);
    inlineName(settings.options);
    prepareBooleanOptions(settings.options);

    return settings;
};

function setDefaultOption(settings) {
    let option = _.filter(settings.options, 'defaultOption');

    if (option.length === 0) {
        _.merge(settings.options, defaultOptions);
        settings.defaultOption = Object.keys(defaultOptions)[0];
    } else if (option.length === 1) {
        settings.defaultOption = _.findKey(settings.options, 'defaultOption');
    } else if (option.length > 1) {
        throw new Error(`Multiple default options configured.`);
    }
}

function getFlags(options) {
    _.forOwn(options, (option, key) => {
        if (option.flag === true) {
            option.flag = key;
        }
    });

    return getProperties(options, 'flag');
}

function getAliases(options) {
    let aliases = getProperties(options, 'alias');

    aliases.forEach(el => {
        if (el.length > 1) {
            throw new Error(`Aliases must consist of one character: ${el}`);
        }
    });

    return aliases;
}

function getProperties(options, property) {
    let properties = _.filter(_.map(options, property));

    if (hasDuplicates(properties)) {
        throw new Error(`Identical ${property}-name for multiple options`);
    }

    if (_.some(properties, includesArgument)) {
        throw new Error(`The equal sign is not allowed in ${property}-name ${_.find(properties, includesArgument)}`);
    }

    return properties;

    function includesArgument(string) {
        return ~string.indexOf(options.argumentSymbol);
    }
}

function hasDuplicates(array) {
    return _.uniq(array).length !== array.length;
}

function inlineName(options) {
    _.forOwn(options, (option, key) => {
        if (!option.propName) {
            option.propName = key;
        }
    });
}

function prepareBooleanOptions(options) {
    _.forOwn(options, option => {
        if (option.type !== 'Boolean') {
            return;
        }

        option.defaultValue = _.isUndefined(option.defaultValue) ? false : !!option.defaultValue;

        if (option.defaultOption) {
            throw new Error(`An option of type Boolean cannot be the default option.`);
        }

        if (option.multiple) {
            throw new Error(`An option of type Boolean cannot be configured as multiple.`);
        }
    });
}
