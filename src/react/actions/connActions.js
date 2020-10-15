import moment from 'moment';
import {
  SET_CONNECTED,
  SET_DISCONNECTED,
  SET_PORT,
  UPDATE_SECONDS_SINCE_CHANGE
} from './types';
import comms from '../comms';

const sensorListeners = [];

export const getAvailablePorts = async () => {
  return await comms.listPorts();
}

export const selectPort = (port, baud) => async dispatch => {
  const success = await comms.selectPort(port.path, baud);
  if(success) {
    dispatch({
      type: SET_PORT,
      payload: {
        port: port
      }
    });
  }
  return success;
}

export const startConnListen = () => dispatch => {
  comms.connListen(isConnected => {
    dispatch({
      type: isConnected ? SET_CONNECTED : SET_DISCONNECTED
    });
  });
  window.setInterval(() => {
    dispatch({
      type: UPDATE_SECONDS_SINCE_CHANGE
    });
  }, 1000);
}

export const startSensorListen = () => dispatch => {
  comms.sensorListen(payload => {
    sensorListeners.filter(v => v.id === payload.id).forEach(v => {
      v.handler(payload.data, moment(payload.timestamp));
    });
  });
}

export const addSensorListener = (id, handler) => {
  sensorListeners.push({
    id,
    handler
  });
}

export const removeSensorListener = (id, handler) => {
  sensorListeners.splice(sensorListeners.findIndex(v => v.id === id && v.handler === handler), 1);
}
