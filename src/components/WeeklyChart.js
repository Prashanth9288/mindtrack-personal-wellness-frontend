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
import { format, startOfWeek, addDays } from 'date-fns';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const WeeklyChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-500">No data available</p>
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
      return format(date, 'EEE');
    } catch (error) {
      console.warn('Date formatting error:', error, 'for date:', dateString);
      return 'Error';
    }
  };

  // Prepare chart data
  const chartData = {
    labels: data.map(day => safeFormatDate(day.date)),
    datasets: [
      {
        label: 'Habits Completed',
        data: data.map(day => day.habitsCompleted || 0),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Total Habits',
        data: data.map(day => day.totalHabits || 0),
        backgroundColor: 'rgba(156, 163, 175, 0.3)',
        borderColor: 'rgba(156, 163, 175, 0.5)',
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          title: function(context) {
            const dayIndex = context[0].dataIndex;
            const dayData = data[dayIndex];
            try {
              if (!dayData.date) return 'No Date';
              const date = new Date(dayData.date);
              if (isNaN(date.getTime())) return 'Invalid Date';
              return format(date, 'EEEE, MMM d');
            } catch (error) {
              console.warn('Tooltip date formatting error:', error);
              return 'Date Error';
            }
          },
          label: function(context) {
            const label = context.dataset.label;
            const value = context.parsed.y;
            const dayIndex = context.dataIndex;
            const dayData = data[dayIndex];
            
            if (label === 'Habits Completed') {
              return `${value} of ${dayData.totalHabits} habits completed`;
            }
            return `${label}: ${value}`;
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
          },
          color: '#6B7280'
        }
      },
      y: {
        beginAtZero: true,
        max: Math.max(...data.map(day => day.totalHabits || 0), 5),
        grid: {
          color: 'rgba(156, 163, 175, 0.2)'
        },
        ticks: {
          stepSize: 1,
          font: {
            size: 11
          },
          color: '#6B7280'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <div className="h-48">
      <Bar key="weekly-chart" data={chartData} options={options} />
    </div>
  );
};

export default WeeklyChart;
