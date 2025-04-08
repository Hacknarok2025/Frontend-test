import { useEffect, useState } from 'react';
import Day from './components/day/Day';
import Sidepanel from './components/sidepanel/Sidepanel';
import Modal from '@/commons/Modal';
import { fetchEvents } from '@/api/fetch';
import { EventType } from '@/api/types';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const Home = () => {
  const [events, setEvents] = useState<EventType[]>([]);

  const handleFetchEvents = async () => {
    console.log('fetch');
    try {
      const data: EventType[] = await fetchEvents();

      setEvents(data);
      console.log('Data:', data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    handleFetchEvents();
  }, []);

  const [isOpenModal, setIsOpenModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    from: '',
    to: '',
    description: '',
    day: '',
  });

  const handleAddEvent = ({
    hours,
    minutes,
    day,
  }: {
    hours: number;
    minutes: number;
    day: string;
  }) => {
    setFormData({
      ...formData,
      from:
        String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0'),
      to:
        String(hours + 1).padStart(2, '0') +
        ':' +
        String(minutes).padStart(2, '0'),
      day: day,
      title: `Event on ${day}`,
      description: `Description for event on ${day}`,
    });

    setIsOpenModal(true);
  };

  return (
    <>
      <div className="flex justify-between">
        <Sidepanel />
        {DAYS_OF_WEEK.map((day) => (
          <Day
            name={day}
            key={day}
            handleAddEvent={handleAddEvent}
            events={events}
          />
        ))}
      </div>

      <Modal
        setOpen={setIsOpenModal}
        open={isOpenModal}
        formData={formData}
        setFormData={setFormData}
      />
    </>
  );
};

export default Home;
