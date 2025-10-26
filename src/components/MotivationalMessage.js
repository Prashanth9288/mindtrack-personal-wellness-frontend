import React from 'react';
import { Heart, Trophy, Flame, Star, Zap } from 'lucide-react';

const MotivationalMessage = ({ motivation }) => {
  if (!motivation || !motivation.messages || motivation.messages.length === 0) {
    return null;
  }

  const getMessageIcon = (type) => {
    switch (type) {
      case 'streak':
        return <Flame className="h-5 w-5 text-orange-500" />;
      case 'progress':
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'mood':
        return <Heart className="h-5 w-5 text-pink-500" />;
      case 'daily':
        return <Star className="h-5 w-5 text-blue-500" />;
      case 'support':
        return <Heart className="h-5 w-5 text-purple-500" />;
      default:
        return <Zap className="h-5 w-5 text-primary-500" />;
    }
  };

  const getMessageBgColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200';
      case 'medium':
        return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200';
      default:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200';
    }
  };

  const topMessage = motivation.messages[0];

  return (
    <div className={`rounded-lg border p-4 ${getMessageBgColor(topMessage.priority)}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getMessageIcon(topMessage.type)}
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center">
            <span className="text-2xl mr-2">{topMessage.emoji}</span>
            <p className="text-sm font-medium text-gray-900">
              {topMessage.message}
            </p>
          </div>
          {motivation.messages.length > 1 && (
            <div className="mt-2">
              <button className="text-xs text-gray-600 hover:text-gray-800 font-medium">
                View {motivation.messages.length - 1} more message{motivation.messages.length - 1 > 1 ? 's' : ''}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MotivationalMessage;
