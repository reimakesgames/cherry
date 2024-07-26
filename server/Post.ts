export class Post {
	id: bigint = -1n
	userId: bigint = -1n
	content: string = ""
	image?: string
	createdAt: Date = new Date()

	likesCount: number = 0
	commentsCount: number = 0
	retweetsCount: number = 0
	viewsCount: number = 0

	comments: bigint[] = []
	likes: bigint[] = []
	retweets: bigint[] = []
}
