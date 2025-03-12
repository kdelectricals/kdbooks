import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Users  from "../../../../database/models/User"; // Sequelize model

export default NextAuth({
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
       

        if (!user || credentials.password !==user.dataValues.password) {
          throw new Error("Invalid email or password");
        }

        return { id: user.dataValues.id, email: user.dataValues.email, role: user.dataValues.role };
      },
    }),
  ],
  callbacks: {

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.role = token.role; // Add role to session
      return session; 
    },
  },
  session: { strategy: "jwt", maxAge: 30 * 60 }, // 30 min expiration
  secret: process.env.NEXTAUTH_SECRET,
});
