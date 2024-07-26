let users = {}

class User {
	nickname = ""
	userId = -1n
	profile = ""

	static setUser(userId, user) {
		users[userId] = user
	}

	static getUser(userId) {
		return users[userId]
	}
}

export { User }
