import React from 'react';
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const InsightsCard = ({ insights }) => {
  if (!insights) {
    return null;
  }

  const getInsightIcon = (type) => {
    switch (type) {
      case 'recommendation':
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
      case 'achievement':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'challenge':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      default:
        return <TrendingUp className="h-5 w-5 text-purple-500" />;
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'recommendation':
        return 'insight-info';
      case 'achievement':
        return 'insight-positive';
      case 'challenge':
        return 'insight-warning';
      default:
        return 'insight-info';
    }
  };

  return (
    <div className="space-y-6">
      {/* Recommendations */}
      {insights.recommendations && insights.recommendations.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-blue-500" />
              AI Recommendations
            </h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {insights.recommendations.map((recommendation, index) => (
                <div key={index} className="insight-card insight-info">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {getInsightIcon(recommendation.type)}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {recommendation.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Priority: {recommendation.priority}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Achievements */}
      {insights.achievements && insights.achievements.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              Recent Achievements
            </h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {insights.achievements.map((achievement, index) => (
                <div key={index} className="insight-card insight-positive">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">{achievement.icon}</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {achievement.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Challenges */}
      {insights.challenges && insights.challenges.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
              Areas for Improvement
            </h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {insights.challenges.map((challenge, index) => (
                <div key={index} className="insight-card insight-warning">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {getInsightIcon(challenge.type)}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {challenge.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Severity: {challenge.severity}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Patterns */}
      {insights.patterns && insights.patterns.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-purple-500" />
              Identified Patterns
            </h3>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {insights.patterns.map((pattern, index) => (
                <div key={index} className="insight-card insight-info">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {getInsightIcon(pattern.type)}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {pattern.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Confidence: {pattern.confidence}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightsCard;
