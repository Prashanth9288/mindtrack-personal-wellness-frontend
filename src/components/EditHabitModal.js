import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Target, Palette, Clock, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

const EditHabitModal = ({ habit, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(habit?.icon || '📝');
  const [selectedColor, setSelectedColor] = useState(habit?.color || '#3B82F6');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    defaultValues: {
      name: habit?.name || '',
      description: habit?.description || '',
      category: habit?.category || 'health',
      frequency: habit?.frequency || 'daily',
      targetValue: habit?.targetValue || 1,
      unit: habit?.unit || 'times',
      reminder: {
        enabled: habit?.reminder?.enabled || false,
        time: habit?.reminder?.time || '09:00',
        days: habit?.reminder?.days || []
      }
    }
  });

  const reminderEnabled = watch('reminder.enabled');

  const categories = [
    { value: 'health', label: 'Health', icon: '🏥' },
    { value: 'fitness', label: 'Fitness', icon: '💪' },
    { value: 'mindfulness', label: 'Mindfulness', icon: '🧘' },
    { value: 'learning', label: 'Learning', icon: '📚' },
    { value: 'productivity', label: 'Productivity', icon: '⚡' },
    { value: 'social', label: 'Social', icon: '👥' },
    { value: 'other', label: 'Other', icon: '📝' }
  ];

  const icons = [
    '💧', '🏃', '📚', '🧘', '💪', '🍎', '💤', '☀️', '🌱', '🎯',
    '📝', '🎵', '🎨', '📱', '💡', '🔥', '⭐', '🌈', '🦋', '🌙'
  ];

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
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

      console.log('Updating habit with data:', habitData);
      
      // Import the API function
      const { habitsAPI } = await import('../services/api');
      await habitsAPI.updateHabit(habit._id, habitData);
      
      toast.success('Habit updated successfully! 🎉');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update habit');
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
                  Edit Habit
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
                  <label className="label">Icon</label>
                  <div className="grid grid-cols-10 gap-2">
                    {icons.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setSelectedIcon(icon)}
                        className={`w-8 h-8 text-lg rounded border-2 ${
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
                  <label className="label">Color</label>
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
                            <Bell className="h-5 w-5 text-blue-400" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">Email Notifications</h3>
                            <div className="mt-1 text-sm text-blue-700">
                              <p>You'll receive email reminders at the specified time and days.</p>
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

            {/* Footer */}
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
                  {isSubmitting ? 'Updating...' : 'Update Habit'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditHabitModal;
