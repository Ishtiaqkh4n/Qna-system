"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/models/client/config";
import { useAuthStore, UserPrefs } from "@/store/Auth";
import toast from "react-hot-toast";

export default function OAuthCallback() {
    const router = useRouter();

    useEffect(() => {
        (async () => {
            try {
                const user = await account.get<UserPrefs>();

                // Initialize reputation for new OAuth users
                if (!user.prefs?.reputation) {
                    await account.updatePrefs<UserPrefs>({ reputation: 0 });
                    user.prefs = { reputation: 0 };
                }

                const [jwtResponse, session] = await Promise.all([
                    account.createJWT(),
                    account.getSession("current"),
                ]);

                useAuthStore.setState({
                    session,
                    user,
                    jwt: jwtResponse.jwt,
                    hydrated: true,
                });

                toast.success(`Welcome, ${user.name}!`);
                router.push("/");
            } catch (error) {
                toast.error("OAuth login failed. Please try again.");
                router.push("/login?error=OAuth+login+failed");
            }
        })();
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
                <p className="text-lg text-neutral-300">Completing login...</p>
            </div>
        </div>
    );
}
