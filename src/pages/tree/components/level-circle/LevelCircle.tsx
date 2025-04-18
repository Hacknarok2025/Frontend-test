import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import InstructionsModal from './InstructionsModal';

type LevelCircleProps = {
  level: number;
  top: string;
  left: string;
  disabled?: boolean;
};

const levelNames = {
  1: 'Nilfheim',
  2: 'Helheim',
  3: 'Jotunheim',
  4: 'Nidavell',
  5: 'Vanaheim',
  6: 'Midgard',
  7: 'Muspelheim',
  8: 'Alfheim',
  9: 'Asgard',
};

const LevelCircle = ({
  level,
  top,
  left,
  disabled = false,
}: LevelCircleProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const containerVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
  };

  const clickVariants = {
    initial: { opacity: 1 },
    animate: { opacity: 0, transition: { duration: 0.3 } },
  };

  const containerClass = `absolute flex flex-col items-center transition-all duration-500 transform ${
    disabled ? 'opacity-70 cursor-default' : 'cursor-pointer'
  }`;

  const imageContainerClass = `w-32 h-16 overflow-hidden skew-x-12 transition-all duration-500 ${
    disabled ? 'bg-gray-400' : 'bg-black group-hover:bg-white'
  }`;

  const labelClass = `flex justify-center items-center w-60 h-10 text-lg font-bold skew-x-12 text-center transition-all duration-500 ${
    disabled
      ? 'bg-gray-400 text-gray-700'
      : 'bg-black text-white hover:bg-white hover:text-black group-hover:text-black'
  }`;

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsExpanded(true);
      setTimeout(() => {
        setShowInstructions(true);
      }, 1000);
    }
  };

  const handleCloseInstructions = () => {
    setShowInstructions(false);
    setIsExpanded(false);
  };

  const content = (
    <div onClick={handleImageClick}>
      <div className={imageContainerClass}>
        <motion.img
          src={`/imgs/level${level}.webp`}
          alt={`Level ${level}`}
          className="w-full h-full object-cover opacity-100"
          style={disabled ? { opacity: 0.5 } : {}}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/imgs/placeholder.png';
          }}
          whileHover={disabled ? {} : { opacity: 0.8 }}
        />
      </div>
      <div className={labelClass}>
        {levelNames[level as keyof typeof levelNames] || `Level ${level}`}
      </div>
    </div>
  );

  return (
    <>
      {disabled ? (
        <div style={{ top, left }} className={containerClass}>
          {content}
        </div>
      ) : (
        <motion.div
          style={{ top, left }}
          className={containerClass}
          variants={containerVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          <div style={{ textDecoration: 'none' }}>
            <motion.div
              variants={clickVariants}
              animate="initial"
              exit="animate"
            >
              {content}
            </motion.div>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-90 z-50 flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            onClick={() => setIsExpanded(false)}
          >
            <motion.img
              src={`/imgs/level${level}.webp`}
              alt={`Level ${level}`}
              className="w-[100vw] h-[100vh] object-cover"
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInstructions && (
          <InstructionsModal
            level={level}
            onClose={() => {
              handleCloseInstructions();
              setIsExpanded(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default LevelCircle;
