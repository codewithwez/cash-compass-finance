
function Button({ text, onClick, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-emerald-500 hover:bg-emerald-400 px-6 py-3 rounded-lg font-semibold text-black transition ${className}`}
    >
      {text}
    </button>
  );
}

export default Button;