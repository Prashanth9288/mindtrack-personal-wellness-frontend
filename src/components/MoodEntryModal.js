import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Heart, Zap, Moon, Sun } from 'lucide-react';
import { moodsAPI } from '../services/api';
import toast from 'react-hot-toast';

const MoodEntryModal = ({ onClose, onSuccess, selectedDate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    defaultValues: {
      date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      energy: 5,
      stress: 5,
      sleep: {
        hours: 8,
        quality: 'good'
      }
    }
  });

  const moodOptions = [
    { value: 'very-happy', label: 'Very Happy', emoji: '😄', color: 'bg-yellow-400' },
    { value: 'happy', label: 'Happy', emoji: '😊', color: 'bg-green-400' },
    { value: 'neutral', label: 'Neutral', emoji: '😐', color: 'bg-gray-400' },
    { value: 'sad', label: 'Sad', emoji: '😢', color: 'bg-blue-400' },
    { value: 'very-sad', label: 'Very Sad', emoji: '😭', color: 'bg-purple-400' },
  ];

  const sleepQualities = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  const activities = [
    'Exercise', 'Work', 'Social', 'Reading', 'Music', 'Cooking', 'Gaming',
    'Walking', 'Meditation', 'Shopping', 'Cleaning', 'Learning', 'Art', 'Sports'
  ];

  const onSubmit = async (data) => {
    if (!selectedMood) {
      toast.error('Please select a mood');
      return;
    }

    setIsSubmitting(true);
    try {
      const moodData = {
        ...data,
        mood: selectedMood.value,
        activities: data.activities || []
      };

      await moodsAPI.createMood(moodData);
      toast.success('Mood entry saved! 💭');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save mood entry');
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
                  <Heart className="h-5 w-5 mr-2 text-red-500" />
                  Record Your Mood
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
                {/* Date */}
                <div>
                  <label className="label">Date</label>
                  <input
                    {...register('date', { required: 'Date is required' })}
                    type="date"
                    className="input"
                  />
                </div>

                {/* Mood Selection */}
                <div>
                  <label className="label">How are you feeling? *</label>
                  <div className="grid grid-cols-5 gap-3">
                    {moodOptions.map((mood) => (
                      <button
                        key={mood.value}
                        type="button"
                        onClick={() => setSelectedMood(mood)}
                        className={`flex flex-col items-center p-3 rounded-lg border-2 transition-colors ${
                          selectedMood?.value === mood.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-8 h-8 ${mood.color} rounded-full flex items-center justify-center text-lg mb-1`}>
                          {mood.emoji}
                        </div>
                        <span className="text-xs text-gray-600">{mood.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Energy Level */}
                <div>
                  <label className="label flex items-center">
                    <Zap className="h-4 w-4 mr-1 text-yellow-500" />
                    Energy Level: {watch('energy')}/10
                  </label>
                  <input
                    {...register('energy', { 
                      required: 'Energy level is required',
                      min: 1,
                      max: 10
                    })}
                    type="range"
                    min="1"
                    max="10"
                    className="w-full"
                  />
                </div>

                {/* Stress Level */}
                <div>
                  <label className="label flex items-center">
                    <span className="text-red-500 mr-1">⚡</span>
                    Stress Level: {watch('stress')}/10
                  </label>
                  <input
                    {...register('stress', { 
                      required: 'Stress level is required',
                      min: 1,
                      max: 10
                    })}
                    type="range"
                    min="1"
                    max="10"
                    className="w-full"
                  />
                </div>

                {/* Sleep */}
                <div>
                  <label className="label flex items-center">
                    <Moon className="h-4 w-4 mr-1 text-indigo-500" />
                    Sleep
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Hours</label>
                      <input
                        {...register('sleep.hours', { 
                          min: 0,
                          max: 24
                        })}
                        type="number"
                        min="0"
                        max="24"
                        step="0.5"
                        className="input"
                        placeholder="8"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Quality</label>
                      <select
                        {...register('sleep.quality')}
                        className="input"
                      >
                        {sleepQualities.map(quality => (
                          <option key={quality.value} value={quality.value}>
                            {quality.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Activities */}
                <div>
                  <label className="label">Activities (optional)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {activities.map((activity) => (
                      <label key={activity} className="flex items-center">
                        <input
                          {...register('activities')}
                          type="checkbox"
                          value={activity}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{activity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="label">Notes (optional)</label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    className="input"
                    placeholder="How are you feeling? Any thoughts or observations..."
                    maxLength={500}
                  />
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
                  disabled={isSubmitting || !selectedMood}
                  className="btn btn-primary btn-sm w-full sm:w-auto order-1 sm:order-2"
                >
                  {isSubmitting ? 'Saving...' : 'Save Entry'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MoodEntryModal;
