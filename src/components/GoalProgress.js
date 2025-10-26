import React from 'react';
import { Trophy, Calendar, Target } from 'lucide-react';
import { format, isAfter, isBefore } from 'date-fns';

const GoalProgress = ({ goal }) => {
  // Calculate progress percentage from either the direct value or the latest progress entry
  const progressPercentage = goal.progressPercentage ?? (
    Array.isArray(goal.progress) && goal.progress.length > 0
      ? (goal.progress[goal.progress.length - 1].value / goal.targetValue) * 100
      : 0
  );
  const daysRemaining = goal.daysRemaining;
  const isOverdue = goal.deadline && isAfter(new Date(), new Date(goal.deadline)) && goal.status === 'active';
  const isNearDeadline = goal.deadline && daysRemaining <= 7 && daysRemaining > 0;

  const getStatusColor = () => {
    if (isOverdue) return 'text-red-600';
    if (isNearDeadline) return 'text-yellow-600';
    if (progressPercentage >= 80) return 'text-green-600';
    return 'text-blue-600';
  };

  const getProgressColor = () => {
    if (isOverdue) return 'bg-red-500';
    if (isNearDeadline) return 'bg-yellow-500';
    if (progressPercentage >= 80) return 'bg-green-500';
    return 'bg-blue-500';
  };

  return (
    <div className="p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {goal.title}
          </h4>
          <p className="text-xs text-gray-500 capitalize">{goal.category}</p>
        </div>
        <div className="flex items-center ml-2">
          <span className={`text-xs font-medium ${getStatusColor()}`}>
            {progressPercentage}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="progress-bar">
          <div 
            className={`progress-fill ${getProgressColor()}`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Goal Details */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center">
          <Target className="h-3 w-3 mr-1" />
          <span>{goal.currentValue}/{goal.targetValue} {goal.unit}</span>
        </div>
        
        {goal.deadline && (
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span className={isOverdue ? 'text-red-600' : isNearDeadline ? 'text-yellow-600' : ''}>
              {isOverdue 
                ? 'Overdue' 
                : daysRemaining === 0 
                  ? 'Due today' 
                  : `${daysRemaining} days left`
              }
            </span>
          </div>
        )}
      </div>

      {/* Priority Badge */}
      {goal.priority && goal.priority !== 'medium' && (
        <div className="mt-2">
          <span className={`badge ${
            goal.priority === 'high' || goal.priority === 'urgent' 
              ? 'badge-error' 
              : 'badge-warning'
          }`}>
            {goal.priority === 'urgent' ? '🔥 Urgent' : 
             goal.priority === 'high' ? '⚡ High' : 
             '📌 Low'}
          </span>
        </div>
      )}

      {/* Milestones */}
      {goal.milestones && goal.milestones.length > 0 && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Milestones:</span>
            <span className="text-gray-700">
              {goal.milestones.filter(m => m.achieved).length}/{goal.milestones.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalProgress;
