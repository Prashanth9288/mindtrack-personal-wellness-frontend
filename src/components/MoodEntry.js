import React from 'react';
import { format } from 'date-fns';
import { Trash2, Edit, Heart } from 'lucide-react';

const MoodEntry = ({ mood, onDelete, onEdit }) => {
  const getMoodEmoji = (moodValue) => {
    const emojis = {
      'very-happy': '😄',
      'happy': '😊',
      'neutral': '😐',
      'sad': '😢',
      'very-sad': '😭'
    };
    return emojis[moodValue] || '😐';
  };

  const getMoodColor = (moodValue) => {
    const colors = {
      'very-happy': 'text-yellow-600 bg-yellow-100',
      'happy': 'text-green-600 bg-green-100',
      'neutral': 'text-gray-600 bg-gray-100',
      'sad': 'text-blue-600 bg-blue-100',
      'very-sad': 'text-purple-600 bg-purple-100'
    };
    return colors[moodValue] || 'text-gray-600 bg-gray-100';
  };

  const getMoodLabel = (moodValue) => {
    const labels = {
      'very-happy': 'Very Happy',
      'happy': 'Happy',
      'neutral': 'Neutral',
      'sad': 'Sad',
      'very-sad': 'Very Sad'
    };
    return labels[moodValue] || 'Unknown';
  };

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${getMoodColor(mood.mood)}`}>
          {getMoodEmoji(mood.mood)}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-medium text-gray-900">{getMoodLabel(mood.mood)}</h4>
            <span className="text-sm text-gray-500">
              {format(new Date(mood.date), 'MMM d, yyyy')}
            </span>
          </div>
          <div className="flex items-center space-x-4 mt-1">
            <div className="flex items-center text-sm text-gray-600">
              <Heart className="h-4 w-4 mr-1" />
              <span>Energy: {mood.energy}/10</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span>Stress: {mood.stress}/10</span>
            </div>
            {mood.sleep && (
              <div className="flex items-center text-sm text-gray-600">
                <span>Sleep: {mood.sleep.hours}h</span>
              </div>
            )}
          </div>
          {mood.notes && (
            <p className="text-sm text-gray-600 mt-1">{mood.notes}</p>
          )}
          {mood.activities && mood.activities.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {mood.activities.map((activity, index) => (
                <span key={index} className="badge badge-primary text-xs">
                  {activity}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {onEdit && (
          <button
            onClick={() => onEdit(mood)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            title="Edit entry"
          >
            <Edit className="h-4 w-4" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(mood._id)}
            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-100 rounded"
            title="Delete entry"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MoodEntry;
