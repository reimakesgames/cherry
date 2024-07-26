import express from "express"
import cookieParser from "cookie-parser"

const app = express()

app.use(cookieParser())
app.use((req, res, next) => {
	// check if there's an access token
	let accessToken = req.cookies.accessToken

	if (!accessToken) {
		return res.redirect(
			"https://discord.com/oauth2/authorize?client_id=1266028997381193738&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fredirect&scope=identify"
		)
	}

	next()
})

export { app as Verify }
