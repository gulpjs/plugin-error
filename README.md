<p align="center">
  <a href="https://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
</p>

# plugin-error

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][ci-image]][ci-url] [![Coveralls Status][coveralls-image]][coveralls-url]

Error handling for Vinyl plugins.

## Usage

```js
var PluginError = require("plugin-error");

var err = new PluginError("test", {
  message: "something broke",
});

var err = new PluginError({
  plugin: "test",
  message: "something broke",
});

var err = new PluginError("test", "something broke");

var err = new PluginError("test", "something broke", { showStack: true });

var existingError = new Error("OMG");
var err = new PluginError("test", existingError, { showStack: true });
```

## API

### `new PluginError(pluginName, message[, options])`

Error constructor that takes:

- `pluginName` - a `String` that should be the module name of your plugin
- `message` - a `String` message or an existing `Error` object
- `options` - an `Object` of your options

**Behavior:**

- By default the stack will not be shown. Set `options.showStack` to true if you think the stack is important for your error.
- If you pass an error object as the message the stack will be pulled from that, otherwise one will be created.
- If you pass in a custom stack string you need to include the message along with that.
- Error properties will be included in `err.toString()`, but may be omitted by including `{ showProperties: false }` in the options.

## Strict No LLM / No AI Policy

No LLMs for issues.

No LLMs for patches / pull requests.

No LLMs for comments on the bug tracker, including translation.

English is encouraged, but not required. You are welcome to post in your native language and rely on others to have their own translation tools of choice to interpret your words.

## License

MIT

<!-- prettier-ignore-start -->
[downloads-image]: https://img.shields.io/npm/dm/plugin-error.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/plugin-error
[npm-image]: https://img.shields.io/npm/v/plugin-error.svg?style=flat-square

[ci-url]: https://github.com/gulpjs/plugin-error/actions/workflows/dev.yml
[ci-image]: https://img.shields.io/github/actions/workflow/status/gulpjs/plugin-error/dev.yml?style=flat-square

[coveralls-url]: https://coveralls.io/r/gulpjs/plugin-error
[coveralls-image]: https://img.shields.io/coveralls/gulpjs/plugin-error/main.svg?style=flat-square
<!-- prettier-ignore-end -->
