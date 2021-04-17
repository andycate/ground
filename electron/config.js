const model = {

  //----------Flight Computer----------

  // lox pressures
  loxTankPT: 0.0,
  loxDomePT: 0.0,
  loxInjectorPT: 0.0,
  loxGemsPT: 0.0,
  // lox fitting tree and gems temperature
  loxTreeTemp: 0.0,
  loxTreeHeater: 0.0,
  loxGemsTemp: 0.0,
  loxGemsHeater: 0.0,
  // lox fill TCs
  loxTankMidTC: 0.0,
  loxTankTopTC: 0.0,
  // lox injector PT temp
  loxInjectorTemp: 0,0,

  // propane pressures
  propTankPT: 0.0,
  propDomePT: 0.0,
  propInjectorPT: 0.0,
  propGemsPT: 0.0,
  // propane fill TCs
  propTankMidTC: 0.0,
  propTankTopTC: 0.0,
  // propane injector PT TC
  propInjectorTC: 0.0,

  // pressurant pressure
  pressurantPT: 0.0,
  // flight board power stats
  flightVoltage: 0.0,
  flightPower: 0.0,
  flightCurrent: 0.0,

  // valve states
  lox2Way: false,
  lox5Way: false,
  prop5Way: false,
  loxGems: false,
  propGems: false,
  HPS: false,
  HPSEnable: false,

  //connection stats
  // connection stats
  flightConnected: false,
  flightKbps: 0,

  //---------------DAQ 1---------------

  propGemsPT: 0.0,
  daq1Voltage: 0.0,
  daq1Power: 0.0,
  daq1CurrentDraw: 0.0,
  thrust1: 0.0,
  thrust2: 0.0,
  totalThrust: 0.0,
  LOxTankBottomTC: 0.0,
  propTankBottomTC: 0.0,
  EngineTC1: 0.0,
  EngineTC2: 0.0,
  daq1_5v_aVoltage: 0.0,
  daq1_5v_aCurrent: 0.0,
  daq1_5vVoltage: 0.0,
  daq1_5vCurrent: 0.0,
  pressurantTemp: 0.0,

  // connection stats
  daq1Connected: false,
  daq1Kbps: 0,


  //---------------DAQ 2---------------

  engineTC3: 0.0,
  engineTC4: 0.0,
  engineTC5: 0.0,
  engineTC6: 0.0,

  //-------Actuator Controller 1-------

  // heaters currents
  propTankTopHeaterCurrent: 0.0,
  propTankMidHeaterCurrent: 0.0,
  // heater setvals
  propTankTopHeaterVal: 0.0,
  propTankMidHeaterVal: 0.0,
  // board stats
  ac1Voltage: 0.0,
  ac1Power: 0.0,
  ac1CurrentDraw: 0.0,
  // actuator currents
  pressurantVentRBVcurrent: 0.0,
  pressurantFlowRBVcurrent: 0.0,
  LOxVentRBVcurrent: 0.0,
  LOxTankVentRBVcurrent: 0.0,
  LOxFlowRBVcurrent: 0.0,
  // actuator channel states
  pressurantVentRBVchState: 0.0,
  pressurantFlowRBVchState: 0.0,
  LOxVentRBVchState: 0.0,
  LOxTankVentRBVchState: 0.0,
  LOxFlowRBVchState: 0.0,
  // actuator states
  pressurantVentRBVstate: 0.0,
  pressurantFlowRBVstate: 0.0,
  LOxVentRBVstate: 0.0,
  LOxTankVentRBVstate: 0.0,
  LOxFlowRBVstate: 0.0,
  // connection stats
  actCtrlr1Connected: false,
  actCtrlr1Kbps: 0,


  //-------Actuator Controller 2-------

  propTankBottomHeaterCurrent: 0.0,
  LOxTankTopHeaterCurrent: 0.0,

  propTankBottomHeaterVal: 0.0,
  LOxTankTopHeaterVal: 0.0,

  ac2Voltage: 0.0,
  ac2Power: 0.0,
  ac2CurrentDraw: 0.0,

  LOxRQD1current: 0.0,
  LOxRQD2current: 0.0,
  propaneVentRBVcurrent: 0.0,
  propaneFlowRBVcurrent: 0.0,
  propaneRQD1current: 0.0,
  propaneRQD2current: 0.0,

  LOxRQD1chState: 0.0,
  LOxRQD2chState: 0.0,
  propaneVentRBVchState: 0.0,
  propaneFlowRBVchState: 0.0,
  propaneRQD1chState: 0.0,
  propaneRQD2chState: 0.0,

  LOxRQD1state: 0.0,
  LOxRQD2state: 0.0,
  propaneVentRBVstate: 0.0,
  propaneFlowRBVstate: 0.0,
  propaneRQD1state: 0.0,
  propaneRQD2state: 0.0,

  actCtrlr2Connected: false,
  actCtrlr2Kbps: 0,

  //-------Actuator Controller 3-------

  LOxTankMidHeaterCurrent: 0.0,
  LOxTankBottomHeaterCurrent: 0.0,

  LOxTankMidHeaterVal: 0.0,
  LOxTankBottomHeaterVal: 0.0,

  ac3Voltage: 0.0,
  ac3Power: 0.0,
  ac3CurrentDraw: 0.0,

  LOxPrechillRBVcurrent: 0.0,
  purgePrechillVentRBVcurrent: 0.0,
  prechillFlowRBVcurrent: 0.0,
  propanePrechillRBVcurrent: 0.0,
  purgeFlowRBVcurrent: 0.0,

  LOxPrechillRBVchState: 0.0,
  purgePrechillVentRBVchState: 0.0,
  prechillFlowRBVchState: 0.0,
  propanePrechillRBVchState: 0.0,
  purgeFlowRBVchState: 0.0,

  LOxPrechillRBVstate: 0.0,
  purgePrechillVentRBVstate: 0.0,
  prechillFlowRBVstate: 0.0,
  propanePrechillRBVstate: 0.0,
  purgeFlowRBVstate: 0.0,

  actCtrlr3Connected: false,
  actCtrlr3Kbps: 0
};

module.exports = { model };
