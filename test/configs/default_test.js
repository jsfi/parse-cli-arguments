'use strict';

const expect = require('expect.js');
const parser = require('../../');
/*global describe*/
/*global it*/

let config = { options: [{ flag: 'test', defaultOption: true }] };

describe('flag default config', function() {
    it('empty arguments', function () {
        let args = [];
        expect(parser(config, args)).to.eql({ test: undefined });
    });

    it('single argument', function () {
        let args = ['test'];
        expect(parser(config, args)).to.eql({ test: 'test' });
    });

    it('multiple arguments', function () {
        let args = ['test1', 'test2'];
        expect(parser(config, args)).to.eql({ test: 'test2' });
    });

    it('flag', function () {
        let args = ['--test'];
        expect(parser(config, args)).to.eql({ test: true });
    });

    it('flag with argument', function () {
        let args = ['--test=test'];
        expect(parser(config, args)).to.eql({ test: 'test' });
    });

    it('flag next argument', function () {
        let args = ['--test', 'test'];
        expect(parser(config, args)).to.eql({ test: 'test' });
    });

    it('argument, flag next argument', function () {
        let args = ['test', '--test', 'testF'];
        expect(parser(config, args)).to.eql({ test: 'testF' });
    });

    it('flag next argument, argument', function () {
        let args = ['--test', 'testF', 'test'];
        expect(parser(config, args)).to.eql({ test: 'test' });
    });
});
