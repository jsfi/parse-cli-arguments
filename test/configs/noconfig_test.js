'use strict';

const expect = require('expect.js');
const parser = require('../../');
/*global describe*/
/*global it*/

let config = {};

describe('empty config', function() {
    it('empty arguments', function () {
        let args = [];
        expect(parser(config, args)).to.eql({ _args: args });
    });

    it('single argument', function () {
        let args = ['test'];
        expect(parser(config, args)).to.eql({ _args: args });
    });

    it('multiple arguments', function () {
        let args = ['test1', 'test2'];
        expect(parser(config, args)).to.eql({ _args: args });
    });
});
