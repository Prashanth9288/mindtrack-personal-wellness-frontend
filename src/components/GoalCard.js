import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Calendar, Target, BarChart3, MoreVertical, Edit, Trash2, Play, Pause, Check } from 'lucide-react';
import { format, isAfter, isBefore } from 'date-fns';

const GoalCard = ({ goal, onViewAnalytics, onDelete, onStatusChange, onUpdateProgress, onEdit }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const progressPercentage = goal.progressPercentage || (goal.targetValue > 0 ? Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100) : 0);
  const daysRemaining = goal.daysRemaining;
  const isOverdue = goal.deadline && isAfter(new Date(), new Date(goal.deadline)) && goal.status === 'active';
  const isNearDeadline = goal.deadline && daysRemaining <= 7 && daysRemaining > 0;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

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
    return goal.color ? '' : 'bg-blue-500'; // Use goal color if available
  };

  const getProgressStyle = () => {
    if (goal.color && !isOverdue && !isNearDeadline && progressPercentage < 80) {
      return { backgroundColor: goal.color };
    }
    return {};
  };

  const getStatusBadge = () => {
    const statusColors = {
      active: 'badge-primary',
      completed: 'badge-success',
      paused: 'badge-warning',
      cancelled: 'badge-error'
    };
    return statusColors[goal.status] || 'badge-primary';
  };

  return (
    <div className="card hover:shadow-md transition-shadow" style={{ borderLeft: `4px solid ${goal.color || '#10B981'}` }}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <span className="text-2xl mr-3">{goal.icon}</span>
            <div>
              <h3 className="font-medium text-gray-900">{goal.title}</h3>
              <p className="text-sm text-gray-500 capitalize">{goal.category}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {onViewAnalytics && (
              <button
                onClick={() => onViewAnalytics(goal)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="View Analytics"
              >
                <BarChart3 className="h-4 w-4" />
              </button>
            )}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="More options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    {onEdit && (
                      <button
                        onClick={() => {
                          onEdit(goal);
                          setShowMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Edit className="h-4 w-4 mr-3" />
                        Edit Goal
                      </button>
                    )}
                    {onUpdateProgress && goal.status === 'active' && (
                      <button
                        onClick={() => {
                          onUpdateProgress(goal);
                          setShowMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Target className="h-4 w-4 mr-3" />
                        Update Progress
                      </button>
                    )}
                    {onStatusChange && (
                      <>
                        {goal.status === 'active' && (
                          <button
                            onClick={() => {
                              onStatusChange(goal._id, 'paused');
                              setShowMenu(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Pause className="h-4 w-4 mr-3" />
                            Pause Goal
                          </button>
                        )}
                        {goal.status === 'paused' && (
                          <button
                            onClick={() => {
                              onStatusChange(goal._id, 'active');
                              setShowMenu(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Play className="h-4 w-4 mr-3" />
                            Resume Goal
                          </button>
                        )}
                        {goal.status === 'active' && (
                          <button
                            onClick={() => {
                              onStatusChange(goal._id, 'completed');
                              setShowMenu(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Check className="h-4 w-4 mr-3" />
                            Mark Complete
                          </button>
                        )}
                      </>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this goal?')) {
                            onDelete(goal._id);
                          }
                          setShowMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-3" />
                        Delete Goal
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {goal.description && (
          <p className="text-sm text-gray-600 mb-4">{goal.description}</p>
        )}

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {progressPercentage}%
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className={`progress-fill ${getProgressColor()}`}
              style={{ 
                width: `${Math.min(progressPercentage, 100)}%`,
                ...getProgressStyle()
              }}
            />
          </div>
        </div>

        {/* Goal Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <Target className="h-4 w-4 mr-1" />
              <span>{goal.currentValue}/{goal.targetValue} {goal.unit}</span>
            </div>
            <span className={`badge ${getStatusBadge()}`}>
              {goal.status}
            </span>
          </div>

          {goal.deadline && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-1" />
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

          {goal.priority && goal.priority !== 'medium' && (
            <div className="flex items-center text-sm">
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
        </div>

        {/* Milestones */}
        {goal.milestones && goal.milestones.length > 0 && (
          <div className="border-t pt-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Milestones:</span>
              <span className="text-gray-700">
                {goal.milestones.filter(m => m.achieved).length}/{goal.milestones.length}
              </span>
            </div>
            <div className="mt-2">
              <div className="flex space-x-1">
                {goal.milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={`h-2 flex-1 rounded ${
                      milestone.achieved ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 mt-4">
          {goal.status === 'active' && onUpdateProgress && (
            <button 
              onClick={() => onUpdateProgress(goal)}
              className="btn btn-primary btn-sm flex-1"
            >
              Update Progress
            </button>
          )}
          {goal.status === 'paused' && onStatusChange && (
            <button 
              onClick={() => onStatusChange(goal._id, 'active')}
              className="btn btn-secondary btn-sm flex-1"
            >
              Resume
            </button>
          )}
          {goal.status === 'active' && onStatusChange && (
            <button 
              onClick={() => onStatusChange(goal._id, 'paused')}
              className="btn btn-outline btn-sm"
            >
              Pause
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
