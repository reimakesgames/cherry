import express from "express"
import { RESTPostOAuth2AccessTokenResult, APIUser } from "discord-api-types/v10"
import download from "image-downloader"
import { User } from "./User.js"

const app = express()

async function getAccessToken(code: string) {
	const params = new URLSearchParams()
	params.set("grant_type", "authorization_code")
	params.set("code", code)
	params.set("redirect_uri", `https://cherry.reicaffie.com/api/auth/redirect`)

	const authorization = `Basic ${btoa(
		`${process.env.DISCORD_CLIENT_ID}:${process.env.DISCORD_CLIENT_SECRET}`
	)}`

	const response = await fetch("https://discord.com/api/v10/oauth2/token", {
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
	const response = await fetch("https://discord.com/api/v10/users/@me", {
		headers: {
			authorization: `Bearer ${access_token}`,
		},
	})

	return (await response.json()) as APIUser
}

async function getUserData(access_token: string, userId: string) {
	const response = await fetch(
		`https://discord.com/api/v10/users/${userId}`,
		{
			headers: {
				authorization: `Bearer ${access_token}`,
			},
		}
	)

	return (await response.json()) as APIUser
}

async function downloadAvatar(url: string, dest: string) {
	const options = {
		url,
		dest,
	}

	await download.image(options)
}

app.get("/redirect", async (req, res) => {
	let { code } = req.query

	if (typeof code !== "string") {
		return res.status(400).json({
			error: "Invalid code",
		})
	}

	let accessToken = await getAccessToken(code)
	let apiUser = await getMyData(accessToken.access_token)
	console.log(`User ${apiUser.username}#${apiUser.discriminator} logged in`)

	User.newUserFromAPIUser(apiUser)

	let avatarUrl = `https://cdn.discordapp.com/avatars/${apiUser.id}/${apiUser.avatar}.png`
	await downloadAvatar(avatarUrl, process.cwd() + `/avatar/${apiUser.id}.png`)

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: true,
	})
	res.cookie("userId", apiUser.id, {
		httpOnly: true,
		secure: true,
	})

	res.redirect((process.env.SERVER_URL as string) + "?userId=" + apiUser.id)
})

export { app as Auth }
