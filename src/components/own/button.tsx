interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text?: any;
}

const Button = ({ text}: ButtonProps) => {
    return (
        <button
            className='bg-[#000000] text-6xl text-white px-6 py-3 hover:bg-white hover:text-black transition-all duration-500 transform hover:scale-110 skew-x-12'
        >
      <span className="inline-block skew-x-[-12deg]">
        {text}
      </span>
        </button>
    );
};

export default Button;