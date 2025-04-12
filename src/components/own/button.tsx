interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  add?: any;
}

const Button = ({ children, onClick, add }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`m-5 bg-[#000000] px-6 py-3 transition-all duration-500 transform hover:scale-110 skew-x-12 ${add}`}
    >
      <span className="inline-block skew-x-[-12deg]">{children}</span>
    </button>
  );
};

export default Button;
