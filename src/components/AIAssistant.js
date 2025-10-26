import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hi! I'm your MindTrack AI assistant. I can help you with daily planning, habit suggestions, and wellness tips. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const aiResponses = [
    "Great question! Based on your habits, I'd suggest starting your day with a 5-minute meditation to set a positive tone.",
    "That's a wonderful goal! Try breaking it down into smaller, daily actions. Consistency is key to building lasting habits.",
    "I notice you've been tracking your mood well! Consider adding a gratitude practice to boost your overall well-being.",
    "For better sleep, try establishing a consistent bedtime routine and avoid screens 1 hour before bed.",
    "Your hydration habit is excellent! Keep it up - proper hydration supports both physical and mental health.",
    "I recommend setting aside 10 minutes each morning to plan your day. This can significantly improve your productivity.",
    "Based on your current habits, you might enjoy adding a short walk to your routine. Even 15 minutes can boost your energy!",
    "Great job on your streak! Remember, progress over perfection. Every small step counts toward your goals.",
    "I suggest trying the '2-minute rule' - if a task takes less than 2 minutes, do it immediately. This prevents small tasks from piling up.",
    "Your wellness journey is unique to you. Focus on what makes you feel good and energized, not what others are doing.",
    "Consider tracking your energy levels throughout the day to identify your peak performance times.",
    "Mindfulness can be as simple as taking 3 deep breaths before starting a new task. Small moments of awareness add up!",
    "I'm proud of your consistency! Building habits takes time, and you're doing great by showing up each day.",
    "Try the 'habit stacking' technique - attach a new habit to an existing one. For example, meditate right after brushing your teeth.",
    "Remember to celebrate your wins, no matter how small. Acknowledging progress keeps you motivated and positive."
  ];

  const getAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Specific responses based on keywords
    if (lowerMessage.includes('plan') || lowerMessage.includes('schedule')) {
      return "For effective daily planning, I suggest: 1) Review your goals the night before, 2) Prioritize 3 main tasks, 3) Schedule breaks, 4) End with reflection. What specific area would you like help planning?";
    }
    
    if (lowerMessage.includes('habit') || lowerMessage.includes('routine')) {
      return "Building habits takes 21-66 days on average. Start small, be consistent, and track your progress. What habit would you like to develop?";
    }
    
    if (lowerMessage.includes('mood') || lowerMessage.includes('feel')) {
      return "Your mood tracking is valuable data! Consider what activities or thoughts preceded your best days. What's been affecting your mood lately?";
    }
    
    if (lowerMessage.includes('goal') || lowerMessage.includes('target')) {
      return "SMART goals work best: Specific, Measurable, Achievable, Relevant, and Time-bound. What goal are you working towards?";
    }
    
    if (lowerMessage.includes('motivation') || lowerMessage.includes('motivated')) {
      return "Motivation comes and goes, but systems and habits are reliable. Focus on building systems that work even when motivation is low.";
    }
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety')) {
      return "Stress is a natural response. Try deep breathing, short walks, or the 5-4-3-2-1 grounding technique. What's been causing you stress?";
    }
    
    if (lowerMessage.includes('sleep') || lowerMessage.includes('tired')) {
      return "Quality sleep is crucial for wellness. Try: consistent bedtime, cool room, no screens 1 hour before bed, and a relaxing routine.";
    }
    
    if (lowerMessage.includes('exercise') || lowerMessage.includes('workout')) {
      return "Movement is medicine! Even 10 minutes of activity can boost your mood and energy. What type of movement do you enjoy?";
    }
    
    if (lowerMessage.includes('nutrition') || lowerMessage.includes('food')) {
      return "Nourish your body with whole foods, stay hydrated, and eat mindfully. Small, sustainable changes work better than drastic diets.";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return "I'm here to help! I can assist with daily planning, habit building, goal setting, and wellness strategies. What specific support do you need?";
    }
    
    // Random response for other messages
    return aiResponses[Math.floor(Math.random() * aiResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: getAIResponse(inputMessage),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // 1-3 second delay
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating AI Assistant Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        title="AI Assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          
          <div className="absolute bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-primary-50 rounded-t-lg">
              <div className="flex items-center">
                <div className="p-2 bg-primary-100 rounded-full mr-3">
                  <Bot className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                  <p className="text-xs text-gray-500">Your wellness companion</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.type === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-start">
                      {message.type === 'ai' && (
                        <Bot className="h-4 w-4 mr-2 mt-0.5 text-primary-600 flex-shrink-0" />
                      )}
                      {message.type === 'user' && (
                        <User className="h-4 w-4 mr-2 mt-0.5 text-white flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <div className="flex items-center">
                      <Bot className="h-4 w-4 mr-2 text-primary-600" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about your daily plan..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
