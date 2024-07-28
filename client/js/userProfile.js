import Post from "./Post.js"
import { User } from "./User.js"

const handle = window.location.href.split("/").pop().substring(1)

document.title = `Cherry - @${handle}`
let myUserId = localStorage.getItem("userId")

const API = window.location.origin

const BACK_BUTTON = document.getElementById("back-button")

const DISPLAY_NAME_QUICK_VIEW = document.getElementById(
	"display-name-quick-view"
)
const POSTS_QUICK_VIEW = document.getElementById("posts-quick-view")

const FOLLOW_BUTTON = document.getElementById("follow-button")
const PROFILE = document.getElementById("profile")
const DISPLAY_NAME = document.getElementById("display-name")
const HANDLE = document.getElementById("handle")

const FOLLOWERS = document.getElementById("followers-stat")
const FOLLOWING = document.getElementById("following-stat")

const FEED = document.getElementById("inner-feed")

function BuildPost(post) {
	let p = new Post()
	p.user = User.getUserById(post.userId)
	p.liked = post.likes.includes(myUserId)
	p.postId = post.postId
	p.caption = post.content
	p.images = post.images
	p.postedAt = new Date(post.postedAt)
	p.likes = post.likes
	p.comments = post.comments
	p.retweets = post.retweets
	p.viewsCount = post.viewsCount
	return p
}

fetch(`${API}/api/users?username=${handle}`)
	.then((response) => response.json())
	.then((user) => {
		User.setUser(user.userId, user)

		DISPLAY_NAME_QUICK_VIEW.textContent = user.displayName
		DISPLAY_NAME.textContent = user.displayName
		HANDLE.textContent = `@${user.displayName}`
		PROFILE.src = `${API}/avatar/${user.avatarId}`

		FOLLOWERS.textContent = user.followers.length
		FOLLOWING.textContent = user.following.length

		POSTS_QUICK_VIEW.textContent = `${user.posts.length} posts`
		fetch(`${API}/api/@${handle}/posts`)
			.then((response) => response.json())
			.then((posts) => {
				posts.sort((a, b) => b.postId - a.postId)
				posts.forEach(async (post) => {
					FEED.appendChild(BuildPost(post).toHtml())
				})
			})
			.catch((error) => {
				console.error(error)
			})
	})
	.catch((error) => {
		console.error(error)
	})

if (myUserId !== null) {
	fetch(`${API}/api/users?id=${myUserId}`)
		.then((response) => response.json())
		.then((user) => {
			User.setUser(user.userId, user)

			// if (User.getUserByHandle(handle).userId === myUserId) {
			// 	FOLLOW_BUTTON.style.display = "none"
			// }

			if (user.following.includes(User.getUserByHandle(handle).userId)) {
				FOLLOW_BUTTON.classList.remove("follow")
				FOLLOW_BUTTON.classList.add("unfollow")
				FOLLOW_BUTTON.textContent = "Unfollow"
			} else {
				FOLLOW_BUTTON.classList.remove("unfollow")
				FOLLOW_BUTTON.classList.add("follow")
				FOLLOW_BUTTON.textContent = "Follow"
			}
		})
		.catch((error) => {
			console.error(error)
		})
}

FOLLOW_BUTTON.onclick = async () => {
	if (FOLLOW_BUTTON.classList.contains("follow")) {
		let user = User.getUserByHandle(handle)
		let response = await fetch(`${API}/api/followuser`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				userId: myUserId,
				following: user.userId,
				create: true,
			}),
		})
		let data = await response.json()
		if (data.success) {
			FOLLOW_BUTTON.classList.remove("follow")
			FOLLOW_BUTTON.classList.add("unfollow")
			FOLLOW_BUTTON.textContent = "Unfollow"
			FOLLOWERS.textContent = parseInt(FOLLOWERS.textContent) + 1
		}
	} else {
		let user = User.getUserByHandle(handle)
		let response = await fetch(`${API}/api/followuser`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				userId: myUserId,
				following: user.userId,
				create: false,
			}),
		})
		let data = await response.json()
		if (data.success) {
			FOLLOW_BUTTON.classList.remove("unfollow")
			FOLLOW_BUTTON.classList.add("follow")
			FOLLOW_BUTTON.textContent = "Follow"
			FOLLOWERS.textContent = parseInt(FOLLOWERS.textContent) - 1
		}
	}
}

BACK_BUTTON.onclick = () => {
	window.history.back()
}
