# Telemetry

This directory includes the React App that gets loaded into the Electron.js app.

## Updating Packet Definitions

### Adding Packets to Dashboard

Every *Class extends Board* instance added in /electron/App.js should have the `packets` parameter defined. See
/electron/FlightV2.js for an example.

### Displaying Messages on the Dashboard Text Log

Add an interpolator to the field definitions in the electron directory.

In the current configuration, all numerical values are ignored, so the raw int values from the packet will not be
displayed. For example, the field definition for solenoid short-circuiting is in /electron/FlightV2.js

```json
{
  21: {
    8: {
      field: 'overcurrentTriggeredSols',
      interpolation: Interpolation.interpolateSolenoidErrors
    }
  }
}
```

And, the static Interpolator function, in /electron/Interpolation.js, is used to convert the int value to string (iff
the value is not zero, indicating no errors):

```javascript
 static
interpolateSolenoidErrors(value)
{
    // value is base 2 int where each "1" indicates an error for that solenoid
    // 0 represents no error in any of the sols

    function mapSolNumToName(num) {
        // TODO: map the number to a string
        return `#${num + 1}`
    }

    let int = Math.round(value)

    if (int === 0) {
        return value
    }

    let errors = int.toString(2).split("").reverse().map(_char => (+_char === 1))
    const str = `Shorted sols: ${errors.reduce((acc, cur, idx) => {
        if (cur) {
            acc += `${mapSolNumToName(idx)}, `
        }
        return acc
    }, "")}`
    return str.substring(0, str.length - 2)
}
```

### Configuring the Dashboard Text Log

See /telemetry/src/config/textbox-display-config.js

#### Generic Pre-Filters

`GENERIC_FILTERS` is an array of filter objects (*not tree nodes*) that contains an `ignoredIf` field. Each filter
object is applied to each message encountered. If any of the `ignoredIf` returns true for a message, the message will
not be added to the raw array of logs.

> This means that each ignored message will not be able to be displayed again.
> Changes to GENERIC_FILTER has to be done before build.

Currently, the only filter in the array is the numerical filtering object:

```json
{
  name: 'Number Updates',
  key: 't2-number-updates',
  ignoredIf: (node)
  =>
  (typeof
  node._val
  ===
  'number'
  )
  // if node value is a number, probably is a value update
}
```

#### Filtering Options During Runtime

`ROOT_OPTION_GROUPING` represents filtering options available during run time. It is a tree node where toggling the top
node will toggle all sub-nodes recursively. The menu available will be automatically generated. All messages filtered
through the menu are recoverable (it's just a toggle).

The key: `t2-unknowns`, is a special key that refers to any messages received by the textbox display (after the
pre-filtering) that does not have a key-field definition within the `ROOT_OPTION_GROUPING` already. This is useful to
set specific highlighting colors to catch messages that are not defined and to also filter out any random messages.

#### Adding Highlights to Specific Fields

In `ROOT_OPTION_GROUPING`, any node can contain a `highlight` field that will apply the specified highlight color to all
sub-nodes recursively. If a sub-node of such node also contain a `highlight` field, the sub-node's value will take
precedence and will be applied recursively.

# Create React App's README.md

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using
the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more
information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will
remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right
into your project so you have full control over them. All of the commands except `eject` will still work, but they will
point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you
shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t
customize it when you are ready for it.

## Learn More

You can learn more in
the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
