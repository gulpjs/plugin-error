"use strict";

var assert = require("node:assert");
var { describe, it } = require("node:test");

var PluginError = require("../");

describe("PluginError()", function () {
  it("should default name to Error", function () {
    var err = new PluginError("test", "something broke");
    assert.deepStrictEqual(err.name, "Error");
  });

  it("can be constructed without new", function () {
    // eslint-disable-next-line new-cap
    var err = PluginError("test", "something broke");
    // eslint-enabled-next-line new-cap
    assert.ok(err instanceof PluginError);
  });

  it("throws if plugin name not set", function () {
    assert.throws(
      () => {
        new PluginError(undefined, "something broke");
      },
      { message: "Missing plugin name" },
    );
  });

  it("throws if message not set", function () {
    assert.throws(
      () => {
        new PluginError("test");
      },
      { message: "Missing error message" },
    );
  });

  it("should default name to Error, even when wrapped error has no name", function () {
    var realErr = { message: "something broke" };
    var err = new PluginError("test", realErr);
    assert.strictEqual(err.name, "Error");
  });

  it("should print the plugin name in toString", function () {
    var err = new PluginError("test", "something broke");
    assert.strictEqual(err.toString().includes("test"), true);
  });

  it("should not include the stack by default in toString", function () {
    var err = new PluginError("test", "something broke");
    // Just check that there are no 'at' lines
    assert.strictEqual(err.toString().includes("at"), false);
  });

  it("should include the stack when specified in toString", function () {
    var err = new PluginError("test", "something broke", {
      stack: "at huh",
      showStack: true,
    });
    // Just check that there are 'at' lines
    assert.strictEqual(err.toString().includes("at"), true);
  });

  it("should take arguments as one object", function () {
    var err = new PluginError({
      plugin: "test",
      message: "something broke",
    });
    assert.strictEqual(err.plugin, "test");
    assert.strictEqual(err.message, "something broke");
  });

  it("should take arguments as plugin name and one object", function () {
    var err = new PluginError("test", {
      message: "something broke",
    });
    assert.strictEqual(err.plugin, "test");
    assert.strictEqual(err.message, "something broke");
  });

  it("should take arguments as plugin name and message", function () {
    var err = new PluginError("test", "something broke");
    assert.strictEqual(err.plugin, "test");
    assert.strictEqual(err.message, "something broke");
  });

  it("should take arguments as plugin name, message, and one object", function () {
    var err = new PluginError("test", "something broke", { showStack: true });
    assert.strictEqual(err.plugin, "test");
    assert.strictEqual(err.message, "something broke");
    assert.strictEqual(err.showStack, true);
  });

  it("should take arguments as plugin name, error, and one object", function () {
    var realErr = new Error("something broke");
    realErr.fileName = "original.js";
    var err = new PluginError("test", realErr, {
      showStack: true,
      fileName: "override.js",
    });
    assert.strictEqual(err.plugin, "test");
    assert.strictEqual(err.message, "something broke");
    assert.strictEqual(err.fileName, "override.js");
    assert.strictEqual(err.showStack, true);
  });

  it("should take properties from error", function () {
    var realErr = new Error("something broke");
    realErr.abstractProperty = "abstract";
    var err = new PluginError("test", realErr);
    assert.strictEqual(err.plugin, "test");
    assert.strictEqual(err.message, "something broke");
    assert.strictEqual(err.abstractProperty, "abstract");
  });

  it("should be configured to show properties by default", function () {
    var err = new PluginError("test", "something broke");
    assert.strictEqual(err.showProperties, true);
  });

  it("should not be configured to take option to show properties", function () {
    var err = new PluginError("test", "something broke", {
      showProperties: false,
    });
    assert.strictEqual(err.showProperties, false);
  });

  it("should show properties", function () {
    var err = new PluginError("test", "it broke", { showProperties: true });
    err.fileName = "original.js";
    err.lineNumber = 35;
    assert.strictEqual(err.toString().includes("it broke"), true);
    assert.strictEqual(err.toString().includes("message:"), false);
    assert.strictEqual(err.toString().includes("fileName:"), true);
  });

  it("should show properties", function () {
    var realErr = new Error("something broke");
    realErr.fileName = "original.js";
    realErr.lineNumber = 35;
    var err = new PluginError("test", realErr, { showProperties: true });
    assert.strictEqual(err.toString().includes("message:"), false);
    assert.strictEqual(err.toString().includes("fileName:"), true);
  });

  it("should not show properties", function () {
    var realErr = new Error("something broke");
    realErr.fileName = "original.js";
    realErr.lineNumber = 35;
    var err = new PluginError("test", realErr, { showProperties: false });
    assert.strictEqual(err.toString().includes("message:"), false);
    assert.strictEqual(err.toString().includes("fileName:"), false);
  });

  it("should not show properties, but should show stack", function () {
    var err = new PluginError("test", "it broke", {
      stack: "test stack",
      showStack: true,
      showProperties: false,
    });
    err.fileName = "original.js";
    err.lineNumber = 35;
    assert.strictEqual(err.toString().includes("message:"), false);
    assert.strictEqual(err.toString().includes("fileName:"), false);
    assert.strictEqual(err.toString().includes("test stack"), true);
  });

  it("should not show properties, but should show stack for real error", function () {
    var realErr = new Error("something broke");
    realErr.fileName = "original.js";
    realErr.lineNumber = 35;
    realErr.stack = "test stack";
    var err = new PluginError("test", realErr, {
      showStack: true,
      showProperties: false,
    });
    assert.strictEqual(err.toString().indexOf("message:"), -1);
    assert.strictEqual(err.toString().indexOf("fileName:"), -1);
    assert.notStrictEqual(err.toString().indexOf("test stack"), -1);
  });

  it("should not show properties, but should show stack for _stack", function () {
    var realErr = new Error("something broke");
    realErr.fileName = "original.js";
    realErr.lineNumber = 35;
    realErr._stack = "test stack";
    var err = new PluginError("test", realErr, {
      showStack: true,
      showProperties: false,
    });
    assert.strictEqual(err.toString().indexOf("message:"), -1);
    assert.strictEqual(err.toString().indexOf("fileName:"), -1);
    assert.notStrictEqual(err.toString().indexOf("test stack"), -1);
  });

  it("should show properties and stack", function () {
    var realErr = new Error("something broke");
    realErr.fileName = "original.js";
    realErr.stack = "test stack";
    var err = new PluginError("test", realErr, { showStack: true });
    assert.strictEqual(err.toString().indexOf("message:"), -1);
    assert.notStrictEqual(err.toString().indexOf("fileName:"), -1);
    assert.notStrictEqual(err.toString().indexOf("test stack"), -1);
  });

  it("should show properties added after the error is created", function () {
    var realErr = new Error("something broke");
    var err = new PluginError("test", realErr);
    err.fileName = "original.js";
    assert.strictEqual(err.toString().indexOf("message:"), -1);
    assert.notStrictEqual(err.toString().indexOf("fileName:"), -1);
  });

  it("should toString quickly", { timeout: 1000 }, function () {
    var err = new PluginError("test", "it broke", { showStack: true });
    err.toString();
  });

  it(
    "should toString quickly with original error",
    { timeout: 1000 },
    function () {
      var realErr = new Error("it broke");
      var err = new PluginError("test", realErr, { showStack: true });
      err.toString();
    },
  );

  it('should not show "Details:" if there are no properties to show', function () {
    var err = new PluginError("plugin", "message");
    assert.strictEqual(err.toString().indexOf("Details:"), -1);
  });

  it("should not show additional properties added by a domain", function (t, done) {
    var Duplex = require("stream").Duplex;
    var stream = new Duplex({ objectMode: true });
    var domain = require("domain").create();
    domain.add(stream);
    domain.on("error", function (err) {
      assert.ok(err instanceof PluginError);
      assert.strictEqual(err.toString().includes("domain"), false);
      done();
    });
    stream.emit("error", new PluginError("plugin", "message"));
  });

  it("should not modify error argument", function () {
    var realErr = { message: "something broke" };
    new PluginError("test", realErr);
    assert.deepStrictEqual(realErr, { message: "something broke" });
  });

  it("should not modify options argument", function () {
    var opts = { showStack: true };
    new PluginError("test", "message", opts);
    assert.deepStrictEqual(opts, { showStack: true });
  });
});
