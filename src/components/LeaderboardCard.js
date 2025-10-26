import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';

const LeaderboardCard = ({ rank, user, score, isCurrentUser }) => {
  const getRankIcon = () => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-orange-500" />;
    return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
  };

  const getRankColor = () => {
    if (rank === 1) return 'bg-yellow-50 border-yellow-200';
    if (rank === 2) return 'bg-gray-50 border-gray-200';
    if (rank === 3) return 'bg-orange-50 border-orange-200';
    return 'bg-white border-gray-200';
  };

  return (
    <div className={`flex items-center justify-between p-4 border rounded-lg ${getRankColor()} ${
      isCurrentUser ? 'ring-2 ring-primary-500' : ''
    }`}>
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center w-8 h-8">
          {getRankIcon()}
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium text-sm">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">
              {user.name}
              {isCurrentUser && (
                <span className="ml-2 text-xs text-primary-600 font-medium">(You)</span>
              )}
            </h4>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="text-right">
        <p className="text-lg font-bold text-gray-900">{score}</p>
        <p className="text-xs text-gray-500">points</p>
      </div>
    </div>
  );
};

export default LeaderboardCard;
