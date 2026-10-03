import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        pin: {},
      },
      authorize: async (credentials) => {
        const { email, password, pin } = credentials;
        if (!email || !password || !pin) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const passwordValid = await bcrypt.compare(password, user.passwordHash);
        if (!passwordValid) return null;

        const pinValid = await bcrypt.compare(pin, user.pinHash);
        if (!pinValid) return null;

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
});