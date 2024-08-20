import express from "express"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"

import { User } from "./User.js"
import { VerifyMiddleware } from "./VerifyMiddleware.js"
import { Post } from "./Post.js"
import { getDb, setDb } from "./DB.js"

function NotAGuest(res: any, userId: any) {
	if (userId === "guest") {
		res.status(401).json({
			error: "You must be logged in to do this",
		})
		return true
	}
}

const app = express()

app.use(VerifyMiddleware)

app.use(cookieParser())
app.use(bodyParser.json())

app.get("/@:username", (req, res) => {
	const username = req.params.username as string

	let user = User.getUserFromUsername(username)

	if (user === undefined) {
		return res.status(404).json({
			error: "User not found",
		})
	}

	res.status(200).json({
		success: true,
		user: user,
	})
})

app.get("/:id", (req, res) => {
	const id = req.params.id as string

	let user = User.getUserFromId(id)

	if (user === undefined) {
		return res.status(404).json({
			error: "User not found",
		})
	}

	res.status(200).json({
		success: true,
		user: user,
	})
})

app.get("/:id/posts", (req, res) => {
	const id = req.params.id as string

	let user = User.getUserFromId(id)

	if (user === undefined) {
		return res.status(404).json({
			error: "User not found",
		})
	}

	let db = getDb()

	let posts = user.posts
		.map((postId) => {
			return Post.getPostFromId(postId)
		})
		.map((p: any) => {
			let post = { ...p }

			if (post.retweetOf) {
				let retweet = db.posts.find(
					(p: any) => p.postId === post.retweetOf
				)

				if (retweet) {
					post.retweetOf = retweet
				}
			}

			return post
		})

	res.status(200).json(posts)
})

app.post("/:id/follow", (req, res) => {
	const userId = req.cookies.userId as string
	const toFollowId = req.params.id as string

	if (NotAGuest(res, userId)) return

	const user = User.getUserFromId(userId)
	const toFollow = User.getUserFromId(toFollowId)

	if (!user || !toFollow) {
		return res.status(404).json({
			error: "User not found",
		})
	}

	user.following.push(toFollowId)
	toFollow.followers.push(userId)

	let db = getDb()
	db.users[userId] = user
	db.users[toFollowId] = toFollow
	setDb(db)

	res.status(200).json({
		success: true,
	})
})

app.post("/:id/unfollow", (req, res) => {
	const userId = req.cookies.userId as string
	const toFollowId = req.params.id as string

	if (NotAGuest(res, userId)) return

	const user = User.getUserFromId(userId)
	const toFollow = User.getUserFromId(toFollowId)

	if (!user || !toFollow) {
		return res.status(404).json({
			error: "User not found",
		})
	}

	user.following = user.following.filter((f) => f !== toFollowId)
	toFollow.followers = toFollow.followers.filter((f) => f !== userId)

	res.status(200).json({
		success: true,
	})
})

export { app as UsersAPI }
