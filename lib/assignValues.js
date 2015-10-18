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
    let assigned = {};

    for (let i = 0, len = args.length, last = len - 1; i < len; i++) {
        let arg = args[i];
        let val;

        if (arg === settings.stop) {
            assigned[settings.restArguments] = args.slice(i + 1);
            break;
        }

        if (_.isObject(arg)) {
            if (arg.type === 'Boolean') {
                val = !arg.defaultValue;
            } else if (_.isObject(args[i + 1]) || i === last) {
                val = true;
            } else {
                val = args[++i];
            }
        } else {
            val = arg;
            arg = settings.options[settings.defaultOption];
        }

        if (_.isFunction(arg.transform)) {
            val = arg.transform(val, arg, _);
        }

        if (_.isUndefined(assigned[arg.propName])) {
            assigned[arg.propName] = arg.multiple ? [val] : val;
        } else if (arg.multiple) {
            assigned[arg.propName].push(val);
        } else {
            if (settings.debug) {
                console.warn(`Option ${arg.name} has been overridden.`); // eslint-disable-line no-console
            }

            assigned[arg.propName] = val;
        }
    }

    //set all configured options not present in the assigned object to their default or undefined
    _.forOwn(settings.options, (option, key) => {
        if (_.isUndefined(assigned[key]))

        if (option.multiple && _.isUndefined(option.defaultValue)) {
            assigned[key] = [];
        } else {
            assigned[key] = option.defaultValue;
        }

    });

    return assigned;
};
