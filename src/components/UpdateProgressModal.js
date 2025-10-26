import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Target, TrendingUp, Plus, Minus } from 'lucide-react';
import { goalsAPI } from '../services/api';
import toast from 'react-hot-toast';

const UpdateProgressModal = ({ goal, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressType, setProgressType] = useState('increment'); // increment, set, milestone

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    defaultValues: {
      progressValue: 1,
      newValue: goal?.currentValue || 0,
      milestone: '',
      notes: ''
    }
  });

  const progressValue = watch('progressValue', 1);
  const newValue = watch('newValue', goal?.currentValue || 0);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let updateData = {};

      if (progressType === 'increment') {
        updateData = {
          value: data.progressValue,
          notes: data.notes
        };
      } else if (progressType === 'set') {
        // For setting a specific value, send the target value and setValue flag
        updateData = {
          value: data.newValue,
          notes: data.notes,
          setValue: true
        };
      } else if (progressType === 'milestone') {
        // For milestone, we'll treat it as a small increment
        updateData = {
          value: 1, // Small increment for milestone
          notes: `Milestone: ${data.milestone}`
        };
      }

      console.log('Updating progress with data:', updateData);
      const response = await goalsAPI.updateProgress(goal._id, updateData);
      console.log('Progress update response:', response);
      toast.success('Progress updated successfully! 🎉');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update progress');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProgressPercentage = () => {
    const current = progressType === 'set' ? newValue : (goal?.currentValue || 0) + (progressType === 'increment' ? progressValue : 0);
    return Math.min(Math.round((current / (goal?.targetValue || 1)) * 100), 100);
  };

  const isCompleted = () => {
    const current = progressType === 'set' ? newValue : (goal?.currentValue || 0) + (progressType === 'increment' ? progressValue : 0);
    return current >= (goal?.targetValue || 1);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-primary-500" />
                  Update Progress
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Goal Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">{goal?.icon}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">{goal?.title}</h4>
                    <p className="text-sm text-gray-500 capitalize">{goal?.category}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Current: {goal?.currentValue || 0} / {goal?.targetValue || 1} {goal?.unit || 'times'}
                </div>
              </div>

              {/* Progress Type Selection */}
              <div className="mb-6">
                <label className="label">How would you like to update progress?</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setProgressType('increment')}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      progressType === 'increment'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <Plus className="h-5 w-5 text-primary-500" />
                    </div>
                    <div className="font-medium text-gray-900">Add Progress</div>
                    <div className="text-sm text-gray-500">Increment by amount</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProgressType('set')}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      progressType === 'set'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <Target className="h-5 w-5 text-primary-500" />
                    </div>
                    <div className="font-medium text-gray-900">Set Value</div>
                    <div className="text-sm text-gray-500">Set specific amount</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProgressType('milestone')}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      progressType === 'milestone'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp className="h-5 w-5 text-primary-500" />
                    </div>
                    <div className="font-medium text-gray-900">Milestone</div>
                    <div className="text-sm text-gray-500">Complete milestone</div>
                  </button>
                </div>
              </div>

              {/* Progress Input */}
              {progressType === 'increment' && (
                <div className="mb-6">
                  <label className="label">Add Progress</label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setValue('progressValue', Math.max(1, progressValue - 1))}
                      className="btn btn-outline btn-sm"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      {...register('progressValue', {
                        valueAsNumber: true,
                        min: { value: 1, message: 'Value must be at least 1' }
                      })}
                      type="number"
                      className="input text-center"
                      min="1"
                    />
                    <button
                      type="button"
                      onClick={() => setValue('progressValue', progressValue + 1)}
                      className="btn btn-outline btn-sm"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <span className="text-gray-500">{goal?.unit || 'times'}</span>
                  </div>
                  {errors.progressValue && <p className="text-red-500 text-xs mt-1">{errors.progressValue.message}</p>}
                </div>
              )}

              {progressType === 'set' && (
                <div className="mb-6">
                  <label className="label">Set Current Value</label>
                  <div className="flex items-center space-x-2">
                    <input
                      {...register('newValue', {
                        valueAsNumber: true,
                        min: { value: 0, message: 'Value cannot be negative' },
                        max: { value: goal?.targetValue || 1, message: 'Value cannot exceed target' }
                      })}
                      type="number"
                      className="input"
                      min="0"
                      max={goal?.targetValue || 1}
                    />
                    <span className="text-gray-500">/ {goal?.targetValue || 1} {goal?.unit || 'times'}</span>
                  </div>
                  {errors.newValue && <p className="text-red-500 text-xs mt-1">{errors.newValue.message}</p>}
                </div>
              )}

              {progressType === 'milestone' && (
                <div className="mb-6">
                  <label className="label">Milestone Completed</label>
                  <input
                    {...register('milestone', { required: 'Milestone description is required' })}
                    type="text"
                    className="input"
                    placeholder="e.g., Completed first week"
                  />
                  {errors.milestone && <p className="text-red-500 text-xs mt-1">{errors.milestone.message}</p>}
                </div>
              )}

              {/* Notes */}
              <div className="mb-6">
                <label className="label">Notes (Optional)</label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="input"
                  placeholder="Add any notes about your progress..."
                />
              </div>

              {/* Progress Preview */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">New Progress</span>
                  <span className="text-sm font-medium text-blue-600">
                    {getProgressPercentage()}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
                {isCompleted() && (
                  <div className="mt-2 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      🎉 Goal Completed!
                    </span>
                  </div>
                )}
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
                  disabled={isSubmitting}
                  className="btn btn-primary btn-sm w-full sm:w-auto order-1 sm:order-2 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Target className="h-4 w-4 mr-2" />
                      Update Progress
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

export default UpdateProgressModal;
