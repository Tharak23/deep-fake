import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Default role permissions (same as in the main roles route)
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

// Reference to the same variable used in the main roles route
// In a real app, this would be a database operation
import { rolePermissions } from '../route';

export async function POST() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    // Reset to default permissions
    // In a real app, this would update the database
    Object.keys(defaultRolePermissions).forEach(role => {
      rolePermissions[role] = { ...defaultRolePermissions[role] };
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Role permissions reset to default values',
      roles: rolePermissions
    });
  } catch (error) {
    console.error('Error resetting role permissions:', error);
    return NextResponse.json(
      { error: 'Failed to reset role permissions' },
      { status: 500 }
    );
  }
} 