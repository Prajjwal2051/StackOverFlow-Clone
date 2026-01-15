import { IndexType } from "node-appwrite"
import { db, questionCollection } from "../name"
import { databases } from "./config"
import { Permission } from "appwrite"

export default async function createQuestionCollection() {
    await databases.createCollection(db, questionCollection, questionCollection, [
        Permission.read("any"),
        Permission.read("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ])
    console.log(`Collection ${questionCollection} created`)

    // now we will create attributes for the collection
    await Promise.all([
        databases.createStringAttribute(db, questionCollection, "title", 256, true),
        databases.createStringAttribute(db, questionCollection, "content", 1000, true),
        databases.createStringAttribute(db, questionCollection, "authorId", 50, true),
        databases.createStringAttribute(db, questionCollection, "tags", 50, false, undefined, true),
        databases.createStringAttribute(db, questionCollection, "attachementIds", 50, false, undefined, true),
        databases.createDatetimeAttribute(db, questionCollection, "createdAt", true),
        databases.createDatetimeAttribute(db, questionCollection, "updatedAt", true),
    ])
    console.log(`Attributes for collection ${questionCollection} created`)

    // Wait for attributes to be available before creating indexes
    console.log("Waiting for attributes to be available...")
    await new Promise(resolve => setTimeout(resolve, 2000))

    // now we will create indexes for the collection
    await Promise.all([
        databases.createIndex(db, questionCollection, "title", IndexType.Fulltext, ["title"], ["asc"]),
        databases.createIndex(db, questionCollection, "content", IndexType.Fulltext, ["content"], ["asc"])
    ])
    console.log(`Indexes for collection ${questionCollection} created`)
} 