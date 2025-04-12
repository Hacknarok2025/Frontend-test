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
      className="absolute size-32 sm:size-28 rounded-full overflow-hidden border-4 border-white shadow-md
                   bg-gradient-to-br from-gray-200 to-white
                   transition-transform duration-300 ease-in-out transform hover:scale-110 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] animate-fade-in"
    >
      <img
        src={`/imgs/level${level}.png`}
        alt={`Level ${level}`}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default LevelCircle;
