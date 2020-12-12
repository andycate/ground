# Ground Station
## About
This repository contains code for the ground station that
will be used to view live telemetry from and control the
rocket.

The UI frontend is written using the [React](https://reactjs.org/)
framework. All the UI code lives in the `main` directory,
which was created using [create-react-app](https://create-react-app.dev/).
The app itself uses [Electron](https://www.electronjs.org/) as a
framework for displaying the UI. All the code that runs on the
backend, including processing data from the rocket, lives in the
`electron` directory.

## Setup
Here is a guide to get started with running the dashboard.
First, make sure you have NodeJS installed. If you don't,
read [these](https://nodejs.org/en/download/) instructions
to install it. Once node is installed, `cd` into this
directory and run `npm i`. This will install all the
dependencies required by this project that are defined in
the `package.json` file. Next, `cd` into the `main` directory
and run `npm i`. Repeat for the `remote` directory. The `main`
directory contains all the code for the web based UI. The
`remote` directory contains all the code for the web page
that can be loaded on your phone to view pressure values
remotely over wifi.

Now that you have all the dependencies installed, `cd` back
to the top directory. Then, run `npx electron-rebuild`. This
command rebuilds some of the native libraries for the specific
platform you are running. That's all that is required to setup
for development.

## Running
NOTE: Running the ground station for the first time will create
a new directory in your home directory called `GroundStation`,
where it will store data files.

To start the ground station, first `cd` into the `main` directory
and run `npm run start`. Then open a new terminal window and make
sure you are in the top directory. Run `npm run start-electron` to
open the ground station window.

If you would like to run the remote viewing web page, open a new
terminal window and `cd` into the `remote` directory. Then run
`npm run start`.

## Usage
Once the app is running, you can connect to the rocket by opening
the serial port on your computer corresponding to the radio on the
ground station. By default, any valid data that is received will be
recorded in an SQLite database file that is stored in the
`GroundStation` directory created when the ground station was run for
the first time. When a recording is started, the data will also be
written to a CSV file in that same directory.

## Packaging the app
There is a way to package the app into a nice neat executable that
is standalone, but I'm too lazy to write the instructions to do it
right now. I will do it at some point, when that feature actually
becomes useful/relevant.
