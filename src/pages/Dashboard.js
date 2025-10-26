import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { 
  Target, 
  Heart, 
  Trophy, 
  TrendingUp, 
  Calendar,
  Flame,
  CheckCircle,
  Clock,
  BarChart3,
  Plus,
  Edit,
  MoreVertical
} from 'lucide-react';
import { habitsAPI, moodsAPI, goalsAPI, analyticsAPI, aiAPI } from '../services/api';
import DataService from '../services/dataService';
import LoadingSpinner from '../components/LoadingSpinner';
import HabitCard from '../components/HabitCard';
import MoodTracker from '../components/MoodTracker';
import GoalProgress from '../components/GoalProgress';
import WeeklyChart from '../components/WeeklyChart';
import MotivationalMessage from '../components/MotivationalMessage';
import QuickStats from '../components/QuickStats';
import CreateHabitModal from '../components/CreateHabitModal';
import EditHabitModal from '../components/EditHabitModal';
import GoalModal from '../components/GoalModal';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [showCreateHabitModal, setShowCreateHabitModal] = useState(false);
  const [showEditHabitModal, setShowEditHabitModal] = useState(false);
  const [showCreateGoalModal, setShowCreateGoalModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const queryClient = useQueryClient();

  const { data: todayHabits, isLoading: habitsLoading } = useQuery(
    DataService.QUERY_KEYS.TODAY_HABITS,
    () => habitsAPI.getTodayHabits(),
    { 
      refetchInterval: 30000, 
      select: DataService.transformHabitData
    }
  );

  const { data: recentMoods, isLoading: moodsLoading } = useQuery(
    DataService.QUERY_KEYS.RECENT_MOODS,
    () => moodsAPI.getMoods({ limit: 7 }),
    {
      select: DataService.transformMoodData
    }
  );

  const { data: activeGoals, isLoading: goalsLoading } = useQuery(
    DataService.QUERY_KEYS.ACTIVE_GOALS,
    () => goalsAPI.getGoals({ status: 'active' }),
    { 
      select: DataService.transformGoalData,
      retry: 1
    }
  );

  const { data: dashboardAnalytics, isLoading: analyticsLoading } = useQuery(
    DataService.QUERY_KEYS.DASHBOARD_ANALYTICS,
    () => analyticsAPI.getDashboard({ days: 7 }),
    { 
      select: DataService.transformAnalyticsData,
      retry: 1
    }
  );

  const { data: motivation, isLoading: motivationLoading } = useQuery(
    DataService.QUERY_KEYS.MOTIVATION,
    () => aiAPI.getMotivation()
  );


  const isLoading = habitsLoading || moodsLoading || goalsLoading || analyticsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Calculate consistent stats using DataService
  const habitStats = DataService.calculateHabitStats(todayHabits || []);
  const { completedToday, totalHabits, completionRate } = habitStats;

  const handleEditHabit = (habit) => {
    setSelectedHabit(habit);
    setShowEditHabitModal(true);
  };

  const handleEditSuccess = () => {
    DataService.invalidateHabitQueries(queryClient);
    setShowEditHabitModal(false);
    setSelectedHabit(null);
    toast.success('Habit updated successfully! 🎉');
  };

  const handleDeleteHabit = (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      habitsAPI.deleteHabit(habitId)
        .then(() => {
          DataService.invalidateHabitQueries(queryClient);
          toast.success('Habit deleted successfully');
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || 'Failed to delete habit');
        });
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-primary-100">
          {completedToday > 0 
            ? `Great job completing ${completedToday} habit${completedToday > 1 ? 's' : ''} today!`
            : "Ready to make today amazing? Let's start with your habits!"
          }
        </p>
      </div>

      {/* Quick Stats */}
      <QuickStats 
        completedToday={completedToday}
        totalHabits={totalHabits}
        completionRate={completionRate}
        analytics={dashboardAnalytics}
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Habit Streak</h3>
                <p className="text-2xl font-bold text-orange-600">
                  {todayHabits?.reduce((max, habit) => Math.max(max, habit.streak?.current || 0), 0) || 0}
                </p>
                <p className="text-xs text-gray-500">days</p>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Completion Rate</h3>
                <p className="text-2xl font-bold text-green-600">{completionRate}%</p>
                <p className="text-xs text-gray-500">today</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Total Habits</h3>
                <p className="text-2xl font-bold text-blue-600">{totalHabits}</p>
                <p className="text-xs text-gray-500">active</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      {motivation?.data && (
        <MotivationalMessage motivation={motivation.data} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Habits */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-primary-500" />
                    Today's Habits
                  </h2>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">Completed</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <span className="text-xs text-gray-500">Pending</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {completedToday}/{totalHabits}
                    </div>
                    <div className="text-xs text-gray-500">completed</div>
                  </div>
                  <button
                    onClick={() => setShowCreateHabitModal(true)}
                    className="btn btn-primary btn-sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Habit
                  </button>
                </div>
              </div>
              
              {/* Progress Bar */}
              {totalHabits > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            <div className="card-content">
                  {todayHabits?.length > 0 ? (
                    <div className="space-y-3">
                      {todayHabits.map((habit) => (
                    <HabitCard 
                      key={habit._id} 
                      habit={habit} 
                      onEdit={handleEditHabit}
                      onDelete={handleDeleteHabit}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No habits yet</h3>
                  <p className="text-gray-500 mb-4">Start building healthy habits today!</p>
                  <button 
                    onClick={() => setShowCreateHabitModal(true)}
                    className="btn btn-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Habit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-500" />
                Recent Activity
              </h3>
            </div>
            <div className="card-content">
                  {todayHabits?.filter(habit => habit.isCompletedToday).length > 0 ? (
                    <div className="space-y-3">
                      {todayHabits
                        .filter(habit => habit.isCompletedToday)
                        .slice(0, 3)
                        .map((habit) => (
                      <div key={habit._id} className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {habit.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Completed {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className="text-lg">{habit.icon}</span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No recent activity</p>
                  <p className="text-xs text-gray-400">Complete some habits to see activity here</p>
                </div>
              )}
            </div>
          </div>

          {/* Mood Tracker */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-red-500" />
                How are you feeling?
              </h3>
            </div>
              <div className="card-content">
                <MoodTracker recentMoods={recentMoods || []} />
              </div>
          </div>

          {/* Active Goals */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                Active Goals
              </h3>
            </div>
            <div className="card-content">
              {activeGoals && activeGoals.length > 0 ? (
                <div className="space-y-3">
                  {activeGoals.slice(0, 3).map((goal) => (
                    <GoalProgress key={goal._id} goal={goal} />
                  ))}
                  {activeGoals.length > 3 && (
                    <button className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium">
                      View all {activeGoals.length} goals
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No active goals</h3>
                  <p className="text-sm text-gray-500 mb-4">Create your first goal to get started!</p>
                  <button 
                    onClick={() => setShowCreateGoalModal(true)}
                    className="btn btn-primary btn-sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Goal
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-green-500" />
                Weekly Progress
              </h3>
            </div>
            <div className="card-content">
              {dashboardAnalytics?.weeklyTrends && dashboardAnalytics.weeklyTrends.length > 0 ? (
                <WeeklyChart data={dashboardAnalytics.weeklyTrends} />
              ) : totalHabits > 0 ? (
                <div className="space-y-4">
                  {/* Simple Progress Overview */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{completedToday}</div>
                      <div className="text-xs text-blue-500">Completed Today</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{totalHabits}</div>
                      <div className="text-xs text-green-500">Total Habits</div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Today's Progress</span>
                      <span>{completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <button 
                      onClick={() => window.location.href = '/analytics'}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      View Detailed Analytics →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No data available yet</h3>
                  <p className="text-sm text-gray-500 mb-4">Start tracking habits to see your progress!</p>
                  <button 
                    onClick={() => window.location.href = '/habits'}
                    className="btn btn-primary btn-sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Start Tracking
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      {dashboardAnalytics?.insights && dashboardAnalytics.insights.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
              Insights & Recommendations
            </h3>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardAnalytics.insights.map((insight, index) => (
                <div key={index} className="insight-card insight-info">
                  <p className="text-sm text-gray-700">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Habit Modal */}
      {showCreateHabitModal && (
        <CreateHabitModal
          onClose={() => setShowCreateHabitModal(false)}
              onSuccess={() => {
                DataService.invalidateHabitQueries(queryClient);
                toast.success('Habit created successfully! 🎉');
                setShowCreateHabitModal(false);
              }}
        />
      )}

      {/* Edit Habit Modal */}
      {showEditHabitModal && selectedHabit && (
        <EditHabitModal
          habit={selectedHabit}
          onClose={() => {
            setShowEditHabitModal(false);
            setSelectedHabit(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Create Goal Modal */}
      {showCreateGoalModal && (
        <GoalModal
          onClose={() => setShowCreateGoalModal(false)}
          onSuccess={() => {
            DataService.invalidateGoalQueries(queryClient);
            toast.success('Goal created successfully! 🎉');
            setShowCreateGoalModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
