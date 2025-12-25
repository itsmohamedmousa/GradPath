import { useState, useMemo } from 'react';
import { Search, Calendar, BookOpen, SortAsc, SortDesc, Tag, Plus } from 'lucide-react';
import NoteCard from '../../components/NoteCard';
import { useNotes } from '../../contexts/NotesContext';
import Loader2 from '../../components/Loader/Loader2';
import { useNavigate } from 'react-router-dom';

function Notes() {
  const { data: notes, loadingNotes, refresh } = useNotes();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [sortBy, setSortBy] = useState('updated');
  const [sortOrder, setSortOrder] = useState('desc');

  // Extract unique subjects
  const subjects = useMemo(() => {
    if (!notes?.notes) return [];
    const uniqueSubjects = [...new Set(notes.notes.map((note) => note.subject).filter(Boolean))];
    return uniqueSubjects.sort();
  }, [notes]);

  // Extract unique tags
  const tags = useMemo(() => {
    if (!notes?.notes) return [];
    const allTags = notes.notes.flatMap((note) => note.tags || []);
    const uniqueTags = [...new Set(allTags.map((tag) => tag.name))];
    return uniqueTags.sort();
  }, [notes]);

  // Filter and sort notes
  const filteredNotes = useMemo(() => {
    if (!notes?.notes) return [];

    let filtered = notes.notes.filter((note) => {
      const matchesSearch =
        note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSubject = selectedSubject === 'all' || note.subject === selectedSubject;

      const matchesTag =
        selectedTag === 'all' || (note.tags && note.tags.some((tag) => tag.name === selectedTag));

      return matchesSearch && matchesSubject && matchesTag;
    });

    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'updated') {
        comparison = new Date(b.updated_at) - new Date(a.updated_at);
      } else if (sortBy === 'created') {
        comparison = new Date(b.created_at) - new Date(a.created_at);
      } else if (sortBy === 'title') {
        comparison = (a.title || '').localeCompare(b.title || '');
      }

      return sortOrder === 'asc' ? -comparison : comparison;
    });

    return filtered;
  }, [notes, searchQuery, selectedSubject, selectedTag, sortBy, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleNoteClick = (note) => {
    navigate(`/notes/${encodeURIComponent(note.title)}`);
  };

  if (loadingNotes) {
    return (
      <div>
        <Loader2 />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Notes</h1>
            <p className="text-gray-600">
              {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} found
            </p>
          </div>
          <button
            onClick={() => navigate('/notes/create')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 justify-center sm:justify-start"
          >
            <Plus className="w-5 h-5" />
            Create Note
          </button>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 md:p-6 mb-6 overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 items-center">
            {/* Search Input */}
            <div className="lg:col-span-2 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                <Search className="inline w-4 h-4 mr-1" />
                Search Notes
              </label>
              <input
                type="text"
                placeholder="Search by title or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-w-0 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   outline-none transition"
              />
            </div>

            {/* Subject Filter */}
            <div className="min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                <BookOpen className="inline w-4 h-4 mr-1" />
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full min-w-0 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   outline-none transition cursor-pointer"
              >
                <option value="all">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag Filter */}
            <div className="min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                <Tag className="inline w-4 h-4 mr-1" />
                Tag
              </label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full min-w-0 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   outline-none transition cursor-pointer"
              >
                <option value="all">All Tags</option>
                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div className="min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Sort By
              </label>

              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full min-w-0 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     outline-none transition cursor-pointer"
                >
                  <option value="updated">Last Modified</option>
                  <option value="created">Date Created</option>
                  <option value="title">Title</option>
                </select>

                <button
                  onClick={toggleSortOrder}
                  className="flex items-center justify-center px-3 py-2
                     border border-gray-300 rounded-lg
                     hover:bg-gray-50 transition shrink-0"
                  title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                >
                  {sortOrder === 'asc' ? (
                    <SortAsc className="w-5 h-5" />
                  ) : (
                    <SortDesc className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedSubject !== 'all' || selectedTag !== 'all') && (
            <div className="mt-4 flex flex-wrap gap-2 max-w-full">
              {searchQuery && (
                <span
                  className="inline-flex items-center max-w-full px-3 py-1 rounded-full text-sm
                         bg-blue-100 text-blue-800 truncate"
                >
                  <span className="truncate">Search: "{searchQuery}"</span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-2 shrink-0 hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              )}

              {selectedSubject !== 'all' && (
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm
                         bg-green-100 text-green-800"
                >
                  Subject: {selectedSubject}
                  <button
                    onClick={() => setSelectedSubject('all')}
                    className="ml-2 hover:text-green-900"
                  >
                    ×
                  </button>
                </span>
              )}

              {selectedTag !== 'all' && (
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm
                         bg-purple-100 text-purple-800"
                >
                  Tag: {selectedTag}
                  <button
                    onClick={() => setSelectedTag('all')}
                    className="ml-2 hover:text-purple-900"
                  >
                    ×
                  </button>
                </span>
              )}

              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSubject('all');
                  setSelectedTag('all');
                }}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="group cursor-pointer"
                onClick={() => handleNoteClick(note)}
              >
                <div className="mb-3">
                  <NoteCard text={note.content || 'No content'} />
                </div>
                <div className="px-2">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition truncate">
                    {note.title || 'Untitled'}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span className="truncate">{note.subject || 'No subject'}</span>
                    <span className="text-xs whitespace-nowrap ml-2">
                      {formatDate(note.updated_at)}
                    </span>
                  </div>
                  {/* Display tags */}
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag.id}
                          className="inline-block px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700"
                        >
                          {tag.name}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className="inline-block px-2 py-0.5 text-xs text-gray-500">
                          +{note.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="max-w-md mx-auto">
              <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No notes found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || selectedSubject !== 'all' || selectedTag !== 'all'
                  ? "Try adjusting your filters to find what you're looking for."
                  : 'Start creating notes to see them here.'}
              </p>
              {(searchQuery || selectedSubject !== 'all' || selectedTag !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSubject('all');
                    setSelectedTag('all');
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notes;
