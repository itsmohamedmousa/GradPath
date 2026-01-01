import { useState, useEffect } from 'react';
import { useCourse } from '../../contexts/CourseContext';
import { useToastContext } from '../../contexts/ToastContext';
import { Calculator, Target, TrendingUp, AlertCircle } from 'lucide-react';

function GradeCalculator() {
  const { data: courses } = useCourse();
  const { show } = useToastContext();
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [targetGrade, setTargetGrade] = useState('');
  const [results, setResults] = useState([]);
  const [currentGrade, setCurrentGrade] = useState(0);
  const registeredCourses = courses.filter(course => course.status === 'Registered')

  const calculateRequiredGrades = () => {
    setResults([]);

    if (!selectedCourseId || !targetGrade) {
      show('Please select a course and enter a target grade.', 'warning');
      return;
    }

    const course = courses.find((c) => c.id === parseInt(selectedCourseId));
    if (!course || !course.grade_items || course.grade_items.length === 0) {
      show('This course has no grade items.', 'warning');
      return;
    }

    const target = parseFloat(targetGrade);
    if (isNaN(target) || target < 0 || target > 100) {
      show('Please enter a valid target grade between 0 and 100.', 'warning');
      return;
    }

    // Calculate current weighted grade from completed items
    let completedWeight = 0;
    let currentWeightedScore = 0;

    course.grade_items.forEach((item) => {
      const weight = parseFloat(item.weight) || 0;
      const score = parseFloat(item.score);

      if (!isNaN(score) && score !== null && score !== '') {
        completedWeight += weight;
        currentWeightedScore += (score * weight) / 100;
      }
    });

    setCurrentGrade(completedWeight > 0 ? currentWeightedScore : 0);

    // Calculate required grades for incomplete items
    const incompleteItems = course.grade_items.filter((item) => {
      const score = parseFloat(item.score);
      return isNaN(score) || score === null || score === '';
    });

    if (incompleteItems.length === 0) {
      show('All grade items have been completed for this course.', 'info');
      return;
    }

    const remainingWeight = 100 - completedWeight;

    if (remainingWeight <= 0) {
      show('All grade items have been completed.', 'info');
      return;
    }

    // Calculate what's needed on remaining items
    const pointsNeeded = target - currentWeightedScore;
    const calculatedResults = [];

    // For each incomplete item, calculate what's needed if only that item remains
    incompleteItems.forEach((item) => {
      const weight = parseFloat(item.weight) || 0;

      // Calculate required score if this is the only remaining item
      const requiredScore = (pointsNeeded * 100) / weight;

      calculatedResults.push({
        title: item.title || 'Untitled',
        weight: weight,
        requiredScore: requiredScore,
        type: item.type || 'Assessment',
      });
    });

    // Also calculate average needed across all remaining items
    if (incompleteItems.length > 0) {
      const averageRequired = (pointsNeeded * 100) / remainingWeight;
      calculatedResults.push({
        title: 'Average across all remaining items',
        weight: remainingWeight,
        requiredScore: averageRequired,
        type: 'Average',
        isAverage: true,
      });
    }

    setResults(calculatedResults);
  };

  const getScoreColor = (score) => {
    if (score > 100) return 'text-red-600';
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score) => {
    if (score > 100) return 'Target may not be achievable';
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    if (score >= 60) return 'Passing';
    return 'Below passing';
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Calculator className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Grade Calculator</h2>
          <p className="text-sm text-gray-600">Calculate what you need on future assessments</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Course Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
          <select
            value={selectedCourseId}
            onChange={(e) => {
              setSelectedCourseId(e.target.value);
              setResults([]);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition cursor-pointer"
          >
            <option value="">Choose a course...</option>
            {registeredCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          {registeredCourses.length === 0 && (
            <p className="mt-2 text-sm text-gray-500">No registered courses available</p>
          )}
        </div>

        {/* Target Grade Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Target className="inline w-4 h-4 mr-1" />
            Target Grade (%)
          </label>
          <input
            type="number"
            placeholder="e.g. 85"
            value={targetGrade}
            onChange={(e) => setTargetGrade(e.target.value)}
            min="0"
            max="100"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
          />
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateRequiredGrades}
          disabled={registeredCourses.length === 0}
          className={`w-full px-6 py-3 rounded-lg transition font-medium flex items-center justify-center gap-2 ${
            registeredCourses.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          <Calculator className="w-5 h-5" />
          Calculate Required Grades
        </button>

        {/* Error Message - Removed since we use toast now */}

        {/* Current Grade Display */}
        {results.length > 0 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">Current Grade:</span>
              <span className="text-lg font-bold text-blue-600">{currentGrade.toFixed(2)}%</span>
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Required Scores:</h3>
            </div>

            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  result.isAverage ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4
                      className={`font-semibold ${
                        result.isAverage ? 'text-purple-900' : 'text-gray-900'
                      }`}
                    >
                      {result.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Weight: {result.weight.toFixed(1)}%
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      result.isAverage
                        ? 'bg-purple-200 text-purple-800'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {result.type}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-gray-600">Required Score:</span>
                  <div className="text-right">
                    <span className={`text-2xl font-bold ${getScoreColor(result.requiredScore)}`}>
                      {result.requiredScore.toFixed(1)}%
                    </span>
                    <p className={`text-xs mt-1 ${getScoreColor(result.requiredScore)}`}>
                      {getScoreMessage(result.requiredScore)}
                    </p>
                  </div>
                </div>

                {result.requiredScore > 100 && (
                  <div className="mt-3 p-2 bg-red-100 rounded text-xs text-red-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>This target may not be achievable with remaining assessments</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Help Text */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">How to use:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Select a course with incomplete grade items</li>
            <li>• Enter your desired target grade</li>
            <li>• See what score you need on each remaining assessment</li>
            <li>• The "Average" shows what you need across all remaining items</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default GradeCalculator;
