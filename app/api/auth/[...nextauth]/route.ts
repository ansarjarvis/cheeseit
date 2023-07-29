import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

let handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
