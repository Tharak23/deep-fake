'use client';

import { useState, useEffect } from 'react';
import { 
  FiKey, 
  FiShield, 
  FiUser, 
  FiFileText, 
  FiDatabase,
  FiEdit,
  FiSave,
  FiRotateCcw,
  FiAlertTriangle,
  FiLoader
} from 'react-icons/fi';

// Default permissions as fallback if API fails
const defaultPermissions = {
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

type RolePermission = {
  [key: string]: boolean;
};

type RoleSettings = {
  label: string;
  permissions: RolePermission;
};

type RoleConfig = {
  [key: string]: RoleSettings;
};

const AccessControl = () => {
  const [roles, setRoles] = useState<RoleConfig>({});
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [editedPermissions, setEditedPermissions] = useState<RolePermission | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRolePermissions = async () => {
      setIsLoading(true);
      setErrorMessage('');
      
      try {
        // Fetch from the API
        const response = await fetch('/api/admin/roles');
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        const data = await response.json();
        if (data.roles) {
          setRoles(data.roles);
        } else {
          throw new Error('Invalid data format received from API');
        }
      } catch (error) {
        console.error('Error fetching role permissions:', error);
        setErrorMessage('Failed to load role permissions. Using default values.');
        setRoles(defaultPermissions);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRolePermissions();
  }, []);

  const handleEditRole = (roleKey: string) => {
    setEditingRole(roleKey);
    setEditedPermissions({ ...roles[roleKey].permissions });
  };

  const handleCancelEdit = () => {
    setEditingRole(null);
    setEditedPermissions(null);
  };

  const handleTogglePermission = (permission: string) => {
    if (!editedPermissions) return;
    
    setEditedPermissions({
      ...editedPermissions,
      [permission]: !editedPermissions[permission]
    });
  };

  const handleSavePermissions = async () => {
    if (!editingRole || !editedPermissions) return;
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      // Send to the API
      const response = await fetch(`/api/admin/roles`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: editingRole, permissions: editedPermissions })
      });
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Update local state with the response data
      if (data.roles) {
        setRoles(data.roles);
      }
      
      setEditingRole(null);
      setEditedPermissions(null);
      setSuccessMessage('Role permissions updated successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating role permissions:', error);
      setErrorMessage('Failed to update role permissions. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetToDefault = async () => {
    if (window.confirm('Are you sure you want to reset all permissions to default values? This cannot be undone.')) {
      setIsSubmitting(true);
      setErrorMessage('');
      
      try {
        // Send to the API
        const response = await fetch('/api/admin/roles/reset', { method: 'POST' });
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update local state with the response data
        if (data.roles) {
          setRoles(data.roles);
        }
        
        setSuccessMessage('All role permissions have been reset to default values.');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error resetting role permissions:', error);
        setErrorMessage('Failed to reset role permissions. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Group permissions by category for better organization
  const permissionCategories = {
    'Blogs': ['read_blogs', 'comment_blogs', 'like_blogs', 'create_blogs', 'edit_own_blogs'],
    'Datasets': ['view_datasets', 'download_datasets', 'upload_datasets'],
    'Research': ['access_research_tools'],
    'Admin': ['manage_users', 'manage_permissions', 'delete_any_content']
  };

  // Format permission name for display
  const formatPermissionName = (permission: string) => {
    return permission
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-12 flex flex-col items-center justify-center">
        <FiLoader className="animate-spin text-indigo-500 mb-4" size={32} />
        <p className="text-gray-400">Loading access control settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
        <h2 className="text-xl font-bold text-white flex items-center">
          <FiKey className="mr-2" size={20} />
          Access Control
        </h2>
        <p className="text-gray-400 mt-1">
          Manage role-based permissions and access control for different user types.
        </p>
      </div>
      
      {/* Success message */}
      {successMessage && (
        <div className="bg-green-900/30 border border-green-800 rounded-lg p-4 flex items-center text-green-400">
          <FiShield className="mr-2" size={18} />
          {successMessage}
        </div>
      )}
      
      {/* Error message */}
      {errorMessage && (
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 flex items-center text-red-400">
          <FiAlertTriangle className="mr-2" size={18} />
          {errorMessage}
        </div>
      )}
      
      {/* Role cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.keys(roles).map((roleKey) => (
          <div 
            key={roleKey}
            className={`bg-gray-900/50 border rounded-lg overflow-hidden ${
              editingRole === roleKey ? 'border-indigo-600' : 'border-gray-800'
            }`}
          >
            {/* Role header */}
            <div className={`p-4 flex justify-between items-center ${
              roleKey === 'admin' 
                ? 'bg-red-900/20 border-b border-red-900/30' 
                : roleKey === 'verified_researcher'
                ? 'bg-green-900/20 border-b border-green-900/30'
                : 'bg-gray-800/50 border-b border-gray-700'
            }`}>
              <div className="flex items-center">
                <div className={`p-2 rounded-md ${
                  roleKey === 'admin' 
                    ? 'bg-red-900/30' 
                    : roleKey === 'verified_researcher'
                    ? 'bg-green-900/30'
                    : 'bg-gray-700/30'
                }`}>
                  {roleKey === 'admin' ? (
                    <FiShield className="text-red-400" size={18} />
                  ) : roleKey === 'verified_researcher' ? (
                    <FiUser className="text-green-400" size={18} />
                  ) : (
                    <FiUser className="text-gray-400" size={18} />
                  )}
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-white">{roles[roleKey].label}</h3>
                  <div className="text-xs text-gray-400">
                    {Object.values(roles[roleKey].permissions).filter(Boolean).length} permissions
                  </div>
                </div>
              </div>
              
              {!editingRole && (
                <button
                  onClick={() => handleEditRole(roleKey)}
                  className={`p-1.5 rounded-md ${
                    roleKey === 'admin'
                      ? 'text-red-400 hover:bg-red-900/20'
                      : 'text-gray-400 hover:bg-gray-800'
                  }`}
                  aria-label={`Edit ${roles[roleKey].label} permissions`}
                >
                  <FiEdit size={16} />
                </button>
              )}
            </div>
            
            {/* Role permissions */}
            <div className="p-4">
              {editingRole === roleKey ? (
                // Editing mode
                <>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Edit Permissions</h4>
                    <p className="text-xs text-gray-500">Toggle permissions for this role. Changes will only be saved when you click the Save button.</p>
                  </div>
                  
                  {Object.entries(permissionCategories).map(([category, permissions]) => (
                    <div key={category} className="mb-4">
                      <h5 className="text-xs text-gray-400 uppercase tracking-wider mb-2">{category}</h5>
                      <div className="space-y-2">
                        {permissions.map((permission) => (
                          editedPermissions && permission in editedPermissions ? (
                            <div 
                              key={permission}
                              className="flex items-center justify-between p-2 rounded bg-gray-800/50 hover:bg-gray-800 transition-colors"
                            >
                              <span className="text-sm">{formatPermissionName(permission)}</span>
                              <button
                                onClick={() => handleTogglePermission(permission)}
                                className={`w-10 h-5 rounded-full flex items-center ${
                                  editedPermissions[permission] ? 'bg-green-600' : 'bg-gray-700'
                                } transition-colors`}
                                aria-label={`${editedPermissions[permission] ? 'Disable' : 'Enable'} ${formatPermissionName(permission)}`}
                              >
                                <span 
                                  className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                                    editedPermissions[permission] ? 'translate-x-5' : 'translate-x-1'
                                  }`} 
                                />
                              </button>
                            </div>
                          ) : null
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1.5 border border-gray-700 rounded text-sm text-gray-300 hover:bg-gray-800"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSavePermissions}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded text-sm text-white flex items-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <FiLoader className="animate-spin mr-2" size={14} />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FiSave className="mr-2" size={14} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                // View mode
                <div className="space-y-4">
                  {Object.entries(permissionCategories).map(([category, permissions]) => (
                    <div key={category}>
                      <h5 className="text-xs text-gray-400 uppercase tracking-wider mb-2">{category}</h5>
                      <div className="space-y-1">
                        {permissions.map((permission) => (
                          roles[roleKey].permissions[permission] !== undefined ? (
                            <div 
                              key={permission}
                              className="flex items-center text-sm"
                            >
                              <span className={`w-2 h-2 rounded-full mr-2 ${
                                roles[roleKey].permissions[permission] ? 'bg-green-500' : 'bg-red-500'
                              }`} />
                              <span className={
                                roles[roleKey].permissions[permission] ? 'text-gray-300' : 'text-gray-500'
                              }>
                                {formatPermissionName(permission)}
                              </span>
                            </div>
                          ) : null
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Reset button */}
      {!editingRole && (
        <div className="flex justify-end">
          <button
            onClick={resetToDefault}
            className="flex items-center px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-md text-sm transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FiLoader className="animate-spin mr-2" size={14} />
                Resetting...
              </>
            ) : (
              <>
                <FiRotateCcw className="mr-2" size={14} />
                Reset to Default
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AccessControl; 