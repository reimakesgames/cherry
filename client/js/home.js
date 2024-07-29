import Post from "./Post.js"
import { User } from "./User.js"

const API = window.location.origin

const FEED = document.getElementById("inner-feed")
const INPUT_BOX = document.getElementById("input-box")
const POST_BUTTON = document.getElementById("post-button")
const NAVBAR_PROFILE = document.getElementById("navbar-profile")
const POSTBOX_PROFILE = document.getElementById("postbox-profile")
const POSTBOX_USER = document.getElementById("postbox-user")
const POSTBOX_HANDLE = document.getElementById("postbox-handle")

let urlParams = new URLSearchParams(window.location.search)
let myUserId = urlParams.get("userId") || localStorage.getItem("userId")
if (myUserId !== null) {
	localStorage.setItem("userId", myUserId)
	window.history.replaceState({}, document.title, "/home/")
}
let myUser

fetch(`${API}/api/users/${myUserId}`)
	.then((response) => response.json())
	.then((data) => {
		myUser = data.user
		User.setUser(myUserId, myUser)

		NAVBAR_PROFILE.src = `${API}/avatar/${myUser.avatarId}`
		POSTBOX_PROFILE.src = `${API}/avatar/${myUser.avatarId}`
		POSTBOX_USER.textContent = myUser.displayName
		POSTBOX_HANDLE.textContent = "@" + myUser.displayName
	})
	.catch((error) => {
		console.error(error)
	})

fetch(`${API}/api/feed`)
	.then((response) => response.json())
	.then((posts) => {
		posts.sort((a, b) => b.postId - a.postId)
		posts.forEach(async (post) => {
			let user = User.getUserById(post.userId)

			let postObj = Post.newFromApiObj(post)
			postObj.liked = post.likes.includes(myUserId)

			FEED.appendChild(postObj.toHtml())

			if (user === undefined) {
				user = await (
					await fetch(`${API}/api/users/${post.userId}`)
				).json()
				User.setUser(post.userId, user)
			}
			Post.updateUser(postHtml, user)
			console.log(`Hydrated post ${post.postId}`)
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
	xhr.open("POST", `${API}/api/posts/create`, true)
	xhr.setRequestHeader("Content-Type", "application/json")
	xhr.onreadystatechange = () => {
		if (xhr.readyState === 4 && xhr.status === 200) {
			let res = JSON.parse(xhr.responseText)
			let post = res.post
			INPUT_BOX.value = ""

			FEED.prepend(Post.newFromApiObj(post).toHtml())
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
