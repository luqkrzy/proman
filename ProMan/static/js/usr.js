export function getCurrentUser() {
	let current = ''
	if (user.includes('AnonymousUser')) {
		current = 'AnonymousUser'
	} else {
		current = user
	}
	return current

}
