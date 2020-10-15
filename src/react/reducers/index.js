import { combineReducers } from "redux";
import connReducer from "./connReducer";
export default combineReducers({
  conn: connReducer,
});
