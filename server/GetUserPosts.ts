import express from "express"
import { User } from "./User.js"
import { getDb } from "./DB.js"

const app = express()

app.get("/@:username/posts", (req, res) => {
	const username = req.params.username as string

	let user = User.getUserFromUsername(username)

	if (!user) {
		return res.status(404).json({
			error: "User not found",
		})
	}

	let posts = []
	let db = getDb()
	for (let postId of user.posts) {
		posts.push(db.posts.find((p) => p.postId === postId))
	}
	res.json(posts)
})

export { app as GetUserPosts }
