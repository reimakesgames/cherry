import express from "express"
import { User } from "./User.js"
import bodyParser from "body-parser"

const app = express()

app.use(bodyParser.json())

app.post("/followuser", (req, res) => {
	const { userId, following, create } = req.body

	let user = User.getUserFromId(userId)
	let userToFollow = User.getUserFromId(following)

	console.log(user?.displayName, userToFollow?.displayName)

	if (!user || !userToFollow) {
		return res.status(404).json({
			error: "User not found",
		})
	}

	if (create) {
		user.following.push(following)
		userToFollow.followers.push(userId)
	} else {
		user.following = user.following.filter((f) => f !== following)
		userToFollow.followers = userToFollow.followers.filter(
			(f) => f !== userId
		)
	}

	res.json({
		success: true,
	})
})

export { app as FollowUser }
