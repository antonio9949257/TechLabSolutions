import React from 'react';
import { Link } from 'react-router-dom';

const KitsSection = ({ section }) => {
  return (
    <section className="py-12 kits-bg" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${section.backgroundImage}')` }}>
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-8">{section.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {section.content.map((kit, index) => (
            <div key={index} className="bg-card-bg rounded-lg shadow-md h-full">
              <div className="p-6 text-center">
                <div className="text-white mb-3"><i className={`${kit.icon} text-5xl`}></i></div>
                <h3 className="text-xl font-bold text-white">{kit.title}</h3>
                <p className="text-gray-300">{kit.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-white font-bold text-lg">{kit.price}</span>
                  <Link to={kit.link} className="font-bold text-white hover:underline">
                    Ver más <i className="fas fa-arrow-right ml-1"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KitsSection;
