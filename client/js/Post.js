function n(element) {
	return document.createElement(element)
}

class Post {
	name = "John Doe"
	handle = "@johndoe"
	caption = "This is a caption"
	image = null
	commentsCount = 0
	retweetsCount = 0
	likesCount = 0
	viewsCount = 0
	date = new Date()
	liked = false
	retweeted = false
	comments = []

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
		let profile = n("img")
		profile.classList.add("profile")
		profile.src = ""
		let name = n("span")
		name.classList.add("name")
		name.textContent = this.name
		let handle = n("span")
		handle.classList.add("handle")
		handle.textContent = this.handle
		let date = n("span")
		date.classList.add("date")
		date.textContent = this.date.toLocaleDateString()
		header.appendChild(profile)
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
		let image = n("div")
		image.classList.add("image")
		let img = n("img")
		img.src = this.image
		image.appendChild(img)
		content.appendChild(text)
		content.appendChild(image)
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
			this.commentsCount,
			this.retweetsCount,
			this.likesCount,
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
		})
		return footer
	}
}

export default Post
