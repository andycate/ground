import {
  SET_CONNECTED,
  SET_DISCONNECTED,
  SET_PORT,
  UPDATE_SECONDS_SINCE_CHANGE
} from '../actions/types';
const initialState = {
  connected: false,
  secondsSinceChange: 0,
  port: null
};
export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CONNECTED:
      return {
        ...state,
        connected: true,
        secondsSinceChange: 0
      };
    case SET_DISCONNECTED:
      return {
        ...state,
        connected: false,
        secondsSinceChange: 0
      };
    case SET_PORT:
      return {
        ...state,
        port: action.payload.port
      };
    case UPDATE_SECONDS_SINCE_CHANGE:
      return {
        ...state,
        secondsSinceChange: state.secondsSinceChange + 1
      };
    default:
      return state;
  }
}
