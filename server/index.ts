import express from "express"
import fs from "fs"

fs.mkdirSync("content/avatar", { recursive: true })
fs.mkdirSync("content/media", { recursive: true })
fs.writeFileSync("content/db.json", `{"users": [], "posts": []}`)

require("dotenv").config()
;(BigInt.prototype as any).toJSON = function () {
	return this.toString()
}

import { GetFeedAlgorithm } from "./GetFeedAlgorithm.js"
import { AuthAPI } from "./AuthAPI.js"
import { UserProfile } from "./UserProfile.js"
import { UsersAPI } from "./UsersAPI.js"
import { PostsAPI } from "./PostsAPI.js"

const app = express()

const PORT = process.env.PORT || 3000

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*")
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
	res.setHeader("Cross-Origin-Opener-Policy", "same-origin")
	res.setHeader("Cross-Origin-Embedder-Policy", "require-corp")
	res.setHeader("Cross-Origin-Resource-Policy", "cross-origin")
	next()
})

app.use("/api/auth", AuthAPI)
app.use("/api", GetFeedAlgorithm)
app.use("/api/users", UsersAPI)
app.use("/api/posts", PostsAPI)
app.use("/", express.static("client"))
app.use("/media", express.static("content/media"))
app.use("/avatar", express.static("content/avatar"))
app.use("/", UserProfile)

app.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`)
})
