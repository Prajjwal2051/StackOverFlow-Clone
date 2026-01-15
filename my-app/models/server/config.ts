import {Avatars,Client,Databases,Storage,Users} from "node-appwrite"
import env from "@/app/env";

let client = new Client();
client
    .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
    .setProject(env.appwrite.projectId) // Your project ID
    .setKey(env.appwrite.apiKey) // Your secret API key
;

const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);
const users = new Users(client);

export {
    client,
    avatars,
    databases,
    storage,
    users
}
