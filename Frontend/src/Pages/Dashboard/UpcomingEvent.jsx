import EventCard from '../../components/EventCard';
import { useEvent } from '../../contexts/EventContext';
import { useFormattedTime } from '../../hooks/useFormattedTime';
import { useFormattedDate } from '../../hooks/useFormattedDate';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';

function UpcomingEvent() {
  const { data: eventData } = useEvent();

  function getUpcomingEvent(events) {
    if (!Array.isArray(events) || events.length === 0) return null;

    const now = new Date();
    const futureEvents = events.filter(
      (event) => event?.event_time && new Date(event.event_time) > now,
    );

    if (futureEvents.length === 0) return null;
    return futureEvents.sort((a, b) => new Date(a.event_time) - new Date(b.event_time))[0];
  }

  const upcomingEvent = getUpcomingEvent(eventData?.events);
  const eventTitle = upcomingEvent?.title || 'Untitled Event';
  const eventTimeHours = upcomingEvent?.event_time.substring(11, 13);
  const isnight = eventTimeHours < 6 || eventTimeHours >= 18;

  const getTimeUntilEvent = (eventTime) => {
    const now = new Date();
    const event = new Date(eventTime);
    const diffInMs = event - now;
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInHours < 1) {
      const diffInMins = Math.floor(diffInMs / 60000);
      return `in ${diffInMins} minute${diffInMins !== 1 ? 's' : ''}`;
    } else if (diffInHours < 24) {
      return `in ${diffInHours} hour${diffInHours !== 1 ? 's' : ''}`;
    } else if (diffInDays < 7) {
      return `in ${diffInDays} day${diffInDays !== 1 ? 's' : ''}`;
    } else {
      return 'upcoming';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-rose-100 rounded-lg">
          <Calendar className="w-5 h-5 text-rose-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Upcoming Event</h3>
          <p className="text-xs text-gray-600">Next scheduled</p>
        </div>
      </div>

      {upcomingEvent ? (
        <div className="space-y-4">
          {/* Event Card */}
          <div className="block group cursor-pointer">
            <div className="transition-transform duration-200 group-hover:scale-[1.02]">
              <EventCard
                eventHours={useFormattedTime(upcomingEvent.event_time)}
                eventDate={useFormattedDate(upcomingEvent.event_time)}
                eventDesc={upcomingEvent.description}
                isnight={isnight}
              />
            </div>
          </div>

          {/* Event Info */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 truncate">{eventTitle}</h4>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{getTimeUntilEvent(upcomingEvent.event_time)}</span>
            </div>

            {upcomingEvent.location && (
              <div className="flex items-center gap-2">
                <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                  📍 {upcomingEvent.location}
                </span>
              </div>
            )}

            {upcomingEvent.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{upcomingEvent.description}</p>
            )}
          </div>

          {/* View Button */}
          <Link
            to="/calendar"
            className="block w-full px-4 py-2 text-center bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition font-medium text-sm"
          >
            View in Calendar
          </Link>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500 text-sm mb-3">No upcoming events</p>
            <Link
              to="/calendar"
              className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium"
            >
              View Calendar
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpcomingEvent;
