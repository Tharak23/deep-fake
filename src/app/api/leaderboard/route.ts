import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

export async function GET(_request: NextRequest) {
  try {
    await dbConnect();
    
    // Get users who have completed registration
    const users = await User.find({ teamRegistered: true })
      .sort({ 'contributions.papers': -1 })
      .limit(10)
      .lean();
    
    // Format users for the leaderboard
    const formattedUsers = users.map((user, index) => ({
      id: user._id.toString(),
      name: user.name || 'Anonymous User',
      avatar: user.image,
      score: user.contributions?.papers.length + 
             user.contributions?.datasets.length + 
             user.contributions?.experiments.length || 0,
      change: 'none', // We would need to track changes over time
      badge: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : null
    }));
    
    // If we don't have enough real users, use placeholder data
    const placeholderUsers = [
      { id: '1', name: 'Dr. Sarah Chen', avatar: '/placeholders/team-member-1.jpg', score: 1250, change: 'up', badge: 'gold' },
      { id: '3', name: 'Dr. Aisha Patel', avatar: '/placeholders/team-member-3.jpg', score: 1120, change: 'up', badge: 'silver' },
      { id: '2', name: 'Prof. Michael Rodriguez', avatar: '/placeholders/team-member-2.jpg', score: 980, change: 'down', badge: 'bronze' },
      { id: '4', name: 'Dr. James Wilson', avatar: '/placeholders/team-member-4.jpg', score: 840, change: 'up', badge: null },
      { id: '5', name: 'Dr. Emily Zhang', avatar: '/placeholders/team-member-1.jpg', score: 720, change: 'down', badge: null },
    ];
    
    // Add placeholder users if needed
    if (formattedUsers.length < 5) {
      for (let i = formattedUsers.length; i < 5; i++) {
        formattedUsers.push(placeholderUsers[i]);
      }
    }
    
    // Create different categories
    const overall = [...formattedUsers].sort((a, b) => b.score - a.score);
    
    // For papers, datasets, and experiments, we would ideally have specific scores
    // For now, we'll use the same data with different sorting
    const papers = [...formattedUsers]
      .sort((a, b) => b.score - a.score)
      .map((user, index) => ({
        ...user,
        score: Math.floor(user.score / 3), // Simulate paper count
        badge: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : null
      }));
    
    const datasets = [...formattedUsers]
      .sort((a, b) => a.id.localeCompare(b.id)) // Different sorting for variety
      .map((user, index) => ({
        ...user,
        score: Math.floor(user.score / 4), // Simulate dataset count
        badge: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : null
      }));
    
    const experiments = [...formattedUsers]
      .sort((a, b) => b.name.localeCompare(a.name)) // Different sorting for variety
      .map((user, index) => ({
        ...user,
        score: Math.floor(user.score / 2), // Simulate experiment count
        badge: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : null
      }));
    
    return NextResponse.json({
      overall,
      papers,
      datasets,
      experiments
    });
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard data' },
      { status: 500 }
    );
  }
} 