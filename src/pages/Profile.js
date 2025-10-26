import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Settings, Bell, Palette, Shield, Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    setValue
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      preferences: {
        theme: user?.preferences?.theme || 'light',
        notifications: {
          email: user?.preferences?.notifications?.email ?? true,
          push: user?.preferences?.notifications?.push ?? true,
          reminderTime: user?.preferences?.notifications?.reminderTime || '09:00'
        }
      }
    }
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword
  } = useForm();

  const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  const onProfileSubmit = async (data) => {
    setIsUpdating(true);
    try {
      const result = await updateProfile(data);
      if (result.success) {
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setIsChangingPassword(true);
    try {
      const result = await changePassword(data.currentPassword, data.newPassword);
      if (result.success) {
        toast.success('Password changed successfully!');
        resetPassword();
      }
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-content">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium text-lg">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">{user?.name}</h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className={`h-4 w-4 mr-3 ${
                      activeTab === tab.id
                        ? 'text-primary-700 !important'
                        : 'text-gray-600 !important'
                    }`} style={{
                      color: activeTab === tab.id ? '#1d4ed8' : '#4b5563'
                    }} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">General Information</h3>
              </div>
              <div className="card-content">
                <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-6">
                  <div>
                    <label className="label">Full Name</label>
                    <input
                      {...registerProfile('name', { required: 'Name is required' })}
                      type="text"
                      className="input"
                      placeholder="Enter your full name"
                    />
                    {profileErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{profileErrors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="label">Email Address</label>
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="input bg-gray-50"
                    />
                    <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="btn btn-primary"
                    >
                      {isUpdating ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
              </div>
              <div className="card-content">
                <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                        <p className="text-sm text-gray-500">Receive updates via email</p>
                      </div>
                      <input
                        {...registerProfile('preferences.notifications.email')}
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                        <p className="text-sm text-gray-500">Receive push notifications</p>
                      </div>
                      <input
                        {...registerProfile('preferences.notifications.push')}
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="label">Daily Reminder Time</label>
                      <input
                        {...registerProfile('preferences.notifications.reminderTime')}
                        type="time"
                        className="input"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="btn btn-primary"
                    >
                      {isUpdating ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Appearance Settings</h3>
              </div>
              <div className="card-content">
                <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-6">
                  <div>
                    <label className="label">Theme</label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          {...registerProfile('preferences.theme')}
                          type="radio"
                          value="light"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">Light</div>
                          <div className="text-sm text-gray-500">Clean and bright interface</div>
                        </div>
                      </label>
                      <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          {...registerProfile('preferences.theme')}
                          type="radio"
                          value="dark"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">Dark</div>
                          <div className="text-sm text-gray-500">Easy on the eyes</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="btn btn-primary"
                    >
                      {isUpdating ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
              </div>
              <div className="card-content">
                <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-6">
                  <div>
                    <label className="label">Current Password</label>
                    <input
                      {...registerPassword('currentPassword', { required: 'Current password is required' })}
                      type="password"
                      className="input"
                      placeholder="Enter your current password"
                    />
                    {passwordErrors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="label">New Password</label>
                    <input
                      {...registerPassword('newPassword', { 
                        required: 'New password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                      })}
                      type="password"
                      className="input"
                      placeholder="Enter your new password"
                    />
                    {passwordErrors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="label">Confirm New Password</label>
                    <input
                      {...registerPassword('confirmPassword', { 
                        required: 'Please confirm your new password',
                        validate: (value, formValues) => 
                          value === formValues.newPassword || 'Passwords do not match'
                      })}
                      type="password"
                      className="input"
                      placeholder="Confirm your new password"
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className="btn btn-primary"
                    >
                      {isChangingPassword ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Change Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
