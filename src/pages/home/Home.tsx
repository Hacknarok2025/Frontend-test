import Button from '@/components/own/button';

const Home = () => {
  return (
    <>
      {/* Kontener dla wideo tła */}
      <div className="fixed top-0 left-0 w-full h-full z-[1] overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
        >
          <source
            src="https://bjtlziatyjsnvlqzdejp.supabase.co/storage/v1/object/public/backgroundvideo//videoplayback.mp4"
            type="video/mp4"
          />
        </video>

        {/* Nakładka dla lepszej czytelności tekstu */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
      </div>

      {/* Zawartość strony */}
      <div className="h-[100vh] w-[90%] mx-auto py-20 flex flex-col relative z-2">
        <div className="max-w-xl flex justify-center flex-col h-[100%]">
          <h1 className="text-8xl font-bold mb-4 text-white">
            HACKNAROCK 2025
          </h1>
          <p className="text-2xl text-gray-300 mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac
            vestibulum erat.
          </p>
        </div>
        <div className="self-end relative right-20">
          <Button
            onClick={() => {
              console.log('asdasd');
            }}
            text={'Start Game'}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
