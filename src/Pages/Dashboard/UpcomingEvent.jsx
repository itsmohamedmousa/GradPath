import { ResponsiveContainer } from 'recharts';
import EventCard from '../../components/EventCard';

function UpcomingEvent() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <ResponsiveContainer width="100%" height={300}>
        <div className="flex flex-col justify-between items-center h-full">
          <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Upcoming Event</p>
          <EventCard />
          <p>Event Title here</p>
        </div>
      </ResponsiveContainer>
    </div>
  );
}

export default UpcomingEvent;
