const config = {
  sensors: [
    {
      name: "LOX Tank Pressure",
      packetId: 1,
      values: [
        {
          packetPosition: 0,
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
          packetId: 1,
          packetPosition: 1,
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
          label: "pressure",
          interpolation: {
            type: "linear", // linear, quadratic
            unit: "PSI",
            values: [ // [x, y] pairs
              [1677721,0],
              [1845493,150],
              [2650800,700],
              [2709520,730],
              [2793406,805],
              [2919235,890],
              [3053453,990],
              [3204448,1100],
              [3321888,1200],
              [3556769,1351],
              [3690987,1450],
              [3858759,1580],
              [4110417,1760],
              [4328521,1930],
              [4563402,2100],
              [4697620,2180],
              [4949278,2400],
              [5184159,2550],
              [5419040,2700],
              [5637144,2870],
              [5855248,3020],
              [6090129,3190],
              [6266290,3333],
              [6383730,3426],
              [6660554,3620],
              [6744440,3700],
              [6945767,3850],
              [7180648,4000],
              [7281311,4080],
              [7432306,4186],
              [7482638,4221],
              [7700742,4365],
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
          label: "voltage",
          interpolation: {
            type: "none",
            unit: "Volts"
          }
        },
        {
          packetPosition: 1,
          label: "wattage",
          interpolation: {
            type: "none",
            unit: "Watts"
          }
        },
        {
          packetPosition: 2,
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
          label: "temperature",
          interpolation: {
            type: "none", // none, linear, quadratic
            unit: "Celcius"
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
