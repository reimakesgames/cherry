import express from "express"
import fs from "fs"

require("dotenv").config()
;(BigInt.prototype as any).toJSON = function () {
	return this.toString()
}

fs.mkdirSync("content/media", { recursive: true })
fs.mkdirSync("content/avatar", { recursive: true })
fs.writeFileSync(
	"db.json",
	`{"users": {"906204724200624138": {"displayName": "reimakesgames","userId": "906204724200624138","avatarId": "906204724200624138.png","followers": [],"following": [],"posts": [],"likes": []}},"posts": [{"postId": "0","userId": "906204724200624138","content": "Hello, world!","images": ["sticker.gif"],"postedAt": "2024-07-26T14:01:19.948Z","viewsCount": 0,"comments": [],"likes": [],"retweets": []},{"postId": "1","userId": "906204724200624138","content": "Look at this thing","images": ["wow.png"],"postedAt": "2024-07-26T14:01:19.948Z","viewsCount": 0,"comments": [],"likes": [],"retweets": []},{"postId": "2","userId": "906204724200624138","content": "hello guys","postedAt": "2024-07-27T13:28:14.379Z","viewsCount": 0,"comments": [],"likes": ["906204724200624138"],"retweets": []},{"postId": "3","userId": "906204724200624138","content": "new post","postedAt": "2024-07-27T13:32:33.706Z","viewsCount": 0,"comments": [],"likes": ["906204724200624138"],"retweets": []}]}`
)

import { GetFeedAlgorithm } from "./GetFeedAlgorithm.js"
import { Auth } from "./Auth.js"
import { GetUser } from "./GetUser.js"
import { PostTweet } from "./PostTweet.js"
import { Verify } from "./Verify.js"
import { LikeTweet } from "./LikeTweet.js"
import { GetPostStats } from "./GetPostStats.js"

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

app.use("/api/auth", Auth)
app.use("/", Verify)
app.use("/api", GetFeedAlgorithm)
app.use("/api", GetUser)
app.use("/api", GetPostStats)
app.use("/api", PostTweet)
app.use("/api", LikeTweet)
app.use("/", express.static("client"))
app.use("/media", express.static("content/media"))
app.use("/avatar", express.static("content/avatar"))

app.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`)
})
