const state = {
  // lox pressures
  loxTankPT: 0.0,
  loxDomePT: 0.0,
  loxInjectorPT: 0.0,
  loxGemsPT: 0.0,
  // lox fitting tree and gems temperature
  loxTreeTC: 0.0,
  loxGemsTC: 0.0,
  // lox fill TCs
  loxTankLowTC: 0.0,
  loxTankMidTC: 0.0,
  loxTankHighTC: 0.0,
  // propane injector PT TC
  propInjectorTC: 0.0,
  // propane pressures
  propTankPT: 0.0,
  propDomePT: 0.0,
  propInjectorPT: 0.0,
  // propane fill TCs
  propTankLowTC: 0.0,
  propTankMidTC: 0.0,
  propTankHighTC: 0.0,
  // propane injector PT TC
  propInjectorTC: 0.0,
  // pressurant pressure
  pressurantPT: 0.0,
  // flight board power stats
  flightVoltage: 0.0,
  flightPower: 0.0,
  flightCurrent: 0.0,
  // engine temperatures
  engine1TC: 0.0,
  engine2TC: 0.0,
  engine3TC: 0.0,
  engine4TC: 0.0,
  engine5TC: 0.0,
  engine6TC: 0.0,
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
