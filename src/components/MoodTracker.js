import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { moodsAPI } from '../services/api';
import DataService from '../services/dataService';
import toast from 'react-hot-toast';

const MoodTracker = ({ recentMoods }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [energy, setEnergy] = useState(5);
  const [stress, setStress] = useState(5);
  const queryClient = useQueryClient();

  // Ensure recentMoods is always an array
  const safeRecentMoods = Array.isArray(recentMoods) ? recentMoods : [];

  const todayMood = safeRecentMoods.find(mood => {
    const today = new Date();
    const moodDate = new Date(mood.date);
    return moodDate.toDateString() === today.toDateString();
  });

  const moodOptions = [
    { value: 'very-happy', label: 'Very Happy', emoji: '😄', color: 'bg-yellow-400' },
    { value: 'happy', label: 'Happy', emoji: '😊', color: 'bg-green-400' },
    { value: 'neutral', label: 'Neutral', emoji: '😐', color: 'bg-gray-400' },
    { value: 'sad', label: 'Sad', emoji: '😢', color: 'bg-blue-400' },
    { value: 'very-sad', label: 'Very Sad', emoji: '😭', color: 'bg-purple-400' },
  ];

  const submitMoodMutation = useMutation(
    (moodData) => moodsAPI.createMood(moodData),
    {
      onSuccess: () => {
        DataService.invalidateMoodQueries(queryClient);
        toast.success('Mood recorded! 💭');
        setSelectedMood(null);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to record mood');
      },
    }
  );

  const handleMoodSubmit = async (mood) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const moodData = {
        mood: mood.value,
        energy: energy,
        stress: stress,
      };

      if (todayMood && selectedMood === 'update') {
        // Update existing mood
        await moodsAPI.updateMood(todayMood._id, moodData);
        queryClient.invalidateQueries('recentMoods');
        queryClient.invalidateQueries('dashboardAnalytics');
        toast.success('Mood updated! 💭');
      } else {
        // Create new mood
        await submitMoodMutation.mutateAsync(moodData);
      }
      
      setSelectedMood(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record mood');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (todayMood) {
    const moodOption = moodOptions.find(option => option.value === todayMood.mood);
    
    return (
      <div className="text-center">
        <div className="mb-4">
          <div className={`w-16 h-16 ${moodOption?.color} rounded-full flex items-center justify-center text-2xl mx-auto mb-2`}>
            {moodOption?.emoji}
          </div>
          <h4 className="font-medium text-gray-900">You're feeling {moodOption?.label.toLowerCase()}</h4>
          <p className="text-sm text-gray-500">Recorded today</p>
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Energy:</span>
              <span className="font-medium">{todayMood.energy}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  todayMood.energy >= 7 ? 'bg-green-500' : 
                  todayMood.energy >= 4 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${(todayMood.energy / 10) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Stress:</span>
              <span className="font-medium">{todayMood.stress}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  todayMood.stress <= 3 ? 'bg-green-500' : 
                  todayMood.stress <= 6 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${(todayMood.stress / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => {
            setSelectedMood('update');
            setEnergy(todayMood.energy || 5);
            setStress(todayMood.stress || 5);
          }}
          className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Update mood
        </button>
      </div>
    );
  }

  if (selectedMood) {
    return (
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 text-center">
          {selectedMood === 'update' ? 'Update your mood' : 'How are you feeling today?'}
        </h4>
        
        <div className="grid grid-cols-5 gap-2">
          {moodOptions.map((mood) => (
            <button
              key={mood.value}
              onClick={() => handleMoodSubmit(mood)}
              disabled={isSubmitting}
              className={`flex flex-col items-center p-2 rounded-lg border-2 border-transparent hover:border-primary-200 transition-colors ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <div className={`w-8 h-8 ${mood.color} rounded-full flex items-center justify-center text-lg mb-1`}>
                {mood.emoji}
              </div>
              <span className="text-xs text-gray-600">{mood.label}</span>
            </button>
          ))}
        </div>

        {/* Energy Level Slider */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Energy Level: {energy}/10
          </label>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Low</span>
            <input
              type="range"
              min="1"
              max="10"
              value={energy}
              onChange={(e) => setEnergy(parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-xs text-gray-500">High</span>
          </div>
        </div>

        {/* Stress Level Slider */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Stress Level: {stress}/10
          </label>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Low</span>
            <input
              type="range"
              min="1"
              max="10"
              value={stress}
              onChange={(e) => setStress(parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-xs text-gray-500">High</span>
          </div>
        </div>
        
        {isSubmitting && (
          <div className="text-center">
            <div className="inline-flex items-center text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
              {selectedMood === 'update' ? 'Updating mood...' : 'Recording mood...'}
            </div>
          </div>
        )}
        
        <button
          onClick={() => setSelectedMood(null)}
          className="w-full text-sm text-gray-500 hover:text-gray-700"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mb-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-2">
          💭
        </div>
        <h4 className="font-medium text-gray-900">Track your mood</h4>
        <p className="text-sm text-gray-500">How are you feeling today?</p>
      </div>
      
      <button
        onClick={() => setSelectedMood(true)}
        className="btn btn-primary btn-sm w-full"
      >
        Record Mood
      </button>
    </div>
  );
};

export default MoodTracker;
