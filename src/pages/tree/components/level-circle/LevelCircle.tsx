type LevelCircleProps = {
  level: number;
  top: string;
  left: string;
  disabled?: boolean;
};

const LevelCircle = ({
  level,
  top,
  left,
  disabled = false,
}: LevelCircleProps) => {
  level = 1;

  const containerClass = `absolute flex flex-col items-center transition-all duration-500 transform ${
    disabled ? 'opacity-70' : 'hover:scale-110 group'
  }`;

  const imageContainerClass = `w-32 h-16 overflow-hidden skew-x-12 transition-all duration-500 ${
    disabled ? 'bg-gray-400' : 'bg-black group-hover:bg-white'
  }`;

  const labelClass = `flex justify-center items-center w-60 h-10 text-lg font-bold skew-x-12 text-center transition-all duration-500 ${
    disabled
      ? 'bg-gray-400 text-gray-700'
      : 'bg-black text-white group-hover:bg-white group-hover:text-black'
  }`;

  return (
    <div style={{ top, left }} className={containerClass}>
      <div className={imageContainerClass}>
        <img
          src={`/imgs/level${level}.png`}
          alt={`Level ${level}`}
          className="w-full h-full object-cover opacity-100"
          style={disabled ? { opacity: 0.5 } : {}}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/imgs/placeholder.png';
          }}
        />
      </div>

      <div className={labelClass}>Level {level}</div>
    </div>
  );
};

export default LevelCircle;
