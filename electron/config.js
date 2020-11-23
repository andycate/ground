const config = {
  sensors: [
    {
      name: "LOX Tank Pressure",
      packetId: 1,
      values: [
        {
          packetPosition: 0,
          storageName: "loxTank",
          label: "pressure",
          interpolation: {
            type: "linear", // linear, quadratic
            unit: "PSI",
            values: [ // [x, y] pairs
              [0, -123.89876445934394],
              [8388607, 1131.40825] // 2^23 - 1
            ]
          }
        }
      ]
    },
    {
      name: "Prop Tank Pressure",
      packetId: 1,
      values: [
        {
          packetPosition: 1,
          storageName: "propTank",
          label: "pressure",
          interpolation: {
            type: "linear", // linear, quadratic
            unit: "PSI",
            values: [ // [x, y] pairs
              [0, -123.89876445934394],
              [8388607, 1131.40825] // 2^23 - 1
            ]
          }
        }
      ]
    },
    {
      name: "LOX Injector Pressure",
      packetId: 1,
      values: [
        {
          packetPosition: 2,
          storageName: "loxInjector",
          label: "pressure",
          interpolation: {
            type: "linear", // linear, quadratic
            unit: "PSI",
            values: [ // [x, y] pairs
              [0, -123.89876445934394],
              [8388607, 1131.40825] // 2^23 - 1
            ]
          }
        }
      ]
    },
    {
      name: "Prop Injector Pressure",
      packetId: 1,
      values: [
        {
          packetPosition: 3,
          storageName: "propInjector",
          label: "pressure",
          interpolation: {
            type: "linear", // none, linear, quadratic
            unit: "PSI",
            values: [ // [x, y] pairs
              [0, -123.89876445934394],
              [8388607, 1131.40825] // 2^23 - 1
            ]
          }
        }
      ]
    },
    {
      name: "Nitrogen Pressure",
      packetId: 1,
      values: [
        {
          packetPosition: 4,
          storageName: "highPressure",
          label: "pressure",
          interpolation: {
            type: "linear", // linear, quadratic
            unit: "PSI",
            values: [
              [ 1484917.8337280003, 0 ],
              [ 1609270.5587200003, 150 ],
              [ 2311497.711616, 700 ],
              [ 2362701.774848, 730 ],
              [ 2435850.4366080007, 805 ],
              [ 2545573.429248, 890 ],
              [ 2662611.288064, 990 ],
              [ 2794278.8792320006, 1100 ],
              [ 2896687.0056960005, 1200 ],
              [ 3101503.2586240005, 1351 ],
              [ 3218541.1174400006, 1450 ],
              [ 3364838.4409600007, 1580 ],
              [ 3584284.4262400004, 1760 ],
              [ 3774470.9468160006, 1930 ],
              [ 3979287.1997440006, 2100 ],
              [ 4096325.0585600007, 2180 ],
              [ 4315771.043840001, 2400 ],
              [ 4520587.296768, 2550 ],
              [ 4725403.549696, 2700 ],
              [ 4915590.0702720005, 2870 ],
              [ 5105776.590848001, 3020 ],
              [ 5310592.843776001, 3190 ],
              [ 5464205.033472002, 3333 ],
              [ 5566613.1599360015, 3426 ],
              [ 5808003.743744001, 3620 ],
              [ 5881152.405504001, 3700 ],
              [ 6056709.193728001, 3850 ],
              [ 6261525.446656002, 4000 ],
              [ 6349303.840768002, 4080 ],
              [ 6480971.431936001, 4186 ],
              [ 6524860.628992, 4221 ],
              [ 6715047.149568, 4365 ],
            ]
          }
        }
      ]
    },
    {
      name: "Battery",
      packetId: 2,
      values: [
        {
          packetPosition: 0,
          storageName: "batteryVoltage",
          label: "voltage",
          interpolation: {
            type: "none",
            unit: "Volts"
          }
        },
        {
          packetPosition: 1,
          storageName: "wattage",
          label: "wattage",
          interpolation: {
            type: "none",
            unit: "Watts"
          }
        },
        {
          packetPosition: 2,
          storageName: "batteryAmperage",
          label: "current",
          interpolation: {
            type: "none",
            unit: "Amps"
          }
        }
      ]
    },
    {
      name: "Fitting Tree",
      packetId: 0,
      values: [
        {
          packetPosition: 0,
          storageName: "fittingTreeTemperature",
          label: "temperature",
          interpolation: {
            type: "none", // none, linear, quadratic
            unit: "Celcius"
          }
        },
        {
          packetPosition: 1,
          storageName: "fittingTreeHeater",
          label: "heater",
          interpolation: {
            type: "none", // none, linear, quadratic
            unit: "Volts"
          }
        }
      ]
    },
  ]
};

const getPacketConfig = () => {
  const packets = {};
  config.sensors.forEach((s, i) => {
    if(!packets[s.packetId]) {
      packets[s.packetId] = [];
    }
    packets[s.packetId].push(i);
  });
  return packets;
}

module.exports = { config, getPacketConfig };
