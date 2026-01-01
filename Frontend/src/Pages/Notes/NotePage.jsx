import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Calendar, BookOpen, Tag, X, Download } from 'lucide-react';
import { useNotes } from '../../contexts/NotesContext';
import { useToastContext } from '../../contexts/ToastContext';
import { useState } from 'react';
import Loader2 from '../../components/Loader/Loader2';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

function NotePage() {
  const { noteTitle } = useParams();
  const navigate = useNavigate();
  const { data: notes, deleteNote, updateNote, loadingNotes } = useNotes();
  const { show } = useToastContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedSubject, setEditedSubject] = useState('');
  const [editedTags, setEditedTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Find the note by title (decode URL in case of special characters)
  const decodedTitle = decodeURIComponent(noteTitle);
  const note = notes?.notes?.find((n) => n.title === decodedTitle);

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle delete
  const handleDelete = async () => {
    const success = await deleteNote(note.id);
    if (success) {
      show('Note deleted successfully', 'success');
      navigate('/notes');
    } else {
      show('Failed to delete note', 'error');
    }
  };

  // Handle edit mode
  const handleEditClick = () => {
    setEditedTitle(note.title);
    setEditedContent(note.content);
    setEditedSubject(note.subject || '');
    setEditedTags(note.tags?.map((tag) => tag.name) || []);
    setTagInput('');
    setIsEditing(true);
  };

  // Handle adding tag
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (!trimmedTag) {
      show('Tag cannot be empty', 'warning');
      return;
    }
    if (editedTags.includes(trimmedTag)) {
      show('Tag already exists', 'warning');
      return;
    }
    setEditedTags([...editedTags, trimmedTag]);
    setTagInput('');
    show(`Tag "${trimmedTag}" added`, 'success');
  };

  // Handle removing tag
  const handleRemoveTag = (tagToRemove) => {
    setEditedTags(editedTags.filter((tag) => tag !== tagToRemove));
  };

  // Handle tag input key press
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Handle save
  const handleSave = async () => {
    // Validation
    if (!editedTitle.trim()) {
      show('Note title cannot be empty', 'warning');
      return;
    }

    const success = await updateNote(note.id, {
      title: editedTitle,
      content: editedContent,
      subject: editedSubject,
      tags: editedTags,
    });

    if (success) {
      show('Note updated successfully', 'success');
      setIsEditing(false);
      // Navigate to new URL if title changed
      if (editedTitle !== note.title) {
        navigate(`/notes/${encodeURIComponent(editedTitle)}`);
      }
    } else {
      show('Failed to update note', 'error');
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setIsEditing(false);
  };

  if (loadingNotes) {
    return <Loader2 />;
  }

  const handleDownload = () => {
    // Create a blob with the markdown content
    const blob = new Blob([note.content], { type: 'text/markdown' });

    // Create a temporary link element
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    // Set the filename (replaces spaces with underscores for better compatibility)
    link.href = url;
    link.download = `${note.title.replace(/\s+/g, '_')}.md`;

    // Append to body, click, and cleanup
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    show('Download started', 'success');
  };

  // If note not found
  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/notes')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Notes
          </button>
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Note Not Found</h2>
            <p className="text-gray-600 mb-6">The note "{decodedTitle}" could not be found.</p>
            <button
              onClick={() => navigate('/notes')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Go Back to Notes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-2">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/notes')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Notes
        </button>

        {/* Note Content */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              {isEditing ? (
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-3xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none flex-1 mr-4"
                  placeholder="Note title..."
                />
              ) : (
                <h1 className="text-3xl font-bold text-gray-900 flex-1">
                  {note.title || 'Untitled'}
                </h1>
              )}

              {!isEditing && (
                <div className="flex gap-2">
                  <button
                    onClick={handleDownload}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                    title="Download as Markdown"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleEditClick}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Edit note"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete note"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {isEditing ? (
                  <input
                    type="text"
                    value={editedSubject}
                    onChange={(e) => setEditedSubject(e.target.value)}
                    className="border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                    placeholder="Subject..."
                  />
                ) : (
                  <span>{note.subject || 'No subject'}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Updated: {formatDate(note.updated_at)}</span>
              </div>
            </div>

            {/* Tags Section */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Tags</span>
              </div>

              {isEditing ? (
                <div>
                  {/* Tag Input */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 mb-3 min-w-0">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyPress}
                      className="flex-1 min-w-0 h-10 px-3 text-sm
                        border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        outline-none transition"
                      placeholder="Add a tag (press Enter)"
                    />

                    <button
                      onClick={handleAddTag}
                      className="h-10 px-4 text-sm
                        bg-blue-600 text-white rounded-lg
                        hover:bg-blue-700 transition
                        whitespace-nowrap shrink-0
                        flex items-center justify-center"
                    >
                      Add
                    </button>
                  </div>

                  {/* Editable Tags */}
                  <div className="flex flex-wrap gap-2">
                    {editedTags.length > 0 ? (
                      editedTags.map((tag, index) => (
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
                      <span className="text-sm text-gray-400">No tags yet</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {note.tags && note.tags.length > 0 ? (
                    note.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-block px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700"
                      >
                        {tag.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">No tags</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {isEditing ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full min-h-[400px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y"
                placeholder="Note content..."
              />
            ) : (
              <div className="prose max-w-none prose-slate">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                  {note.content || 'No content'}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="border-t border-gray-200 p-6 flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          )}

          {/* Footer Info */}
          {!isEditing && (
            <div className="border-t border-gray-200 p-6 bg-gray-50 text-sm text-gray-600">
              <p>Created: {formatDate(note.created_at)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {showConfirmModal && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black opacity-50 z-50 transition-opacity duration-300"></div>

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="bg-white rounded-lg shadow-xl p-6 w-80 text-center
                   transform transition-all duration-300 ease-out
                   opacity-100 translate-y-0"
              style={{
                animation: 'popUp 0.3s ease forwards',
              }}
            >
              <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this note? This action cannot be undone.
              </p>
              <div className="flex justify-between space-x-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    handleDelete();
                  }}
                  className="flex-1 py-2 text-sm rounded bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes popUp {
              0% {
                opacity: 0;
                transform: translateY(50px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </>
      )}
    </div>
  );
}

export default NotePage;
