import { db, voteCollection } from "../name"
import { databases, storage } from "./config"
import { Permission } from "appwrite"

export default async function cretaeVoteCollection(){
    await databases.createCollection(db,voteCollection,voteCollection,[
        Permission.read("any"),
        Permission.read("users"),
        Permission.create("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ])
    console.log(`Collection ${voteCollection} created`)
    // now we will create attributes for the collection
    await Promise.all([
        databases.createStringAttribute(db,voteCollection,"type",10,true),
        databases.createStringAttribute(db,voteCollection,"typeId",50,true),
        databases.createEnumAttribute(db,voteCollection,"voteValue",[ "upvote", "downvote"],true),
        databases.createStringAttribute(db,voteCollection,"authorId",50,true),
        databases.createDatetimeAttribute(db,voteCollection,"createdAt",true),
        databases.createDatetimeAttribute(db,voteCollection,"updatedAt",true),
    ])
    console.log(`Attributes for collection ${voteCollection} created`)
}