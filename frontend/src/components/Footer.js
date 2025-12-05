import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center p-3 mt-auto">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} TechLab Solutions. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
