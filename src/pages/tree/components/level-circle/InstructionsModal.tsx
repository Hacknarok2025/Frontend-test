import React from 'react';
import { motion } from 'framer-motion';
import { instructions } from './instructions';
import KeyButton from './KeyButton';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/own/button';

type InstructionsModalProps = {
  level: number;
  onClose: () => void;
};

const InstructionsModal = ({ level, onClose }: InstructionsModalProps) => {
  const navigate = useNavigate();
  const levelInstructions = instructions[level as keyof typeof instructions];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-[#18181b] p-8 rounded-lg max-w-2xl w-full mx-4 border border-[#3f3f46] shadow-xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <h2 className="text-4xl font-bold mb-6 text-white">
          Level {level} Instructions
        </h2>

        <p className="text-gray-300 text-xl mb-8">{levelInstructions.desc}</p>

        <div className="space-y-4 mb-8">
          <h3 className="text-2xl font-semibold text-white mb-4">Controls:</h3>
          <div className="grid grid-cols-2 gap-4">
            {levelInstructions.buttons.map((button, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex gap-2">
                  {button.keys.map((key, keyIndex) => (
                    <KeyButton
                      key={keyIndex}
                      label={key}
                      isSpace={key === 'space'}
                      className="min-w-[60px]"
                    />
                  ))}
                </div>
                <span className="text-gray-300">{button.action}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            onClick={onClose}
            add="px-6 py-2 text-lg hover:bg-white hover:text-black border-2 border-solid border-white text-white"
          >
            Back to Tree
          </Button>
          <Button
            onClick={() => navigate(`/level${level}`)}
            add="px-6 py-2 text-lg hover:bg-white hover:text-black border-2 border-solid border-white text-white"
          >
            Start Level
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InstructionsModal;
