import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, Calendar, Trash2, Edit } from 'lucide-react';
import { useEvent } from '../../contexts/EventContext';
import EventModal from './EventModal';
import Loader2 from '../../components/Loader/Loader2';
import { useToastContext } from '../../contexts/ToastContext';

function CalendarPage() {
  const { data, loadingEvent, createEvent, updateEvent, deleteEvent } = useEvent();
  const events = data?.events || [];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const { show } = useToastContext();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get calendar data
  const { year, month, daysInMonth, firstDayOfMonth } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    return {
      year,
      month,
      daysInMonth: lastDay.getDate(),
      firstDayOfMonth: firstDay.getDay(),
    };
  }, [currentDate]);

  // Get events for a specific date
  const getEventsForDate = (date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.event_time);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Handle date click
  const handleDateClick = (day) => {
    const clickedDate = new Date(year, month, day);
    if (clickedDate >= today) {
      setSelectedDate(clickedDate);
      setShowDayModal(true);
    }
  };

  // Handle create/edit event
  const handleSaveEvent = async (eventData) => {
    let result;

    if (eventData.id) {
      // Update existing event
      result = await updateEvent(eventData);
    } else {
      // Create new event
      result = await createEvent(eventData);
    }

    if (result.success) {
      setShowEventModal(false);
      setEditingEvent(null);
      show('Event saved successfully', 'success');
    } else {
      show(result.error || 'Failed to save event', 'error');
    }
  };

  // Handle delete event
  const handleDeleteEvent = (eventId) => {
    setEventToDelete(eventId);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;

    const result = await deleteEvent(eventToDelete);
    if (!result.success) {
      show(result.error || 'Failed to delete event', 'error');
    }

    setEventToDelete(null);
    setShowConfirmModal(false);
    show('Event deleted successfully', 'success');
  };

  // Handle edit event
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowDayModal(false);
    setShowEventModal(true);
  };

  // Generate calendar days
  const calendarDays = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getTypeColor = (type) => {
    const colors = {
      event: 'bg-blue-100 text-blue-700',
      exam: 'bg-orange-100 text-orange-700',
      meeting: 'bg-green-100 text-green-700',
      deadline: 'bg-red-100 text-red-700',
      reminder: 'bg-yellow-100 text-yellow-700',
      birthday: 'bg-pink-100 text-pink-700',
      appointment: 'bg-purple-100 text-purple-700',
    };
    return colors[type] || colors.event;
  };

  if (loadingEvent) {
    return <Loader2 />;
  }

  return (
    <div className="min-h-screen bg-white p-2">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Calendar</h1>
            <p className="text-gray-600">
              {events.length} {events.length === 1 ? 'event' : 'events'} scheduled
            </p>
          </div>
          <button
            onClick={goToToday}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 justify-center sm:justify-start"
          >
            <Calendar className="w-5 h-5" />
            Today
          </button>
        </div>

        {/* Calendar Container */}
        <div className="bg-white rounded-xl shadow-md flex-1 flex flex-col overflow-hidden">
          {/* Calendar Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold text-gray-900">
                {monthNames[month]} {year}
              </h2>

              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 p-4 sm:p-6 overflow-auto">
            <div className="h-full flex flex-col">
              {/* Day Names */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {dayNames.map((day) => (
                  <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2 flex-1">
                {calendarDays.map((day, index) => {
                  if (day === null) {
                    return <div key={`empty-${index}`} className="aspect-square" />;
                  }

                  const date = new Date(year, month, day);
                  const isPast = date < today;
                  const isToday = date.getTime() === today.getTime();
                  const dayEvents = getEventsForDate(date);
                  const hasEvents = dayEvents.length > 0;

                  return (
                    <div
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={`
                        aspect-square border rounded-lg p-2 flex flex-col
                        transition-all duration-200
                        ${
                          isPast
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white hover:bg-blue-50 hover:border-blue-300 cursor-pointer'
                        }
                        ${isToday ? 'border-blue-500 border-2 bg-blue-50' : 'border-gray-200'}
                        ${hasEvents && !isPast ? 'ring-2 ring-purple-200' : ''}
                      `}
                    >
                      <div
                        className={`
                        text-sm font-semibold mb-1
                        ${isToday ? 'text-blue-600' : ''}
                      `}
                      >
                        {day}
                      </div>

                      {hasEvents && (
                        <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className={`text-xs px-1 py-0.5 rounded truncate ${getTypeColor(
                                event.type,
                              )}`}
                              title={event.title}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Day Detail Modal */}
        {showDayModal && selectedDate && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black opacity-50 z-50" />
            <div
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
              onClick={() => setShowDayModal(false)}
            >
              <div
                className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </h3>
                    <button
                      onClick={() => setShowDayModal(false)}
                      className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  {/* Events List */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-3">Events</h4>
                    {getEventsForDate(selectedDate).length > 0 ? (
                      <div className="space-y-3">
                        {getEventsForDate(selectedDate).map((event) => (
                          <div
                            key={event.id}
                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-semibold text-gray-900 flex-1">{event.title}</h5>
                              <div className="flex items-center gap-2 ml-4">
                                <span
                                  className={`text-xs px-2 py-1 rounded ${getTypeColor(
                                    event.type,
                                  )}`}
                                >
                                  {event.type}
                                </span>
                                <button
                                  onClick={() => handleEditEvent(event)}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                  title="Edit event"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteEvent(event.id)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                  title="Delete event"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            {event.description && (
                              <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatTime(event.event_time)}
                              </div>
                              {event.reminder_time && (
                                <div className="flex items-center gap-1 text-yellow-600">
                                  <Clock className="w-4 h-4" />
                                  Reminder: {formatTime(event.reminder_time)}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No events for this day</p>
                    )}
                  </div>

                  {/* Add Event Button */}
                  <button
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 justify-center"
                    onClick={() => {
                      setShowDayModal(false);
                      setShowEventModal(true);
                    }}
                  >
                    <Plus className="w-5 h-5" />
                    Add Event
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Event Creation/Edit Modal */}
        <EventModal
          isOpen={showEventModal}
          onClose={() => {
            setShowEventModal(false);
            setEditingEvent(null);
          }}
          onSave={handleSaveEvent}
          selectedDate={selectedDate}
          editingEvent={editingEvent}
        />
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
                Are you sure you want to delete this event? This action cannot be undone.
              </p>
              <div className="flex justify-between space-x-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
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

export default CalendarPage;
