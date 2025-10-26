import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Heart, Plus, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import { moodsAPI } from '../services/api';
import DataService from '../services/dataService';
import LoadingSpinner from '../components/LoadingSpinner';
import MoodEntry from '../components/MoodEntry';
import MoodCalendar from '../components/MoodCalendar';
import MoodAnalytics from '../components/MoodAnalytics';
import MoodEntryModal from '../components/MoodEntryModal';
import toast from 'react-hot-toast';

const Moods = () => {
  const [view, setView] = useState('list'); // list, calendar, analytics
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const queryClient = useQueryClient();

  const { data: moods, isLoading } = useQuery(
    DataService.QUERY_KEYS.MOODS,
    () => moodsAPI.getMoods({ limit: 30 }),
    { 
      keepPreviousData: true,
      select: DataService.transformMoodData
    }
  );

  const { data: moodTrends, isLoading: trendsLoading } = useQuery(
    'moodTrends',
    () => moodsAPI.getMoodTrends({ days: 30 }),
    { enabled: view === 'analytics' }
  );

  const deleteMutation = useMutation(
    (id) => moodsAPI.deleteMood(id),
    {
      onSuccess: () => {
        DataService.invalidateMoodQueries(queryClient);
        queryClient.invalidateQueries('moodTrends');
        toast.success('Mood entry deleted');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete mood entry');
      },
    }
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this mood entry?')) {
      deleteMutation.mutate(id);
    }
  };

  const moodStats = moods?.data ? {
    total: moods.data.length,
    average: Math.round(moods.data.reduce((sum, mood) => sum + mood.moodScore, 0) / moods.data.length * 10) / 10,
    happy: moods.data.filter(m => m.mood === 'happy' || m.mood === 'very-happy').length,
    neutral: moods.data.filter(m => m.mood === 'neutral').length,
    sad: moods.data.filter(m => m.mood === 'sad' || m.mood === 'very-sad').length
  } : null;

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
          <h1 className="text-2xl font-bold text-gray-900">Mood Tracking</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your emotional well-being and discover patterns
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                view === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                view === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setView('analytics')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                view === 'analytics' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Analytics
            </button>
          </div>
          <button
            onClick={() => setShowEntryModal(true)}
            className="btn btn-primary btn-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Entry
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      {moodStats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-blue-100">
                <Heart className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Entries</p>
                <p className="text-2xl font-bold text-gray-900">{moodStats.total}</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-green-100">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Average Mood</p>
                <p className="text-2xl font-bold text-gray-900">{moodStats.average}/5</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-yellow-100">
                <span className="text-2xl">😊</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Happy Days</p>
                <p className="text-2xl font-bold text-gray-900">{moodStats.happy}</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-red-100">
                <span className="text-2xl">😢</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Sad Days</p>
                <p className="text-2xl font-bold text-gray-900">{moodStats.sad}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content based on view */}
      {view === 'list' && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Recent Mood Entries</h3>
          </div>
          <div className="card-content">
            {moods?.length > 0 ? (
              <div className="space-y-4">
                {moods.map((mood) => (
                  <MoodEntry 
                    key={mood._id} 
                    mood={mood} 
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No mood entries yet</h3>
                <p className="text-gray-500 mb-6">Start tracking your mood to see patterns and insights.</p>
                <button
                  onClick={() => setShowEntryModal(true)}
                  className="btn btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Entry
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'calendar' && (
        <MoodCalendar 
          moods={moods}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          onAddEntry={() => setShowEntryModal(true)}
        />
      )}

      {view === 'analytics' && (
        <MoodAnalytics 
          moods={moods}
          trends={moodTrends?.data}
          isLoading={trendsLoading}
        />
      )}

      {/* Add/Edit Mood Entry Modal */}
      {showEntryModal && (
        <MoodEntryModal
          onClose={() => setShowEntryModal(false)}
          onSuccess={() => {
            setShowEntryModal(false);
            DataService.invalidateMoodQueries(queryClient);
          }}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};

export default Moods;
