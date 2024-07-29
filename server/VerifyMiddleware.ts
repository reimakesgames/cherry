import express from "express"
import cookieParser from "cookie-parser"

const app = express()

const URL = process.env.URL as string

app.use(cookieParser())
app.use((req, res, next) => {
	let accessToken = req.cookies.accessToken
	let userId = req.cookies.userId

	if (!accessToken || !userId) {
		return res.status(401).redirect(`${URL}/401.html`)
	}

	next()
})

export { app as VerifyMiddleware }
