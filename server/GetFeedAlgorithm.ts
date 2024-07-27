import express from "express"
import { getDb } from "./DB.js"

const app = express()

app.get("/feed", (req, res) => {
	let db = getDb()

	res.json(db.posts)
})

export { app as GetFeedAlgorithm }
