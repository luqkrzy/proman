import {easyHandler} from "./data_handler.js";

export function getCurrentUser() {
	let current = ''
	if (user.includes('AnonymousUser')) {
		current = 'AnonymousUser'
	} else {
		current = user
	}
	return current

}


export function getUser() {
	return easyHandler._returnData('/api/current-user/')

}
