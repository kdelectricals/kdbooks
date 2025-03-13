import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Users from "../../../../database/models/User"; // Sequelize model

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Fetch user from MySQL database
        const user = await Users.findOne({ where: { username: credentials.email } });

        if (!user || credentials.password !== user.dataValues.password) {
          throw new Error("Invalid email or password");
        }

        return {
          id: String(user.dataValues.id),
          email: user.dataValues.email,
          firstName: user.dataValues.firstName,
          lastName: user.dataValues.lastName,
          userName: user.dataValues.username, // ✅ Make sure this matches DB field
          role: user.dataValues.role,
          phone: user.dataValues.phone,
          address: user.dataValues.address,
          profilePicture: user.dataValues.profilePicture,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.userName = user.userName; // ✅ Fix: Ensure userName is added
        token.role = user.role;
        token.phone = user.phone;
        token.address = user.address;
        token.profilePicture = user.profilePicture;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user = {
          ...session.user, // Preserve default session fields
          id: token.id as string,
          email: token.email as string,
          firstName: token.firstName as string,
          lastName: token.lastName as string,
          userName: token.userName as string, // ✅ Fix: Ensure session gets userName
          role: token.role as string,
          phone: token.phone as string | undefined,
          address: token.address as string | undefined,
          profilePicture: token.profilePicture as string | undefined,
        };
      }
      return session;
    },
  },
  session: { strategy: "jwt", maxAge: 30 * 60 }, // 30 min expiration
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
