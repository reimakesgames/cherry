import express from "express"
import { RESTPostOAuth2AccessTokenResult, APIUser } from "discord-api-types/v10"
import { User } from "./User.js"

const app = express()

const URL = process.env.URL as string
const DISCORD_URL = "https://discord.com/api/v10"

async function getAccessToken(code: string) {
	const params = new URLSearchParams()
	params.set("grant_type", "authorization_code")
	params.set("code", code)
	params.set("redirect_uri", `${URL}/api/auth/redirect`)

	const authorization = `Basic ${btoa(
		`${process.env.DISCORD_CLIENT_ID}:${process.env.DISCORD_CLIENT_SECRET}`
	)}`

	const response = await fetch(`${DISCORD_URL}/oauth2/token`, {
		method: "POST",
		body: params,
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			authorization: authorization,
		},
	})

	return (await response.json()) as RESTPostOAuth2AccessTokenResult
}

async function getMyData(access_token: string) {
	const response = await fetch(`${DISCORD_URL}/users/@me`, {
		headers: {
			authorization: `Bearer ${access_token}`,
		},
	})

	return (await response.json()) as APIUser
}

async function getUserData(access_token: string, userId: string) {
	const response = await fetch(`${DISCORD_URL}/users/${userId}`, {
		headers: {
			authorization: `Bearer ${access_token}`,
		},
	})

	return (await response.json()) as APIUser
}

app.get("/redirect", async (req, res) => {
	let { code } = req.query

	if (typeof code !== "string") {
		return res.status(400).json({
			error: "Invalid code",
		})
	}

	let accessToken = await getAccessToken(code)

	if (!accessToken.access_token) {
		return res.status(400).json({
			error: "Invalid code",
		})
	}

	let apiUser = await getMyData(accessToken.access_token)

	console.log(`User ${apiUser.username}#${apiUser.discriminator} logged in`)

	User.newUserFromAPIUser(apiUser)

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: true,
	})
	res.cookie("userId", apiUser.id, {
		httpOnly: true,
		secure: true,
	})

	res.redirect(URL + "?userId=" + apiUser.id)
})

export { app as Auth }
