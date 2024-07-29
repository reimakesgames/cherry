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

fetch(`${API}/api/users/@${handle}`)
	.then((response) => response.json())
	.then((user) => {
		user = user.user
		User.setUser(user.userId, user)

		DISPLAY_NAME_QUICK_VIEW.textContent = user.displayName
		DISPLAY_NAME.textContent = user.displayName
		HANDLE.textContent = `@${user.displayName}`
		PROFILE.src = `${API}/avatar/${user.avatarId}`

		FOLLOWERS.textContent = user.followers.length
		FOLLOWING.textContent = user.following.length

		POSTS_QUICK_VIEW.textContent = `${user.posts.length} posts`
		fetch(`${API}/api/users/${user.userId}/posts`)
			.then((response) => response.json())
			.then((posts) => {
				console.log(posts)
				posts.sort((a, b) => b.postId - a.postId)
				posts.forEach(async (post) => {
					let user = User.getUserById(post?.retweetOf?.userId || post.userId)
					let retweet = post.retweetOf || post
					let postObj = Post.newFromApiObj(retweet)
					postObj.liked = retweet.likes.includes(myUserId)
					postObj.retweeted = retweet.retweets.includes(myUserId)
					if (post.retweetOf !== undefined) {
						let retweetUser = User.getUserById(post.userId)
						if (retweetUser === undefined) {
							retweetUser = await (
								await fetch(`${API}/api/users/${post.userId}`)
							).json()
							User.setUser(post.userId, retweetUser)
						}
						postObj.retweetedBy = retweetUser
					}

					let postHtml = postObj.toHtml()

					FEED.appendChild(postHtml)

					if (user === undefined) {
						user = await (
							await fetch(`${API}/api/users/${post?.retweetOf?.userId || post.userId}`)
						).json().user
						User.setUser(post?.retweetOf?.userId || post.userId, user)
					}
					Post.updateUser(postHtml, user)
					console.log(`Hydrated post ${post.postId}`)
				})
			})
			.catch((error) => {
				console.error(error)
			})

		if (myUserId !== null) {
			fetch(`${API}/api/users/${myUserId}`)
				.then((response) => response.json())
				.then((user) => {
					user = user.user
					User.setUser(user.userId, user)

					if (User.getUserByHandle(handle).userId === myUserId) {
						FOLLOW_BUTTON.style.display = "none"
					}

					if (
						user.following.includes(
							User.getUserByHandle(handle).userId
						)
					) {
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
	})
	.catch((error) => {
		console.error(error)
	})

FOLLOW_BUTTON.onclick = async () => {
	if (FOLLOW_BUTTON.classList.contains("follow")) {
		let user = User.getUserByHandle(handle)
		let response = await fetch(`${API}/api/users/${user.userId}/follow`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
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
		let response = await fetch(`${API}/api/users/${user.userId}/unfollow`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
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
