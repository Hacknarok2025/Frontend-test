import Button from "@/components/own/button";
import Modal1 from "@/commons/Modal1.tsx";
import { useState } from "react";
import Modal2 from "@/commons/Modal2.tsx";

const Home = () => {
    const [isModalOpen1, setModalOpen1] = useState(false);
    const [isModalOpen2, setModalOpen2] = useState(false);

    return (
        <>
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
            <div className="h-[100vh] w-[90%] mx-auto py-20 flex flex-col relative z-2">
                <div className="max-w-xl flex justify-center flex-col h-[100%]">
                    <h1 className="text-8xl font-bold mb-4 text-white">HACKNAROCK 2025</h1>
                    <p className="text-2xl text-gray-300 mb-8">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac
                        vestibulum erat.
                    </p>
                </div>

                <div className="self-end relative right-20 ">
                    <Button
                        onClick={() => setModalOpen2(true)}
                        add={"px-18  text-6xl text-white border-5 border-solid border-black hover:border-white   transition duration-300"}

                    >
                        Continue Game
                    </Button>
                    <Button
                        onClick={() => setModalOpen1(true)}
                        add={"px-18  text-6xl text-black border-5 border-solid border-white bg-white hover:border-black  hover:bg-white transition duration-300"}

                    >Start Game</Button>
                </div>
            </div>
            <Modal1
                open={isModalOpen1}
                onClose={() => setModalOpen1(false)}
            />
            <Modal2
                open={isModalOpen2}
                onClose={() => setModalOpen2(false)}
            />
        </>
    );
};

export default Home;