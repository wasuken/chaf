const initialState = {
  status: "",
  group_attendances: [],
  user_attendances: {},
};

export default function AttendanceReducer(state = initialState, action) {
  switch (action.type) {
  case 'RECEIVE_GROUP_ATTENDANCES':
    return {
      ...state,
      group_attendances: action.payload
    };
  case 'RECEIVE_USER_ATTENDANCES':
    return {
      ...state,
      user_attendances: action.payload
    };
  case 'FAIL_RECEIVE_GROUP_ATTENDANCES':
    return {
      ...state,
      group_attendances: action.payload
    };
  case 'FAIL_RECEIVE_USER_ATTENDANCES':
    return {
      ...state,
      user_attendances: action.payload
    };
  default:
    return state;
  }
}
