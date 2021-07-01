import { handleLogoutClick } from './middleware/user';
export const BASE_URL = import.meta.env['BASE_URL'];
export const HEADERS = [
  {
    name: "Home",
    path: "/",
	type: 'LOGIN',
  },
  {
    name: "Login",
    path: "/login",
	type: 'LOGOUT',
  },
  {
    name: "profile",
    path: "/profile",
	type: 'LOGIN',
  },
  {
	name: "attendance",
	path: "/attendance",
	type: "LOGIN",
  },
  {
	name: "logout",
	path: "/profile",
	type: "LOGIN",
	onClick: handleLogoutClick
  },
];

export const STATUS_LIST = [
  '退勤',
  '出勤',
  '休憩',
];
