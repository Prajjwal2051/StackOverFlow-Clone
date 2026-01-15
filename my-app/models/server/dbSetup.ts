import { db } from "../name";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createQuestionCollection from "./question.collection";
import cretaeVoteCollection from "./vote.collection";
import { databases } from "./config";

export default async function getOrCreateDB(){
    try {
        await databases.get(db)
        console.log("database connected")
    } catch (error) {
        try {
            // a database has been created 
            await databases.create(db,db)
            console.log("database created")
            // now we will be creating the collections
            await Promise.all([
                createQuestionCollection(),
                createAnswerCollection(),
                createCommentCollection(),
                cretaeVoteCollection()
            ])
            console.log("collections created sucessfully")
            console.log("database connected")
        } catch (error) {
            console.log("error creating databases or collection ",error)
        }
    }
    return databases
}