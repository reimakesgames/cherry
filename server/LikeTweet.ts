import express from "express"
import cookieParser from "cookie-parser"
import { User } from "./User.js"
import { getDb, setDb } from "./DB.js"

const app = express()

app.use(cookieParser())
app.post("/liketweet", (req, res) => {
	let { postId, like } = req.query

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

	let userId = req.cookies.userId
	let user = User.getUser(userId)

	if (!user) {
		return res.status(403).json({
			error: "User not found",
		})
	}

	let db = getDb()
	let post = db.posts.find(
		(p: any) => p.postId.toString() === postId.toString()
	)

	if (!post) {
		return res.status(404).json({
			error: "Post not found",
		})
	}

	let liked = post.likes.includes(userId)

	if (like) {
		if (!liked) {
			post.likes.push(userId)
			user.likes.push(post.postId)
		}
	} else {
		if (liked) {
			post.likes = post.likes.filter((id: any) => id !== userId)
			user.likes = user.likes.filter((id: any) => id !== post.postId)
		}
	}

	setDb(db)

	res.json({
		success: true,
		post: post,
	})
})

export { app as LikeTweet }
