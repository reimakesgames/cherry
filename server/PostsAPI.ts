import express from "express"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"

import { getDb, setDb } from "./DB.js"
import { Post } from "./Post.js"
import { VerifyMiddleware } from "./VerifyMiddleware.js"
import { User } from "./User.js"

const POST_LENGTH = 280

const app = express()

app.use(VerifyMiddleware)

app.use(cookieParser())
app.use(bodyParser.json())

function verifyPID(res: any, pid: any) {
	if (!pid || typeof pid !== "string") {
		return res.status(400).json({
			error: "Post ID is required and must be a string",
		})
	}
}

function verifyContent(res: any, content: any) {
	if (
		!content ||
		typeof content !== "string" ||
		content.length > POST_LENGTH
	) {
		return res.status(400).json({
			error: `Content is required, must be a string, and must be less than ${POST_LENGTH} characters`,
		})
	}
}

app.get("/:postId", (req, res) => {
	let { postId } = req.params

	verifyPID(res, postId)

	let db = getDb()
	let post = db.posts.find(
		(p: any) => p.postId.toString() === postId.toString()
	)

	if (!post) {
		return res.status(404).json({
			error: "Post not found",
		})
	}

	res.status(200).json({
		success: true,
		post: Post.toSimple(post),
	})
})

app.get("/:postId/stats", (req, res) => {
	let { postId } = req.params

	verifyPID(res, postId)

	let db = getDb()
	let post = db.posts.find(
		(p: any) => p.postId.toString() === postId.toString()
	)

	if (!post) {
		return res.status(404).json({
			error: "Post not found",
		})
	}

	res.status(200).json({
		success: true,
		stats: {
			comments: post.comments.length,
			likes: post.likes.length,
			retweets: post.retweets.length,
		},
	})
})

app.post("/:postId/like", (req, res) => {
	let { postId } = req.params
	let intent = req.query.intent || false
	let userId = req.cookies.userId

	verifyPID(res, postId)

	let db = getDb()
	let post = db.posts.find(
		(p: any) => p.postId.toString() === postId.toString()
	)

	if (!post) {
		return res.status(404).json({
			error: "Post not found",
		})
	}

	let user = User.getUserFromId(userId) as any

	if (intent) {
		post.likes.push(userId)
		user.likes.push(post.postId)
	} else {
		post.likes = post.likes.filter((id: any) => id !== userId)
		user.likes = user.likes.filter((id: any) => id !== post.postId)
	}

	setDb(db)

	res.status(200).json({
		success: true,
	})
})

app.post("/create", (req, res) => {
	let { content } = req.body
	let userId = req.cookies.userId

	verifyContent(res, content)

	let user = User.getUserFromId(userId) as any

	let db = getDb()
	let id = BigInt(Date.now())
	let post = new Post()
	post.postId = id.toString()
	post.userId = userId
	post.content = content
	db.posts.push(post)

	user.posts.push(id.toString())
	setDb(db)

	res.status(200).json({
		success: true,
		post: post,
	})
})

export { app as PostsAPI }