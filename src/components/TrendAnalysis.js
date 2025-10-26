import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { format } from 'date-fns';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TrendAnalysis = ({ data }) => {
  if (!data || !data.moodTrend || data.moodTrend.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No mood data available for trend analysis</p>
      </div>
    );
  }

  // Helper function to safely format dates
  const safeFormatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateString);
        return 'Invalid Date';
      }
      return format(date, 'MMM d');
    } catch (error) {
      console.warn('Date formatting error:', error, 'for date:', dateString);
      return 'Error';
    }
  };

  const moodScores = {
    'very-happy': 5,
    'happy': 4,
    'neutral': 3,
    'sad': 2,
    'very-sad': 1
  };

  const chartData = {
    labels: data.moodTrend.map(entry => safeFormatDate(entry.date)),
    datasets: [
      {
        label: 'Mood Score',
        data: data.moodTrend.map(entry => moodScores[entry.mood] || 0),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y'
      },
      {
        label: 'Energy Level',
        data: data.moodTrend.map(entry => entry.energy || 0),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: false,
        yAxisID: 'y1'
      },
      {
        label: 'Stress Level',
        data: data.moodTrend.map(entry => entry.stress || 0),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: false,
        yAxisID: 'y1'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        cornerRadius: 6,
        callbacks: {
          title: function(context) {
            const dataIndex = context[0].dataIndex;
            const entry = data.moodTrend[dataIndex];
            try {
              if (!entry.date) return 'No Date';
              const date = new Date(entry.date);
              if (isNaN(date.getTime())) return 'Invalid Date';
              return format(date, 'EEEE, MMM d, yyyy');
            } catch (error) {
              console.warn('Tooltip date formatting error:', error);
              return 'Date Error';
            }
          },
          label: function(context) {
            const label = context.dataset.label;
            const value = context.parsed.y;
            
            if (label === 'Mood Score') {
              const moodLabels = {
                5: 'Very Happy',
                4: 'Happy', 
                3: 'Neutral',
                2: 'Sad',
                1: 'Very Sad'
              };
              return `${label}: ${moodLabels[value] || value}`;
            }
            
            return `${label}: ${value}/10`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        min: 1,
        max: 5,
        ticks: {
          stepSize: 1,
          font: {
            size: 11
          },
          callback: function(value) {
            const moodLabels = {
              5: 'Very Happy',
              4: 'Happy',
              3: 'Neutral', 
              2: 'Sad',
              1: 'Very Sad'
            };
            return moodLabels[value] || value;
          }
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.2)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        min: 0,
        max: 10,
        ticks: {
          stepSize: 2,
          font: {
            size: 11
          },
          callback: function(value) {
            return `${value}/10`;
          }
        },
        grid: {
          drawOnChartArea: false,
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Average Mood</p>
            <p className="text-2xl font-bold text-gray-900">{data.averageMood || 0}/5</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Mood Stability</p>
            <p className="text-2xl font-bold text-gray-900">{data.moodStability || 0}%</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Data Points</p>
            <p className="text-2xl font-bold text-gray-900">{data.moodTrend.length}</p>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="h-80">
        <Line key="trend-chart" data={chartData} options={options} />
      </div>
    </div>
  );
};

export default TrendAnalysis;
