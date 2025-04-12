import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    size?: string; // Twój własny rozmiar tekstu (np. "sm", "md", "lg")
    add?: string;  // Dodatkowe klasy CSS
    placeholder?: string;  // Dodatkowe klasy CSS
}

const Input = ({ size, add,placeholder }: InputProps) => {
    return (


        <input

            className={`${add} m-2 border-2 border-solid border-[#00000]  text-${size} text-black px-6 py-3  transition-all duration-500 transform focus:scale-110 `}
            placeholder={placeholder}
        />
    );
};

export default Input;
