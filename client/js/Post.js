import { User } from "./User.js"

const API = window.location.origin

function n(element) {
	return document.createElement(element)
}

function timeSince(date) {
	let seconds = Math.floor((new Date() - date) / 1000)
	let interval = Math.floor(seconds / 31536000)
	if (interval >= 1) {
		return interval + "y"
	}
	interval = Math.floor(seconds / 2592000)
	if (interval >= 1) {
		return interval + "m"
	}
	interval = Math.floor(seconds / 86400)
	if (interval >= 1) {
		return interval + "d"
	}
	interval = Math.floor(seconds / 3600)
	if (interval >= 1) {
		return interval + "h"
	}
	interval = Math.floor(seconds / 60)
	console.log(interval)
	if (interval >= 1) {
		return interval + "m"
	}
	return Math.floor(seconds) + "s"
}

class Post {
	user = new User()
	postId = "-1"
	postedAt = new Date()

	caption = "This is a caption"
	images = []

	viewsCount = 0

	liked = false
	retweeted = false
	comments = []
	likes = []
	retweets = []

	toHtml() {
		let post = n("div")
		post.classList.add("post")
		post.appendChild(this.generateHeader())
		post.appendChild(this.generateContent())
		post.appendChild(this.generateActions())
		return post
	}

	generateHeader() {
		let header = n("div")
		header.classList.add("header")
		let avatar = n("img")
		avatar.crossOrigin = "anonymous"
		avatar.classList.add("profile")
		avatar.src = `${API}/avatar/${this.user.avatarId}`
		avatar.onclick = () => {
			window.location.href = `${API}/@${this.user.displayName}`
		}
		let name = n("span")
		name.classList.add("name")
		name.textContent = this.user.displayName
		let handle = n("span")
		handle.classList.add("handle")
		handle.textContent = "@" + this.user.displayName
		let date = n("span")
		date.classList.add("date")
		date.textContent = timeSince(this.postedAt)
		header.appendChild(avatar)
		header.appendChild(name)
		header.appendChild(handle)
		header.appendChild(date)
		return header
	}

	generateContent() {
		let content = n("div")
		content.classList.add("content")
		let text = n("div")
		text.classList.add("text")
		text.textContent = this.caption
		content.appendChild(text)
		if (this.images !== undefined && this.images.length > 0) {
			let image = n("div")
			image.classList.add("image")
			let img = n("img")
			img.crossOrigin = "anonymous"
			img.src = `${API}/media/${this.images[0]}`
			image.appendChild(img)
			content.appendChild(image)
		}
		return content
	}

	generateActions() {
		let footer = n("div")
		footer.classList.add("actions")
		let mainActions = n("div")
		mainActions.classList.add("main-actions")
		footer.appendChild(mainActions)
		let actions = ["mode_comment", "cached", "favorite", "bar_chart"]
		let counts = [
			this.comments.length,
			this.retweets.length,
			this.likes.length,
			this.viewsCount,
		]
		actions.forEach((action, index) => {
			let div = n("div")
			div.classList.add("action")
			let button = n("button")
			button.classList.add("material-symbols-outlined")
			button.textContent = action
			let span = n("span")
			span.classList.add("count")
			span.textContent = counts[index]
			div.appendChild(button)
			div.appendChild(span)
			mainActions.appendChild(div)
			if (action === "favorite") {
				button.id = this.liked ? "liked" : ""
				button.addEventListener("click", async () => {
					let xhr = new XMLHttpRequest()
					xhr.open(
						"POST",
						`${API}/api/liketweet?postId=${this.postId}&like=${!this
							.liked}`,
						true
					)
					xhr.setRequestHeader("Content-Type", "application/json")
					xhr.onreadystatechange = async () => {
						if (xhr.readyState === 4 && xhr.status === 200) {
							this.liked = !this.liked
							button.id = this.liked ? "liked" : ""
							let likeCount = parseInt(span.textContent)
							span.textContent = likeCount + (this.liked ? 1 : -1)
						}
					}
					xhr.send()
				})
			}
		})
		let share = n("button")
		share.classList.add("material-symbols-outlined")
		share.textContent = "upload"
		footer.appendChild(share)
		return footer
	}
}

export default Post
