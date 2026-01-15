
import { db, questionAttachmentBucket } from "../name"
import { databases, storage } from "./config"
import { Permission } from "appwrite"

export default async function getOrCreateStorage(){
    try{
        await storage.getBucket(questionAttachmentBucket)
        console.log(`Bucket ${questionAttachmentBucket} already exists`)
    }
    catch(error){
        try {
            await storage.createBucket(questionAttachmentBucket,questionAttachmentBucket,[
                    Permission.read("any"),
                    Permission.create("users"),
                    Permission.update("users"),
                    Permission.delete("users"),
                ],
                false,
                undefined,
                undefined,
                [
                    "jpg","png","jpeg","gif","bmp","webp","tiff","svg","pdf","doc","docx","xls","xlsx","ppt","pptx","txt","md"
                ]
            )
            console.log(`Bucket ${questionAttachmentBucket} created`)

        } catch (error) {
            console.log(error);
        }
    }
   
}
