import * as React from "react";
import { Button } from "@/components/ui/button.tsx";

interface ModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const Modal: React.FC<ModalProps> = ({ open, setOpen }) => {
    const [formData, setFormData] = React.useState({
        title: "",
        from: "",
        to: "",
        description: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Zapobiega przeładowaniu strony
        console.log("Wartości formularza:", formData);
        setOpen(false); // Zamykamy modal
    };

    return (
        <>
            {open && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex items-center justify-center"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="bg-white p-8 rounded-3xl w-1/2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h1 className="text-center mb-6">Title</h1>
                        <form className="flex flex-col" onSubmit={handleSubmit}>
                            <label>Tytuł</label>
                            <input
                                className="border-2 border-black"
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                            <label>Od</label>
                            <input
                                className="border-2 border-black"
                                name="from"
                                type="time"
                                value={formData.from}
                                onChange={handleChange}
                                required
                            />
                            <label>Do</label>
                            <input
                                className="border-2 border-black"
                                name="to"
                                type="time"
                                value={formData.to}
                                onChange={handleChange}
                                required
                            />
                            <label>Opis</label>
                            <textarea
                                rows={5}
                                className="border-2 border-black"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                            <Button type="submit" className="mt-6" variant="default">
                                Zapisz
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Modal;
