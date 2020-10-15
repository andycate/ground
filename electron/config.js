const config = {
  sensors: [
    {
      name: 'LOX Injector Low Pressure',
      id: 1,
      display: {
        type: 'graph',
        minValue: 0.0,
        maxValue: 650.0
      },
      numValues: 1
    },
    {
      name: 'Prop Injector Low Pressure',
      id: 2,
      display: {
        type: 'graph',
        minValue: 0.0,
        maxValue: 650.0
      },
      numValues: 1
    },
    {
      name: 'LOX Tank Low Pressure',
      id: 3,
      display: {
        type: 'graph',
        minValue: 0.0,
        maxValue: 800.0
      },
      numValues: 1
    },
    {
      name: 'Prop Tank Low Pressure',
      id: 4,
      display: {
        type: 'graph',
        minValue: 0.0,
        maxValue: 800.0
      },
      numValues: 1
    },
    {
      name: 'High Pressure',
      id: 5,
      display: {
        type: 'graph',
        minValue: 0.0,
        maxValue: 5000.0
      },
      numValues: 1
    },
    {
      name: 'GPS Aux',
      id: 8,
      display: {
        type: 'graph',
        minValue: 0.0,
        maxValue: 5000.0
      },
      numValues: 1
    }
  ]
};

module.exports = config;
