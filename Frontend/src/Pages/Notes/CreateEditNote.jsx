import { useState, useEffect } from 'react';
import { Save, X, Tag, BookOpen, Calendar, ArrowLeft } from 'lucide-react';

function CreateEditNote({ noteId = null, onSave, onCancel }) {
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Common subjects for autocomplete
  const commonSubjects = [
    'Programming',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'History',
    'English',
    'Literature',
    'Economics',
    'Psychology',
    'Philosophy',
    'Art',
    'Music',
    'Business',
    'Computer Science',
    'Other'
  ];

  // Load note data if editing (you'll fetch this from your API)
  useEffect(() => {
    if (noteId) {
      // TODO: Fetch note data from API
      // const fetchNote = async () => {
      //   const response = await fetch(`/api/notes/${noteId}`);
      //   const data = await response.json();
      //   setTitle(data.title);
      //   setContent(data.content);
      //   setSubject(data.subject);
      //   setTags(data.tags || []);
      // };
      // fetchNote();
    }
  }, [noteId]);

  // Validate form
  const validate = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (!subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle tag addition
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    setIsSaving(true);

    try {
      const noteData = {
        title: title.trim(),
        content: content.trim(),
        subject: subject.trim(),
        tags: tags,
      };

      // TODO: Replace with your API call
      console.log('Saving note:', noteData);
      
      // if (noteId) {
      //   await fetch(`/api/notes/${noteId}`, {
      //     method: 'PUT',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(noteData)
      //   });
      // } else {
      //   await fetch('/api/notes', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(noteData)
      //   });
      // }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSave) {
        onSave(noteData);
      }
    } catch (error) {
      console.error('Error saving note:', error);
      setErrors({ submit: 'Failed to save note. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    // navigate('/notes')
  };

  // Character count for content
  const contentLength = content.length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-200 rounded-lg transition"
              title="Back to notes"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {noteId ? 'Edit Note' : 'Create New Note'}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition font-medium hidden md:flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition font-medium flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {errors.submit}
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* Title Input */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className={`w-full px-4 py-3 text-lg border ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Subject and Tags Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subject Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="inline w-4 h-4 mr-1" />
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                list="subjects"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Select or type subject..."
                className={`w-full px-4 py-2 border ${
                  errors.subject ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
              />
              <datalist id="subjects">
                {commonSubjects.map(subj => (
                  <option key={subj} value={subj} />
                ))}
              </datalist>
              {errors.subject && (
                <p className="mt-2 text-sm text-red-600">{errors.subject}</p>
              )}
            </div>

            {/* Tags Input */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="inline w-4 h-4 mr-1" />
                Tags (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add tags..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-medium"
                >
                  Add
                </button>
              </div>
              
              {/* Display Tags */}
              {tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-blue-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content Textarea */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Content <span className="text-red-500">*</span>
              </label>
              <span className="text-sm text-gray-500">
                {contentLength} characters
              </span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
              rows={15}
              className={`w-full px-4 py-3 border ${
                errors.content ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-y font-mono text-sm leading-relaxed`}
            />
            {errors.content && (
              <p className="mt-2 text-sm text-red-600">{errors.content}</p>
            )}
          </div>

          {/* Metadata Display */}
          <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-600 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {noteId ? 'Last edited: Just now' : 'Created: Just now'}
              </span>
            </div>
          </div>

          {/* Mobile Submit Buttons */}
          <div className="md:hidden flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition font-medium"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateEditNote;