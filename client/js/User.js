let users = {}

class User {
	displayName = ""
	userId = "-1"
	avatarId = ""

	static setUser(userId, user) {
		users[userId] = user
	}

	static getUserById(userId) {
		return users[userId]
	}

	static getUserByHandle(handle) {
		for (let userId in users) {
			if (users[userId].displayName === handle) {
				return users[userId]
			}
		}
		return undefined
	}
}

export { User }
