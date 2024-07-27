import { readFileSync, writeFileSync } from "fs"
import { Post } from "./Post.js"
import { User } from "./User.js"

type DB = {
	posts: Post[]
	users: Record<string, User>
}

function getDb(): DB {
	return JSON.parse(readFileSync("content/db.json", "utf-8"))
}

function setDb(db: Object) {
	writeFileSync("content/db.json", JSON.stringify(db))
}

export { getDb, setDb }
