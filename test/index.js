'use strict';

var expect = require('expect');

var PluginError = require('../');

describe('PluginError()', function () {
  it('should default name to Error', function (done) {
    var err = new PluginError('test', 'something broke');
    expect(err.name).toEqual('Error');
    done();
  });

  it('should default name to Error, even when wrapped error has no name', function (done) {
    var realErr = { message: 'something broke' };
    var err = new PluginError('test', realErr);
    expect(err.name).toEqual('Error');
    done();
  });

  it('should print the plugin name in toString', function (done) {
    var err = new PluginError('test', 'something broke');
    expect(err.toString()).toContain('test');
    done();
  });

  it('should not include the stack by default in toString', function (done) {
    var err = new PluginError('test', 'something broke');
    // Just check that there are no 'at' lines
    expect(err.toString()).toNotContain('at');
    done();
  });

  it('should include the stack when specified in toString', function (done) {
    var err = new PluginError('test', 'something broke', { stack: 'at huh', showStack: true });
    // Just check that there are 'at' lines
    expect(err.toString()).toContain('at');
    done();
  });

  it('should take arguments as one object', function (done) {
    var err = new PluginError({
      plugin: 'test',
      message: 'something broke'
    });
    expect(err.plugin).toEqual('test');
    expect(err.message).toEqual('something broke');
    done();
  });

  it('should take arguments as plugin name and one object', function (done) {
    var err = new PluginError('test', {
      message: 'something broke'
    });
    expect(err.plugin).toEqual('test');
    expect(err.message).toEqual('something broke');
    done();
  });

  it('should take arguments as plugin name and message', function (done) {
    var err = new PluginError('test', 'something broke');
    expect(err.plugin).toEqual('test');
    expect(err.message).toEqual('something broke');
    done();
  });

  it('should take arguments as plugin name, message, and one object', function (done) {
    var err = new PluginError('test', 'something broke', { showStack: true });
    expect(err.plugin).toEqual('test');
    expect(err.message).toEqual('something broke');
    expect(err.showStack).toEqual(true);
    done();
  });

  it('should take arguments as plugin name, error, and one object', function (done) {
    var realErr = new Error('something broke');
    realErr.fileName = 'original.js';
    var err = new PluginError('test', realErr, { showStack: true, fileName: 'override.js' });
    expect(err.plugin).toEqual('test');
    expect(err.message).toEqual('something broke');
    expect(err.fileName).toEqual('override.js');
    expect(err.showStack).toEqual(true);
    done();
  });

  it('should take properties from error', function (done) {
    var realErr = new Error('something broke');
    realErr.abstractProperty = 'abstract';
    var err = new PluginError('test', realErr);
    expect(err.plugin).toEqual('test');
    expect(err.message).toEqual('something broke');
    expect(err.abstractProperty).toEqual('abstract');
    done();
  });

  it('should be configured to show properties by default', function (done) {
    var err = new PluginError('test', 'something broke');
    expect(err.showProperties).toBe(true);
    done();
  });

  it('should not be configured to take option to show properties', function (done) {
    var err = new PluginError('test', 'something broke', { showProperties: false });
    expect(err.showProperties).toBe(false);
    done();
  });

  it('should show properties', function (done) {
    var err = new PluginError('test', 'it broke', { showProperties: true });
    err.fileName = 'original.js';
    err.lineNumber = 35;
    expect(err.toString()).toContain('it broke');
    expect(err.toString()).toNotContain('message:');
    expect(err.toString()).toContain('fileName:');
    done();
  });

  it('should show properties', function (done) {
    var realErr = new Error('something broke');
    realErr.fileName = 'original.js';
    realErr.lineNumber = 35;
    var err = new PluginError('test', realErr, { showProperties: true });
    expect(err.toString()).toNotContain('message:');
    expect(err.toString()).toContain('fileName:');
    done();
  });

  it('should not show properties', function (done) {
    var realErr = new Error('something broke');
    realErr.fileName = 'original.js';
    realErr.lineNumber = 35;
    var err = new PluginError('test', realErr, { showProperties: false });
    expect(err.toString()).toNotContain('message:');
    expect(err.toString()).toNotContain('fileName:');
    done();
  });

  it('should not show properties, but should show stack', function (done) {
    var err = new PluginError('test', 'it broke', { stack: 'test stack', showStack: true, showProperties: false });
    err.fileName = 'original.js';
    err.lineNumber = 35;
    expect(err.toString()).toNotContain('message:');
    expect(err.toString()).toNotContain('fileName:');
    expect(err.toString()).toContain('test stack');
    done();
  });

  it('should not show properties, but should show stack for real error', function (done) {
    var realErr = new Error('something broke');
    realErr.fileName = 'original.js';
    realErr.lineNumber = 35;
    realErr.stack = 'test stack';
    var err = new PluginError('test', realErr, { showStack: true, showProperties: false });
    expect(err.toString().indexOf('message:')).toEqual(-1);
    expect(err.toString().indexOf('fileName:')).toEqual(-1);
    expect(err.toString().indexOf('test stack')).toNotEqual(-1);
    done();
  });

  it('should not show properties, but should show stack for _stack', function (done) {
    var realErr = new Error('something broke');
    realErr.fileName = 'original.js';
    realErr.lineNumber = 35;
    realErr._stack = 'test stack';
    var err = new PluginError('test', realErr, { showStack: true, showProperties: false });
    expect(err.toString().indexOf('message:')).toEqual(-1);
    expect(err.toString().indexOf('fileName:')).toEqual(-1);
    expect(err.toString().indexOf('test stack')).toNotEqual(-1);
    done();
  });

  it('should show properties and stack', function (done) {
    var realErr = new Error('something broke');
    realErr.fileName = 'original.js';
    realErr.stack = 'test stack';
    var err = new PluginError('test', realErr, { showStack: true });
    expect(err.toString().indexOf('message:')).toEqual(-1);
    expect(err.toString().indexOf('fileName:')).toNotEqual(-1);
    expect(err.toString().indexOf('test stack')).toNotEqual(-1);
    done();
  });

  it('should show properties added after the error is created', function (done) {
    var realErr = new Error('something broke');
    var err = new PluginError('test', realErr);
    err.fileName = 'original.js';
    expect(err.toString().indexOf('message:')).toEqual(-1);
    expect(err.toString().indexOf('fileName:')).toNotEqual(-1);
    done();
  });

  it('should toString quickly', function (done) {
    this.timeout(100);

    var err = new PluginError('test', 'it broke', { showStack: true });
    err.toString();

    done();
  });

  it('should toString quickly with original error', function (done) {
    this.timeout(100);

    var realErr = new Error('it broke');
    var err = new PluginError('test', realErr, { showStack: true });
    err.toString();

    done();
  });

  it('should not show "Details:" if there are no properties to show', function (done) {
    var err = new PluginError('plugin', 'message');
    expect(err.toString().indexOf('Details:')).toEqual(-1);
    done();
  });
});
