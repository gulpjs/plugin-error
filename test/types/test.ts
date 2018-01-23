import PluginError = require("plugin-error");

{
  // Check constructor signatures
  // See: https://github.com/gulpjs/gulp-util#new-pluginerrorpluginname-message-options
  {
    const err = new PluginError("test", {
      message: "something broke",
    });
  }

  {
    const err = new PluginError({
      plugin: "test",
      message: "something broke",
    });
  }

  {
    const err = new PluginError("test", "something broke");
  }

  {
    const err = new PluginError("test", "something broke", {showStack: true});
  }

  {
    const existingError = new Error("OMG");
    const err = new PluginError("test", existingError, {showStack: true});
  }
}

{
  {
    // Check available properties
    const realErr = Object.assign(new Error("something broke"), {fileName: "original.js"});
    const err = new PluginError("test", realErr, {showStack: true, fileName: "override.js"});
    const plugin: string = err.plugin;
    const message: string = err.message;
    const fileName: string = err.fileName;
    const showStack: boolean = err.showStack;
    const showProperties: boolean = err.showProperties;
  }
  {
    // Inference of custom properties from `error` argument,
    const realErr = Object.assign(new Error("something broke"), {abstractProperty: "abstract"});
    const err = new PluginError("test", realErr, realErr);
    const plugin: string = err.plugin;
    const message: string = err.message;
    const abstractProperty: string = err.abstractProperty;
  }
}

{
  const PLUGIN_NAME = 'test';
  function createPluginError(err: Error | string) {
    return new PluginError(PLUGIN_NAME, err);
  }
}

{
  const PLUGIN_NAME = 'test';

  interface IFooError extends Error {
    foo: number;
  }

  function createPluginError(err: IFooError | string) {
    return new PluginError(PLUGIN_NAME, err);
  }

  const fooError: IFooError = Object.assign(new Error('something broke'), {foo: 1});
  const pluginError = createPluginError(fooError);
  const foo: number = pluginError.foo;
}

{
  // Inference with union type on second parameter and dependent properties
  const PLUGIN_NAME = 'test';

  interface IFooBarError extends Error {
    foo: number;
    bar: number;
  }

  function createPluginError(err: IFooBarError | string) {
    return new PluginError(PLUGIN_NAME, err);
  }

  const fooError: IFooBarError = Object.assign(new Error('something broke'), {foo: 1, bar: 2});
  const pluginError = createPluginError(fooError);
  const foo: number = pluginError.foo;
  const bar: number = pluginError.bar;
}
