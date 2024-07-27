import express from "express"
import cookieParser from "cookie-parser"
import { readFileSync, writeFileSync } from "fs"
import { User } from "./User.js"

const app = express()

app.use(cookieParser())
app.post("/liketweet", (req, res) => {
	let { postId, like } = req.query
	let userId = req.cookies.userId
	let user = User.getUser(userId)

	if (!postId) {
		return res.status(400).json({
			error: "Post ID is required",
		})
	}

	if (typeof postId !== "string") {
		return res.status(400).json({
			error: "Post ID must be a string",
		})
	}

	let db = readFileSync("db.json", "utf-8")
	let parsed = JSON.parse(db)
	let posts = parsed.posts
	let post = posts.find((p: any) => p.postId.toString() === postId.toString())

	if (!post) {
		return res.status(404).json({
			error: "Post not found",
		})
	}

	let liked = post.likes.includes(userId)

	if (like) {
		if (!liked) {
			post.likes.push(userId)
			user.likes.push(post.id)
		}
	} else {
		if (liked) {
			post.likes = post.likes.filter((id: any) => id !== userId)
			user.likes = user.likes.filter((id: any) => id !== post.id)
		}
	}

	writeFileSync("db.json", JSON.stringify(parsed))

	res.json({
		success: true,
		post: post,
	})
})

export { app as LikeTweet }
