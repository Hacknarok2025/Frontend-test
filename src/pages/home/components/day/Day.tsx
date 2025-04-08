import { EventType } from '@/api/types';
import { useRef } from 'react';
import EventCard from './EventCard';

type DayProps = {
  name: string;
  handleAddEvent: ({
    hours,
    minutes,
    day,
  }: {
    hours: number;
    minutes: number;
    day: string;
  }) => void;
  events: EventType[];
};

const Day = ({ name, handleAddEvent, events }: DayProps) => {
  const divRef = useRef<HTMLDivElement>(null);

  const parseToTime = (percentage: number) => {
    const hours = Math.floor((percentage / 100) * 24);
    const minutes = Math.round(((percentage / 100) * 24 - hours) * 60);

    if (minutes === 60) {
      return { hours: hours + 1, minutes: 0 };
    }
    return { hours, minutes };
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const { offsetY } = e.nativeEvent;
    const height = divRef.current.clientHeight;
    const percentage = (offsetY / height) * 100;

    const time = parseToTime(percentage);

    handleAddEvent({ hours: time.hours, minutes: time.minutes, day: name });

    console.log(time.hours, time.minutes, name);
  };

  // backwards

  const parseToPercentage = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return ((hours * 60 + minutes) / (24 * 60)) * 100;
  };

  const getPixels = (time: string): number => {
    const height = divRef.current?.clientHeight || 0;
    const offsetY = (parseToPercentage(time) / 100) * height;
    console.log('Offset:', offsetY);
    return offsetY;
  };

  return (
    <div className="flex-1 border-l-2 border-gray-950">
      <div className="text-center h-[25px]">{name}</div>
      <div
        className="bg-gray-800 text-white h-[1000px] relative"
        ref={divRef}
        onClick={handleClick}
      >
        {events
          .filter((ev) => ev.day === name)
          .map((ev) => (
            <div
              key={ev.start_time}
              className="relative w-full"
              style={{
                top: `${getPixels(ev.start_time)}px`,
                height: `${
                  getPixels(ev.end_time) - getPixels(ev.start_time)
                }px`,
              }}
            >
              <EventCard event={ev} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Day;
