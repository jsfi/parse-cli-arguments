'use strict';

const expect = require('expect.js');
const parser = require('../../');
/*global describe*/
/*global it*/

let config = { options: {
    test: { alias: 't' },
    prueba: { alias: 'p' }
} };

describe('multiple alias config', function() {
    it('empty arguments', function () {
        let args = [];
        expect(parser(config, args)).to.eql({ _args: args, test: undefined, prueba: undefined });
    });

    it('single argument', function () {
        let args = ['test'];
        expect(parser(config, args)).to.eql({ _args: args, test: undefined, prueba: undefined });
    });

    it('multiple arguments', function () {
        let args = ['test1', 'test2'];
        expect(parser(config, args)).to.eql({ _args: args, test: undefined, prueba: undefined });
    });

    it('alias', function () {
        let args = ['-t'];
        expect(parser(config, args)).to.eql({ _args: [], test: true, prueba: undefined });
    });

    it('alias with argument', function () {
        let args = ['-t=test'];
        expect(parser(config, args)).to.eql({ _args: [], test: 'test', prueba: undefined });
    });

    it('alias next argument', function () {
        let args = ['-t', 'test'];
        expect(parser(config, args)).to.eql({ _args: [], test: 'test', prueba: undefined });
    });

    it('argument, alias next argument', function () {
        let args = ['test', '-t', 'testF'];
        expect(parser(config, args)).to.eql({ _args: ['test'], test: 'testF', prueba: undefined });
    });

    it('alias next argument, argument', function () {
        let args = ['-t', 'testF', 'test'];
        expect(parser(config, args)).to.eql({ _args: ['test'], test: 'testF', prueba: undefined });
    });

    it('alias, alias', function () {
        let args = ['-t', '-p'];
        expect(parser(config, args)).to.eql({ _args: [], test: true, prueba: true });
    });

    it('aliases combined', function () {
        let args = ['-tp'];
        expect(parser(config, args)).to.eql({ _args: [], test: true, prueba: true });
    });

    it('aliases combined, argument', function () {
        let args = ['-tp', 'test'];
        expect(parser(config, args)).to.eql({ _args: [], test: true, prueba: 'test' });
    });

    it('aliases combined switched, argument', function () {
        let args = ['-pt', 'test'];
        expect(parser(config, args)).to.eql({ _args: [], test: 'test', prueba: true });
    });

    it('aliases combined, unknwon alias', function () {
        let args = ['-ptq'];
        expect(parser(config, args)).to.eql({ _args: ['-ptq'], test: undefined, prueba: undefined });
    });
});
