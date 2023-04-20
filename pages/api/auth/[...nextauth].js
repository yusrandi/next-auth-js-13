import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import {prisma} from '../../../config/db'
import bcrypt from 'bcrypt'



export const authOptions = {
  // Configure one or more authentication providers
  providers:[
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      }),

    GithubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET
      }),
      CredentialsProvider({
        // The name to display on the sign in form (e.g. "Sign in with...")
        name: "Credentials",
        
        credentials: {
        //   username: { label: "Username", type: "text", placeholder: "jsmith" },
        //   password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
          // Add logic here to look up the user from the credentials supplied
        //   const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }

            const user = await prisma.user.findFirst({
                where: {
                    email: {
                        equals: credentials.email
                    }
                }
            })

            console.log(user);

            if (!user) throw new Error("User Not Found")

            const match = await bcrypt.compare(credentials.password, user.password);
            if (!match) throw new Error("wrong password")

            return user
    
        }
      })
    // ...add more providers here
  ],
}
export default NextAuth(authOptions)