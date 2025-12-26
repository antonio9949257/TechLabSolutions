import React from 'react';

const ServicesSection = ({ section }) => {
  return (
    <section className="py-12 services-bg" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${section.backgroundImage}')` }}>
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-8">{section.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {section.content.services && section.content.services.map((service, index) => (
            <div key={index} className="bg-card-bg rounded-lg shadow-md h-full text-center border-t-4 border-primary">
              <div className="p-6">
                <div className="text-white mb-3"><i className={`${service.icon} text-4xl`}></i></div>
                <h3 className="text-xl font-bold text-white">{service.title}</h3>
                <p className="text-gray-300">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
