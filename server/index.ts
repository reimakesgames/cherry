import express from "express"
import dotenv from "dotenv"
dotenv.config()

import { GetFeedAlgorithm } from "./GetFeedAlgorithm.js"
import { Auth } from "./Auth.js"
import { GetUser } from "./GetUser.js"
import { PostTweet } from "./PostTweet.js"
import { Verify } from "./Verify.js"
import { LikeTweet } from "./LikeTweet.js"
;(BigInt.prototype as any).toJSON = function () {
	return this.toString()
}

const app = express()
const PORT = process.env.SERVER_PORT || 3000

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*")
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
	res.setHeader("Cross-Origin-Opener-Policy", "same-origin")
	res.setHeader("Cross-Origin-Embedder-Policy", "require-corp")
	res.setHeader("Cross-Origin-Resource-Policy", "cross-origin")
	next()
})

app.use("/api/auth", Auth)
app.use("/", Verify)
app.use("/api", GetFeedAlgorithm)
app.use("/api", GetUser)
app.use("/api", PostTweet)
app.use("/api", LikeTweet)
app.use("/media", express.static("media"))
app.use("/avatar", express.static("avatar"))
app.use("/", express.static("client"))

app.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`)
})
