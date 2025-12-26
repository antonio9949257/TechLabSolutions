import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import './Home.css'; // We'll create this for custom styles

const Home = () => {
  const { user } = useAuth(); // Get user from context

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white text-center py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 flex flex-col items-center justify-center">
            {user ? (
              <>
                {user.profilePicture && (
                  <img
                    src={user.profilePicture}
                    alt="Perfil"
                    className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-white"
                  />
                )}
                Bienvenido, {user.nickname || user.name}
              </>
            ) : (
              'Innovación Tecnológica al Alcance de Todos'
            )}
          </h1>
          <p className="text-lg mb-5 mx-auto max-w-3xl">
            Soluciones accesibles en automatización, electrónica e informática industrial
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/products" className="bg-card-bg text-primary hover:bg-background py-3 px-6 text-lg rounded-md transition duration-300">
              Nuestros Productos
            </Link>
            <Link to="/services" className="border border-white text-white hover:bg-white hover:text-primary py-3 px-6 text-lg rounded-md transition duration-300">
              Nuestros Servicios
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;