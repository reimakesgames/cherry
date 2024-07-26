import Post from "./Post.js"
import { User } from "./User.js"

const API = "https://cherry.reicaffie.com"
const FEED_API = `${API}/api/feed`

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

NAVBAR_PROFILE.src = userAccount.profile
POSTBOX_PROFILE.src = userAccount.profile
POSTBOX_USER.textContent = userAccount.nickname
POSTBOX_HANDLE.textContent = "@" + userAccount.nickname

fetch(FEED_API)
	.then((response) => response.json())
	.then((posts) => {
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
			p.name = user.nickname
			p.handle = "@" + user.nickname
			p.profile = user.profile
			p.userId = user.userId
			p.liked = post.likes.includes(userId)
			p.postId = post.id
			p.caption = post.content
			p.image = post.image
			p.date = new Date(post.createdAt)
			p.likesCount = post.likesCount
			p.commentsCount = post.commentsCount
			p.retweetsCount = post.retweetsCount
			p.viewsCount = post.viewsCount
			FEED.appendChild(p.toHtml())
		})
	})
	.catch((error) => {
		console.error(error)
	})

function PostTweet() {
	let text = INPUT_BOX.value
	// verification
	if (text === "") {
		return
	}
	if (text.length > 280) {
		return
	}

	let json = JSON.stringify({ content: text })

	// fetch(`${API}/api/posttweet`, {
	// 	method: "POST",
	// 	headers: {
	// 		"Content-Type": "application/json",
	// 	},
	// 	body: json,
	// })
	// 	.then((response) => response.json())
	// 	.then((post) => {
	// 		INPUT_BOX.value = ""
	// 		let p = new Post()
	// 		p.name = User.nickname
	// 		p.handle = "@" + User.nickname
	// 		p.profile = User.profile
	// 		p.caption = post.content
	// 		p.image = post.image
	// 		p.date = new Date(post.createdAt)
	// 		p.likesCount = post.likesCount
	// 		p.commentsCount = post.commentsCount
	// 		p.retweetsCount = post.retweetsCount
	// 		p.viewsCount = post.viewsCount
	// 		FEED.prepend(p.toHtml())
	// 	})
	// 	.catch((error) => {
	// 		console.error(error)
	// 	})

	// xmlhttprequest
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
			p.name = user.nickname
			p.handle = "@" + user.nickname
			p.profile = user.profile
			p.userId = user.userId
			p.postId = post.id
			p.caption = post.content
			p.image = post.image
			p.date = new Date(post.createdAt)
			p.likesCount = post.likesCount
			p.commentsCount = post.commentsCount
			p.retweetsCount = post.retweetsCount
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
