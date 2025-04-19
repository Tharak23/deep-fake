import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { connectToDatabase } from './mongodb';
import { compare } from 'bcryptjs';
import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

// Add type declarations to extend the default NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      role: string;
      isVerified?: boolean;
      roadmapProgress?: number;
      roadmapLevel?: string;
    }
  }
  
  interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: string;
    isVerified?: boolean;
    roadmapProgress?: number;
    roadmapLevel?: string;
    blogEnabled?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

// Helper function to determine researcher level based on roadmap progress
function getRoadmapLevel(progress: number): 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' {
  if (progress >= 90) return 'Expert';
  if (progress >= 70) return 'Advanced';
  if (progress >= 40) return 'Intermediate';
  return 'Beginner';
}

// Check if email is an admin email
function isAdminEmail(email: string): boolean {
  const adminEmails = [
    'tharak.nagaveti@gmail.com',
    'adityasaisontena@gmail.com',
    'dhanushyangal@gmail.com',
    'tejeshvarma07@gmail.com'
  ];
  
  return adminEmails.includes(email.toLowerCase());
}

export const authOptions: NextAuthOptions = {
  // We'll handle user initialization manually instead of using the adapter
  // to avoid type compatibility issues
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const { db } = await connectToDatabase();
        const user = await db.collection('users').findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error('No user found with this email');
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role || 'user',
          isVerified: user.isVerified || false,
          roadmapProgress: user.roadmapProgress || 0,
          roadmapLevel: user.roadmapLevel || 'Beginner',
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Initialize new users with proper defaults when they sign in for the first time
      if (account?.provider === 'google') {
        try {
          const { db } = await connectToDatabase();
          
          // Check if the user already exists
          const existingUser = await db.collection('users').findOne({ email: user.email });
          
          if (existingUser) {
            // If user exists but doesn't have all the required fields, update it
            if (!existingUser.role || existingUser.role === 'undefined') {
              const isAdmin = isAdminEmail(user.email as string);
              
              await db.collection('users').updateOne(
                { _id: existingUser._id },
                { 
                  $set: {
                    role: isAdmin ? 'admin' : 'user',
                    isVerified: isAdmin,
                    roadmapProgress: existingUser.roadmapProgress || 0,
                    roadmapLevel: existingUser.roadmapLevel || 'Beginner',
                    blogEnabled: isAdmin
                  } 
                }
              );
            }
          } else {
            // If the user doesn't exist yet, create a new user
            const isAdmin = isAdminEmail(user.email as string);
            
            await db.collection('users').insertOne({
              name: user.name,
              email: user.email,
              image: user.image,
              role: isAdmin ? 'admin' : 'user',
              isVerified: isAdmin,
              roadmapProgress: 0,
              roadmapLevel: 'Beginner',
              blogEnabled: isAdmin,
              blogPosts: [],
              datasets: [],
              contributions: {
                papers: [],
                datasets: [],
                experiments: []
              },
              createdAt: new Date()
            });
          }
        } catch (error) {
          console.error('Error initializing user:', error);
        }
      }
      
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        // Get user from database to get the latest data
        try {
          const { db } = await connectToDatabase();
          const dbUser = await db.collection('users').findOne({ _id: new ObjectId(token.sub) });
          
          if (dbUser) {
            session.user.id = token.sub;
            session.user.role = dbUser.role || 'user';
            session.user.isVerified = dbUser.isVerified || false;
            session.user.roadmapProgress = dbUser.roadmapProgress || 0;
            session.user.roadmapLevel = dbUser.roadmapLevel || 'Beginner';
          }
        } catch (error) {
          console.error('Error getting user session data:', error);
          
          // Provide fallback values
          session.user.id = token.sub;
          session.user.role = token.role as string || 'user';
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'user';
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
};
