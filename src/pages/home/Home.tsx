import Button from '@/components/own/button';
import Modal from '@/commons/Modal';
import { useState } from 'react';

const Home = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="relative">
      {/* Kontener dla wideo tła */}
      <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source
            src="https://bjtlziatyjsnvlqzdejp.supabase.co/storage/v1/object/public/backgroundvideo//videoplayback.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Zawartość strony */}
      <div className="relative z-10 h-screen w-[90%] mx-auto py-20 flex flex-col">
        <div className="max-w-xl flex justify-center flex-col h-full">
          <h1 className="text-8xl font-bold mb-4 text-white">
            HACKNAROCK 2025
          </h1>
          <p className="text-2xl text-gray-300 mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac
            vestibulum erat.
          </p>
        </div>

        <div className="self-end relative right-20 flex gap-4">
          <Button
            onClick={() => setModalOpen(true)}
            add="px-18 text-white border-5 border-solid border-black hover:border-white transition duration-300 text-6xl"
          >
            Continue Game
          </Button>
          <Button
            onClick={() => setModalOpen(true)}
            add="px-18 text-black border-5 border-solid border-white bg-white hover:border-black hover:bg-white transition duration-300 text-6xl"
          >
            Start Game
          </Button>
        </div>
      </div>

      {/* Modal */}
      <Modal open={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Home;
