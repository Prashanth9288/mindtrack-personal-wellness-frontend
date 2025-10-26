import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Target, Calendar, Bell, Palette } from 'lucide-react';
import { habitsAPI } from '../services/api';
import toast from 'react-hot-toast';

const CreateHabitModal = ({ onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('📝');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm();

  const frequency = watch('frequency', 'daily');
  const reminderEnabled = watch('reminder.enabled', false);

  const icons = [
    '📝', '💧', '🏃‍♀️', '🧘‍♀️', '📚', '💪', '🌱', '🎯',
    '⚡', '🔥', '💎', '🌟', '🎨', '🎵', '🍎', '☀️'
  ];

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
  ];

  const categories = [
    { value: 'health', label: 'Health', icon: '🏥' },
    { value: 'fitness', label: 'Fitness', icon: '💪' },
    { value: 'mindfulness', label: 'Mindfulness', icon: '🧘‍♀️' },
    { value: 'learning', label: 'Learning', icon: '📚' },
    { value: 'productivity', label: 'Productivity', icon: '⚡' },
    { value: 'social', label: 'Social', icon: '👥' },
    { value: 'other', label: 'Other', icon: '📝' }
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const habitData = {
        ...data,
        icon: selectedIcon,
        color: selectedColor,
        targetValue: data.targetValue ? Number(data.targetValue) : 1,
        reminder: {
          ...data.reminder,
          days: data.reminder?.days ? data.reminder.days.filter(day => day) : []
        }
      };

      console.log('Creating habit with data:', habitData);
      await habitsAPI.createHabit(habitData);
      toast.success('Habit created successfully! 🎉');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create habit');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-primary-500" />
                  Create New Habit
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Habit Name */}
                <div>
                  <label className="label">Habit Name *</label>
                  <input
                    {...register('name', { required: 'Habit name is required' })}
                    type="text"
                    className="input"
                    placeholder="e.g., Drink 8 glasses of water"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="label">Description</label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="input"
                    placeholder="Optional description..."
                  />
                </div>

                {/* Category */}
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

                {/* Frequency */}
                <div>
                  <label className="label">Frequency *</label>
                  <select
                    {...register('frequency', { required: 'Frequency is required' })}
                    className="input"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                {/* Target Value */}
                <div>
                  <label className="label">Target Value</label>
                  <div className="flex space-x-2">
                    <input
                      {...register('targetValue', { 
                        valueAsNumber: true,
                        min: 1,
                        max: 100
                      })}
                      type="number"
                      min="1"
                      max="100"
                      className="input flex-1"
                      placeholder="1"
                    />
                    <input
                      {...register('unit')}
                      type="text"
                      className="input flex-1"
                      placeholder="times"
                    />
                  </div>
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
                        className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg ${
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
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 ${
                          selectedColor === color
                            ? 'border-gray-400'
                            : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Reminder Settings */}
                <div className="border-t pt-4">
                  <div className="flex items-center">
                    <input
                      {...register('reminder.enabled')}
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm font-medium text-gray-700">
                      Enable email reminders
                    </label>
                  </div>

                  {reminderEnabled && (
                    <div className="mt-3 space-y-3">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">Email Notifications</h3>
                            <div className="mt-1 text-sm text-blue-700">
                              <p>You'll receive email reminders at the specified time and days. Make sure your email is verified in your profile settings.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="label">Reminder Time</label>
                        <input
                          {...register('reminder.time')}
                          type="time"
                          className="input"
                          defaultValue="09:00"
                        />
                      </div>

                      <div>
                        <label className="label">Reminder Days</label>
                        <div className="grid grid-cols-7 gap-2">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                            const fullDayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                            return (
                              <label key={day} className="flex items-center">
                                <input
                                  {...register(`reminder.days.${index}`)}
                                  type="checkbox"
                                  value={fullDayNames[index]}
                                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <span className="ml-1 text-xs text-gray-700">{day}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
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
                  {isSubmitting ? 'Creating...' : 'Create Habit'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateHabitModal;
