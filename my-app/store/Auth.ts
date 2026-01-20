// Importing Zustand - a simple state management library for React
import { create } from "zustand"
// Importing immer middleware - helps update state easily without mutating it directly
import { immer } from "zustand/middleware/immer"
// Importing persist middleware - saves state to browser storage so it doesn't disappear on page refresh
import { persist } from "zustand/middleware"

// Importing Appwrite tools - Appwrite is the backend service for authentication
import { AppwriteException, ID, Models } from "node-appwrite"
// Importing our Appwrite account configuration
import { account } from "@/models/client/config"
import { ProxyMatcher } from "next/dist/build/analysis/get-page-static-info"
import { deprecate } from "util"
import { warnOptionHasBeenDeprecated } from "next/dist/server/config"

// This interface defines what extra info we store about each user
export interface UserPrefs {
    reputation: number  // User's reputation score (like karma points)
}

// This interface defines the structure of our authentication store
// It's like a blueprint for managing user login/logout and session info
interface IAuthStore {
    // Stores the current login session information (null if not logged in)
    session: Models.Session | null

    // Stores the JWT (JSON Web Token) - a special key used for secure API requests
    jwt: String | null

    // Stores the logged-in user's information (null if no one is logged in)
    user: Models.User<UserPrefs> | null

    // Tracks if the store has loaded data from browser storage yet
    hydrated: boolean

    // Function to mark that the store has finished loading saved data
    setHydrated(): void

    // Function to check if the current session is still valid
    verifySession(): Promise<void>

    // Function to log in a user with their email and password
    // Returns success status and any error that occurred
    login(
        email: string,
        password: string
    ): Promise<{ sucess: boolean; error?: AppwriteException | null }>

    // Function to create a new user account
    // Takes name, email, and password and returns success status
    createAccount(
        name: string,
        email: string,
        password: string
    ): Promise<{ sucess: boolean; error?: AppwriteException | null }>

    // Function to log out the current user
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
                set({
                    hydrated: true
                })
            },

            async verifySession() {
                try {
                    const session = await account.getSession("current")
                    set({ session })
                } catch (error) {
                    console.log(error)
                }
            },

            async login(email: string, password: string) {
                try {
                    const session = await account.createEmailPasswordSession(email, password)
                    const [user, { jwt }] = await Promise.all([
                        account.get<UserPrefs>(),
                        account.createJWT()
                    ])
                    if (!user.prefs?.reputation) await account.updatePrefs<UserPrefs>({ reputation: 0 })
                    set({ session, user, jwt })
                    return {
                        sucess: true
                    }
                } catch (error) {
                    console.log(error)
                    return {
                        sucess: false,
                        error: error instanceof AppwriteException ? error : null
                    }
                }
            },

            async createAccount(name: string, email: string, password: string) {
                try {
                    await account.create(ID.unique(),email,password)
                    return {
                        sucess: true
                    }
                } catch (error) {
                    console.log(error)
                    return {
                        sucess: false,
                        error: error instanceof AppwriteException ? error : null
                    }
                }
            },

            async logout() {
                try {
                    await account.deleteSession("current")
                    set({session:null,jwt:null, user:null})
                    
                } catch (error) {
                    console.log(error)

                }
            },


        })),
        {
            name: "auth",
            onRehydrateStorage() {
                return (state, error) => {
                    if (!error) {
                        state?.setHydrated()
                    }
                }
            }
        }
    )
)