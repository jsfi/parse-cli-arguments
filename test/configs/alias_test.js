'use strict';

const expect = require('expect.js');
const parser = require('../../');
/*global describe*/
/*global it*/

let config = { options: [{ alias: 't', name: 'test' }] };

describe('alias config', function() {
    it('empty arguments', function () {
        let args = [];
        expect(parser(config, args)).to.eql({ _args: args, test: undefined });
    });

    it('single argument', function () {
        let args = ['test'];
        expect(parser(config, args)).to.eql({ _args: args, test: undefined });
    });

    it('multiple arguments', function () {
        let args = ['test1', 'test2'];
        expect(parser(config, args)).to.eql({ _args: args, test: undefined });
    });

    it('alias', function () {
        let args = ['-t'];
        expect(parser(config, args)).to.eql({ _args: [], test: true });
    });

    it('alias with argument', function () {
        let args = ['-t=test'];
        expect(parser(config, args)).to.eql({ _args: [], test: 'test' });
    });

    it('alias next argument', function () {
        let args = ['-t', 'test'];
        expect(parser(config, args)).to.eql({ _args: [], test: 'test' });
    });

    it('argument, alias next argument', function () {
        let args = ['test', '-t', 'testF'];
        expect(parser(config, args)).to.eql({ _args: ['test'], test: 'testF' });
    });

    it('alias next argument, argument', function () {
        let args = ['-t', 'testF', 'test'];
        expect(parser(config, args)).to.eql({ _args: ['test'], test: 'testF' });
    });
});
