import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Plus, Heart, Calendar as CalendarIcon } from 'lucide-react';

const MoodCalendar = ({ moods, selectedDate, onDateSelect, onAddEntry }) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());

  const getMoodForDate = (date) => {
    // Ensure moods is always an array
    const safeMoods = Array.isArray(moods) ? moods : [];
    return safeMoods.find(mood => isSameDay(new Date(mood.date), date));
  };

  const getMoodEmoji = (mood) => {
    const emojis = {
      'very-happy': '😄',
      'happy': '😊',
      'neutral': '😐',
      'sad': '😢',
      'very-sad': '😭'
    };
    return emojis[mood] || '😐';
  };

  const getMoodColor = (mood) => {
    const colors = {
      'very-happy': 'bg-yellow-100 text-yellow-800',
      'happy': 'bg-green-100 text-green-800',
      'neutral': 'bg-gray-100 text-gray-800',
      'sad': 'bg-blue-100 text-blue-800',
      'very-sad': 'bg-purple-100 text-purple-800'
    };
    return colors[mood] || 'bg-gray-100 text-gray-800';
  };

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;

    const mood = getMoodForDate(date);
    if (!mood) return null;

    return (
      <div className="mood-emoji">
        {getMoodEmoji(mood.mood)}
      </div>
    );
  };

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return null;

    const mood = getMoodForDate(date);
    if (!mood) return null;

    const baseClasses = 'calendar-day';
    const moodClasses = getMoodColor(mood.mood);
    const isToday = isSameDay(date, new Date());
    const isSelected = selectedDate && isSameDay(date, selectedDate);

    return `${baseClasses} ${moodClasses} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`;
  };

  const handleDateChange = (date) => {
    setCurrentDate(date);
    onDateSelect(date);
  };

  const handleTileClick = (date) => {
    const mood = getMoodForDate(date);
    if (!mood) {
      onAddEntry(date);
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <div className="card overflow-hidden">
        <div className="card-header bg-gradient-to-r from-pink-500 to-red-500 text-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Mood Calendar
            </h3>
            <button
              onClick={() => onAddEntry(new Date())}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 border px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </button>
          </div>
        </div>
        <div className="card-content p-0">
          <div className="bg-gradient-to-br from-gray-50 to-white p-6">
            <Calendar
              onChange={handleDateChange}
              value={currentDate}
              tileContent={tileContent}
              tileClassName={tileClassName}
              onClickDay={handleTileClick}
              className="w-full mood-calendar"
              calendarType="US"
              showNeighboringMonth={false}
              formatShortWeekday={(locale, date) => {
                const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                return weekdays[date.getDay()];
              }}
            />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="card-content">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <Heart className="h-4 w-4 text-blue-600" />
            </div>
            <h4 className="text-sm font-semibold text-gray-900">Mood Legend</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { mood: 'very-happy', label: 'Very Happy', color: 'from-yellow-400 to-orange-400' },
              { mood: 'happy', label: 'Happy', color: 'from-green-400 to-emerald-400' },
              { mood: 'neutral', label: 'Neutral', color: 'from-gray-400 to-slate-400' },
              { mood: 'sad', label: 'Sad', color: 'from-blue-400 to-cyan-400' },
              { mood: 'very-sad', label: 'Very Sad', color: 'from-purple-400 to-violet-400' }
            ].map(({ mood, label, color }) => (
              <div key={mood} className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-8 h-8 bg-gradient-to-r ${color} rounded-full flex items-center justify-center mr-3 shadow-sm`}>
                  <span className="text-sm">{getMoodEmoji(mood)}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900">{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Date Info */}
      {selectedDate && (
        <div className="card bg-gradient-to-br from-white to-gray-50 border-gray-200">
          <div className="card-header bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <h3 className="text-lg font-semibold flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h3>
          </div>
          <div className="card-content">
            {(() => {
              const mood = getMoodForDate(selectedDate);
              if (!mood) {
                return (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-8 w-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No mood entry</h4>
                    <p className="text-gray-500 mb-4">No mood recorded for this date</p>
                    <button
                      onClick={() => onAddEntry(selectedDate)}
                      className="btn btn-primary btn-sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Entry
                    </button>
                  </div>
                );
              }

              return (
                <div className="space-y-6">
                  {/* Mood Display */}
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                        <span className="text-4xl">{getMoodEmoji(mood.mood)}</span>
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 capitalize mb-1">
                        {mood.mood.replace('-', ' ')}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Recorded at {format(new Date(mood.date), 'h:mm a')}
                      </p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-green-600 text-sm">⚡</span>
                        </div>
                        <p className="text-sm font-medium text-gray-700">Energy Level</p>
                      </div>
                      <p className="text-2xl font-bold text-green-700">{mood.energy}/10</p>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl border border-red-200">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-red-600 text-sm">😰</span>
                        </div>
                        <p className="text-sm font-medium text-gray-700">Stress Level</p>
                      </div>
                      <p className="text-2xl font-bold text-red-700">{mood.stress}/10</p>
                    </div>
                  </div>

                  {/* Additional Info - Two Column Layout */}
                  {(mood.sleep || (mood.activities && mood.activities.length > 0)) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mood.sleep && (
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                          <div className="flex items-center mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-blue-600 text-sm">😴</span>
                            </div>
                            <p className="text-sm font-medium text-gray-700">Sleep Quality</p>
                          </div>
                          <p className="text-lg font-semibold text-blue-700">
                            {mood.sleep.hours}h ({mood.sleep.quality})
                          </p>
                        </div>
                      )}

                      {mood.activities && mood.activities.length > 0 && (
                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-200">
                          <div className="flex items-center mb-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-purple-600 text-sm">🎯</span>
                            </div>
                            <p className="text-sm font-medium text-gray-700">Activities</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {mood.activities.map((activity, index) => (
                              <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
                                {activity}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {mood.notes && (
                    <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-gray-600 text-sm">📝</span>
                        </div>
                        <p className="text-sm font-medium text-gray-700">Notes</p>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{mood.notes}</p>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodCalendar;
