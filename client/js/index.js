import Post from "./Post.js"
import { User } from "./User.js"

// const API = "https://cherry.reicaffie.com"
const API = "http://localhost:3000"

const FEED = document.getElementById("inner-feed")
const INPUT_BOX = document.getElementById("input-box")
const POST_BUTTON = document.getElementById("post-button")
const NAVBAR_PROFILE = document.getElementById("navbar-profile")
const POSTBOX_PROFILE = document.getElementById("postbox-profile")
const POSTBOX_USER = document.getElementById("postbox-user")
const POSTBOX_HANDLE = document.getElementById("postbox-handle")

let urlParams = new URLSearchParams(window.location.search)
let userId = urlParams.get("userId") || localStorage.getItem("userId")
if (userId !== null) {
	localStorage.setItem("userId", userId)
	window.history.replaceState({}, document.title, "/")
}
let userAccount = await (await fetch(`${API}/api/users?id=${userId}`)).json()
User.setUser(userId, userAccount)

NAVBAR_PROFILE.src = `${API}/avatar/${userAccount.avatarId}`
POSTBOX_PROFILE.src = `${API}/avatar/${userAccount.avatarId}`
POSTBOX_USER.textContent = userAccount.displayName
POSTBOX_HANDLE.textContent = "@" + userAccount.displayName

fetch(`${API}/api/feed`)
	.then((response) => response.json())
	.then((posts) => {
		posts.sort(
			(a, b) => Number.parseInt(a.postId) - Number.parseInt(b.postId)
		)
		posts.reverse()
		posts.forEach(async (post) => {
			let user = User.getUser(post.userId)

			if (user === undefined) {
				user = await (
					await fetch(`${API}/api/users?id=${post.userId}`)
				).json()
			}
			User.setUser(post.userId, user)

			let p = new Post()
			p.user = user
			p.liked = post.likes.includes(userId)
			p.postId = post.postId
			p.caption = post.content
			p.images = post.images
			p.postedAt = new Date(post.postedAt)
			p.likes = post.likes
			p.comments = post.comments
			p.retweets = post.retweets
			p.viewsCount = post.viewsCount
			FEED.appendChild(p.toHtml())
		})
	})
	.catch((error) => {
		console.error(error)
	})

function PostTweet() {
	let text = INPUT_BOX.value

	if (text === "") {
		return
	}
	if (text.length > 280) {
		return
	}

	let json = JSON.stringify({ content: text })

	let xhr = new XMLHttpRequest()
	xhr.open("POST", `${API}/api/posttweet`, true)
	xhr.setRequestHeader("Content-Type", "application/json")
	xhr.onreadystatechange = async () => {
		if (xhr.readyState === 4 && xhr.status === 200) {
			let res = JSON.parse(xhr.responseText)
			let post = res.post
			INPUT_BOX.value = ""

			let user = User.getUser(post.userId)

			if (user === undefined) {
				user = await (
					await fetch(`${API}/api/users?id=${post.userId}`)
				).json()
			}

			console.log(user)

			let p = new Post()
			p.user = user
			p.postId = post.postId
			p.caption = post.content
			p.images = post.images
			p.postedAt = new Date(post.postedAt)
			p.likes = post.likes
			p.comments = post.comments
			p.retweets = post.retweets
			p.viewsCount = post.viewsCount
			FEED.prepend(p.toHtml())
		}
	}
	xhr.send(json)
}

POST_BUTTON.addEventListener("click", PostTweet)
INPUT_BOX.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		PostTweet()
	}
})
