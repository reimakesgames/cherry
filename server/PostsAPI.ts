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

function NotAGuest(res: any, userId: any) {
	if (userId === "guest") {
		res.status(401).json({
			error: "You must be logged in to do this",
		})
		return true
	}
}

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
	let intent = req.query.intent === "true"
	let userId = req.cookies.userId

	if (NotAGuest(res, userId)) return
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

	let liked = post.likes.includes(userId)

	if (intent) {
		if (liked) {
			return res.status(200).json({
				success: true,
				liked: true,
			})
		} else {
			post.likes.push(userId)
			user.likes.push(post.postId)
		}
	} else {
		if (!liked) {
			return res.status(200).json({
				success: true,
				liked: false,
			})
		} else {
			post.likes = post.likes.filter((id: any) => id !== userId)
			user.likes = user.likes.filter((id: any) => id !== post.postId)
		}
	}

	db.users[userId] = user
	setDb(db)

	res.status(200).json({
		success: true,
	})
})

app.post("/:postId/retweet", (req, res) => {
	let { postId } = req.params
	let intent = req.query.intent === "true"
	let userId = req.cookies.userId

	if (NotAGuest(res, userId)) return
	verifyPID(res, postId)

	let db = getDb()
	let retweetedPost = db.posts.find(
		(p: any) => p.postId.toString() === postId.toString()
	)

	if (!retweetedPost) {
		return res.status(404).json({
			error: "Post not found",
		})
	}

	let user = User.getUserFromId(userId) as any

	let retweeted = retweetedPost.retweets.includes(userId)

	if (intent) {
		if (retweeted) {
			return res.status(200).json({
				success: true,
				retweeted: true,
			})
		} else {
			retweetedPost.retweets.push(userId)

			let id = BigInt(Date.now())
			let post = new Post()
			post.postId = id.toString()
			post.userId = userId
			post.retweetOf = postId
			// @ts-ignore
			post.retweets = null // @ts-ignore
			post.likes = null // @ts-ignore
			post.comments = null // @ts-ignore
			post.viewsCount = null

			db.posts.push(post)

			user.posts.push(id.toString())
			db.users[userId] = user
			setDb(db)
		}
	} else {
		if (!retweeted) {
			return res.status(200).json({
				success: true,
				retweeted: false,
			})
		} else {
			retweetedPost.retweets = retweetedPost.retweets.filter(
				(id: any) => id !== userId
			)

			let post = db.posts.find(
				(p: any) => p.retweetOf === postId && p.userId === userId
			)

			if (post) {
				db.posts = db.posts.filter((p: any) => p.postId !== post.postId)
				user.posts = user.posts.filter((id: any) => id !== post.postId)
			}

			db.users[userId] = user
			setDb(db)
		}
	}

	res.status(200).json({
		success: true,
	})
})

app.post("/:postId/view", (req, res) => {
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

	post.viewsCount++

	setDb(db)

	res.status(200).json({
		success: true,
	})
})

app.post("/create", (req, res) => {
	let { content } = req.body
	let userId = req.cookies.userId

	if (NotAGuest(res, userId)) return
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
	db.users[userId] = user
	setDb(db)

	res.status(200).json({
		success: true,
		post: post,
	})
})

export { app as PostsAPI }
