import { useEffect, useState } from 'react';
import { useCourse } from '../../contexts/CourseContext';
import { X } from 'lucide-react';
import { useToastContext } from '../../contexts/ToastContext';

function EditCourse({ editCourse, courseToEdit, setCourseToEdit }) {
  const { data: courses } = useCourse();
  const courseData = courses.find((course) => course.id === Number(courseToEdit.id));
  const [courseId, setCourseId] = useState('');
  const [courseName, setCourseName] = useState('');
  const [credits, setCredits] = useState('');
  const [grade, setGrade] = useState(null);
  const [gradeItems, setGradeItems] = useState([]);
  const { show } = useToastContext();

  useEffect(() => {
    if (courseData) {
      setCourseId(courseData.id);
      setCourseName(courseData.name);
      setCredits(courseData.credits);
      setGradeItems(courseData.grade_items);
    } else {
      setGradeItems([{ title: '', weight: '', score: '', type: 'Exam' }]);
    }
  }, [courseData]);

  const handleGradeItemChange = (index, field, value) => {
    const updated = [...gradeItems];
    updated[index][field] = value;
    setGradeItems(updated);
    const allScoresPresent = updated.every(
      (item) => item.score !== undefined && item.score !== null && item.score !== '',
    );

    if (allScoresPresent) {
      const grade = updated.reduce(
        (acc, item) => acc + (parseFloat(item.score) * parseFloat(item.weight || 0)) / 100,
        0,
      );
      setGrade(grade);
    }
  };

  const addGradeItem = () => {
    setGradeItems([...gradeItems, { title: '', weight: '', score: NaN, type: 'Exam' }]);
  };

  const newCourse = {
    id: courseId,
    name: courseName,
    credits: parseInt(credits, 10),
    final_grade: grade,
    gradeItems: gradeItems,
    status: grade == null ? 'Registered' : grade >= 60 ? 'Passed' : 'Failed',
  };

  if (!courseToEdit.visible) {
    return null;
  }

  return (
    <div className={'mt-7 bg-gray-200 rounded-xl shadow-md'}>
      <div className="flex flex-row w-full items-center justify-between">
        <h2 className="py-3 pl-6 text-l font-bold text-blue-700">Edit Course</h2>
        <button
          className="text-blue-700 underline pr-6 hover:text-red-400 cursor-pointer"
          onClick={() => {
            setCourseToEdit((prev) => ({
              ...prev,
              visible: false,
              id: null,
            }));
          }}
        >
          {<X size={20} />}
        </button>
      </div>
      <div className="min-w-full mx-auto bg-gray-50 p-6 rounded-xl border border-blue-100 mb-10">
        <div className="flex flex-row gap-4 w-full items-between justify-between">
          <div className="mb-6 w-full">
            <label className="block text-sm font-bold text-gray-700 mb-4">Course Name</label>
            <input
              name="course_name"
              value={courseName}
              placeholder="e.g. Networking 101"
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full border border-blue-300 h-10 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6 w-full">
            <label className="block text-sm font-bold text-gray-700 mb-4">Credits</label>
            <input
              type="number"
              name="credits"
              value={credits}
              placeholder="e.g. 3"
              onChange={(e) => setCredits(e.target.value)}
              min="1"
              max="12"
              className="w-full border border-blue-300 h-10 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-bold text-gray-700 mb-4">Grade Items</p>
          {Array.isArray(gradeItems) &&
            gradeItems.map((item, index) => (
              <div
                key={index}
                className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-3 items-center`}
              >
                <input
                  placeholder="e.g. Midterm"
                  value={item.title || ''}
                  onChange={(e) => handleGradeItemChange(index, 'title', e.target.value)}
                  className="border border-blue-300 h-10 px-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Weight (%)"
                  value={item.weight || ''}
                  min={1}
                  max={100}
                  onChange={(e) => handleGradeItemChange(index, 'weight', e.target.value)}
                  className="border border-blue-300 h-10 px-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Grade"
                  value={item.score || ''}
                  min={0}
                  max={100}
                  onChange={(e) => handleGradeItemChange(index, 'score', e.target.value)}
                  className="border border-blue-300 h-10 px-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  placeholder="Type"
                  value={item.type}
                  onChange={(e) => handleGradeItemChange(index, 'type', e.target.value)}
                  className="border border-blue-300 h-10 px-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="text-white bg-red-600 h-10 hover:bg-red-700 px-3 rounded font-semibold"
                >
                  Delete
                </button>
              </div>
            ))}

          <button
            type="button"
            onClick={addGradeItem}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2 font-semibold"
          >
            + Add Grade Item
          </button>
        </div>
        <button
          type="submit"
          onClick={() => {
            if (gradeItems.length > 0) {
              const totalWeight = gradeItems.reduce(
                (acc, item) => acc + (parseFloat(item.weight) || 0),
                0,
              );
              if (totalWeight !== 100) {
                show('Total weight of grade items must equal 100%.', 'warning');
                return;
              }
              editCourse(newCourse);
            }
          }}
          className="w-full bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold"
        >
          Update Course
        </button>
      </div>
    </div>
  );
}

export default EditCourse;
