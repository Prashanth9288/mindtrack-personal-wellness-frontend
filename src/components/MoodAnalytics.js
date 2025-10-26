import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Heart, TrendingUp, Activity } from 'lucide-react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MoodAnalytics = ({ moods, trends, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!moods || moods.length === 0) {
    return (
      <div className="text-center py-8">
        <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No mood data available</h3>
        <p className="text-gray-500">Start tracking your mood to see analytics and insights.</p>
      </div>
    );
  }

  // Ensure moods is always an array
  const safeMoods = Array.isArray(moods) ? moods : [];

  // Calculate mood distribution
  const moodDistribution = safeMoods.reduce((acc, mood) => {
    acc[mood.mood] = (acc[mood.mood] || 0) + 1;
    return acc;
  }, {});

  // Calculate average energy and stress
  const avgEnergy = safeMoods.length > 0 ? safeMoods.reduce((sum, mood) => sum + mood.energy, 0) / safeMoods.length : 0;
  const avgStress = safeMoods.length > 0 ? safeMoods.reduce((sum, mood) => sum + mood.stress, 0) / safeMoods.length : 0;

  const chartData = {
    labels: ['Very Happy', 'Happy', 'Neutral', 'Sad', 'Very Sad'],
    datasets: [
      {
        label: 'Mood Distribution',
        data: [
          moodDistribution['very-happy'] || 0,
          moodDistribution['happy'] || 0,
          moodDistribution['neutral'] || 0,
          moodDistribution['sad'] || 0,
          moodDistribution['very-sad'] || 0
        ],
        backgroundColor: [
          'rgba(251, 191, 36, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(156, 163, 175, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderColor: [
          'rgb(251, 191, 36)',
          'rgb(34, 197, 94)',
          'rgb(156, 163, 175)',
          'rgb(59, 130, 246)',
          'rgb(139, 92, 246)'
        ],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        cornerRadius: 6
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.2)'
        },
        ticks: {
          stepSize: 1,
          font: {
            size: 12
          }
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-100">
              <Heart className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-gray-900">{moods.length}</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-100">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Average Energy</p>
              <p className="text-2xl font-bold text-gray-900">{avgEnergy.toFixed(1)}/10</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-red-100">
              <Activity className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Average Stress</p>
              <p className="text-2xl font-bold text-gray-900">{avgStress.toFixed(1)}/10</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mood Distribution Chart */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Mood Distribution</h3>
        </div>
        <div className="card-content">
          <div className="h-64">
            <Bar key="mood-chart" data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Mood Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Mood Patterns</h3>
          </div>
          <div className="card-content">
            <div className="space-y-3">
              {Object.entries(moodDistribution).map(([mood, count]) => {
                const percentage = safeMoods.length > 0 ? Math.round((count / safeMoods.length) * 100) : 0;
                const moodLabels = {
                  'very-happy': 'Very Happy',
                  'happy': 'Happy',
                  'neutral': 'Neutral',
                  'sad': 'Sad',
                  'very-sad': 'Very Sad'
                };
                
                return (
                  <div key={mood} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{moodLabels[mood]}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Energy & Stress</h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Energy Level</span>
                  <span className="text-sm text-gray-600">{avgEnergy.toFixed(1)}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(avgEnergy / 10) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Stress Level</span>
                  <span className="text-sm text-gray-600">{avgStress.toFixed(1)}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${(avgStress / 10) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodAnalytics;
