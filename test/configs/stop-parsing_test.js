'use strict';

const expect = require('expect.js');
const parser = require('../../');
/*global describe*/
/*global it*/

let config = {
    options: [
        { flag: 'flag' },
        { alias: 'a', name: 'alias' }
    ]
};

describe('stop-parsing config', function() {
    it('empty arguments', function () {
        let args = [];
        expect(parser(config, args)).to.eql({ _args: args, flag: undefined, alias: undefined });
    });

    it('stop, no arguments', function () {
        let args = ['--'];
        expect(parser(config, args)).to.eql({ _args: [], flag: undefined, alias: undefined, argv: [] });
    });

    it('stop, one argument', function () {
        let args = ['--', 'test'];
        expect(parser(config, args)).to.eql({ _args: [], flag: undefined, alias: undefined, argv: ['test'] });
    });

    it('stop, multiple arguments', function () {
        let args = ['--', 'test1', 'test2'];
        expect(parser(config, args)).to.eql({ _args: [], flag: undefined, alias: undefined, argv: ['test1', 'test2'] });
    });

    it('flag with argument, stop, one argument', function () {
        let args = ['--flag=test1', '--', 'test2'];
        expect(parser(config, args)).to.eql({ _args: [], flag: 'test1', alias: undefined, argv: ['test2'] });
    });

    it('flag next argument, stop, one argument', function () {
        let args = ['--flag', 'test1', '--', 'test2'];
        expect(parser(config, args)).to.eql({ _args: [], flag: 'test1', alias: undefined, argv: ['test2'] });
    });

    it('flag no argument, stop, one argument', function () {
        let args = ['--flag', '--', 'test'];
        expect(parser(config, args)).to.eql({ _args: [], flag: true, alias: undefined, argv: ['test'] });
    });

    it('configured stop and rest, one argument', function () {
        let args = ['##', 'test'];

        config.stopArgument = '##';
        config.restArguments = 'rest';

        expect(parser(config, args)).to.eql({ _args: [], flag: undefined, alias: undefined, rest: ['test'] });
    });
});
