const hours = [
  '0:00',
  '1:00',
  '2:00',
  '3:00',
  '4:00',
  '5:00',
  '6:00',
  '7:00',
  '8:00',
  '9:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
];
const Sidepanel = () => {
  return (
    <div>
      <div className="h-[25px]">Calendar</div>
      <div className="bg-gray-200 h-[1000px] text-gray-800 flex flex-col">
        {hours.map((hour) => (
          <div className="flex-1 border-b-2 border-gray-950" key={hour}>
            {hour}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidepanel;
