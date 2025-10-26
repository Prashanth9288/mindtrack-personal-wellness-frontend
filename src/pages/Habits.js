import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Plus, Filter, Search, Target, Flame, Calendar, BarChart3 } from 'lucide-react';
import { habitsAPI } from '../services/api';
import DataService from '../services/dataService';
import LoadingSpinner from '../components/LoadingSpinner';
import HabitCard from '../components/HabitCard';
import CreateHabitModal from '../components/CreateHabitModal';
import EditHabitModal from '../components/EditHabitModal';
import HabitAnalytics from '../components/HabitAnalytics';
import toast from 'react-hot-toast';

const Habits = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    isActive: true,
    search: ''
  });
  const [view, setView] = useState('grid'); // grid, list, analytics

  const queryClient = useQueryClient();

  const { data: habits, isLoading } = useQuery(
    [DataService.QUERY_KEYS.HABITS, filters],
    () => habitsAPI.getHabits(filters),
    { 
      keepPreviousData: true,
      select: DataService.transformHabitData
    }
  );

  const deleteMutation = useMutation(
    (id) => habitsAPI.deleteHabit(id),
    {
      onSuccess: () => {
        DataService.invalidateHabitQueries(queryClient);
        toast.success('Habit deleted successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete habit');
      },
    }
  );

  const toggleActiveMutation = useMutation(
    ({ id, isActive }) => habitsAPI.updateHabit(id, { isActive }),
    {
      onSuccess: () => {
        DataService.invalidateHabitQueries(queryClient);
        toast.success('Habit status updated');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update habit');
      },
    }
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleActive = (id, isActive) => {
    toggleActiveMutation.mutate({ id, isActive: !isActive });
  };

  const handleEdit = (habit) => {
    setSelectedHabit(habit);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    queryClient.invalidateQueries('habits');
    queryClient.invalidateQueries('todayHabits');
    setShowEditModal(false);
    setSelectedHabit(null);
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'health', label: 'Health' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'mindfulness', label: 'Mindfulness' },
    { value: 'learning', label: 'Learning' },
    { value: 'productivity', label: 'Productivity' },
    { value: 'social', label: 'Social' },
    { value: 'other', label: 'Other' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Habits</h1>
          <p className="mt-1 text-sm text-gray-500">
            Build and track your daily habits for a better life
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => setView('analytics')}
            className={`btn btn-outline btn-sm ${
              view === 'analytics' ? 'bg-primary-50 text-primary-700 border-primary-200' : ''
            }`}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary btn-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Habit
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-content">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search habits..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="input pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="input"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              <select
                value={filters.isActive}
                onChange={(e) => setFilters({ ...filters, isActive: e.target.value === 'true' })}
                className="input"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics View */}
      {view === 'analytics' && selectedHabit ? (
        <HabitAnalytics habit={selectedHabit} onClose={() => setSelectedHabit(null)} />
      ) : view === 'analytics' ? (
        <div className="card">
          <div className="card-content text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a habit to view analytics</h3>
            <p className="text-gray-500">Choose a habit from the list below to see detailed analytics and insights.</p>
          </div>
        </div>
      ) : (
        /* Habits Grid/List */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits?.length > 0 ? (
            habits.map((habit) => (
              <HabitCard 
                key={habit._id} 
                habit={habit} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="col-span-full">
              <div className="card text-center py-12">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No habits found</h3>
                <p className="text-gray-500 mb-6">
                  {filters.search || filters.category !== '' 
                    ? 'Try adjusting your filters or search terms.'
                    : 'Start building healthy habits today!'
                  }
                </p>
                {!filters.search && filters.category === '' && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn btn-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Habit
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Habit Modal */}
      {showCreateModal && (
        <CreateHabitModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            DataService.invalidateHabitQueries(queryClient);
          }}
        />
      )}

      {/* Edit Habit Modal */}
      {showEditModal && selectedHabit && (
        <EditHabitModal
          habit={selectedHabit}
          onClose={() => {
            setShowEditModal(false);
            setSelectedHabit(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default Habits;
