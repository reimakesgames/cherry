import express from "express"
import { Post } from "./Post.js"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import { User } from "./User.js"
import { getDb, setDb } from "./DB.js"

const app = express()

app.use(bodyParser.json())
app.use(cookieParser())
app.post("/posttweet", (req, res) => {
	let { content } = req.body
	let userId = req.cookies.userId

	if (!content) {
		return res.status(400).json({
			error: "Content is required",
		})
	}

	if (typeof content !== "string") {
		return res.status(400).json({
			error: "Content must be a string",
		})
	}

	if (content.length > 280) {
		return res.status(400).json({
			error: "Content is too long",
		})
	}

	let db = getDb()
	let id = db.posts.length
	let post = new Post()
	post.postId = id.toString()
	post.userId = userId
	post.content = content
	db.posts.push(post)
	let user = User.getUserFromId(userId)
	user?.posts.push(id.toString())
	console.table(user?.posts)
	setDb(db)

	res.json({
		success: true,
		post: post,
	})
})

export { app as PostTweet }
