"use client";

import { databases } from "@/models/client/config";
import { db, voteCollection } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { cn } from "@/lib/utils";
import { IconCaretUpFilled, IconCaretDownFilled } from "@tabler/icons-react";
import { Query } from "appwrite";

interface VoteDocument {
    $id: string;
    voteStatus: "upvoted" | "downvoted";
}
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

const VoteButtons = ({
    type,
    id,
    upvotes,
    downvotes,
    className,
}: {
    type: "question" | "answer";
    id: string;
    upvotes: { total: number; documents?: any[] };
    downvotes: { total: number; documents?: any[] };
    className?: string;
}) => {
    const [votedDocument, setVotedDocument] = React.useState<VoteDocument | null | undefined>(undefined); // undefined means not fetched yet
    const [voteResult, setVoteResult] = React.useState<number>(upvotes.total - downvotes.total);

    const { user } = useAuthStore();
    const router = useRouter();

    React.useEffect(() => {
        (async () => {
            if (user) {
                try {
                    const response = await databases.listDocuments(db, voteCollection, [
                        Query.equal("type", type),
                        Query.equal("typeId", id),
                        Query.equal("votedById", user.$id),
                    ]);
                    setVotedDocument(() => (response.documents[0] as unknown as VoteDocument | undefined) || null);
                } catch (error) {
                    console.error("Failed to fetch existing vote:", error);
                    setVotedDocument(null); // allow voting even if fetch fails
                }
            } else {
                setVotedDocument(null); // no user, so not voted
            }
        })();
    }, [user, id, type]);

    const toggleUpvote = async () => {
        if (!user) return router.push("/login");

        if (votedDocument === undefined) return;

        try {
            const response = await fetch(`/api/vote`, {
                method: "POST",
                headers: {
                    "x-appwrite-jwt": useAuthStore.getState().jwt || "",
                },
                body: JSON.stringify({
                    votedById: user.$id,
                    voteStatus: "upvoted",
                    type,
                    typeId: id,
                }),
            });

            const data = await response.json();

            if (!response.ok) throw data;

            setVoteResult(() => data.data.voteResult);
            setVotedDocument(() => data.data.document as VoteDocument | null);
            toast.success(data.message || "Vote recorded!");
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong");
        }
    };

    const toggleDownvote = async () => {
        if (!user) return router.push("/login");

        if (votedDocument === undefined) return;

        try {
            const response = await fetch(`/api/vote`, {
                method: "POST",
                headers: {
                    "x-appwrite-jwt": useAuthStore.getState().jwt || "",
                },
                body: JSON.stringify({
                    votedById: user.$id,
                    voteStatus: "downvoted",
                    type,
                    typeId: id,
                }),
            });

            const data = await response.json();

            if (!response.ok) throw data;

            setVoteResult(() => data.data.voteResult);
            setVotedDocument(() => data.data.document as VoteDocument | null);
            toast.success(data.message || "Vote recorded!");
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong");
        }
    };

    return (
        <div className={cn("flex shrink-0 flex-col items-center justify-start gap-y-4", className)}>
            <button
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
                    votedDocument && votedDocument.voteStatus === "upvoted"
                        ? "border-orange-500 text-orange-500"
                        : "border-white/30"
                )}
                onClick={toggleUpvote}
            >
                <IconCaretUpFilled />
            </button>
            <span>{voteResult}</span>
            <button
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10",
                    votedDocument && votedDocument.voteStatus === "downvoted"
                        ? "border-orange-500 text-orange-500"
                        : "border-white/30"
                )}
                onClick={toggleDownvote}
            >
                <IconCaretDownFilled />
            </button>
        </div>
    );
};

export default VoteButtons;
