import { ResponsiveContainer } from 'recharts';
import NoteCard from '../../components/NoteCard';
import { useNotes } from '../../contexts/NotesContext';
import { Link } from 'react-router-dom';

function LastModifiedNote() {
  const { data: notes } = useNotes();
  console.log(notes);
  const lastModifiedNote =
    notes?.notes?.length > 0
      ? notes.notes.reduce((latest, current) => {
          return new Date(current.updated_at) > new Date(latest.updated_at) ? current : latest;
        })
      : null;
  const lastModifiedNoteContent = lastModifiedNote?.content
    ? lastModifiedNote.content
    : 'No Content';
  const noteTitle = lastModifiedNote?.title ? lastModifiedNote.title : 'No Title';

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      {lastModifiedNote ? (
        <ResponsiveContainer width="100%" height={300}>
          <div className="flex flex-col items-center justify-around">
            <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Last Modified Note</p>
            <Link to={`/notes/${lastModifiedNote.title}`} className="cursor-pointer">
              <NoteCard text={lastModifiedNoteContent} />
            </Link>
            <p>{noteTitle}</p>
          </div>
        </ResponsiveContainer>
      ) : (
        <div className="text-center cursor-not-allowed p- flex flex-col items-center justify-center h-full">
          <p className="text-gray-600">No notes available</p>
        </div>
      )}
    </div>
  );
}

export default LastModifiedNote;
