import "./Footer.css";

export default function Footer({ isAuth }) {
  return (
    <footer className={`footer-area ${!isAuth ? "with-sidebar" : ""}`}>
      <p>Voxaro © 2025 All rights reserved. v.1.2.3</p>
    </footer>
  );
}
