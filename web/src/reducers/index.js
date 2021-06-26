import { combineReducers } from "redux";

import AttendanceReducer from "./attendanceReducer";
import UserReducer from "./userReducer";

const rootReducer = combineReducers({
  AttendanceReducer,
  UserReducer,
});

export default rootReducer;
