import { useState } from 'react';

function AddCourse() {
  const [gradeItems, setGradeItems] = useState([{ name: '', weight: '', grade: '' }]);

  const handleGradeItemChange = (index, field, value) => {
    const updated = [...gradeItems];
    updated[index][field] = value;
    setGradeItems(updated);
  };

  const addGradeItem = () => {
    setGradeItems([...gradeItems, { name: '', weight: '', grade: '' }]);
    console.log(gradeItems);
  };

  return (
    <>
      <h2 className="mt-10 ml-4 text-2xl font-bold mb-6 text-black font-[Playfair_Display]">Add Course</h2>
      <div className="min-w-full mx-auto bg-gray-100 p-6 rounded-xl border border-blue-100 shadow-md mb-10">

        <div className="flex flex-row gap-4 w-full items-between justify-between">
          <div className="mb-6 w-full">
            <label className="block text-sm font-bold text-gray-700 mb-4">Course Name</label>
            <input
              name="course_name"
              placeholder="e.g. Networking 101"
              className="w-full border border-blue-300 h-10 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6 w-full">
            <label className="block text-sm font-bold text-gray-700 mb-4">Credits</label>
            <input
              type="number"
              name="credits"
              placeholder="e.g. 3"
              min="1"
              max="12"
              className="w-full border border-blue-300 h-10 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>  
        </div>

        <div className="mb-4">
          <p className="text-md font-bold text-gray-700 mb-4">Grade Items</p>
          {gradeItems.map((item, index) => (
            <div key={index} className={`grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 items-center`}>
              <input
                placeholder="e.g. Midterm"
                value={item.name}
                onChange={(e) => handleGradeItemChange(index, 'name', e.target.value)}
                className="border border-blue-300 h-10 px-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Weight (%)"
                value={item.weight}
                min={0}
                max={100}
                onChange={(e) => handleGradeItemChange(index, 'weight', e.target.value)}
                className="border border-blue-300 h-10 px-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Grade"
                value={item.grade}
                min={0}
                max={100}
                onChange={(e) => handleGradeItemChange(index, 'grade', e.target.value)}
                className="border border-blue-300 h-10 px-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
          className="w-full bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold"
        >
          Add Course
        </button>
      </div>
    </>
  );
}

export default AddCourse;
