import { EventType } from '@/api/types';

const EventCard = ({ event }: { event: EventType }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-2 mb-2 text-gray-950 text-sm h-full">
      {event.title}
      <br />
      {event.start_time} : {event.end_time}
    </div>
  );
};

export default EventCard;
