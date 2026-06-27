import { Permission } from "node-appwrite";
import { db, questionCollection } from "../name";
import { databases } from "./config";

export default async function createQuestionCollection() {
    try {
        // Create the collection
        await databases.createCollection(
            db,                          // databaseId
            questionCollection,          // collectionId
            questionCollection,          // name (display name)
            [
                Permission.read("any"),      // Anyone can read
                Permission.read("users"),    // Authenticated users can read
                Permission.create("users"),  // Authenticated users can create
                Permission.update("users"),  // Authenticated users can update
                Permission.delete("users"),  // Authenticated users can delete
            ]
        );
        console.log("✅ Question collection created");

        // Create attributes
        await Promise.all([
            databases.createStringAttribute(db, questionCollection, "title", 100, true),
            databases.createStringAttribute(db, questionCollection, "content", 10000, true),
            databases.createStringAttribute(db, questionCollection, "authorId", 50, true),
            databases.createStringAttribute(db, questionCollection, "tags", 50, true, undefined, true), // array
            databases.createStringAttribute(db, questionCollection, "attachmentId", 50, false),         // optional
        ]);
        console.log("✅ Attributes created successfully");

    } catch (error) {
        console.error("❌ Error creating collection:", error);
        throw error;
    }
}