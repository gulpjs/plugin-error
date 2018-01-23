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
    const options: PluginError.Options = {showStack: true};
    const err = new PluginError("test", existingError, options);
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
  // Union types
  const PLUGIN_NAME: string = "test";

  interface FooError extends Error {
    foo: number;
  }

  const ERROR: Error = new Error("something broke");
  const FOO_ERROR: FooError = Object.assign(new Error("something broke"), {foo: 1});
  const MESSAGE: string = "something broke";
  const OPTIONS: {message: string} = {message: "something broke"};

  {
    function createError(error: Error | string) {
      return new PluginError(PLUGIN_NAME, error);
    }
    const pluginError1 = createError(ERROR);
    const pluginError2 = createError(FOO_ERROR);
    const pluginError3 = createError(MESSAGE);
    // The following code should cause a compilation error:
    // const foo: any = pluginError2.foo;
  }

  {
    // Make sure that custom properties are preserved
    function createError(error: FooError) {
      return new PluginError(PLUGIN_NAME, error);
    }
    const pluginError = createError(FOO_ERROR);
    const foo: number = pluginError.foo;
  }

  {
    // Just check that there's no issue when building it with a string
    function createError(error: string) {
      return new PluginError(PLUGIN_NAME, error);
    }
    const pluginError = createError(MESSAGE);
    // The following code should cause a compilation error:
    // const foo: any = pluginError.foo;
  }

  {
    // Check that custom properties are preserved but marked as potentially missing
    // The `foo` property must be of type `number | undefined` because it's existence depends
    // on the way `createError` is called.
    function createError(error: FooError | string) {
      return new PluginError(PLUGIN_NAME, error);
    }

    const pluginError1 = createError(FOO_ERROR);
    const foo1: number | undefined = pluginError1.foo;
    // The following code should cause a compilation error:
    // const foo2: number = pluginError1.foo;

    const pluginError2 = createError(MESSAGE);
    const foo3: number | undefined = pluginError2.foo;
    // The following code should cause a compilation error:
    // const foo4: number = pluginError2.foo;
  }

  {
    // Check support for  unions with option object
    function createError(error: FooError | string | (PluginError.Options & {message: string})) {
      return new PluginError(PLUGIN_NAME, error);
    }

    const pluginError1 = createError(FOO_ERROR);
    const foo1: number | undefined = pluginError1.foo;
    // The following code should cause a compilation error:
    // const foo2: number = pluginError1.foo;

    const pluginError2 = createError(MESSAGE);
    const foo3: number | undefined = pluginError2.foo;
    // The following code should cause a compilation error:
    // const foo4: number = pluginError2.foo;

    const pluginError3 = createError(OPTIONS);
    const foo5: number | undefined = pluginError3.foo;
    // The following code should cause a compilation error:
    // const foo6: number = pluginError3.foo;
  }
}
