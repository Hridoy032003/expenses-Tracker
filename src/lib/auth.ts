import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { nanoid } from 'nanoid';
import { NextAuthOptions, getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { db } from './db';




export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/Sign-in',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
 
  ],
  callbacks: {
    async jwt({ token, user }) {
       const dbUser = await db.user.findFirst({
        where: {
          email: token.email!,
        },
      });

      if (!dbUser) {
        if (user) {
          token.id = user.id;
        }
        return token;
      }


      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        username: dbUser.username || nanoid(10),
       
     
      };
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.username = token.username;
      
 
      }
      return session;
    },
   

    redirect({ baseUrl }) {
      return baseUrl;
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);