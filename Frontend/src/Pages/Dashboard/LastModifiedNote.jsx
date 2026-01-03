import NoteCard from '../../components/NoteCard';
import { useNotes } from '../../contexts/NotesContext';
import { Link } from 'react-router-dom';
import { FileText, Clock } from 'lucide-react';

function LastModifiedNote() {
  const { data: notes } = useNotes();

  const lastModifiedNote =
    notes?.notes?.length > 0
      ? notes.notes.reduce((latest, current) => {
          return new Date(current.updated_at) > new Date(latest.updated_at) ? current : latest;
        })
      : null;

  const lastModifiedNoteContent = lastModifiedNote?.content || 'No Content';
  const noteTitle = lastModifiedNote?.title || 'Untitled';

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 60) {
      return `${diffInMins} minute${diffInMins !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  return (
    <div className="bg-[rgb(var(--card))] rounded-xl shadow-md p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-amber-100 rounded-lg">
          <FileText className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h3 className="font-bold text-[rgb(var(--text))]">Recent Note</h3>
          <p className="text-xs text-[rgb(var(--text-secondary))]">Last modified</p>
        </div>
      </div>

      {lastModifiedNote ? (
        <div className="space-y-4">
          {/* Note Preview */}
          <Link to={`/notes/${encodeURIComponent(lastModifiedNote.title)}`} className="block group">
            <div className="transition-transform duration-200 group-hover:scale-[1.02]">
              <NoteCard text={lastModifiedNoteContent} />
            </div>
          </Link>

          {/* Note Info */}
          <div className="space-y-2">
            <Link to={`/notes/${encodeURIComponent(lastModifiedNote.title)}`} className="block">
              <h4 className="font-semibold text-[rgb(var(--text))] hover:text-[rgb(var(--primary))] transition truncate">
                {noteTitle}
              </h4>
            </Link>

            {lastModifiedNote.subject && (
              <div className="flex items-center gap-2">
                <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                  {lastModifiedNote.subject}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-[rgb(var(--text-secondary))]">
              <Clock className="w-3 h-3" />
              <span>{formatDate(lastModifiedNote.updated_at)}</span>
            </div>

            {lastModifiedNote.tags && lastModifiedNote.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                {lastModifiedNote.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-block px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700"
                  >
                    {tag.name}
                  </span>
                ))}
                {lastModifiedNote.tags.length > 3 && (
                  <span className="inline-block px-2 py-0.5 text-xs text-gray-500">
                    +{lastModifiedNote.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* View Button */}
          <Link
            to={`/notes/${encodeURIComponent(lastModifiedNote.title)}`}
            className="block w-full px-4 py-2 text-center bg-amber-600 hover:bg-amber-700 text-[rgb(var(--text))] rounded-lg transition font-medium text-sm"
          >
            View Note
          </Link>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-12 h-12 mx-auto mb-3 text-[rgb(var(--text-secondary))]" />
            <p className="text-[rgb(var(--text-secondary))] text-sm mb-3">No notes available</p>
            <Link
              to="/notes/create"
              className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-[rgb(var(--text))] rounded-lg transition text-sm font-medium"
            >
              Create Your First Note
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default LastModifiedNote;
