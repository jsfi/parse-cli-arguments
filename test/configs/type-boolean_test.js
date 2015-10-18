'use strict';

const expect = require('expect.js');
const parser = require('../../');
/*global describe*/
/*global it*/

let config = { options: {
    test: { alias: 't', type: 'Boolean' },
    prueba: { alias: 'p', type: 'Boolean', defaultValue: true }
} };

describe('type config', function() {
    it('empty arguments', function () {
        let args = [];
        expect(parser(config, args)).to.eql({ _args: args, test: false, prueba: true });
    });

    it('single argument', function () {
        let args = ['test'];
        expect(parser(config, args)).to.eql({ _args: args, test: false, prueba: true });
    });

    it('multiple arguments', function () {
        let args = ['test1', 'test2'];
        expect(parser(config, args)).to.eql({ _args: args, test: false, prueba: true });
    });

    it('alias', function () {
        let args = ['-t'];
        expect(parser(config, args)).to.eql({ _args: [], test: true, prueba: true });
    });

    it('alias with argument', function () {
        let args = ['-t=test'];
        expect(parser(config, args)).to.eql({ _args: [], test: true, prueba: true });
    });

    it('alias next argument', function () {
        let args = ['-t', 'test'];
        expect(parser(config, args)).to.eql({ _args: ['test'], test: true, prueba: true });
    });

    it('argument, alias next argument', function () {
        let args = ['test', '-t', 'testF'];
        expect(parser(config, args)).to.eql({ _args: ['test', 'testF'], test: true, prueba: true });
    });

    it('alias next argument, argument', function () {
        let args = ['-t', 'testF', 'test'];
        expect(parser(config, args)).to.eql({ _args: ['testF', 'test'], test: true, prueba: true });
    });

    it('alias, alias', function () {
        let args = ['-t', '-p'];
        expect(parser(config, args)).to.eql({ _args: [], test: true, prueba: false });
    });

    it('aliases combined', function () {
        let args = ['-tp'];
        expect(parser(config, args)).to.eql({ _args: [], test: true, prueba: false });
    });

    it('aliases combined, argument', function () {
        let args = ['-tp', 'test'];
        expect(parser(config, args)).to.eql({ _args: ['test'], test: true, prueba: false });
    });

    it('aliases combined switched, argument', function () {
        let args = ['-pt', 'test'];
        expect(parser(config, args)).to.eql({ _args: ['test'], test: true, prueba: false });
    });

    it('aliases combined, unknwon alias', function () {
        let args = ['-ptq'];
        expect(parser(config, args)).to.eql({ _args: ['-ptq'], test: false, prueba: true });
    });
});
