import "./Input.css";

function Input({ label, type = "text", error, register, ...props }) {
  return (
    <div className="input-wrapper">
      <label className="input-label">{label}</label>
      <input
        type={type}
        className={`input-field ${error ? "input-error" : ""}`}
        {...register}
        {...props}
      />
      {error && <span className="error-message">{error.message}</span>}
    </div>
  );
}

export default Input;
