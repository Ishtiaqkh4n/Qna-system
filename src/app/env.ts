const env = {
    appwrite: {
        endpoint: String(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || ""),
        projectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || ""),
        apikey: String(process.env.APPWRITE_API_KEY || ""),
    },
};

// Only validate server-side so NEXT_PUBLIC_* inlining works on the client
if (typeof window === "undefined" && !env.appwrite.apikey) {
    throw new Error("Missing required environment variable: APPWRITE_API_KEY");
}

export default env;
