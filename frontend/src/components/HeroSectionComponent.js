import React from 'react';
import { Link } from 'react-router-dom';

const HeroSectionComponent = ({ section }) => {
  if (!section || !section.enabled) return null;

  const { title, subtitle, content, backgroundImage } = section;
  const { description, buttonText, buttonLink } = content || {};

  return (
    <section
      className="hero-section bg-primary text-white text-center py-12"
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      <div className="container mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 flex flex-col items-center justify-center">
          {title}
        </h1>
        {subtitle && <p className="text-xl mb-4">{subtitle}</p>}
        {description && <p className="text-lg mb-5 mx-auto max-w-3xl">{description}</p>}
        {buttonText && buttonLink && (
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link to={buttonLink} className="bg-card-bg text-primary hover:bg-background py-3 px-6 text-lg rounded-md transition duration-300">
              {buttonText}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSectionComponent;
