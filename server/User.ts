import { APIUser } from "discord-api-types/v10"
import download from "image-downloader"
import path from "path"
import { getDb, setDb } from "./DB.js"

const CONTENT = path.join(process.cwd(), "content")

async function downloadAvatar(url: string, dest: string) {
	await download.image({
		url,
		dest,
	})
}

class User {
	displayName: string = ""
	userId: string = "-1"
	avatarId: string = ""

	followers: string[] = []
	following: string[] = []
	posts: string[] = []
	likes: string[] = []

	static setUser(userId: string, user: User) {
		let db = getDb()
		db.users[userId] = user
		setDb(db)
	}

	static getUser(userId: string) {
		let db = getDb()
		return db.users[userId]
	}

	static async newUserFromAPIUser(apiUser: APIUser) {
		let user = new User()

		let avatarUrl = `https://cdn.discordapp.com/avatars/${apiUser.id}/${apiUser.avatar}.png`
		let avatarFilename = `${apiUser.id}.png`
		await downloadAvatar(
			avatarUrl,
			path.join(CONTENT, "avatar", avatarFilename)
		)

		user.displayName = apiUser.username
		user.userId = apiUser.id
		user.avatarId = avatarFilename

		user.followers = []
		user.following = []
		user.posts = []
		user.likes = []

		this.setUser(apiUser.id, user)
	}
}

export { User }
