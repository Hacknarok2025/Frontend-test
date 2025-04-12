import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/own/button";
import Input from "@/components/own/input";

interface ModalProps {
    open: boolean;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ open, onClose }) => {
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
                            type: "spring",
                            damping: 20,
                            stiffness: 100,
                            duration: 0.3
                        }}
                    >
                        <div className="flex justify-between items-start mb-6 skew-x-[-24deg]">
                            <h1 className="text-2xl font-bold">Select Your Warriors Name</h1>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 text-4xl"
                            >
                                ×
                            </button>
                        </div>
                        <form className="flex justify-center flex-col items-start">
                            <Input placeholder={"Name"} size={"2xl"} />
                            <Input placeholder={"Email"} size={"2xl"} />
                        </form>
                        <div className="mt-6 flex justify-end skew-x-[-24deg]">
                            <Button
                                onClick={onClose}
                                size={"2xl"}
                                add={"px-18 hover:bg-white hover:text-black skew-x-[24deg] border-2 border-solid border-black text-white"}
                            >
                                Start
                            </Button>

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;