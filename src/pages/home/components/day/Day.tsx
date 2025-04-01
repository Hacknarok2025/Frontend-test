import { useRef } from 'react';

type DayProps = {
  name: string;
};

const Day = ({ name }: DayProps) => {
  const divRef = useRef(null);

  const parseToTime = (percentage: number) => {
    const hours = Math.floor((percentage / 100) * 24);
    const minutes = Math.round(((percentage / 100) * 24 - hours) * 60);

    if (minutes === 60) {
      return { hours: hours + 1, minutes: 0 };
    }
    return { hours, minutes };
  };

  const handleClick = (e) => {
    if (!divRef.current) return;

    const { offsetY } = e.nativeEvent;
    const height = divRef.current.clientHeight;
    const percentage = (offsetY / height) * 100;

    const time = parseToTime(percentage);

    console.log(time.hours, time.minutes, name);
  };

  return (
    <div className="flex-1 border-l-2 border-gray-950">
      <div className="text-center h-[25px]">{name}</div>
      <div
        className="bg-gray-800 text-white h-[1000px]"
        ref={divRef}
        onClick={handleClick}
      ></div>
    </div>
  );
};

export default Day;
