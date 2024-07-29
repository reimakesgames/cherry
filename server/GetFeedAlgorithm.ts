import express from "express"
import { getDb } from "./DB.js"

const app = express()

app.get("/feed", (req, res) => {
	let db = getDb()

	let fixedRetweets = db.posts.map((p: any) => {
		let post = { ...p }

		if (post.retweetOf) {
			let retweet = db.posts.find((p: any) => p.postId === post.retweetOf)

			if (retweet) {
				post.retweetOf = retweet
			}
		}

		return post
	})

	res.json(fixedRetweets)
})

export { app as GetFeedAlgorithm }
