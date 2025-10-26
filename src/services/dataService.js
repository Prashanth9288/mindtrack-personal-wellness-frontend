// import { useQueryClient } from 'react-query';

// // Centralized data service for consistent data handling across the app
// export class DataService {
//   // Query keys for consistent caching
//   static QUERY_KEYS = {
//     HABITS: 'habits',
//     TODAY_HABITS: 'todayHabits',
//     MOODS: 'moods',
//     RECENT_MOODS: 'recentMoods',
//     GOALS: 'goals',
//     ACTIVE_GOALS: 'activeGoals',
//     DASHBOARD_ANALYTICS: 'dashboardAnalytics',
//     SOCIAL_STATS: 'socialStats',
//     LEADERBOARD: 'leaderboard',
//     MOTIVATION: 'motivation'
//   };

//   // Invalidate all related queries when data changes
//   static invalidateHabitQueries(queryClient) {
//     queryClient.invalidateQueries(this.QUERY_KEYS.HABITS);
//     queryClient.invalidateQueries(this.QUERY_KEYS.TODAY_HABITS);
//     queryClient.invalidateQueries(this.QUERY_KEYS.DASHBOARD_ANALYTICS);
//     queryClient.invalidateQueries(this.QUERY_KEYS.SOCIAL_STATS);
//   }

//   static invalidateMoodQueries(queryClient) {
//     queryClient.invalidateQueries(this.QUERY_KEYS.MOODS);
//     queryClient.invalidateQueries(this.QUERY_KEYS.RECENT_MOODS);
//     queryClient.invalidateQueries(this.QUERY_KEYS.DASHBOARD_ANALYTICS);
//   }

//   static invalidateGoalQueries(queryClient) {
//     queryClient.invalidateQueries(this.QUERY_KEYS.GOALS);
//     queryClient.invalidateQueries(this.QUERY_KEYS.ACTIVE_GOALS);
//     queryClient.invalidateQueries(this.QUERY_KEYS.DASHBOARD_ANALYTICS);
//     queryClient.invalidateQueries(this.QUERY_KEYS.SOCIAL_STATS);
//   }

//   static invalidateAllQueries(queryClient) {
//     queryClient.invalidateQueries();
//   }

//   // Data transformation helpers
//   static transformHabitData(response) {
//     const habits = response?.data?.data; // response.data.data is your actual array
//     if (!Array.isArray(habits)) return [];
  
//     return habits.map(habit => ({
//       ...habit,
//       isCompletedToday: habit.isCompletedToday || false,
//       currentStreak: habit.streak?.current || 0,
//       progressPercentage: habit.progressPercentage || 0,
//       longestStreak: habit.streak?.longest || 0
//     }));
//   }

//   static transformMoodData(moods) {
//     if (!moods?.data) return [];
//     return moods.data;
//   }

//   static transformGoalData(goals) {  
//     if (!goals?.data) return [];
//     return goals.data.map(goal => ({
//       ...goal,
//       progressPercentage: goal.progressPercentage || 0,
//       daysRemaining: goal.daysRemaining || null
//     }));
//   }

//   static transformAnalyticsData(analytics) {
//     if (!analytics?.data) return {};
//     return analytics.data;
//   }

//   // Calculate consistent stats
//   static calculateHabitStats(habits) {
//     const totalHabits = habits.length;
//     const completedToday = habits.filter(habit => habit.isCompletedToday).length;
//     const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
//     const totalStreak = habits.reduce((sum, habit) => sum + (habit.currentStreak || 0), 0);
//     const averageStreak = totalHabits > 0 ? Math.round(totalStreak / totalHabits) : 0;
//     const longestStreak = Math.max(...habits.map(habit => habit.streak?.longest || 0), 0);

//     return {
//       totalHabits,
//       completedToday,
//       completionRate,
//       averageStreak,
//       longestStreak,
//       totalStreak
//     };
//   }

//   static calculateMoodStats(moods) {
//     const totalEntries = moods.length;
//     const averageMood = totalEntries > 0 ? 
//       Math.round(moods.reduce((sum, mood) => sum + mood.moodScore, 0) / totalEntries * 10) / 10 : 0;
//     const averageEnergy = totalEntries > 0 ? 
//       Math.round(moods.reduce((sum, mood) => sum + mood.energy, 0) / totalEntries * 10) / 10 : 0;
//     const averageStress = totalEntries > 0 ? 
//       Math.round(moods.reduce((sum, mood) => sum + mood.stress, 0) / totalEntries * 10) / 10 : 0;

//     return {
//       totalEntries,
//       averageMood,
//       averageEnergy,
//       averageStress
//     };
//   }

//   static calculateGoalStats(goalsResponse) {
//     if (!goalsResponse) return {
//       totalGoals: 0,
//       activeGoals: 0,
//       completedGoals: 0,
//       overdueGoals: 0,
//       averageProgress: 0,
//       recentGoals: []
//     };
  
//     const {
//       total = 0,
//       active = 0,
//       completed = 0,
//       overdue = 0,
//       averageProgress = 0,
//       recentGoals = []
//     } = goalsResponse;
  
//     // Recalculate from recentGoals if needed (for dynamic updates)
//     const recalculatedAverage =
//       recentGoals.length > 0
//         ? Math.round(
//             recentGoals.reduce(
//               (sum, goal) =>
//                 sum +
//                 ((goal.progressPercentage ??
//                   (goal.targetValue && goal.targetValue > 0
//                     ? (goal.currentValue / goal.targetValue) * 100
//                     : 0)) || 0),
//               0
//             ) / recentGoals.length
//           )
//         : averageProgress;
  
//     return {
//       totalGoals: total,
//       activeGoals: active,
//       completedGoals: completed,
//       overdueGoals: overdue,
//       averageProgress: recalculatedAverage,
//       recentGoals: recentGoals || []
//     };
//   }
  
// }

// export default DataService;
// Centralized data service for consistent data handling across the app
export class DataService {
  // Query keys for consistent caching
  static QUERY_KEYS = {
    HABITS: 'habits',
    TODAY_HABITS: 'todayHabits',
    MOODS: 'moods',
    RECENT_MOODS: 'recentMoods',
    GOALS: 'goals',
    ACTIVE_GOALS: 'activeGoals',
    DASHBOARD_ANALYTICS: 'dashboardAnalytics',
    SOCIAL_STATS: 'socialStats',
    LEADERBOARD: 'leaderboard',
    MOTIVATION: 'motivation'
  };

  // Invalidate all related queries when data changes
  static invalidateHabitQueries(queryClient) {
    // use array-key prefix to match [key, params] queries
    queryClient.invalidateQueries([this.QUERY_KEYS.HABITS]);
    queryClient.invalidateQueries([this.QUERY_KEYS.TODAY_HABITS]);
    queryClient.invalidateQueries([this.QUERY_KEYS.DASHBOARD_ANALYTICS]);
    queryClient.invalidateQueries([this.QUERY_KEYS.SOCIAL_STATS]);
  }

  static invalidateMoodQueries(queryClient) {
    queryClient.invalidateQueries([this.QUERY_KEYS.MOODS]);
    queryClient.invalidateQueries([this.QUERY_KEYS.RECENT_MOODS]);
    queryClient.invalidateQueries([this.QUERY_KEYS.DASHBOARD_ANALYTICS]);
  }

  static invalidateGoalQueries(queryClient) {
    queryClient.invalidateQueries([this.QUERY_KEYS.GOALS]);
    queryClient.invalidateQueries([this.QUERY_KEYS.ACTIVE_GOALS]);
    queryClient.invalidateQueries([this.QUERY_KEYS.DASHBOARD_ANALYTICS]);
    queryClient.invalidateQueries([this.QUERY_KEYS.SOCIAL_STATS]);
  }

  static invalidateAllQueries(queryClient) {
    queryClient.invalidateQueries();
  }

  // Data transformation helpers
  // These accept either already-normalized arrays OR axios responses
  static transformHabitData(responseOrArray) {
    // If passed an axios-normalized array already, use it directly
    const raw = Array.isArray(responseOrArray)
      ? responseOrArray
      : (responseOrArray && responseOrArray.data) // api.get(...).then(res => res.data.data) returns array normally
        ? (Array.isArray(responseOrArray.data) ? responseOrArray.data : responseOrArray.data?.data)
        : undefined;

    const habits = Array.isArray(raw) ? raw : [];

    return habits.map(habit => ({
      ...habit,
      isCompletedToday: habit.isCompletedToday || false,
      // support both streak.current or currentStreak
      currentStreak: habit.streak?.current ?? habit.currentStreak ?? 0,
      progressPercentage: habit.progressPercentage ?? habit.progress ?? 0,
      longestStreak: habit.streak?.longest ?? habit.longestStreak ?? 0
    }));
  }

  static transformMoodData(responseOrArray) {
    const raw = Array.isArray(responseOrArray)
      ? responseOrArray
      : (responseOrArray && responseOrArray.data) 
        ? (Array.isArray(responseOrArray.data) ? responseOrArray.data : responseOrArray.data?.data)
        : undefined;
    return Array.isArray(raw) ? raw : [];
  }

  static transformGoalData(responseOrArray) {
    const raw = Array.isArray(responseOrArray)
      ? responseOrArray
      : (responseOrArray && responseOrArray.data) 
        ? (Array.isArray(responseOrArray.data) ? responseOrArray.data : responseOrArray.data?.data)
        : undefined;
    const goals = Array.isArray(raw) ? raw : [];

    return goals.map(goal => {
      // Handle progress array vs progress percentage
      let progressPercentage = 0;
      if (Array.isArray(goal.progress)) {
        // If progress is an array, calculate percentage from the latest entry
        const latestProgress = goal.progress[goal.progress.length - 1];
        progressPercentage = latestProgress ? (latestProgress.value / goal.targetValue) * 100 : 0;
      } else {
        progressPercentage = goal.progressPercentage ?? goal.progress ?? 0;
      }

      return {
        ...goal,
        progressPercentage,
        daysRemaining: goal.daysRemaining ?? null,
        currentValue: goal.currentValue ?? (Array.isArray(goal.progress) ? goal.progress[goal.progress.length - 1]?.value : goal.progress) ?? 0,
        // Ensure progress array is not directly rendered
        progress: Array.isArray(goal.progress) ? goal.progress.map(p => ({
          ...p,
          date: new Date(p.date).toISOString(),
          value: p.value || 0,
          notes: p.notes || ''
        })) : []
      };
    });
  }

  static transformAnalyticsData(response) {
    if (!response) return {};
    return response.data ?? response;
  }

  // Calculate consistent stats
  static calculateHabitStats(habits) {
    const totalHabits = habits.length;
    const completedToday = habits.filter(habit => habit.isCompletedToday).length;
    const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
    const totalStreak = habits.reduce((sum, habit) => sum + (habit.currentStreak || 0), 0);
    const averageStreak = totalHabits > 0 ? Math.round(totalStreak / totalHabits) : 0;
    const longestStreak = Math.max(...habits.map(habit => habit.longestStreak || 0), 0);

    return {
      totalHabits,
      completedToday,
      completionRate,
      averageStreak,
      longestStreak,
      totalStreak
    };
  }

  static calculateMoodStats(moods) {
    const totalEntries = moods.length;
    const averageMood = totalEntries > 0 ?
      Math.round(moods.reduce((sum, mood) => sum + (mood.moodScore ?? 0), 0) / totalEntries * 10) / 10 : 0;
    const averageEnergy = totalEntries > 0 ?
      Math.round(moods.reduce((sum, mood) => sum + (mood.energy ?? 0), 0) / totalEntries * 10) / 10 : 0;
    const averageStress = totalEntries > 0 ?
      Math.round(moods.reduce((sum, mood) => sum + (mood.stress ?? 0), 0) / totalEntries * 10) / 10 : 0;

    return {
      totalEntries,
      averageMood,
      averageEnergy,
      averageStress
    };
  }

  static calculateGoalStats(goals) {
    const totalGoals = goals.length;
    const activeGoals = goals.filter(goal => goal.status === 'active').length;
    const completedGoals = goals.filter(goal => goal.status === 'completed').length;
    const averageProgress = totalGoals > 0 ?
      Math.round(goals.reduce((sum, goal) => sum + (goal.progressPercentage ?? 0), 0) / totalGoals) : 0;

    return {
      totalGoals,
      activeGoals,
      completedGoals,
      averageProgress
    };
  }
}

export default DataService;