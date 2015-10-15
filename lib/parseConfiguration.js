/*
 * parse-cli-arguments
 * https://github.com/jsfi/parse-cli-arguments
 *
 * Copyright (c) 2015 Martin Sachse
 * Licensed under the MIT license.
 */

'use strict';

const _ = require('lodash');

const defaultOption = { name: '_args', defaultOption: true, multiple: true };
const defaultConfiguration = {
    options: [defaultOption],
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

    if (!_.isArray(settings.options)) {
        throw new Error(`Options must be configured as an array.`); // eslint-disable-line no-console
    }

    checkOptionNames(settings.options);
    setDefaultOption(settings);
    settings.flags = getFlags(settings.options);
    settings.aliases = getAliases(settings.options);
    prepareBooleanOptions(settings.options);

    return settings;
};

function checkOptionNames(options) {
    let names = options.map(function(el) {
        if (!el.name) {
            if (el.flag) {
                el.name = el.flag;
            } else {
                throw new Error(`Either option or flag must be defined.`);
            }
        }

        return el.name;
    });

    if (hasDuplicates(names)) {
        throw Error(`Same name used for multiple options.`);
    }
}

function setDefaultOption(settings) {
    let option = settings.options.filter(_.property('defaultOption'));

    if (option.length === 0) {
        settings.options = [defaultOption].concat(settings.options);
        settings.defaultOption = defaultOption;
    } else if (option.length === 1) {
        settings.defaultOption = option[0];
    } else if (option.length > 1) {
        throw new Error(`Multiple default options configured.`);
    }
}

function getFlags(options) {
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
    let properties = options.filter(_.property(property)).map(_.property(property));

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

function prepareBooleanOptions(options) {
    options.filter(_.matchesProperty('type', 'Boolean')).forEach(el => {
        el.defaultValue = _.isUndefined(el.defaultValue) ? false : !!el.defaultValue;

        if (el.defaultOption) {
            throw new Error(`An option of type Boolean cannot be the default option.`);
        }

        if (el.multiple) {
            throw new Error(`An option of type Boolean cannot be configured as multiple.`);
        }
    });
}
