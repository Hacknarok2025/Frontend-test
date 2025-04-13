import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/own/button';
import Input from '@/components/own/input';
import { useNavigate } from 'react-router-dom';
import { postPlayerData } from '@/api/post';
import { useState } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

const Modal2: React.FC<ModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    await loginUser();
    onClose();
    navigate('/tree', { state: { scrollToBottom: true } });
  };

  const loginUser = async () => {
    try {
      await postPlayerData({
        name,
        email: '', // Since this is continue game, we don't need email
        password,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white p-8 w-1/2 max-w-2xl"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.5, opacity: 0, skewX: 12 }}
            animate={{ scale: 1, opacity: 1, skewX: 12 }}
            exit={{ scale: 0.5, opacity: 0, skewX: 12 }}
            style={{ transformOrigin: 'center' }}
            transition={{
              type: 'spring',
              damping: 20,
              stiffness: 100,
              duration: 0.3,
            }}
          >
            <div className="flex justify-between items-start mb-6">
              <div className={'skew-x-[-12deg]'}>
                <h1 className="text-2xl font-bold">Continue your game</h1>
                <h2 className="text-xl font-bold">Enter your name and password</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-4xl"
              >
                ×
              </button>
            </div>
            <form className="flex justify-center flex-col items-start">
              <Input 
                placeholder={'Name'} 
                size={'2xl'} 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input 
                type={'password'} 
                placeholder={'Password'} 
                size={'2xl'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </form>
            <div className="mt-6 flex justify-end skew-x-[-24deg]">
              <Button
                onClick={handleLogin}
                add={'px-18 text-2xl hover:bg-white hover:text-black skew-x-[24deg] border-2 border-solid border-black text-white'}
              >
                Login
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal2;
