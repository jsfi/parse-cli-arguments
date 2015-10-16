/*
 * parse-cli-arguments
 * https://github.com/jsfi/parse-cli-arguments
 *
 * Copyright (c) 2015 Martin Sachse
 * Licensed under the MIT license.
 */

'use strict';

const _ = require('lodash');

module.exports = function(args, settings) {
    for (let i = 0, len = args.length; i < len; i++) {
        let arg = args[i];
        let val;
        let prop;
        let propOffset;

        if (arg === settings.stopArgument) {
            args.splice(i, 1, settings.stop);
            break;
        }

        if (~arg.indexOf(settings.argumentSymbol)) {
            let split = arg.split(settings.argumentSymbol);
            arg = split.shift();
            val = split.join(settings.argumentSymbol);
        }

        if (_.startsWith(arg, settings.flagSymbol)) {
            prop = getOptionByType(arg, settings.flags, settings, 'flag', settings.flagSymbol);

            if (prop) {
                args.splice(i, 1, prop);
                propOffset = 0;
            }
        } else if (_.startsWith(arg, settings.aliasSymbol)) {
            let argParts;
            let argProps = [];

            if (arg.length == 2) {
                argParts = [arg];
            } else if (arg.length > 2) {
                argParts = arg.split('').map(el => `-${el}`);
                argParts.shift();
            } else {
                continue;
            }

            argProps = argParts.map(el => getOptionByType(el, settings.aliases, settings, 'alias', settings.aliasSymbol)
            ).filter(_.identity);

            if (argProps.length === argParts.length) {
                args.splice(i, 1);
                argProps.forEach((argProp, offset) => args.splice(i + offset, 0, argProp));

                propOffset = argProps.length - 1;
                prop = argProps[propOffset];
            } else if (argProps.length) {
                if (settings.debug) {
                    console.warn(`Alias ${arg} ignored because not all parts could be identified.`); // eslint-disable-line no-console
                }
            }
        }

        if (!_.isUndefined(propOffset)) {
            if (val) {
                if (prop.type === 'Boolean') {
                    if (settings.debug) {
                        console.warn(`Value ${val} is discarded because ${prop.name} is configured as Boolean.`); // eslint-disable-line no-console
                    }
                } else {
                    propOffset++;
                    args.splice(i + propOffset, 0, val);
                }
            }

            if (propOffset > 0) {
                i += propOffset;
                len += propOffset;
            }
        }
    }

    return args;
}

function getOptionByType(arg, check, settings, property, prefix) {
    if (isDefined(arg, check, prefix)) {
        return _.find(settings.options, _.matchesProperty(property, arg.replace(prefix, '')));
    }

    return false;
}

function isDefined(arg, collection, prefix) {
    return _.startsWith(arg, prefix) && _.find(collection, _.matches(arg.replace(prefix, '')));
}
