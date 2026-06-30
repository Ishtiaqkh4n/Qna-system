import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases, users, verifyAuth } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

export async function POST(request: NextRequest) {
    try {
        const user = await verifyAuth(request);
        const { voteStatus, type, typeId } = await request.json();
        const votedById = user.$id;

        const existingVotes = await databases.listDocuments(db, voteCollection, [
            Query.equal("type", type),
            Query.equal("typeId", typeId),
            Query.equal("votedById", votedById),
        ]);

        const existingVote = existingVotes.documents[0];

        // Fetch the content author for reputation adjustment
        const questionOrAnswer = await databases.getDocument(
            db,
            type === "question" ? questionCollection : answerCollection,
            typeId
        );
        const authorPrefs = await users.getPrefs<UserPrefs>(questionOrAnswer.authorId);
        let repDelta = 0;

        if (existingVote) {
            // Delete existing vote first
            await databases.deleteDocument(db, voteCollection, existingVote.$id);

            // Reverse the reputation effect from the old vote
            repDelta += existingVote.voteStatus === "upvoted" ? -1 : 1;

            // If same vote status clicked again, it's a withdrawal
            if (existingVote.voteStatus === voteStatus) {
                await users.updatePrefs<UserPrefs>(questionOrAnswer.authorId, {
                    reputation: Number(authorPrefs.reputation) + repDelta,
                });

                const [upvotes, downvotes] = await Promise.all([
                    databases.listDocuments(db, voteCollection, [
                        Query.equal("type", type),
                        Query.equal("typeId", typeId),
                        Query.equal("voteStatus", "upvoted"),
                        Query.limit(1),
                    ]),
                    databases.listDocuments(db, voteCollection, [
                        Query.equal("type", type),
                        Query.equal("typeId", typeId),
                        Query.equal("voteStatus", "downvoted"),
                        Query.limit(1),
                    ]),
                ]);

                return NextResponse.json(
                    {
                        data: { document: null, voteResult: upvotes.total - downvotes.total },
                        message: "Vote Withdrawn",
                    },
                    { status: 200 }
                );
            }
        }

        // Create new vote document (first-time vote or switching)
        const doc = await databases.createDocument(db, voteCollection, ID.unique(), {
            type,
            typeId,
            voteStatus,
            votedById,
        });

        // Apply the new vote's reputation effect
        repDelta += voteStatus === "upvoted" ? 1 : -1;

        await users.updatePrefs<UserPrefs>(questionOrAnswer.authorId, {
            reputation: Number(authorPrefs.reputation) + repDelta,
        });

        const [upvotes, downvotes] = await Promise.all([
            databases.listDocuments(db, voteCollection, [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("voteStatus", "upvoted"),
                Query.limit(1),
            ]),
            databases.listDocuments(db, voteCollection, [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
                Query.equal("voteStatus", "downvoted"),
                Query.limit(1),
            ]),
        ]);

        return NextResponse.json(
            {
                data: { document: doc, voteResult: upvotes.total - downvotes.total },
                message: existingVote ? "Vote Status Updated" : "Voted",
            },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error?.message || "Error processing vote" },
            { status: error?.status || error?.code || 500 }
        );
    }
}
