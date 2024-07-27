import express from "express"
import { getDb } from "./DB.js"

const app = express()

app.get("/poststats", (req, res) => {
	let { postId } = req.query

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

	let db = getDb()
	let post = db.posts.find(
		(p: any) => p.postId.toString() === postId.toString()
	)

	if (!post) {
		return res.status(404).json({
			error: "Post not found",
		})
	}

	res.json({
		success: true,
		stats: {
			comments: post.comments.length,
			likes: post.likes.length,
			retweets: post.retweets.length,
		},
	})
})

export { app as GetPostStats }
