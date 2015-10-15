'use strict';

const expect = require('expect.js');
const parser = require('../../');
/*global describe*/
/*global it*/

let config = { options: [{ alias: 't', name: 'test', transform: (val, arg, _) => `${_.capitalize(arg.name)}: ${val}` }] };

describe('transform config', function() {
    it('alias with argument', function () {
        let args = ['-t=test'];
        expect(parser(config, args)).to.eql({ _args: [], test: 'Test: test' });
    });

    it('alias next argument', function () {
        let args = ['-t', 'test'];
        expect(parser(config, args)).to.eql({ _args: [], test: 'Test: test' });
    });

    it('argument, alias next argument', function () {
        let args = ['test', '-t', 'testF'];
        expect(parser(config, args)).to.eql({ _args: ['test'], test: 'Test: testF' });
    });

    it('alias next argument, argument', function () {
        let args = ['-t', 'testF', 'test'];
        expect(parser(config, args)).to.eql({ _args: ['test'], test: 'Test: testF' });
    });
});
