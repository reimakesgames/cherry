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

const PROFILE = document.getElementById("profile")
const DISPLAY_NAME = document.getElementById("display-name")
const HANDLE = document.getElementById("handle")

const FOLLOWERS = document.getElementById("followers-stat")
const FOLLOWING = document.getElementById("following-stat")

const FEED = document.getElementById("inner-feed")

function BuildPost(post) {
	let p = new Post()
	p.user = User.getUser(post.userId)
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
		fetch(`${API}/api/@reimakesgames/posts`)
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

BACK_BUTTON.onclick = () => {
	window.history.back()
}
