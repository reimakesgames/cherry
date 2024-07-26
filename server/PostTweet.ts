import express from "express"
import { readFile, readFileSync, write, writeFileSync } from "fs"
import { Post } from "./Post.js"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import { User } from "./User.js"

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

	let db = readFileSync("db.json", "utf-8")
	let parsed = JSON.parse(db)
	let posts = parsed.posts
	let id = posts.length
	let post = new Post()
	post.id = id
	post.userId = userId
	post.content = content
	posts.push(post)
	parsed.posts = posts
	User.getUser(BigInt(userId)).posts.push(id)
	writeFileSync("db.json", JSON.stringify(parsed))

	res.json({
		success: true,
		post: post,
	})
})

export { app as PostTweet }
