import { useState, useEffect } from 'react';
import { X, Calendar, Clock, Type, FileText } from 'lucide-react';

function EventModal({ isOpen, onClose, onSave, selectedDate, editingEvent = null }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'event',
    event_time: '',
    reminder_time: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingEvent) {
      // Editing existing event
      const eventDate = new Date(editingEvent.event_time);
      const reminderDate = editingEvent.reminder_time ? new Date(editingEvent.reminder_time) : null;

      setFormData({
        id: editingEvent.id,
        title: editingEvent.title || '',
        description: editingEvent.description || '',
        type: editingEvent.type || 'event',
        event_time: formatDateTimeLocal(eventDate),
        reminder_time: reminderDate ? formatDateTimeLocal(reminderDate) : '',
      });
    } else if (selectedDate) {
      // Creating new event
      const dateTime = new Date(selectedDate);
      dateTime.setHours(12, 0, 0, 0);

      setFormData({
        title: '',
        description: '',
        type: 'event',
        event_time: formatDateTimeLocal(dateTime),
        reminder_time: '',
      });
    }
  }, [selectedDate, editingEvent]);

  const formatDateTimeLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.event_time) {
      newErrors.event_time = 'Event time is required';
    }

    if (formData.reminder_time && formData.event_time) {
      const reminderDate = new Date(formData.reminder_time);
      const eventDate = new Date(formData.event_time);
      if (reminderDate >= eventDate) {
        newErrors.reminder_time = 'Reminder must be before event time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Format dates to MySQL datetime format
    const eventDateTime = new Date(formData.event_time)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');
    const reminderDateTime = formData.reminder_time
      ? new Date(formData.reminder_time).toISOString().slice(0, 19).replace('T', ' ')
      : null;

    const submitData = {
      ...formData,
      event_time: eventDateTime,
      reminder_time: reminderDateTime,
    };

    onSave(submitData);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black opacity-50 z-50" onClick={onClose} />

      {/* Modal */}
      <div
        className="fixed inset-0 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="inline w-4 h-4 mr-1" />
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter event title"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add a description (optional)"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Type className="inline w-4 h-4 mr-1" />
                  Event Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition cursor-pointer"
                >
                  <option value="event">Event</option>
                  <option value="meeting">Meeting</option>
                  <option value="exam">Exam</option>
                  <option value="deadline">Deadline</option>
                  <option value="reminder">Reminder</option>
                  <option value="birthday">Birthday</option>
                  <option value="appointment">Appointment</option>
                </select>
              </div>

              {/* Event Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Event Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="event_time"
                  value={formData.event_time}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                    errors.event_time ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.event_time && (
                  <p className="text-red-500 text-sm mt-1">{errors.event_time}</p>
                )}
              </div>

              {/* Reminder Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline w-4 h-4 mr-1" />
                  Reminder Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  name="reminder_time"
                  value={formData.reminder_time}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                    errors.reminder_time ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.reminder_time && (
                  <p className="text-red-500 text-sm mt-1">{errors.reminder_time}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Set when you want to be reminded about this event
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EventModal;
