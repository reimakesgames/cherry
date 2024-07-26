import { APIUser } from "discord-api-types/v10"
import { readFileSync, writeFileSync } from "fs"
import path from "path"

class User {
	nickname: string = ""
	userId: bigint = -1n
	profile: string = ""
	followers: number[] = []
	following: number[] = []
	posts: number[] = []
	likes: number[] = []

	static setUser(userId: bigint, user: User) {
		let db = JSON.parse(
			readFileSync(path.join(process.cwd(), "db.json"), "utf-8")
		)
		db.users[userId.toString()] = user
		writeFileSync(path.join(process.cwd(), "db.json"), JSON.stringify(db))
	}

	static getUser(userId: bigint) {
		let db = JSON.parse(
			readFileSync(path.join(process.cwd(), "db.json"), "utf-8")
		)
		return db.users[userId.toString()]
	}

	static newUserFromAPIUser(apiUser: APIUser) {
		let user = new User()
		user.nickname = apiUser.username
		user.userId = BigInt(apiUser.id)
		user.profile = process.env.SERVER_URL + "/avatar/" + apiUser.id + ".png"
		user.followers = []
		user.following = []
		user.posts = []
		user.likes = []
		this.setUser(BigInt(apiUser.id), user)
	}
}

export { User }
