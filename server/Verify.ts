import express from "express"
import cookieParser from "cookie-parser"

const app = express()

const LOCKED_ROUTES = ["/home"]

app.use(cookieParser())
app.use((req, res, next) => {
	if (LOCKED_ROUTES.includes(req.path)) {
		let accessToken = req.cookies.accessToken

		if (!accessToken) {
			return res.redirect(
				"https://discord.com/oauth2/authorize?client_id=1266028997381193738&response_type=code&redirect_uri=https%3A%2F%2Fcherry.reicaffie.com%2Fapi%2Fauth%2Fredirect&scope=identify"
			)
		}
	}

	next()
})

export { app as Verify }
