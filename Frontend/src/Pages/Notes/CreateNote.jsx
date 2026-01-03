import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Tag, X } from 'lucide-react';
import { useNotes } from '../../contexts/NotesContext';
import { useToastContext } from '../../contexts/ToastContext';
import { useState } from 'react';

function CreateNote() {
  const navigate = useNavigate();
  const { createNote } = useNotes();
  const { show } = useToastContext();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Handle adding tag
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (!trimmedTag) {
      show('Tag cannot be empty', 'warning');
      return;
    }
    if (tags.includes(trimmedTag)) {
      show('Tag already exists', 'warning');
      return;
    }
    setTags([...tags, trimmedTag]);
    setTagInput('');
    show(`Tag "${trimmedTag}" added`, 'success');
  };

  // Handle removing tag
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Handle tag input key press
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Handle create note
  const handleCreate = async () => {
    // Validation
    if (!title.trim()) {
      show('Note title is required', 'warning');
      return;
    }

    if (!content.trim()) {
      show('Note content is required', 'warning');
      return;
    }

    setIsCreating(true);

    const result = await createNote({
      title: title.trim(),
      content: content.trim(),
      subject: subject.trim(),
      tags: tags,
    });

    setIsCreating(false);

    if (result) {
      show('Note created successfully', 'success');
      navigate('/notes');
    } else {
      show('Failed to create note', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))] p-2">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/notes')}
          className="flex items-center gap-2 text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text))] mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Notes
        </button>

        {/* Create Note Form */}
        <div className="bg-[rgb(var(--card))] rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="border-b border-[rgb(var(--border))] p-6">
            <h1 className="text-3xl font-bold text-[rgb(var(--text))] mb-6">Create New Note</h1>

            {/* Title Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 text-[rgb(var(--text))] border border-[rgb(var(--border))] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Enter note title..."
              />
            </div>

            {/* Subject Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 text-[rgb(var(--text))] border border-[rgb(var(--border))] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="e.g., Mathematics, History, etc."
              />
            </div>

            {/* Tags Section */}
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                <Tag className="inline w-4 h-4 mr-1" />
                Tags
              </label>

              {/* Tag Input */}
              <div className="flex flex-col sm:flex-row items-center gap-2 mb-3 min-w-0">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyPress}
                  className="flex-1 min-w-0 h-10 px-3 text-sm text-[rgb(var(--text))]
                    border border-[rgb(var(--border))] rounded-lg
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    outline-none transition"
                  placeholder="Add a tag (press Enter)"
                />

                <button
                  onClick={handleAddTag}
                  className="h-10 px-4 text-sm
                    bg-[rgb(var(--primary))] text-[rgb(var(--text))] rounded-lg
                    hover:bg-[rgb(var(--primary-hover))] transition
                    whitespace-nowrap shrink-0
                    flex items-center justify-center"
                >
                  Add
                </button>
              </div>

              {/* Tags Display */}
              <div className="flex flex-wrap gap-2">
                {tags.length > 0 ? (
                  tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:bg-purple-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-[rgb(var(--text-secondary))]">No tags yet</span>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[400px] p-4 text-[rgb(var(--text))] border border-[rgb(var(--border))] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y"
              placeholder="Write your note content here..."
            />
          </div>

          {/* Actions */}
          <div className="border-t border-[rgb(var(--border))] p-6 flex justify-end gap-3">
            <button
              onClick={() => navigate('/notes')}
              className="px-6 py-2 border border-[rgb(var(--border))] text-[rgb(var(--text))] rounded-lg hover:bg-[rgb(var(--hover))] transition"
              disabled={isCreating}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={isCreating}
              className="px-6 py-2 bg-[rgb(var(--primary))] text-[rgb(var(--text))] rounded-lg hover:bg-[rgb(var(--primary-hover))] transition disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isCreating ? 'Creating...' : 'Create Note'}
            </button>
          </div>
        </div>

        {/* Helper Text */}
        <div className="mt-4 text-sm text-[rgb(var(--text-secondary))] text-center">
          <span className="text-red-500">*</span> Required fields
        </div>
      </div>
    </div>
  );
}

export default CreateNote;
