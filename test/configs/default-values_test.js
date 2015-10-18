'use strict';

const expect = require('expect.js');
const parser = require('../../');
/*global describe*/
/*global it*/

let config = {
    options: {
        flag: { flag: true, defaultValue: 'flag' },
        alias: { alias: 'a', defaultValue: 'alias' }
    }
};

describe('default values config', function() {
    it('empty arguments', function () {
        let args = [];
        expect(parser(config, args)).to.eql({ _args: args, flag: 'flag', alias: 'alias' });
    });

    it('single argument', function () {
        let args = ['test'];
        expect(parser(config, args)).to.eql({ _args: args, flag: 'flag', alias: 'alias' });
    });

    it('flag and alias', function () {
        let args = ['--flag', '-a'];
        expect(parser(config, args)).to.eql({ _args: [], flag: true, alias: true });
    });

    it('flag and alias with arguments', function () {
        let args = ['--flag=test1', '-a=test2'];
        expect(parser(config, args)).to.eql({ _args: [], flag: 'test1', alias: 'test2' });
    });

    it('flag and alias next arguments', function () {
        let args = ['--flag', 'test1', '-a', 'test2'];
        expect(parser(config, args)).to.eql({ _args: [], flag: 'test1', alias: 'test2' });
    });
});
