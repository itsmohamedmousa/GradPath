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

    show('Download started', 'info');
  };

  // If note not found
  if (!note) {
    return (
      <div className="min-h-screen bg-[rgb(var(--background))] p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/notes')}
            className="flex items-center gap-2 text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text))] mb-6 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Notes
          </button>
          <div className="bg-[rgb(var(--card))] rounded-lg shadow-md p-12 text-center">
            <h2 className="text-2xl font-bold text-[rgb(var(--text))] mb-2">Note Not Found</h2>
            <p className="text-[rgb(var(--text-secondary))] mb-6">The note "{decodedTitle}" could not be found.</p>
            <button
              onClick={() => navigate('/notes')}
              className="px-6 py-2 bg-[rgb(var(--primary))] text-[rgb(var(--text))] rounded-lg hover:bg-[rgb(var(--primary-hover))] transition"
            >
              Go Back to Notes
            </button>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Note Content */}
        <div className="bg-[rgb(var(--card))] rounded-lg shadow-md overflow-hidden border border-[rgb(var(--border))]">
          {/* Header */}
          <div className="border-b border-[rgb(var(--border))] p-4 md:p-6">
            {/* Title and Actions Row: Column on mobile, Row on md+ */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
              {isEditing ? (
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-2xl md:text-3xl font-bold text-[rgb(var(--text))] border-b-2 border-blue-500 focus:outline-none w-full md:flex-1"
                  placeholder="Note title..."
                />
              ) : (
                <h1 className="text-2xl md:text-3xl font-bold text-[rgb(var(--text))] flex-1 break-words">
                  {note.title || 'Untitled'}
                </h1>
              )}

              {!isEditing && (
                <div className="flex w-full md:w-auto items-center gap-2 sm:gap-3">
                  {/* Download Button */}
                  <button
                    onClick={handleDownload}
                    className="flex flex-1 md:flex-none items-center justify-center gap-2 p-2.5 md:p-2 
                       text-green-600 hover:bg-green-50 rounded-lg border border-green-100 
                       md:border-none transition-all active:scale-95"
                    title="Download as Markdown"
                  >
                    <Download className="w-5 h-5" />
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={handleEditClick}
                    className="flex flex-1 md:flex-none items-center justify-center gap-2 p-2.5 md:p-2 
                       text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-100 
                       md:border-none transition-all active:scale-95"
                    title="Edit note"
                  >
                    <Edit className="w-5 h-5" />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="flex flex-1 md:flex-none items-center justify-center gap-2 p-2.5 md:p-2 
                       text-red-600 hover:bg-red-50 rounded-lg border border-red-100 
                       md:border-none transition-all active:scale-95"
                    title="Delete note"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Metadata Row: flex-wrap ensures it flows nicely on narrow screens */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-[rgb(var(--text-secondary))] mb-6">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 shrink-0 text-[rgb(var(--text-secondary))]" />
                {isEditing ? (
                  <input
                    type="text"
                    value={editedSubject}
                    onChange={(e) => setEditedSubject(e.target.value)}
                    className="border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                    placeholder="Subject..."
                  />
                ) : (
                  <span className="font-medium">{note.subject || 'No subject'}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 shrink-0 text-[rgb(var(--text-secondary))]" />
                <span>
                  Updated: <span className="font-medium">{formatDate(note.updated_at)}</span>
                </span>
              </div>
            </div>

            {/* Tags Section */}
            <div className="pt-2 border-t border-[rgb(var(--border))] md:border-none">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-[rgb(var(--text-secondary))]" />
                <span className="text-sm font-semibold text-[rgb(var(--text))] uppercase tracking-wider">
                  Tags
                </span>
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  {/* Tag Input: Column on tiny mobile, Row on SM+ */}
                  <div className="flex flex-col sm:flex-row items-stretch gap-2 min-w-0">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyPress}
                      className="flex-1 min-w-0 h-10 px-3 text-sm text-[rgb(var(--text))]
                        border border-[rgb(var(--border))] rounded-lg
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        outline-none transition"
                      placeholder="Add a tag..."
                    />
                    <button
                      onClick={handleAddTag}
                      className="h-10 px-6 bg-[rgb(var(--primary))] text-[rgb(var(--text))] rounded-lg
                        hover:bg-[rgb(var(--primary-hover))] transition font-medium text-sm shrink-0"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {editedTags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-purple-50 text-purple-700 border border-purple-100"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {note.tags && note.tags.length > 0 ? (
                    note.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-3 py-1 rounded-full text-sm bg-purple-50 text-purple-700 border border-purple-100 font-medium"
                      >
                        {tag.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-[rgb(var(--text-secondary))] italic">No tags associated</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4 md:p-8">
            {isEditing ? (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full min-h-[400px] p-4 text-[rgb(var(--text))] border border-[rgb(var(--border))] rounded-lg 
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y"
                placeholder="Start writing your note..."
              />
            ) : (
              <div
                className="prose prose-slate max-w-none 
                    prose-headings:font-bold prose-a:text-blue-600 
                    prose-img:rounded-xl prose-code:text-blue-500"
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                  {note.content || 'No content'}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Footer Actions / Info */}
          {isEditing ? (
            <div className="border-t border-[rgb(var(--border))] p-4 md:p-6 bg-card flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-6 py-2.5 border border-[rgb(var(--border))] text-[rgb(var(--text))] rounded-lg bg-[rgb(var(--card))] hover:bg-[rgb(var(--hover))] transition font-medium order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-[rgb(var(--primary))] text-white rounded-lg hover:bg-[rgb(var(--primary-hover))] shadow-sm transition font-medium order-1 sm:order-2"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="border-t border-[rgb(var(--border))] p-4 md:p-6 bg-[rgb(var(--card))] text-xs md:text-sm text-[rgb(var(--text-secondary))] flex justify-between items-center">
              <span>Created: {formatDate(note.created_at)}</span>
              <span className="hidden sm:inline">ID: {note.id}</span>
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
              className="bg-[rgb(var(--card))] rounded-lg shadow-xl p-6 w-80 text-center
                   transform transition-all duration-300 ease-out
                   opacity-100 translate-y-0"
              style={{
                animation: 'popUp 0.3s ease forwards',
              }}
            >
              <h2 className="text-lg font-semibold mb-4 text-[rgb(var(--text))]">Confirm Delete</h2>
              <p className="text-sm text-[rgb(var(--text-secondary))] mb-6">
                Are you sure you want to delete this note? This action cannot be undone.
              </p>
              <div className="flex justify-between space-x-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-2 text-sm rounded border border-[rgb(var(--border))] bg-[rgb(var(--card))] hover:bg-[rgb(var(--hover))] text-[rgb(var(--text-secondary))]"
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
