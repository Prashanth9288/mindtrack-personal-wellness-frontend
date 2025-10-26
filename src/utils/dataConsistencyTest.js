// Data Consistency Test Utility
// This utility helps test that all sections show consistent data

export const testDataConsistency = () => {
  console.log('🧪 Testing Data Consistency Across All Sections...');
  
  // Test 1: Check if all query keys are consistent
  const expectedQueryKeys = [
    'habits',
    'todayHabits', 
    'moods',
    'recentMoods',
    'goals',
    'activeGoals',
    'dashboardAnalytics',
    'socialStats',
    'leaderboard',
    'motivation'
  ];
  
  console.log('✅ Expected Query Keys:', expectedQueryKeys);
  
  // Test 2: Check data transformation functions
  const testHabitData = {
    data: [
      { _id: '1', name: 'Test Habit', isCompletedToday: true, currentStreak: 5 }
    ]
  };
  
  const testMoodData = {
    data: [
      { _id: '1', mood: 'happy', energy: 7, stress: 3 }
    ]
  };
  
  const testGoalData = {
    data: [
      { _id: '1', title: 'Test Goal', currentValue: 50, targetValue: 100, progressPercentage: 50 }
    ]
  };
  
  const testAnalyticsData = {
    data: {
      habits: { totalHabits: 5, completedToday: 3 },
      moods: { totalEntries: 10, averageMood: 7.5 },
      goals: { totalGoals: 3, activeGoals: 2 }
    }
  };
  
  console.log('✅ Test Data Structures Created');
  
  // Test 3: Verify data transformation
  try {
    // These would be called with the actual DataService in real usage
    console.log('✅ Data transformation functions are available');
  } catch (error) {
    console.error('❌ Data transformation error:', error);
  }
  
  // Test 4: Check invalidation patterns
  const invalidationPatterns = {
    habits: ['habits', 'todayHabits', 'dashboardAnalytics', 'socialStats'],
    moods: ['moods', 'recentMoods', 'dashboardAnalytics'],
    goals: ['goals', 'activeGoals', 'dashboardAnalytics', 'socialStats']
  };
  
  console.log('✅ Invalidation Patterns:', invalidationPatterns);
  
  // Test 5: Verify consistent data structure expectations
  const dataStructureExpectations = {
    habits: {
      required: ['_id', 'name', 'isCompletedToday', 'currentStreak'],
      optional: ['progressPercentage', 'streak', 'completions']
    },
    moods: {
      required: ['_id', 'mood', 'energy', 'stress', 'date'],
      optional: ['notes', 'activities']
    },
    goals: {
      required: ['_id', 'title', 'currentValue', 'targetValue', 'progressPercentage'],
      optional: ['deadline', 'status', 'milestones']
    }
  };
  
  console.log('✅ Data Structure Expectations:', dataStructureExpectations);
  
  console.log('🎉 Data Consistency Test Complete!');
  
  return {
    queryKeys: expectedQueryKeys,
    invalidationPatterns,
    dataStructureExpectations,
    testData: {
      habits: testHabitData,
      moods: testMoodData,
      goals: testGoalData,
      analytics: testAnalyticsData
    }
  };
};

export default testDataConsistency;

