import Day from './components/day/Day';
import Sidepanel from './components/sidepanel/Sidepanel';

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
  return (
    <div className="flex justify-between">
      <Sidepanel />
      {DAYS_OF_WEEK.map((day) => (
        <Day name={day} key={day} />
      ))}
    </div>
  );
};

export default Home;
