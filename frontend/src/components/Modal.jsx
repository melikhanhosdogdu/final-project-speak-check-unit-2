import ReactDom from "react-dom";
import { X } from "lucide-react";
import "./Modal.css";

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return ReactDom.createPortal(
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-container">
        <div className="modal-header">
          <button className="modal-close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </>,
    document.getElementById("portal")
  );
}

export default Modal;
