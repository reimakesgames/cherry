import { APIUser } from "discord-api-types/v10"
import { readFileSync, writeFileSync } from "fs"
import download from "image-downloader"
import path from "path"

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

	followers: number[] = []
	following: number[] = []
	posts: number[] = []
	likes: number[] = []

	static setUser(userId: string, user: User) {
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
