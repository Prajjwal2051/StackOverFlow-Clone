import { commentCollection, db } from "../name"
import { databases } from "./config"
import { Permission } from "appwrite"

export default async function createCommentCollection() {
    await databases.createCollection(db, commentCollection, commentCollection, [
        Permission.read("any"),
        Permission.read("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ])
    console.log(`Collection ${commentCollection} created`)
    // now we will create attributes for the collection
    await Promise.all([
        databases.createStringAttribute(db, commentCollection, "content", 1000, true),
        databases.createEnumAttribute(db, commentCollection, "type", ["answer", "question"], true),
        databases.createStringAttribute(db, commentCollection, "typeId", 50, true),
        databases.createStringAttribute(db, commentCollection, "authorId", 50, true),
        databases.createDatetimeAttribute(db, commentCollection, "createdAt", true),
        databases.createDatetimeAttribute(db, commentCollection, "updatedAt", true),
    ])

}