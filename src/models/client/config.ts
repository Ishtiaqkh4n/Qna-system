import env from "@/app/env"
import {Client,Account,Avatars,Storage,Databases} from "appwrite"



const client = new Client()
 .setEndpoint(env.appwrite.endpoint)
 .setProject(env.appwrite.projectId)


 const databases = new Databases(client)
 const account = new Account(client)
 const avatar = new Avatars(client)
 const storage = new Storage(client)


 export {
    databases,
    account,
    avatar,
    storage
 }