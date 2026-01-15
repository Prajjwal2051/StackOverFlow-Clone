
import { db, answerCollection } from "../name"
import { databases } from "./config"
import { Permission } from "appwrite"

export default async function createAnswerCollection() {
    await databases.createCollection(db, answerCollection, answerCollection, [
        Permission.read("any"),
        Permission.read("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ])
    console.log(`Collection ${answerCollection} created`)
    // now we will create attributes for the collection
    await Promise.all([
        databases.createStringAttribute(db, answerCollection, "title", 256, true),
        databases.createStringAttribute(db, answerCollection, "content", 1000, true),
        databases.createStringAttribute(db, answerCollection, "authorId", 50, true),
        databases.createStringAttribute(db, answerCollection, "tags", 50, false, undefined, true),
        databases.createStringAttribute(db, answerCollection, "attachementIds", 50, false, undefined, true),
        databases.createDatetimeAttribute(db, answerCollection, "createdAt", true),
        databases.createDatetimeAttribute(db, answerCollection, "updatedAt", true),
    ])
    console.log(`Attributes for collection ${answerCollection} created`)
}