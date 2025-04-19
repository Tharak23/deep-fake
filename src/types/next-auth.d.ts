import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's id. */
      id: string;
      /** The user's name. */
      name: string;
      /** The user's email address. */
      email: string;
      /** The user's image URL. */
      image?: string;
      /** The user's role. */
      role: string;
      /** The user's bio. */
      bio?: string;
      /** The user's specialization. */
      specialization?: string;
      /** The user's research interests. */
      interests?: string;
      /** When the user was created. */
      createdAt?: string;
      /** When the user was last updated. */
      updatedAt?: string;
      /** Whether the user is registered for a team. */
      teamRegistered?: boolean;
      /** Whether the user has blog posting enabled. */
      blogEnabled?: boolean;
      /** Whether the user is verified as a researcher. */
      isVerified?: boolean;
      /** The user's roadmap progress (0-100). */
      roadmapProgress?: number;
      /** The user's roadmap level (Beginner, Intermediate, Advanced, Expert). */
      roadmapLevel?: string;
      /** The user's blog posts. */
      blogPosts?: any[];
      /** The user's datasets. */
      datasets?: any[];
      /** The user's contributions. */
      contributions?: {
        papers: any[];
        datasets: any[];
        experiments: any[];
      };
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: string;
    bio?: string;
    specialization?: string;
    interests?: string;
    createdAt?: string;
    updatedAt?: string;
    teamRegistered?: boolean;
    blogEnabled?: boolean;
    isVerified?: boolean;
    roadmapProgress?: number;
    roadmapLevel?: string;
    blogPosts?: any[];
    datasets?: any[];
    contributions?: {
      papers: any[];
      datasets: any[];
      experiments: any[];
    };
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** The user's id. */
    id: string;
    /** The user's role. */
    role: string;
    /** The user's email. */
    email: string;
    /** The user's name. */
    name: string;
    /** The user's image URL. */
    image?: string;
    /** The user's bio. */
    bio?: string;
    /** The user's specialization. */
    specialization?: string;
    /** The user's research interests. */
    interests?: string;
    /** Whether the user is registered for a team. */
    teamRegistered?: boolean;
    /** Whether the user has blog posting enabled. */
    blogEnabled?: boolean;
    /** Whether the user is verified as a researcher. */
    isVerified?: boolean;
    /** The user's roadmap progress (0-100). */
    roadmapProgress?: number;
    /** The user's roadmap level (Beginner, Intermediate, Advanced, Expert). */
    roadmapLevel?: string;
    /** When the user was created. */
    createdAt?: Date;
    /** When the user was last updated. */
    updatedAt?: Date;
    /** The user's contributions. */
    contributions?: {
      papers: any[];
      datasets: any[];
      experiments: any[];
    };
  }
} 