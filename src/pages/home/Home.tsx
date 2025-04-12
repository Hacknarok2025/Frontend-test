import Button from "@/components/own/button";

const Home = () => {

    return (
        <>
            {/* Kontener dla wideo tła */}
            <div className="fixed top-0 left-0 w-full h-full z-[1] overflow-hidden">
                <iframe
                    src="https://www.youtube.com/embed/RvQYosp7uuA?autoplay=1&mute=1&loop=1&controls=0&playlist=RvQYosp7uuA&vq=4kstart=0&start=0&end=40"
                    className="w-full h-full scale-[1.2] "
                    frameBorder="0"
                    allow="autoplay; "
                    allowFullScreen
                />
                    {/* Nakładka dla lepszej czytelności tekstu */}
                <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
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
                <div className="self-end relative right-20">
                    <Button text={"Start Game"} />
                </div>
            </div>
        </>
    );
};

export default Home;