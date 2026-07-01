import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import {AppwriteException, ID, Models, OAuthProvider} from "appwrite"
import { account } from "@/models/client/config";
import toast from "react-hot-toast";


export interface UserPrefs {
  reputation: number
}

interface IAuthStore {
  session: Models.Session | null;
  jwt: string | null
  user: Models.User<UserPrefs> | null
  hydrated: boolean

  setHydrated(): void;
  verifiySession(): Promise<void>;
  login(
    email: string,
    password: string
  ): Promise<
  {
    success: boolean;
    error?: AppwriteException| null
  }>
  oauthLogin(provider: string): Promise<void>;
  createAccount(
    name: string,
    email: string,
    password: string
  ): Promise<
  {
    success: boolean;
    error?: AppwriteException| null
  }>
  logout(): Promise<void>
}


export const useAuthStore = create<IAuthStore>()(
  persist(
    immer((set) => ({
      session: null,
      jwt: null,
      user: null,
      hydrated: false,

      setHydrated() {
        set({hydrated: true})
      },

      async verifiySession() {
        try {
          const session = await account.getSession("current")
          set({session})

        } catch (error) {
          console.log(error)
        }
      },

      async login(email: string, password: string) {
        try {
          const session = await account.createEmailPasswordSession(email, password)
          const [user, {jwt}] = await Promise.all([
            account.get<UserPrefs>(),
            account.createJWT()

          ])
          if (!user.prefs?.reputation) await account.updatePrefs<UserPrefs>({
            reputation: 0
          })

          set({session, user, jwt})

          toast.success(`Welcome back, ${user.name}!`);

          return { success: true}

        } catch (error) {
          const message = error instanceof AppwriteException ? error.message : "Login failed";
          toast.error(message);
          return {
            success: false,
            error: error instanceof AppwriteException ? error: null,
            
          }
        }
      },

      async oauthLogin(provider: string) {
        try {
          const baseUrl = window.location.origin;
          account.createOAuth2Session(
            provider as OAuthProvider,
            `${baseUrl}/oauth/callback`,
            `${baseUrl}/login?error=OAuth+login+failed`
          );
        } catch (error) {
          console.error("OAuth login failed:", error);
        }
      },

      async createAccount(name:string, email: string, password: string) {
        try {
          await account.create(ID.unique(), email, password, name)
          toast.success("Account created! Logging you in...");
          return {success: true}
        } catch (error) {
          const message = error instanceof AppwriteException ? error.message : "Registration failed";
          toast.error(message);
          return {
            success: false,
            error: error instanceof AppwriteException ? error: null,
            
          }
        }
      },

      async logout() {
        try {
          await account.deleteSessions()
          set({session: null, jwt: null, user: null})
          toast.success("Logged out successfully");
        } catch (error) {
          const message = error instanceof AppwriteException ? error.message : "Logout failed";
          toast.error(message);
        }
      },
    })),
    {
      name: "auth",
      onRehydrateStorage(){
        return (state, error) => {
          if (!error) state?.setHydrated()
        }
      }
    }
  )
)