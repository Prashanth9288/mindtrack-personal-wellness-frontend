import React from 'react';
import { Target, CheckCircle, TrendingUp, Calendar } from 'lucide-react';

const QuickStats = ({ completedToday, totalHabits, completionRate, analytics }) => {
  const stats = [
    {
      name: 'Today\'s Progress',
      value: `${completedToday}/${totalHabits}`,
      percentage: completionRate,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Current Streak',
      value: analytics?.habits?.longestStreak || 0,
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      name: 'Active Goals',
      value: analytics?.goals?.activeGoals || 0,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Days Tracked',
      value: analytics?.moods?.totalEntries || 0,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              {stat.percentage !== undefined && (
                <div className="mt-1">
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                    <span className="ml-2 text-xs text-gray-500">{stat.percentage}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
