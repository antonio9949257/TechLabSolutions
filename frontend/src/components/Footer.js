import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-footer-bg text-footer-text text-center py-4 mt-auto">
      <div className="container mx-auto px-4">
        <p className="text-sm">&copy; {new Date().getFullYear()} TechLab Solutions. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
