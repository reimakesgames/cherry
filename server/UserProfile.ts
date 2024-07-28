import express from "express"
import { User } from "./User.js"

const app = express()

app.get("/@:username", (req, res) => {
	const username = req.params.username as string

	let user = User.getUserFromUsername(username)

	if (!user) {
		return res.status(404).json({
			error: "User not found",
		})
	}

	res.sendFile("client/user/index.html", { root: process.cwd() })
})

export { app as UserProfile }
