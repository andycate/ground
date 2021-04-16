const model = {

  //----------Flight Computer----------

  // lox pressures
  loxTankPT: 0.0,
  loxDomePT: 0.0,
  loxInjectorPT: 0.0,
  loxGemsPT: 0.0,
  // lox fitting tree and gems temperature
  loxTreeTC: 0.0,
  loxTreeHeater: 0.0,
  loxGemsTC: 0.0,
  loxGemsHeater: 0.0,
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
  propGemsPT: 0.0,
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

  // valve states
  lox2Way: false,
  lox5Way: false,
  prop5Way: false,
  loxGems: false,
  propGems: false,
  HPS: false,
  HPSEnable: false,



  //---------------DAQ 1---------------

  //---------------DAQ 2---------------

  //-------Actuator Controller 1-------

  propTankTopHeaterCurrent: 0.0,
  propTankMidHeaterCurrent: 0.0,
  propTankTopHeaterVal: 0.0,
  propTankMidHeaterVal: 0.0,
  ac1Voltage: 0.0,
  ac1Power: 0.0,
  ac1CurrentDraw: 0.0,
  pressurantVentRBVcurrent: 0.0,
  pressurantFlowRBVcurrent: 0.0,
  LOxVentRBVcurrent: 0.0,
  LOxTankVentRBVcurrent: 0.0,
  LOxFlowRBVcurrent: 0.0,
  pressurantVentRBVchState: 0.0,
  pressurantFlowRBVchState: 0.0,
  LOxVentRBVchState: 0.0,
  LOxTankVentRBVchState: 0.0,
  LOxFlowRBVchState: 0.0,
  pressurantVentRBVstate: false,
  pressurantFlowRBVstate: false,
  LOxVentRBVstate: false,
  LOxTankVentRBVstate: false,
  LOxFlowRBVstate: false,

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
  LOxRQD1state: false,
  LOxRQD2state: false,
  propaneVentRBVstate: false,
  propaneFlowRBVstate: false,
  propaneRQD1state: false,
  propaneRQD2state: false,

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
  LOxPrechillRBVstate: false,
  purgePrechillVentRBVstate: false,
  prechillFlowRBVstate: false,
  propanePrechillRBVstate: false,
  purgeFlowRBVstate: false
};

module.exports = { model };
