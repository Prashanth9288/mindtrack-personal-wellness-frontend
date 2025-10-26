import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Share2, Facebook, Twitter, Linkedin, Instagram, MessageCircle, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const ShareProgressModal = ({ onClose, onShare, stats }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const shareType = watch('type', 'progress');

  const shareTypes = [
    { value: 'progress', label: 'Daily Progress', description: 'Share your daily achievements' },
    { value: 'streak', label: 'Streak Milestone', description: 'Celebrate a streak achievement' },
    { value: 'goal', label: 'Goal Completion', description: 'Share a completed goal' },
    { value: 'motivation', label: 'Motivational Message', description: 'Inspire others with your journey' }
  ];

  const socialPlatforms = [
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: Facebook, 
      color: 'bg-blue-600 hover:bg-blue-700',
      description: 'Share with friends and family'
    },
    { 
      id: 'twitter', 
      name: 'Twitter', 
      icon: Twitter, 
      color: 'bg-sky-500 hover:bg-sky-600',
      description: 'Tweet your progress'
    },
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      icon: Linkedin, 
      color: 'bg-blue-700 hover:bg-blue-800',
      description: 'Share professional achievements'
    },
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: Instagram, 
      color: 'bg-pink-600 hover:bg-pink-700',
      description: 'Share your wellness journey'
    },
    { 
      id: 'whatsapp', 
      name: 'WhatsApp', 
      icon: MessageCircle, 
      color: 'bg-green-600 hover:bg-green-700',
      description: 'Share with close contacts'
    }
  ];

  const generateContent = (type, customMessage) => {
    const baseMessage = customMessage || '';
    
    switch (type) {
      case 'progress':
        return `${baseMessage} 🎯 I completed ${stats?.completedToday || 0} habits today! Building healthy habits one day at a time. #MindTrack #WellnessJourney`;
      case 'streak':
        return `${baseMessage} 🔥 I've maintained a ${stats?.currentStreak || 0}-day streak! Consistency is key to success. #MindTrack #Streak`;
      case 'goal':
        return `${baseMessage} 🏆 I just completed a goal! Every small step counts towards big achievements. #MindTrack #GoalAchieved`;
      case 'motivation':
        return `${baseMessage} 💪 Small daily improvements lead to big results. Keep pushing forward! #MindTrack #Motivation`;
      default:
        return `${baseMessage} 🌟 Making progress on my wellness journey with MindTrack! #MindTrack #Wellness`;
    }
  };

  const handleSocialMediaShare = (platformId) => {
    const content = generateContent(shareType, watch('message'));
    const appUrl = window.location.origin;
    
    let shareUrl = '';
    
    switch (platformId) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}&quote=${encodeURIComponent(content)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}&url=${encodeURIComponent(appUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(appUrl)}&summary=${encodeURIComponent(content)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(content + ' ' + appUrl)}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct URL sharing, so we'll copy to clipboard
        navigator.clipboard.writeText(content + ' ' + appUrl).then(() => {
          toast.success('Content copied to clipboard! You can now paste it on Instagram.');
        }).catch(() => {
          toast.error('Failed to copy to clipboard. Please copy manually: ' + content);
        });
        return;
      default:
        toast.error('Platform not supported');
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      toast.success(`Opening ${socialPlatforms.find(p => p.id === platformId)?.name}...`);
    }
  };

  const onSubmit = async (data) => {
    if (!selectedPlatform) {
      toast.error('Please select a social media platform');
      return;
    }

    setIsSubmitting(true);
    try {
      // Handle social media sharing
      handleSocialMediaShare(selectedPlatform);
      
      // Also call the onShare callback if provided
      if (onShare) {
        const content = generateContent(shareType, data.message);
        const shareData = {
          platform: selectedPlatform,
          content: content,
          type: shareType
        };
        await onShare(shareData);
      }
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      toast.error('Failed to share progress');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlatformSelect = (platform) => {
    setSelectedPlatform(platform);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Share2 className="h-5 w-5 mr-2 text-primary-500" />
                  Share Your Progress
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Share Type Selection */}
              <div className="mb-6">
                <label className="label">What would you like to share?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {shareTypes.map((type) => (
                    <label key={type.value} className="relative">
                      <input
                        {...register('type')}
                        type="radio"
                        value={type.value}
                        className="sr-only"
                      />
                      <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        shareType === type.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <div className="font-medium text-gray-900">{type.label}</div>
                        <div className="text-sm text-gray-500 mt-1">{type.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom Message */}
              <div className="mb-6">
                <label className="label">Custom Message (Optional)</label>
                <textarea
                  {...register('message')}
                  rows={3}
                  className="input"
                  placeholder="Add a personal message to your post..."
                />
              </div>

              {/* Social Media Platform Selection */}
              <div className="mb-6">
                <label className="label">Choose Platform</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {socialPlatforms.map((platform) => (
                    <div key={platform.id} className="relative">
                      <button
                        type="button"
                        onClick={() => handlePlatformSelect(platform.id)}
                        className={`w-full p-4 border-2 rounded-lg transition-all text-left ${
                          selectedPlatform === platform.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          <platform.icon className={`h-6 w-6 mr-3 ${
                            selectedPlatform === platform.id ? 'text-primary-600' : 'text-gray-500'
                          }`} />
                          <span className="font-medium text-gray-900">{platform.name}</span>
                        </div>
                        <div className="text-sm text-gray-500">{platform.description}</div>
                      </button>
                      
                      {/* Direct Share Button */}
                      <button
                        type="button"
                        onClick={() => handleSocialMediaShare(platform.id)}
                        className={`absolute top-2 right-2 p-1 rounded-full transition-all ${
                          platform.id === 'facebook' ? 'bg-blue-600 hover:bg-blue-700' :
                          platform.id === 'twitter' ? 'bg-sky-500 hover:bg-sky-600' :
                          platform.id === 'linkedin' ? 'bg-blue-700 hover:bg-blue-800' :
                          platform.id === 'instagram' ? 'bg-pink-600 hover:bg-pink-700' :
                          platform.id === 'whatsapp' ? 'bg-green-600 hover:bg-green-700' :
                          'bg-gray-600 hover:bg-gray-700'
                        } text-white`}
                        title={`Share directly on ${platform.name}`}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview */}
              {selectedPlatform && (
                <div className="mb-6">
                  <label className="label">Preview</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        U
                      </div>
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">You</div>
                        <div className="text-sm text-gray-500">Now</div>
                      </div>
                    </div>
                    <div className="text-gray-800">
                      {generateContent(shareType, watch('message'))}
                    </div>
                  </div>
                </div>
              )}

              {/* Stats Summary */}
              <div className="mb-6 bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Your Progress Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Habits Today:</span>
                    <span className="font-medium ml-2">{stats?.completedToday || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Current Streak:</span>
                    <span className="font-medium ml-2">{stats?.currentStreak || 0} days</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Habits:</span>
                    <span className="font-medium ml-2">{stats?.totalHabits || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Goals Completed:</span>
                    <span className="font-medium ml-2">{stats?.completedGoals || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-3 space-y-2 sm:space-y-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-outline btn-sm w-full sm:w-auto order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedPlatform}
                  className="btn btn-primary btn-sm w-full sm:w-auto order-1 sm:order-2 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Opening {selectedPlatform ? socialPlatforms.find(p => p.id === selectedPlatform)?.name : 'Platform'}...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open {selectedPlatform ? socialPlatforms.find(p => p.id === selectedPlatform)?.name : 'Platform'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShareProgressModal;