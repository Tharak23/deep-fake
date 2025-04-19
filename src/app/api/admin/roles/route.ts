import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Default role permissions
const defaultRolePermissions = {
  'regular_user': {
    label: 'Regular User',
    permissions: {
      read_blogs: true,
      comment_blogs: true,
      like_blogs: true,
      view_datasets: false,
      download_datasets: false,
      upload_datasets: false,
      create_blogs: false,
      edit_own_blogs: false,
      access_research_tools: false
    }
  },
  'verified_researcher': {
    label: 'Verified Researcher',
    permissions: {
      read_blogs: true,
      comment_blogs: true,
      like_blogs: true,
      view_datasets: true,
      download_datasets: true,
      upload_datasets: true,
      create_blogs: true,
      edit_own_blogs: true,
      access_research_tools: true
    }
  },
  'admin': {
    label: 'Administrator',
    permissions: {
      read_blogs: true,
      comment_blogs: true,
      like_blogs: true,
      view_datasets: true,
      download_datasets: true,
      upload_datasets: true,
      create_blogs: true,
      edit_own_blogs: true,
      access_research_tools: true,
      manage_users: true,
      manage_permissions: true,
      delete_any_content: true
    }
  }
};

// In a real application, these would be stored in a database
// For now, we'll use this variable to simulate persistence
export let rolePermissions = { ...defaultRolePermissions };

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    // In a real app, you would fetch from database
    // For now, return the in-memory permissions
    return NextResponse.json({ roles: rolePermissions });
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch role permissions' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const data = await request.json();
    const { role, permissions } = data;
    
    if (!role || !permissions || !rolePermissions[role]) {
      return NextResponse.json(
        { error: 'Invalid role or permissions data' },
        { status: 400 }
      );
    }
    
    // Update the role permissions
    rolePermissions[role].permissions = permissions;
    
    // In a real app, you would save to database here
    
    return NextResponse.json({ 
      success: true,
      message: 'Role permissions updated successfully',
      roles: rolePermissions
    });
  } catch (error) {
    console.error('Error updating role permissions:', error);
    return NextResponse.json(
      { error: 'Failed to update role permissions' },
      { status: 500 }
    );
  }
} 