import QuestionForm from "@/components/QuestionForm";
import { Meteors } from "@/components/magicui/meteors";
import React from "react";

const Page = () => {
    return (
        <div className="relative pb-20 pt-32">
            <Meteors number={30} />
            <div className="container mx-auto px-4">
                <h1 className="mb-2 text-3xl font-bold">Ask a public question</h1>
                <p className="mb-8 text-white/60">
                    Be specific and imagine you&apos;re asking a question to another person.
                </p>
                <div className="max-w-3xl">
                    <QuestionForm />
                </div>
            </div>
        </div>
    );
};

export default Page;
