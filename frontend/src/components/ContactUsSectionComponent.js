import React from 'react';
import { Link } from 'react-router-dom';

const ContactUsSectionComponent = ({ section }) => {
  if (!section || !section.enabled) return null;

  const { title, subtitle, content } = section;
  const { text, email } = content || {};

  return (
    <section className="contact-us-section bg-gray-100 text-gray-800 text-center py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-4">{title || 'Contáctanos'}</h2>
        {subtitle && <p className="text-lg mb-5 mx-auto max-w-3xl">{subtitle}</p>}
        {text && <p className="text-lg mb-5 mx-auto max-w-3xl">{text}</p>}
        {email && (
          <p className="text-lg mb-5 mx-auto max-w-3xl">
            Email: <a href={`mailto:${email}`} className="text-blue-600 hover:underline">{email}</a>
          </p>
        )}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link to="/contact" className="bg-primary text-white hover:bg-blue-700 py-3 px-6 text-lg rounded-md transition duration-300">
            Enviar Mensaje
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ContactUsSectionComponent;
