import {create} from "zustand"
import { immer } from "zustand/middleware/immer"
import { persist } from "zustand/middleware"

import { AppwriteException, ID, Models } from "node-appwrite"
import { account } from "@/models/client/config"
import { ProxyMatcher } from "next/dist/build/analysis/get-page-static-info"

export interface UserPrefs{
    reputation: number
}

interface IAuthStore{
    session:Models.Session | null
    jwt:String | null
    user: Models.User<UserPrefs> | null
    hydrated:boolean

    setHydrated(): void
    verifySession(): Promise<void>
    login(
        email:String,
        password:String
    ): Promise<{sucess:boolean; error?:AppwriteException | null}>
    createAccount(
        name:String,
        email: String,
        password: String
    ): Promise<{ sucess: boolean; error?: AppwriteException | null }>
    logout(): Promise<void>
}