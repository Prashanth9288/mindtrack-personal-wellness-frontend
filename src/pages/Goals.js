import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Trophy, Plus, Target, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import { goalsAPI } from '../services/api';
import DataService from '../services/dataService';
import LoadingSpinner from '../components/LoadingSpinner';
import GoalCard from '../components/GoalCard';
import GoalModal from '../components/GoalModal';
import UpdateProgressModal from '../components/UpdateProgressModal';
import GoalAnalytics from '../components/GoalAnalytics';
import toast from 'react-hot-toast';

const Goals = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUpdateProgressModal, setShowUpdateProgressModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);
  const [filters, setFilters] = useState({
    status: 'active',
    category: '',
    search: ''
  });
  const [view, setView] = useState('grid'); // grid, list, analytics

  const queryClient = useQueryClient();

  const { data: goals, isLoading } = useQuery(
    [DataService.QUERY_KEYS.GOALS, filters],
    () => goalsAPI.getGoals(filters),
    { 
      keepPreviousData: true,
      select: DataService.transformGoalData
    }
  );

  const { data: overview, isLoading: overviewLoading } = useQuery(
    'goalsOverview',
    () => goalsAPI.getGoalsOverview()
  );

  const deleteMutation = useMutation(
    (id) => goalsAPI.deleteGoal(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('goals');
        queryClient.invalidateQueries('goalsOverview');
        toast.success('Goal deleted successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete goal');
      },
    }
  );

  const updateStatusMutation = useMutation(
    ({ id, status }) => goalsAPI.updateGoal(id, { status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('goals');
        queryClient.invalidateQueries('goalsOverview');
        toast.success('Goal status updated');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update goal');
      },
    }
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleStatusChange = (id, status) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setShowEditModal(true);
  };

  const handleUpdateProgress = (goal) => {
    setSelectedGoal(goal);
    setShowUpdateProgressModal(true);
  };

  const handleEditSuccess = () => {
    queryClient.invalidateQueries('goals');
    queryClient.invalidateQueries('goalsOverview');
    setShowEditModal(false);
    setEditingGoal(null);
    toast.success('Goal updated successfully! 🎉');
  };

  const handleUpdateProgressSuccess = () => {
    DataService.invalidateGoalQueries(queryClient);
    setShowUpdateProgressModal(false);
    setSelectedGoal(null);
    toast.success('Progress updated successfully! 🎉');
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'health', label: 'Health' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'career', label: 'Career' },
    { value: 'education', label: 'Education' },
    { value: 'personal', label: 'Personal' },
    { value: 'financial', label: 'Financial' },
    { value: 'social', label: 'Social' },
    { value: 'other', label: 'Other' }
  ];

  const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
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
          <h1 className="text-2xl font-bold text-gray-900">Goals</h1>
          <p className="mt-1 text-sm text-gray-500">
            Set and track your personal goals and achievements
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
            New Goal
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      {overview?.data && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100">
                <Trophy className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Goals</p>
                <p className="text-2xl font-bold text-gray-900">{overview.data.total}</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{overview.data.active}</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-yellow-100">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{overview.data.completed}</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-red-100">
                <Calendar className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">{overview.data.overdue}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="card-content">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search goals..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="input"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="input"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
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
            </div>
          </div>
        </div>
      </div>

      {/* Analytics View */}
      {view === 'analytics' && selectedGoal ? (
        <GoalAnalytics goal={selectedGoal} onClose={() => setSelectedGoal(null)} />
      ) : view === 'analytics' ? (
        <div className="card">
          <div className="card-content text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a goal to view analytics</h3>
            <p className="text-gray-500">Choose a goal from the list below to see detailed analytics and progress.</p>
          </div>
        </div>
      ) : (
        /* Goals Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals?.length > 0 ? (
            goals.map((goal) => (
              <GoalCard 
                key={goal._id} 
                goal={goal}
                onViewAnalytics={() => setSelectedGoal(goal)}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onUpdateProgress={handleUpdateProgress}
                onEdit={handleEdit}
              />
            ))
          ) : (
            <div className="col-span-full">
              <div className="card text-center py-12">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No goals found</h3>
                <p className="text-gray-500 mb-6">
                  {filters.search || filters.category !== '' || filters.status !== 'active'
                    ? 'Try adjusting your filters or search terms.'
                    : 'Start setting goals to achieve your dreams!'
                  }
                </p>
                {!filters.search && filters.category === '' && filters.status === 'active' && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn btn-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Goal
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Goal Modal (Create/Edit) */}
      {(showCreateModal || (showEditModal && editingGoal)) && (
        <GoalModal
          goal={showEditModal ? editingGoal : null}
          onClose={() => {
            setShowCreateModal(false);
            setShowEditModal(false);
            setEditingGoal(null);
          }}
          onSuccess={() => {
            setShowCreateModal(false);
            setShowEditModal(false);
            setEditingGoal(null);
            DataService.invalidateGoalQueries(queryClient);
          }}
        />
      )}

      {/* Update Progress Modal */}
      {showUpdateProgressModal && selectedGoal && (
        <UpdateProgressModal
          goal={selectedGoal}
          onClose={() => {
            setShowUpdateProgressModal(false);
            setSelectedGoal(null);
          }}
          onSuccess={handleUpdateProgressSuccess}
        />
      )}
    </div>
  );
};

export default Goals;
