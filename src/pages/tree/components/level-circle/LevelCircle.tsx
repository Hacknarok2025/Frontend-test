type LevelCircleProps = {
  level: number;
  top: string;
  left: string;
};

const LevelCircle = ({ level, top, left }: LevelCircleProps) => {
  // TODO: Usunąć po dodaniu dynamicznych wartości level
  level = 1;

  return (
    <div
      style={{ top, left }}
      className="absolute flex flex-col items-center  transition-all duration-500 transform hover:scale-110 group"
    >
      <div className="w-30 h-15 bg-black text-6xl p-1 text-white skew-x-12 group-hover:bg-white transition-all duration-500 transform">
        <img
          src={`/imgs/level${level}.png`}
          alt={`Level ${level}`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex justify-center w-60 h-10 bg-black text-lg p-1 text-white font-bold skew-x-12 text-center items-center group-hover:bg-white transition-all duration-500 transform group-hover:text-black">
        Level {level}
      </div>
    </div>
  );
};

export default LevelCircle;
