import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { CheckCircle, Circle, Flame, Clock, MoreVertical, Edit, Trash2, Pause, Play } from 'lucide-react';
import { habitsAPI } from '../services/api';
import DataService from '../services/dataService';
import toast from 'react-hot-toast';

const HabitCard = ({ habit, onEdit, onDelete }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const queryClient = useQueryClient();

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

  const completeMutation = useMutation(
    (data) => habitsAPI.completeHabit(habit._id, data),
    {
      onSuccess: () => {
        DataService.invalidateHabitQueries(queryClient);
        toast.success(`${habit.name} completed! 🔥`);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to complete habit');
      },
    }
  );

  const removeCompletionMutation = useMutation(
    () => habitsAPI.removeCompletion(habit._id),
    {
      onSuccess: () => {
        DataService.invalidateHabitQueries(queryClient);
        toast.success('Completion removed');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to remove completion');
      },
    }
  );

  const toggleActiveMutation = useMutation(
    ({ id, isActive }) => habitsAPI.updateHabit(id, { isActive }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('habits');
        queryClient.invalidateQueries('todayHabits');
        toast.success('Habit status updated');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update habit');
      },
    }
  );

  const deleteMutation = useMutation(
    (id) => habitsAPI.deleteHabit(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('habits');
        queryClient.invalidateQueries('todayHabits');
        toast.success('Habit deleted successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete habit');
      },
    }
  );

  const handleComplete = async () => {
    if (isCompleting) return;
    
    console.log('Completing habit:', habit._id, habit.name);
    setIsCompleting(true);
    try {
      const result = await completeMutation.mutateAsync({ value: 1 });
      console.log('Habit completion result:', result);
    } catch (error) {
      console.error('Habit completion error:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleRemoveCompletion = async () => {
    if (isCompleting) return;
    
    console.log('Removing completion for habit:', habit._id, habit.name);
    setIsCompleting(true);
    try {
      const result = await removeCompletionMutation.mutateAsync();
      console.log('Remove completion result:', result);
    } catch (error) {
      console.error('Remove completion error:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleToggleActive = async () => {
    try {
      await toggleActiveMutation.mutateAsync({ 
        id: habit._id, 
        isActive: !habit.isActive 
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      try {
        await deleteMutation.mutateAsync(habit._id);
      } catch (error) {
        // Error handled by mutation
      }
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(habit);
    }
    setShowMenu(false);
  };

  const isCompleted = habit.isCompletedToday;
  const streak = habit.currentStreak || 0;

  // Debug logging
  console.log('HabitCard data:', {
    id: habit._id,
    name: habit.name,
    isCompletedToday: habit.isCompletedToday,
    color: habit.color,
    completions: habit.completions
  });

  return (
    <div 
      className={`habit-card ${isCompleted ? 'completed' : ''} p-4 border-l-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200`}
      style={{ 
        borderLeftColor: habit.color || '#3B82F6',
        backgroundColor: isCompleted ? `${habit.color || '#3B82F6'}10` : 'white'
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <span className="text-2xl">{habit.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {habit.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-500 capitalize">{habit.category}</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 capitalize">{habit.frequency}</span>
            </div>
            
            {/* Target and Progress */}
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Target: {habit.targetValue} {habit.unit}</span>
                <div className="flex items-center space-x-2">
                  {habit.completions && habit.completions.length > 0 && (
                    <span className="text-gray-500">
                      {habit.completions.length} completed
                    </span>
                  )}
                  {habit.targetValue > 1 && (
                    <span className="text-gray-500">
                      ({Math.round((habit.completions?.length || 0) / habit.targetValue * 100)}%)
                    </span>
                  )}
                </div>
              </div>
              
              {/* Progress Bar */}
              {habit.targetValue > 1 && (
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min((habit.completions?.length || 0) / habit.targetValue * 100, 100)}%`,
                      backgroundColor: habit.color || '#3B82F6'
                    }}
                  ></div>
                </div>
              )}
            </div>
            
            {/* Streak Information */}
            {streak > 0 && (
              <div className="flex items-center mt-2">
                <Flame className="h-3 w-3 text-orange-500 mr-1" />
                <span className="text-xs text-orange-600 font-medium">
                  {streak} day streak
                </span>
                {habit.streak?.longest && habit.streak.longest > streak && (
                  <span className="text-xs text-gray-400 ml-2">
                    (Best: {habit.streak.longest})
                  </span>
                )}
              </div>
            )}
            
            {/* Reminder Info */}
            {habit.reminder?.enabled && (
              <div className="flex items-center mt-1">
                <Clock className="h-3 w-3 text-blue-500 mr-1" />
                <span className="text-xs text-blue-600">
                  Reminder: {habit.reminder.time}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={isCompleted ? handleRemoveCompletion : handleComplete}
            disabled={isCompleting}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
              isCompleted
                ? 'bg-green-100 text-green-600 hover:bg-green-200 shadow-sm'
                : 'bg-gray-100 text-gray-400 hover:bg-primary-100 hover:text-primary-600 hover:shadow-sm'
            } ${isCompleting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {isCompleted ? (
              <CheckCircle className="h-6 w-6" />
            ) : (
              <Circle className="h-6 w-6" />
            )}
          </button>

          {/* More Options Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-all duration-200"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-10 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={handleEdit}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4 mr-3" />
                    Edit Habit
                  </button>
                  
                  <button
                    onClick={handleToggleActive}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {habit.isActive ? (
                      <>
                        <Pause className="h-4 w-4 mr-3" />
                        Pause Habit
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-3" />
                        Resume Habit
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleDelete}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-3" />
                    Delete Habit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Description and Additional Details */}
      <div className="mt-3 space-y-2">
        {habit.description && (
          <p className="text-xs text-gray-600">{habit.description}</p>
        )}
        
        {/* Completion Status */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isCompleted 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {isCompleted ? 'Completed' : 'Pending'}
            </span>
            
            {habit.isActive === false && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                Paused
              </span>
            )}
          </div>
          
          <div className="text-gray-500">
            Created {new Date(habit.createdAt).toLocaleDateString()}
          </div>
        </div>
        
        {/* Recent Completions */}
        {habit.completions && habit.completions.length > 0 && (
          <div className="text-xs text-gray-500">
            Last completed: {new Date(habit.completions[habit.completions.length - 1].date).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitCard;
