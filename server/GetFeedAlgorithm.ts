import express from "express"
import { Post } from "./Post.js"
import { readFileSync } from "fs"

const app = express()

app.get("/feed", (req, res) => {
	let db = JSON.parse(readFileSync("db.json", "utf-8"))

	res.json(db.posts)
})

export { app as GetFeedAlgorithm }
