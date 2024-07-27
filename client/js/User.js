let users = {}

class User {
	displayName = ""
	userId = "-1"
	avatarId = ""

	static setUser(userId, user) {
		users[userId] = user
	}

	static getUser(userId) {
		return users[userId]
	}
}

export { User }
