import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Trophy, Calendar, Target } from 'lucide-react';
import { goalsAPI } from '../services/api';
import toast from 'react-hot-toast';

const GoalModal = ({ goal, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(goal?.icon || '🎯');
  const [selectedColor, setSelectedColor] = useState(goal?.color || '#10B981');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm({
    defaultValues: {
      title: goal?.title || '',
      description: goal?.description || '',
      category: goal?.category || 'personal',
      type: goal?.type || 'target',
      targetValue: goal?.targetValue || 1,
      currentValue: goal?.currentValue || 0,
      unit: goal?.unit || 'times',
      priority: goal?.priority || 'medium',
      deadline: goal?.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '',
      isPublic: goal?.isPublic || false
    }
  });

  useEffect(() => {
    if (goal) {
      reset({
        title: goal.title || '',
        description: goal.description || '',
        category: goal.category || 'personal',
        type: goal.type || 'target',
        targetValue: goal.targetValue || 1,
        currentValue: goal.currentValue || 0,
        unit: goal.unit || 'times',
        priority: goal.priority || 'medium',
        deadline: goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '',
        isPublic: goal.isPublic || false
      });
      setSelectedIcon(goal.icon || '🎯');
      setSelectedColor(goal.color || '#10B981');
    } else {
      reset({
        title: '', description: '', category: 'personal', type: 'target',
        targetValue: 1, currentValue: 0, unit: 'times', priority: 'medium',
        deadline: '', isPublic: false
      });
      setSelectedIcon('🎯');
      setSelectedColor('#10B981');
    }
  }, [goal, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const goalData = {
        ...data,
        icon: selectedIcon,
        color: selectedColor,
        milestones: data.milestones || []
      };

      if (goal?._id) {
        await goalsAPI.updateGoal(goal._id, goalData);
        toast.success('Goal updated successfully! 🎉');
      } else {
        await goalsAPI.createGoal(goalData);
        toast.success('Goal created successfully! 🎉');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${goal?._id ? 'update' : 'create'} goal`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: 'personal', label: 'Personal', icon: '👤' },
    { value: 'health', label: 'Health', icon: '💪' },
    { value: 'career', label: 'Career', icon: '💼' },
    { value: 'education', label: 'Education', icon: '📚' },
    { value: 'fitness', label: 'Fitness', icon: '🏃' },
    { value: 'finance', label: 'Finance', icon: '💰' },
    { value: 'hobby', label: 'Hobby', icon: '🎨' },
    { value: 'travel', label: 'Travel', icon: '✈️' }
  ];

  const goalTypes = [
    { value: 'target', label: 'Target Goal' },
    { value: 'habit', label: 'Habit Goal' },
    { value: 'milestone', label: 'Milestone Goal' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-gray-500' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-500' },
    { value: 'high', label: 'High', color: 'text-orange-500' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-500' }
  ];

  const icons = ['🎯', '🏆', '⭐', '💪', '📚', '💰', '🏃', '🎨', '✈️', '💡', '🔥', '🚀', '💎', '🌟', '🎪', '🎭'];

  const colors = [
    { name: 'Green', value: '#10B981' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Orange', value: '#F59E0B' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Pink', value: '#EC4899' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                  {goal?._id ? 'Edit Goal' : 'Create New Goal'}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Goal Title */}
                <div>
                  <label className="label">Goal Title *</label>
                  <input
                    {...register('title', { required: 'Goal title is required' })}
                    type="text"
                    className="input"
                    placeholder="e.g., Run a marathon"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="label">Description</label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="input"
                    placeholder="Describe your goal and why it's important to you..."
                  />
                </div>

                {/* Category and Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Category *</label>
                    <select
                      {...register('category', { required: 'Category is required' })}
                      className="input"
                    >
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.icon} {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">Goal Type *</label>
                    <select
                      {...register('type', { required: 'Goal type is required' })}
                      className="input"
                    >
                      {goalTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Target Value and Unit */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Target Value *</label>
                    <input
                      {...register('targetValue', { 
                        required: 'Target value is required',
                        valueAsNumber: true,
                        min: 1
                      })}
                      type="number"
                      min="1"
                      className="input"
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label className="label">Unit</label>
                    <input
                      {...register('unit')}
                      type="text"
                      className="input"
                      placeholder="miles, books, days..."
                    />
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="label">Priority</label>
                  <div className="grid grid-cols-4 gap-2">
                    {priorities.map(priorityOption => (
                      <label key={priorityOption.value} className="flex items-center">
                        <input
                          {...register('priority')}
                          type="radio"
                          value={priorityOption.value}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <span className={`ml-2 text-sm ${priorityOption.color}`}>
                          {priorityOption.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Deadline */}
                <div>
                  <label className="label flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Deadline (optional)
                  </label>
                  <input
                    {...register('deadline')}
                    type="date"
                    className="input"
                  />
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="label">Choose Icon</label>
                  <div className="grid grid-cols-8 gap-2">
                    {icons.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setSelectedIcon(icon)}
                        className={`w-10 h-10 text-xl rounded-lg border-2 transition-colors ${
                          selectedIcon === icon 
                            ? 'border-primary-500 bg-primary-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <label className="label">Choose Color</label>
                  <div className="flex space-x-2">
                    {colors.map(color => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setSelectedColor(color.value)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          selectedColor === color.value 
                            ? 'border-gray-400 scale-110' 
                            : 'border-gray-200 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Public Goal */}
                <div className="flex items-center">
                  <input
                    {...register('isPublic')}
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Make this goal public (friends can see your progress)
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-2 sm:space-y-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-outline btn-sm w-full sm:w-auto order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-sm w-full sm:w-auto order-1 sm:order-2"
                >
                  {isSubmitting ? (goal?._id ? 'Updating...' : 'Creating...') : (goal?._id ? 'Update Goal' : 'Create Goal')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GoalModal;

