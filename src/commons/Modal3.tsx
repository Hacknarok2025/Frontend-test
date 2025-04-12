
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/own/button";

import {useNavigate} from "react-router-dom";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children:any;
}

const Modal3: React.FC<ModalProps> = ({ open, onClose,children }) => {
    const navigate = useNavigate(); // Używamy useNavigate zamiast useRouter

    const handleLogin = () => {
        onClose(); // Zamknij modal
        navigate('/tree'); // Przekieruj na /tree używając react-router-dom
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
                            type: "spring",
                            damping: 20,
                            stiffness: 100,
                            duration: 0.3
                        }}
                    >
                        <div className=" flex px-4 justify-between items-start mb-6 skew-x-[-12deg]">
                            <div className="flex flex-col">
                                {children}
                            </div>
                            <button
                                onClick={onClose}
                                className="align-top text-gray-500 hover:text-gray-700 text-4xl"
                            >
                                ×
                            </button>
                        </div>
                        <div>

                        </div>
                        <div className="mt-6 flex justify-end skew-x-[-24deg]">
                            <Button

                                onClick={handleLogin}
                                add={"px-18 text-4xl hover:bg-white hover:text-black skew-x-[24deg] border-2 border-solid border-black text-white"}
                            >
                                Continue
                            </Button>

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal3;
