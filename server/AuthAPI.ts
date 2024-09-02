import express from "express"
import { RESTPostOAuth2AccessTokenResult, APIUser } from "discord-api-types/v10"
import { User } from "./User.js"
import path from "path"
import download from "image-downloader"

const CONTENT = path.join(process.cwd(), "content")

async function newUserFromAPIUser(apiUser: APIUser) {
	let user = new User()

	let avatarUrl = `https://cdn.discordapp.com/avatars/${apiUser.id}/${apiUser.avatar}.png`
	let avatarFilename = `${apiUser.id}.png`
	await downloadAvatar(
		avatarUrl,
		path.join(CONTENT, "avatar", avatarFilename)
	)

	user.displayName = apiUser.username
	user.userId = apiUser.id
	user.avatarId = avatarFilename

	User.setUser(apiUser.id, user)
}

async function downloadAvatar(url: string, dest: string) {
	await download.image({
		url,
		dest,
	})
}

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
			error: "Invalid code, must be a string",
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

	await newUserFromAPIUser(apiUser)

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: true,
	})
	res.cookie("userId", apiUser.id, {
		httpOnly: true,
		secure: true,
	})

	res.redirect(`${URL}/home?userId=${apiUser.id}`)
})

app.get("/skip", (req, res) => {
	// generate random token

	let accessToken = "guest"

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: true,
	})

	res.cookie("userId", "guest", {
		httpOnly: true,
		secure: true,
	})

	res.redirect(`${URL}/home?userId=guest`)
})

export { app as AuthAPI }
