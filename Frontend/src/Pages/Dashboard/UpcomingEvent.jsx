import { ResponsiveContainer } from 'recharts';
import EventCard from '../../components/EventCard';
import { useEvent } from '../../contexts/EventContext';
import { useFormattedTime } from '../../hooks/useFormattedTime';
import { useFormattedDate } from '../../hooks/useFormattedDate';
import { Link } from 'react-router-dom';

function UpcomingEvent() {
  const { data: eventData } = useEvent();
  console.log('Event data in UpcomingEvent:', eventData);

  function getUpcomingEvent(events) {
    if (!Array.isArray(events) || events.length === 0) return null;

    const now = new Date();
    const futureEvents = events.filter(
      (event) => event?.event_time && new Date(event.event_time) > now,
    );

    if (futureEvents.length === 0) return null;
    return futureEvents.sort((a, b) => new Date(a.event_time) - new Date(b.event_time))[0];
  }

  // Fixed: Use eventData?.events (plural) instead of event?.event
  const upcomingEvent = getUpcomingEvent(eventData?.events);
  const eventTitle = upcomingEvent?.title;
  const eventTimeHours = upcomingEvent?.event_time.substring(11, 13);
  const isnight = eventTimeHours < 6 || eventTimeHours >= 18;

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      {upcomingEvent ? (
        <ResponsiveContainer width="100%" height={300}>
          <div className="w-full flex flex-col justify-between text-center h-full">
            <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Upcoming Event</p>
            <div to={`/calendar/${upcomingEvent.title}`} className="cursor-pointer">
              <div className="text-left">
                <EventCard
                  eventHours={useFormattedTime(upcomingEvent.event_time)}
                  eventDate={useFormattedDate(upcomingEvent.event_time)}
                  eventDesc={upcomingEvent.description}
                  isnight={isnight}
                />
              </div>
            </div>
            <p>{eventTitle}</p>
          </div>
        </ResponsiveContainer>
      ) : (
        <div className="text-center cursor-not-allowed p-4 flex flex-col items-center justify-center h-full">
          <p className="text-gray-600">No upcoming events available</p>
        </div>
      )}
    </div>
  );
}

export default UpcomingEvent;
