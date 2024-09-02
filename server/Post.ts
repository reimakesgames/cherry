import { getDb } from "./DB.js"

type PostWithNoRelations = {
	postId: string
	userId: string
	content?: string
	images?: string[]
	postedAt: Date
}

export class Post {
	postId: string = "-1"
	userId: string = "-1"
	content?: string = ""
	images?: string[]
	postedAt: Date = new Date()
	retweetOf?: string

	comments: string[] = []
	likes: string[] = []
	retweets: string[] = []
	viewsCount: number = 0

	static getPostFromId(id: string): Post | undefined {
		let db = getDb()
		let post = db.posts.find((p: any) => p.postId === id)
		return post
	}

	static toSimple(post: Post): PostWithNoRelations {
		return {
			postId: post.postId,
			userId: post.userId,
			content: post.content,
			images: post.images,
			postedAt: post.postedAt,
		}
	}
}
