import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    // Connect to the database using the correct method
    const { db } = await connectToDatabase();
    
    // Fetch verified researchers with contributions
    const verifiedResearchers = await db.collection('users').find({ 
      role: 'verified_researcher',
      isVerified: true
    }).project({
      name: 1,
      email: 1,
      image: 1,
      role: 1,
      roadmapProgress: 1,
      roadmapLevel: 1,
      blogPosts: 1,
      datasets: 1,
      verificationDate: 1,
      institution: 1,
      position: 1,
      field: 1
    }).limit(10).toArray();
    
    console.log(`Found ${verifiedResearchers.length} verified researchers`);
    
    // Transform the data for the frontend
    const researchers = verifiedResearchers.map(researcher => ({
      id: researcher._id.toString(),
      name: researcher.name,
      email: researcher.email,
      avatar: researcher.image, // Changed from avatar to image for consistency
      role: researcher.role,
      roadmapProgress: researcher.roadmapProgress || 0,
      roadmapLevel: researcher.roadmapLevel || getRoadmapLevel(researcher.roadmapProgress || 0),
      blogPosts: Array.isArray(researcher.blogPosts) ? researcher.blogPosts.length : 0,
      datasets: Array.isArray(researcher.datasets) ? researcher.datasets.length : 0,
      createdAt: researcher.verificationDate ? new Date(researcher.verificationDate).toISOString() : new Date().toISOString()
    }));
    
    // If no researchers are found, provide a fallback for development/testing
    if (researchers.length === 0) {
      console.log('No verified researchers found in the database, adding mock data');
      // Add mock data as fallback
      researchers.push({
        id: '1',
        name: 'Dr. Sarah Chen',
        email: 'researcher@example.com',
        avatar: null,
        role: 'verified_researcher',
        roadmapProgress: 85,
        roadmapLevel: 'Advanced',
        blogPosts: 3,
        datasets: 2,
        createdAt: new Date().toISOString()
      });
    }
    
    return NextResponse.json({ researchers });
  } catch (error) {
    console.error('Error fetching researchers for research platform:', error);
    return NextResponse.json(
      { error: 'Failed to fetch researchers data', details: (error as Error).message },
      { status: 500 }
    );
  }
}

// Helper function to determine researcher level based on roadmap progress
function getRoadmapLevel(progress: number): 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' {
  if (progress >= 90) return 'Expert';
  if (progress >= 70) return 'Advanced';
  if (progress >= 40) return 'Intermediate';
  return 'Beginner';
} 