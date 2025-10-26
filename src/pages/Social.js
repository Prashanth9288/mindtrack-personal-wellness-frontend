import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Trophy, Share2, BarChart3, Users, TrendingUp } from 'lucide-react';
import { socialAPI } from '../services/api';
import DataService from '../services/dataService';
import LoadingSpinner from '../components/LoadingSpinner';
import LeaderboardCard from '../components/LeaderboardCard';
import ShareProgressModal from '../components/ShareProgressModal';
import toast from 'react-hot-toast';

const Social = () => {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [showShareModal, setShowShareModal] = useState(false);

  const queryClient = useQueryClient();

  const { data: leaderboardData, isLoading: leaderboardLoading, error: leaderboardError } = useQuery(
    DataService.QUERY_KEYS.LEADERBOARD,
    () => socialAPI.getLeaderboard({ type: 'habits', period: 'week' }),
    { 
      retry: 1,
      refetchOnWindowFocus: false
    }
  );

  const { data: statsData, isLoading: statsLoading, error: statsError } = useQuery(
    DataService.QUERY_KEYS.SOCIAL_STATS,
    () => socialAPI.getSocialStats(),
    { 
      retry: 1,
      refetchOnWindowFocus: false
    }
  );

  const shareMutation = useMutation(
    (shareData) => socialAPI.shareProgress(shareData),
    {
      onSuccess: (data) => {
        // Open the share URL in a new window
        window.open(data.shareUrl, '_blank', 'width=600,height=400');
        toast.success(`Opening ${data.platform} to share your progress!`);
        setShowShareModal(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to share progress');
      },
    }
  );

  const handleShare = (shareData) => {
    shareMutation.mutate(shareData);
  };

  const tabs = [
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'stats', label: 'My Stats', icon: BarChart3 },
    { id: 'share', label: 'Share Progress', icon: Share2 },
  ];

  // Removed global loading state - each tab handles its own loading

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Social</h1>
          <p className="mt-1 text-sm text-gray-500">
            Connect with the community and share your progress
          </p>
        </div>
        <button
          onClick={() => setShowShareModal(true)}
          className="mt-4 sm:mt-0 btn btn-primary"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share Progress
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  isActive
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className={`h-4 w-4 mr-2 ${
                  isActive ? 'text-primary-600' : 'text-gray-500'
                }`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          {leaderboardLoading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : leaderboardError ? (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-500">Failed to load leaderboard data</p>
              <button 
                onClick={() => queryClient.invalidateQueries('leaderboard')}
                className="btn btn-primary btn-sm mt-4"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Habits Leaderboard */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                    Habits Leaderboard
                  </h3>
                </div>
                <div className="card-content">
                  {leaderboardData?.leaderboard && leaderboardData.leaderboard.length > 0 ? (
                    <div className="space-y-3">
                      {leaderboardData.leaderboard.slice(0, 10).map((entry, index) => (
                        <div key={entry.user._id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {entry.rank}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {entry.user.name || 'Anonymous User'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {entry.score} habits completed
                              </p>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="text-right">
                              <p className="text-sm font-bold text-primary-600">{entry.score}</p>
                              <p className="text-xs text-gray-500">points</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No leaderboard data available</p>
                      <p className="text-sm text-gray-400 mt-2">Start tracking habits to appear on the leaderboard!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Streaks Leaderboard */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                    Streaks Leaderboard
                  </h3>
                </div>
                <div className="card-content">
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Streak data coming soon!</p>
                    <p className="text-sm text-gray-400 mt-2">We're working on adding streak tracking to the leaderboard.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          {statsLoading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : statsError ? (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-500">Failed to load your stats</p>
              <button 
                onClick={() => queryClient.invalidateQueries('socialStats')}
                className="btn btn-primary btn-sm mt-4"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="stat-card">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <BarChart3 className="h-8 w-8 text-blue-500" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Habits</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {statsData?.totalHabits || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Trophy className="h-8 w-8 text-yellow-500" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Completed Today</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {statsData?.completedToday || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <TrendingUp className="h-8 w-8 text-green-500" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Current Streak</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {statsData?.currentStreak || 0} days
                      </p>
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-8 w-8 text-purple-500" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Goals Completed</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {statsData?.completedGoals || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Summary */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Your Progress Summary</h3>
                </div>
                <div className="card-content">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Habits Progress</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Habits Created</span>
                          <span className="font-medium">{statsData?.totalHabits || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Completed Today</span>
                          <span className="font-medium">{statsData?.completedToday || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Completed</span>
                          <span className="font-medium">{statsData?.totalHabitsCompleted || 0}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Goals Progress</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Goals</span>
                          <span className="font-medium">{statsData?.totalGoals || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Completed Goals</span>
                          <span className="font-medium">{statsData?.completedGoals || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Days Tracked</span>
                          <span className="font-medium">{statsData?.totalDaysTracked || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievement Badges */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-gray-900">Achievement Badges</h3>
                </div>
                <div className="card-content">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className={`text-center p-4 rounded-lg border-2 ${
                      (statsData?.currentStreak || 0) >= 7 ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'
                    }`}>
                      <div className="text-2xl mb-2">🔥</div>
                      <div className="text-sm font-medium">7-Day Streak</div>
                      <div className="text-xs text-gray-500">
                        {(statsData?.currentStreak || 0) >= 7 ? 'Earned!' : 'Keep going!'}
                      </div>
                    </div>
                    <div className={`text-center p-4 rounded-lg border-2 ${
                      (statsData?.totalHabits || 0) >= 5 ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}>
                      <div className="text-2xl mb-2">🎯</div>
                      <div className="text-sm font-medium">5 Habits</div>
                      <div className="text-xs text-gray-500">
                        {(statsData?.totalHabits || 0) >= 5 ? 'Earned!' : 'Keep going!'}
                      </div>
                    </div>
                    <div className={`text-center p-4 rounded-lg border-2 ${
                      (statsData?.completedGoals || 0) >= 1 ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}>
                      <div className="text-2xl mb-2">🏆</div>
                      <div className="text-sm font-medium">First Goal</div>
                      <div className="text-xs text-gray-500">
                        {(statsData?.completedGoals || 0) >= 1 ? 'Earned!' : 'Keep going!'}
                      </div>
                    </div>
                    <div className={`text-center p-4 rounded-lg border-2 ${
                      (statsData?.totalDaysTracked || 0) >= 30 ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
                    }`}>
                      <div className="text-2xl mb-2">📅</div>
                      <div className="text-sm font-medium">30 Days</div>
                      <div className="text-xs text-gray-500">
                        {(statsData?.totalDaysTracked || 0) >= 30 ? 'Earned!' : 'Keep going!'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Share Progress Tab */}
      {activeTab === 'share' && (
        <div className="space-y-6">
          {/* Share Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Share2 className="h-5 w-5 mr-2 text-blue-500" />
                  Share Your Progress
                </h3>
              </div>
              <div className="card-content">
                <div className="text-center py-6">
                  <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Share Your Journey</h4>
                  <p className="text-gray-500 mb-4">
                    Inspire others by sharing your wellness journey and achievements
                  </p>
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="btn btn-primary"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Progress
                  </button>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                  Your Achievements
                </h3>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">🎯</div>
                      <div>
                        <p className="font-medium text-gray-900">Habits Completed</p>
                        <p className="text-sm text-gray-500">{statsData?.completedToday || 0} today</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{statsData?.totalHabitsCompleted || 0}</p>
                      <p className="text-xs text-gray-500">total</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">🔥</div>
                      <div>
                        <p className="font-medium text-gray-900">Current Streak</p>
                        <p className="text-sm text-gray-500">Keep it going!</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{statsData?.currentStreak || 0}</p>
                      <p className="text-xs text-gray-500">days</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">🏆</div>
                      <div>
                        <p className="font-medium text-gray-900">Goals Completed</p>
                        <p className="text-sm text-gray-500">Great achievements!</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-purple-600">{statsData?.completedGoals || 0}</p>
                      <p className="text-xs text-gray-500">goals</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Options */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Share on Social Media</h3>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <button
                  onClick={() => {
                    const content = `🎯 I completed ${statsData?.completedToday || 0} habits today! Building healthy habits one day at a time. #MindTrack #WellnessJourney`;
                    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(content)}`;
                    window.open(url, '_blank', 'width=600,height=400');
                  }}
                  className="flex flex-col items-center p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <div className="text-2xl mb-2">📘</div>
                  <div className="text-sm font-medium">Facebook</div>
                </button>

                <button
                  onClick={() => {
                    const content = `🎯 I completed ${statsData?.completedToday || 0} habits today! Building healthy habits one day at a time. #MindTrack #WellnessJourney`;
                    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}&url=${encodeURIComponent(window.location.origin)}`;
                    window.open(url, '_blank', 'width=600,height=400');
                  }}
                  className="flex flex-col items-center p-4 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                >
                  <div className="text-2xl mb-2">🐦</div>
                  <div className="text-sm font-medium">Twitter</div>
                </button>

                <button
                  onClick={() => {
                    const content = `🎯 I completed ${statsData?.completedToday || 0} habits today! Building healthy habits one day at a time. #MindTrack #WellnessJourney`;
                    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodeURIComponent(content)}`;
                    window.open(url, '_blank', 'width=600,height=400');
                  }}
                  className="flex flex-col items-center p-4 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
                >
                  <div className="text-2xl mb-2">💼</div>
                  <div className="text-sm font-medium">LinkedIn</div>
                </button>

                <button
                  onClick={() => {
                    const content = `🎯 I completed ${statsData?.completedToday || 0} habits today! Building healthy habits one day at a time. #MindTrack #WellnessJourney`;
                    navigator.clipboard.writeText(content + ' ' + window.location.origin).then(() => {
                      toast.success('Content copied to clipboard! You can now paste it on Instagram.');
                    });
                  }}
                  className="flex flex-col items-center p-4 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
                >
                  <div className="text-2xl mb-2">📷</div>
                  <div className="text-sm font-medium">Instagram</div>
                </button>

                <button
                  onClick={() => {
                    const content = `🎯 I completed ${statsData?.completedToday || 0} habits today! Building healthy habits one day at a time. #MindTrack #WellnessJourney`;
                    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(content + ' ' + window.location.origin)}`;
                    window.open(url, '_blank', 'width=600,height=400');
                  }}
                  className="flex flex-col items-center p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <div className="text-2xl mb-2">💬</div>
                  <div className="text-sm font-medium">WhatsApp</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Progress Modal */}
      {showShareModal && (
        <ShareProgressModal
          onClose={() => setShowShareModal(false)}
          onShare={handleShare}
          stats={statsData}
        />
      )}
    </div>
  );
};

export default Social;