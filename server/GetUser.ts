import express from "express"
import { User } from "./User.js"

const app = express()

app.get("/users", (req, res) => {
	const id = req.query.id as string
	const username = req.query.username as string

	let user = User.getUserFromId(id) || User.getUserFromUsername(username)

	if (!user) {
		return res.status(404).json({
			error: "User not found",
		})
	}

	res.json(user)
})

export { app as GetUser }
