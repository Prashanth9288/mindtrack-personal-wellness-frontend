import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { BarChart3, TrendingUp, Target, Heart, Calendar, Zap } from 'lucide-react';
import { analyticsAPI, aiAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import AnalyticsChart from '../components/AnalyticsChart';
import InsightsCard from '../components/InsightsCard';
import TrendAnalysis from '../components/TrendAnalysis';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30'); // 7, 30, 90 days
  const [activeTab, setActiveTab] = useState('overview');

  const { data: dashboardData, isLoading: dashboardLoading } = useQuery(
    ['dashboardAnalytics', timeRange],
    () => analyticsAPI.getDashboard({ days: parseInt(timeRange) }),
    { 
      keepPreviousData: true,
      select: (data) => data?.data || data,
      retry: 1
    }
  );

  const { data: trendsData, isLoading: trendsLoading } = useQuery(
    ['trends', timeRange],
    () => analyticsAPI.getTrends({ days: parseInt(timeRange) }),
    { 
      keepPreviousData: true,
      select: (data) => data?.data || data,
      retry: 1
    }
  );

  const { data: insightsData, isLoading: insightsLoading } = useQuery(
    ['insights', timeRange],
    () => analyticsAPI.getInsights({ days: parseInt(timeRange) }),
    { 
      keepPreviousData: true,
      select: (data) => data?.data || data,
      retry: 1
    }
  );

  const { data: motivationData } = useQuery(
    'motivation',
    () => aiAPI.getMotivation()
  );

  const isLoading = dashboardLoading || trendsLoading || insightsLoading;

  // Debug logging
  console.log('Analytics Debug:', {
    activeTab,
    dashboardData,
    trendsData,
    insightsData,
    motivationData
  });

  // Additional debugging for object rendering issues
  if (motivationData?.data) {
    console.log('MotivationData structure:', {
      type: typeof motivationData.data,
      isArray: Array.isArray(motivationData.data),
      hasMessages: motivationData.data.messages ? true : false,
      keys: Object.keys(motivationData.data)
    });
  }

  // Handle tab changes
  useEffect(() => {
    console.log(`Analytics tab changed to: ${activeTab}`);
  }, [activeTab]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'habits', label: 'Habits', icon: Target },
    { id: 'moods', label: 'Moods', icon: Heart },
    { id: 'goals', label: 'Goals', icon: TrendingUp },
    { id: 'insights', label: 'Insights', icon: Zap }
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
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Deep insights into your wellness journey
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            console.log(`Analytics Tab ${tab.id}: isActive=${isActive}, activeTab=${activeTab}`);
            return (
              <button
                key={tab.id}
                onClick={() => {
                  console.log(`Clicking Analytics tab: ${tab.id}`);
                  setActiveTab(tab.id);
                  // Force a small delay to ensure state update
                  setTimeout(() => {
                    console.log(`Tab state after click: ${tab.id}`);
                  }, 100);
                }}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  isActive
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className={`h-4 w-4 mr-2 ${
                  isActive
                    ? 'text-primary-600 !important'
                    : 'text-gray-500 !important'
                }`} style={{
                  color: isActive ? '#2563eb' : '#6b7280'
                }} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="stat-card">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Habit Completion</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData?.habits?.completionRate || dashboardData?.completionRate || 0}%
                  </p>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average Mood</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData?.data?.moods?.averageMood || 0}/5
                  </p>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-yellow-100">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Goal Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData?.data?.goals?.averageProgress || 0}%
                  </p>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-100">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Days Tracked</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardData?.data?.moods?.totalEntries || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Trends Chart */}
          {dashboardData?.data?.weeklyTrends && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Weekly Progress</h3>
              </div>
              <div className="card-content">
                <AnalyticsChart data={dashboardData.data.weeklyTrends} />
              </div>
            </div>
          )}

          {/* Insights */}
          {dashboardData?.data?.insights && dashboardData.data.insights.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Key Insights</h3>
              </div>
              <div className="card-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dashboardData.data.insights.map((insight, index) => (
                    <div key={index} className="insight-card insight-info">
                      <p className="text-sm text-gray-700">
                        {typeof insight === 'string' ? insight : JSON.stringify(insight)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Habits Tab */}
      {activeTab === 'habits' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Habit Performance</h3>
            </div>
            <div className="card-content">
              {trendsData?.habits && trendsData.habits.length > 0 ? (
                <div className="space-y-4">
                  {trendsData.habits.map((habit) => (
                    <div key={habit.habitId || habit._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{habit.habitName || habit.name}</h4>
                        <span className="text-sm text-gray-500 capitalize">{habit.category}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Current Streak: {habit.currentStreak || 0} days</span>
                        <span>Longest Streak: {habit.longestStreak || 0} days</span>
                        <span>Completion Rate: {habit.completionRate || 0}%</span>
                      </div>
                      <div className="mt-2">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${habit.completionRate || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No habit data available</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Start tracking habits to see your performance analytics here.
                  </p>
                  <button 
                    onClick={() => window.location.href = '/habits'}
                    className="btn btn-primary btn-sm"
                  >
                    Go to Habits
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Habit Trends Chart */}
          {trendsData?.habits && trendsData.habits.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Habit Trends</h3>
              </div>
              <div className="card-content">
                <AnalyticsChart 
                  data={trendsData.habits} 
                  type="habits" 
                  timeRange={timeRange}
                />
              </div>
            </div>
          )}

          {/* Habit Insights */}
          {insightsData?.habits && insightsData.habits.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Habit Insights</h3>
              </div>
              <div className="card-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {insightsData.habits.map((insight, index) => (
                    <div key={index} className="insight-card insight-info">
                      <p className="text-sm text-gray-700">
                        {typeof insight === 'string' ? insight : JSON.stringify(insight)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Moods Tab */}
      {activeTab === 'moods' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Mood Trends</h3>
            </div>
            <div className="card-content">
              {trendsData?.moods && trendsData.moods.length > 0 ? (
                <TrendAnalysis data={trendsData.moods} />
              ) : (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No mood data available</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Start tracking your mood to see trends and insights here.
                  </p>
                  <button 
                    onClick={() => window.location.href = '/moods'}
                    className="btn btn-primary btn-sm"
                  >
                    Go to Moods
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mood Analytics */}
          {trendsData?.moods && trendsData.moods.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Mood Analytics</h3>
              </div>
              <div className="card-content">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {dashboardData?.moods?.averageMood || 0}
                    </div>
                    <div className="text-sm text-blue-500">Average Mood</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {trendsData.moods.filter(m => m.mood === 'happy' || m.mood === 'very-happy').length}
                    </div>
                    <div className="text-sm text-green-500">Happy Days</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {trendsData.moods.length}
                    </div>
                    <div className="text-sm text-purple-500">Total Entries</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Goals Tab */}
      {activeTab === 'goals' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Goal Progress</h3>
            </div>
            <div className="card-content">
              {trendsData?.goals && trendsData.goals.length > 0 ? (
                <div className="space-y-4">
                  {trendsData.goals.map((goal) => (
                    <div key={goal.goalId || goal._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{goal.title || goal.goalName}</h4>
                        <span className="text-sm text-gray-500 capitalize">{goal.category}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Progress: {goal.progressPercentage || goal.progress || 0}%</span>
                        <span className={`badge ${
                          goal.status === 'completed' ? 'badge-success' :
                          goal.status === 'active' ? 'badge-primary' :
                          'badge-warning'
                        }`}>
                          {goal.status}
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${goal.progressPercentage || goal.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No goal data available</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Create goals to track your progress and see analytics here.
                  </p>
                  <button 
                    onClick={() => window.location.href = '/goals'}
                    className="btn btn-primary btn-sm"
                  >
                    Go to Goals
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Goal Trends Chart */}
          {trendsData?.goals && trendsData.goals.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Goal Trends</h3>
              </div>
              <div className="card-content">
                <AnalyticsChart 
                  data={trendsData.goals} 
                  type="goals" 
                  timeRange={timeRange}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          {insightsData && (insightsData.length > 0 || Object.keys(insightsData).length > 0) ? (
            <InsightsCard insights={insightsData} />
          ) : (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Personalized Insights</h3>
              </div>
              <div className="card-content">
                <div className="text-center py-8">
                  <Zap className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No insights available yet</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Keep tracking your habits, moods, and goals to get personalized insights.
                  </p>
                  <div className="flex space-x-3 justify-center">
                    <button 
                      onClick={() => window.location.href = '/habits'}
                      className="btn btn-primary btn-sm"
                    >
                      Track Habits
                    </button>
                    <button 
                      onClick={() => window.location.href = '/moods'}
                      className="btn btn-secondary btn-sm"
                    >
                      Track Moods
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Motivational Messages */}
          {motivationData?.data && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">Daily Motivation</h3>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  {Array.isArray(motivationData.data) ? (
                    motivationData.data.map((message, index) => (
                      <div key={index} className="insight-card insight-positive">
                        <div className="flex items-start">
                          <span className="text-2xl mr-3">{message.emoji || '💡'}</span>
                          <div>
                            <p className="font-medium text-gray-900">{message.message || message}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {message.type === 'streak' && 'Keep up the great work!'}
                              {message.type === 'progress' && 'You\'re making excellent progress!'}
                              {message.type === 'mood' && 'Your positive energy is inspiring!'}
                              {message.type === 'daily' && 'Every small step counts!'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : motivationData.data && motivationData.data.messages ? (
                    motivationData.data.messages.map((message, index) => (
                      <div key={index} className="insight-card insight-positive">
                        <div className="flex items-start">
                          <span className="text-2xl mr-3">{message.emoji || '💡'}</span>
                          <div>
                            <p className="font-medium text-gray-900">{message.message || message}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {message.type === 'streak' && 'Keep up the great work!'}
                              {message.type === 'progress' && 'You\'re making excellent progress!'}
                              {message.type === 'mood' && 'Your positive energy is inspiring!'}
                              {message.type === 'daily' && 'Every small step counts!'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="insight-card insight-positive">
                      <div className="flex items-start">
                        <span className="text-2xl mr-3">💡</span>
                        <div>
                          <p className="font-medium text-gray-900">
                            {typeof motivationData.data === 'string' ? motivationData.data : 'Stay motivated and keep building great habits!'}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">Every small step counts!</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Analytics;
