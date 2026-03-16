import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import "./Dropdown.css";

function Dropdown({
  options = [],
  value,
  onChange,
  placeholder = "Select...",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        const menu = document.querySelector(".dropdown-menu");
        menu.classList.add("closing");
        setTimeout(() => {
          menu.style.display = "none";
          menu.classList.remove("closing");
          setIsOpen(false);
        }, 200);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    if (option !== null) {
      onChange(option);
    }
    if (!isOpen) {
      setIsOpen(true);
      return;
    }
    const menu = document.querySelector(".dropdown-menu");
    menu.classList.add("closing");
    setTimeout(() => {
      menu.style.display = "none";
      menu.classList.remove("closing");
      setIsOpen(false);
    }, 200);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        type="button"
        className="dropdown-trigger"
        onClick={() => handleSelect(null)}
      >
        <span className="dropdown-value">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={20}
          className={`dropdown-icon ${isOpen ? "open" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`dropdown-item ${
                option.value === value ? "selected" : ""
              }`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
