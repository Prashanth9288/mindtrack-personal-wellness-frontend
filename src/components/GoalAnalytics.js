import React from 'react';
import { Line } from 'react-chartjs-2';
import { X, Trophy, TrendingUp, Calendar } from 'lucide-react';

const GoalAnalytics = ({ goal, onClose }) => {
  if (!goal) return null;

  const chartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Progress',
        data: [25, 50, 75, goal.progressPercentage || 0],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                {goal.title} Analytics
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="stat-card">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{goal.progressPercentage || 0}%</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Current Value</p>
                  <p className="text-2xl font-bold text-gray-900">{goal.currentValue || 0}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Target Value</p>
                  <p className="text-2xl font-bold text-gray-900">{goal.targetValue || 0}</p>
                </div>
              </div>
            </div>

            <div className="h-64">
              <Line data={chartData} options={options} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalAnalytics;
