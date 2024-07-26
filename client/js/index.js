import Post from "./Post.js"

const FEED = document.getElementById("inner-feed")

let post = new Post()

FEED.appendChild(post.toHtml())
