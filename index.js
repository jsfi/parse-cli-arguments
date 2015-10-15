/*
 * parse-cli-arguments
 * https://github.com/jsfi/parse-cli-arguments
 *
 * Copyright (c) 2015 Martin Sachse
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(configuration, args) {
    let settings = require('./lib/parseConfiguration')(configuration);

    args = require('./lib/getArgs')(args);
    args = require('./lib/identifyOptions')(args, settings);
    args = require('./lib/assignValues')(args, settings);

    return args;
};
