# parse-cli-arguments

> Parses passed cli arguments to an object

## Install

This module requires node `>=4.0.0`

```
$ npm install --save parse-cli-arguments
```

## Usage

```js
let args = require('parse-cli-arguments')(configuration);
```

## Example

```js
//node index.js test -a
let args = require('parse-cli-arguments')({
    options: [
        { name: 'option', defaultOption: true },
        { alias: 'a', name: 'alias' }
    ]
});
/*args = {
    option: 'test',
    alias: true
}*/
```

## Configuration

```js
let configuration = {
    options: [],
    flagSymbol: '--',
    aliasSymbol: '-',
    argumentSymbol: '=',
    stopArgument: '--',
    restArguments: 'argv',
    debug: false
}
```

### options

The options-array is a collection of options. If no option is set or none is configured as a `defaultOption` the collection will be extended by a catch-all option with the name `_args`.

### option

```js
let option = {
    name: 'option', //String
    flag: 'flag', //String
    alias: 'f', //String
    defaultOption: true, //Boolean
    multiple: true, //Boolean
    defaultValue: true, //any value
    type: '', //String
    transform: function(val) { return parseInt(val); }
}
```

The shortest valid option is `{ flag: 'flag' }`. It is valid to set only the name, but this option would always return `undefined` as no value can be assigned to the option without configuring `flag`, `alias` or `defaultValue`.

#### option.name

This configuration sets the name of the property in the returned object.

#### option.flag

This configuration sets the name of the flag. If the name of the option is not set, the name of the flag will be used in the returned object.

#### option.alias

This configuration sets the name of the alias. It must only consist of one character. The name or the flag of the option is necessary.

#### option.defaultOption

This configuration must be set no more than once. All unassigned values will be added to this option. If no option is configured as `defaultOption`, unassigned values will be available in an array with the name `_args`.

#### option.multiple

This configuration allows the option to return multiple values. If it is set, the returned value will always be an array. If it is not set and multiple values for the same flag or alias are passed, only the last one will be returned.

#### option.defaultValue

This configuration sets the returned value if the flag/alias  was not passed or no unassigned value was added to the `defaultOption`. The returned object always contains every configured option. If no value is passed and no `defaultValue` is configured the value will be `undefined` or `[]` when configured as `multiple`.

If a flag/alias is passed without a value, e.g. `node index.js --flag`, the value will be set to `true`.

#### option.type

This configuration is only used to distinguish between Booleans and all other values. If an option is configured as Boolean, the opposite of the `defaultValue` will be returned when the flag or alias is set. If no `defaultValue` is configured, the `defaultValue` is automatically set to `false`. Boolean options must not be configured as `defaultOption` or `multiple`.

#### option.transform

This configuration allows to define a function that modifies the value before it is added to the returned object. Three arguments will be passed to the function: the passed value, the matched option and a reference to lodash.

### flagSymbol

This configuration sets the prefix for all flags. The default value is `--`.

### aliasSymbol

This configuration sets the prefix for all aliases. The default value is `-`.

### argumentSymbol

This configuration sets the sign that separates flags/aliases and values. The default value is `=`.

### stopArgument

This configuration sets the symbol that will stop the parsing of the passed arguments.

### restArguments

This configuration sets the name of the property that contains all unparsed values.

### debug

This configuration activates warnings that are written to the console. This warnings notice the user of behaviors that could be misinterpreted as failure but work as intended.

There are currently 3 different warnings:
- "Option [option.name] has been overridden." - Triggered when an option is not configured as multiple but multiple values were passed. Only the last passed value will be returned.
- "Alias [aliases] ignored because not all parts could be identified." - Triggered when aliases are grouped, e.g. `-abc`, and not all aliases are configured. In this case the group will be treated as a value.
- "Value [val] is discarded because [option.name] is configured as Boolean." - If a flag or alias is configured as Boolean but passed with a value, e.g. `-test="123"`, the value will be ignored.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add tests for any new or changed functionality. Lint and test your code using `npm test`.
