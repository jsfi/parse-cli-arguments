/*
 * parse-cli-arguments
 * https://github.com/jsfi/parse-cli-arguments
 *
 * Copyright (c) 2015 Martin Sachse
 * Licensed under the MIT license.
 */

'use strict';

const _ = require('lodash');

module.exports = function(args) {
    if (args) {
        if (_.isArray(args)) {
            args = args.slice();
        } else {
            throw Error('Passed arguments must be an array or falsy.');
        }
    } else {
        args = process.argv.slice(2);
    }

    if (_.some(args, el => !_.isBoolean(el) && !_.isNumber(el) && !_.isString(el) && !_.isNull(el))) {
        throw Error('Only primitive values allowed.');
    }

    return args;
};
