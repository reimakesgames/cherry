export class Post {
	postId: string = "-1"
	userId: string = "-1"
	content: string = ""
	images?: string[1]
	postedAt: Date = new Date()
	viewsCount: number = 0

	comments: bigint[] = []
	likes: bigint[] = []
	retweets: bigint[] = []
}
