import { useState } from 'react';
import { useCourse } from '../../contexts/CourseContext';
import { useToastContext } from '../../contexts/ToastContext';

function AddCourse() {
  const [courseName, setCourseName] = useState('');
  const [credits, setCredits] = useState('');
  const [gradeItems, setGradeItems] = useState([
    { title: '', weight: '', score: '', type: 'Exam' },
  ]);
  const [grade, setGrade] = useState(null);
  const { refreshCourses } = useCourse();
  const { show } = useToastContext();

  const handleGradeItemChange = (index, field, value) => {
    const updated = [...gradeItems];
    updated[index][field] = value;
    setGradeItems(updated);

    const allScoresPresent = updated.every(
      (item) => item.score !== undefined && item.score !== null && item.score !== '',
    );

    if (allScoresPresent) {
      const calculatedGrade = updated.reduce(
        (acc, item) => acc + (parseFloat(item.score) * parseFloat(item.weight || 0)) / 100,
        0,
      );
      setGrade(calculatedGrade);
    } else {
      setGrade(null);
    }
  };

  const addGradeItem = () => {
    setGradeItems([...gradeItems, { title: '', weight: '', score: null, type: 'Exam' }]);
  };

  const newCourse = {
    name: courseName,
    credits: parseInt(credits, 10),
    final_grade: grade,
    gradeItems: gradeItems,
    status:
      grade === null || grade === undefined ? 'Registered' : grade >= 60 ? 'Passed' : 'Failed',
  };

  const addCourse = async (newCourse) => {
    if (gradeItems.length > 0) {
      const totalWeight = gradeItems.reduce((acc, item) => acc + (parseFloat(item.weight) || 0), 0);
      if (totalWeight !== 100) {
        show('Total weight of grade items must equal 100%.', 'warning');
        return;
      }
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/courses.php?action=add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newCourse),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        show(result.message || 'Course Added Successfully.', 'success');
        refreshCourses();
      } else {
        show(result.message || 'Failed to Add Course.', 'error');
      }
    } catch (err) {
      console.error('Add error:', err);
      show('Something went wrong.', 'error');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Course</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Name</label>
            <input
              name="course_name"
              placeholder="e.g. Networking 101"
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Credits</label>
            <input
              type="number"
              name="credits"
              placeholder="e.g. 3"
              onChange={(e) => setCredits(e.target.value)}
              min="1"
              max="12"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Grade Items</label>
          <div className="space-y-3">
            {gradeItems.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 bg-gray-50 rounded-lg"
              >
                <input
                  placeholder="e.g. Midterm"
                  value={item.title}
                  onChange={(e) => handleGradeItemChange(index, 'title', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
                <input
                  type="number"
                  placeholder="Weight (%)"
                  value={item.weight}
                  min={1}
                  max={100}
                  onChange={(e) => handleGradeItemChange(index, 'weight', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
                <input
                  type="number"
                  placeholder="Grade"
                  value={item.score}
                  min={0}
                  max={100}
                  onChange={(e) => handleGradeItemChange(index, 'score', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
                <select
                  value={item.type}
                  onChange={(e) => handleGradeItemChange(index, 'type', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition cursor-pointer"
                >
                  <option value="Exam">Exam</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Attendance">Attendance</option>
                  <option value="Project">Project</option>
                  <option value="Other">Other</option>
                </select>
                <button
                  type="button"
                  onClick={() => setGradeItems(gradeItems.filter((_, i) => i !== index))}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addGradeItem}
            className="mt-3 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition font-medium"
          >
            + Add Grade Item
          </button>
        </div>

        <button
          type="submit"
          onClick={() => {
            addCourse(newCourse);
          }}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
        >
          Add Course
        </button>
      </div>
    </div>
  );
}

export default AddCourse;
