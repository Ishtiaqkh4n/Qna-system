import env from "@/app/env"

import {
    Account,
    Avatars,
    Client,
    Databases,
    Storage,
    Users
} from "node-appwrite"
import { NextRequest } from "next/server";

const client = new Client()

client
    .setEndpoint(env.appwrite.endpoint) 
    .setProject(env.appwrite.projectId)
    .setKey(env.appwrite.apikey)

const databases = new Databases(client)
const storage = new Storage(client)
const avatars = new Avatars(client)
const users = new Users(client)
const account = new Account(client)

export async function verifyAuth(request: NextRequest) {
    const jwt = request.headers.get("x-appwrite-jwt");
    if (!jwt) throw new Error("Missing authentication token");

    const sessionClient = new Client()
        .setEndpoint(env.appwrite.endpoint)
        .setProject(env.appwrite.projectId)
        .setJWT(jwt);

    const sessionAccount = new Account(sessionClient);
    const user = await sessionAccount.get();
    return user;
}

export {
    account,
    avatars,
    databases,
    storage,
    users
}

