let users = {}

class User {
	displayName = ""
	userId = "-1"
	avatarId = ""

	/**
	 * @param {string} userId
	 * @param {User} user
	 */
	static setUser(userId, user) {
		users[userId] = user
	}

	/**
	 *
	 * @param {string} userId
	 * @returns {User | undefined}
	 */
	static getUserById(userId) {
		return users[userId]
	}

	/**
	 * @param {string} handle
	 * @returns {User | undefined}
	 */
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
