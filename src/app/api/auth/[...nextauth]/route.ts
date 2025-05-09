import NextAuth from "next-auth";
import User from "@/models/user";
import connectToDB from "@/lib/user";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  session: {
    strategy: "jwt", // Use JWT for session management
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectToDB(); // Connect to the database
          const user = await User.findOne({ email: credentials?.email });
          if (!user) {
            throw new Error("No user found with this email");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials?.password ?? "",
            user.password as string
          );
          if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
          }

          return user; // Return the user object if authentication is successful
        } catch (error) {
          console.error("Error during authorization:", error);
          return null; // Return null if authentication fails
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any)._id;
        token.email = user.email; // Corrected from `getToken.email` to `token.email`
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          email: token.email,
          name: token.name || null, // Use `token.name` if available
          image: token.picture || null, // Use `token.picture` if available
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in", // Custom sign-in page
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in your `.env` file
});

export { handler as GET, handler as POST };