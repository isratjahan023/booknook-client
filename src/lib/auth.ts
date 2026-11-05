import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { db, mongoClient } from "@/lib/mongodb";

export const auth = betterAuth({
  appName: "BookNook",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  database: mongodbAdapter(db, {
    client: mongoClient,
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false,
  },

  plugins: [jwt()],
});