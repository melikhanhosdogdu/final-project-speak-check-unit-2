import { Loader2 } from "lucide-react";
import "./Button.css";

function Button({ children, type = "button", isLoading = false, ...props }) {
  return (
    <button
      type={type}
      className={`btn btn-primary ${isLoading ? "btn-loading" : ""}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="spinner-icon" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
