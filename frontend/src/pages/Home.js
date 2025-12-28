import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import './Home.css'; // We'll create this for custom styles

const categories = [
  'Todos',
  'Cámaras de Seguridad',
  'Cámaras IP',
  'Cámaras WiFi',
  'Cámaras PTZ',
  'Kits de Vigilancia',
  'DVR / NVR',
  'Alarmas',
  'Sensores de Movimiento',
  'Video Porteros',
  'Control de Acceso',
  'Accesorios'
];

const Home = () => {
  const { user } = useAuth(); // Get user from context
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    navigate(`/products?category=${category}`);
  };

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
            <Link to="/products?category=Kits de Vigilancia" className="bg-green-500 text-white hover:bg-green-600 py-3 px-6 text-lg rounded-md transition duration-300">
              Nuestros Kits
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 flex">
        {/* Category Sidebar */}
        <aside className="w-1/4 pr-8 sticky-sidebar">
          <h3 className="text-xl font-bold mb-4">Categorías</h3>
          <ul className="space-y-2">
            {categories.map(category => (
              <li key={category}>
                <button
                  onClick={() => handleCategoryClick(category)}
                  className={`w-full text-left px-4 py-2 rounded-md transition duration-200 ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'hover:bg-background'
                  }`}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="w-3/4">
          {/* Featured Products Section */}
          <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center text-text-primary mb-8">Cámaras de Seguridad Destacadas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Product 1 */}
                <div className="bg-card-bg rounded-lg shadow-md overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1617038201066-246697090540?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Dahua Camera" className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-text-primary mb-2">Cámara IP Dahua 4MP</h3>
                    <p className="text-secondary mb-4">Resolución 4MP, visión nocturna, detección de movimiento. Ideal para exteriores.</p>
                    <Link to="/products" className="bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">Ver Producto</Link>
                  </div>
                </div>
                {/* Product 2 */}
                <div className="bg-card-bg rounded-lg shadow-md overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Hikvision Camera" className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-text-primary mb-2">Cámara Domo Hikvision 2MP</h3>
                    <p className="text-secondary mb-4">Cámara domo Full HD, resistente al vandalismo, audio bidireccional.</p>
                    <Link to="/products" className="bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">Ver Producto</Link>
                  </div>
                </div>
                {/* Product 3 */}
                <div className="bg-card-bg rounded-lg shadow-md overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1587825140708-cb042864f13b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="PTZ Camera" className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-text-primary mb-2">Cámara PTZ Exterior</h3>
                    <p className="text-secondary mb-4">Control de paneo, inclinación y zoom. Cobertura de 360 grados.</p>
                    <Link to="/products" className="bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">Ver Producto</Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Security Kits Section */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center text-text-primary mb-8">Kits de Seguridad Completos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Kit 1 */}
                <div className="bg-card-bg rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
                  <img src="https://images.unsplash.com/photo-1587825140708-cb042864f13b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Kit Básico" className="w-full md:w-1/3 h-48 md:h-auto object-cover" />
                  <div className="p-6 flex-1">
                    <h3 className="text-xl font-bold text-text-primary mb-2">Kit Básico de Vigilancia</h3>
                    <p className="text-secondary mb-4">Incluye 2 cámaras, DVR de 4 canales y accesorios. Fácil instalación.</p>
                    <Link to="/products" className="bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">Ver Kit</Link>
                  </div>
                </div>
                {/* Kit 2 */}
                <div className="bg-card-bg rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
                  <img src="https://images.unsplash.com/photo-1617038201066-246697090540?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Kit Avanzado" className="w-full md:w-1/3 h-48 md:h-auto object-cover" />
                  <div className="p-6 flex-1">
                    <h3 className="text-xl font-bold text-text-primary mb-2">Kit Avanzado con IA</h3>
                    <p className="text-secondary mb-4">4 cámaras con IA, NVR de 8 canales, detección facial y analíticas avanzadas.</p>
                    <Link to="/products" className="bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">Ver Kit</Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Product Categories Section */}
          <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center text-text-primary mb-8">Explora Nuestras Categorías</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/products?category=ip-cameras" className="bg-card-bg p-6 rounded-lg shadow-md text-center hover:shadow-lg transition duration-300">
                  <h3 className="text-xl font-bold text-text-primary">Cámaras IP</h3>
                </Link>
                <Link to="/products?category=dvrs" className="bg-card-bg p-6 rounded-lg shadow-md text-center hover:shadow-lg transition duration-300">
                  <h3 className="text-xl font-bold text-text-primary">DVRs</h3>
                </Link>
                <Link to="/products?category=nvrs" className="bg-card-bg p-6 rounded-lg shadow-md text-center hover:shadow-lg transition duration-300">
                  <h3 className="text-xl font-bold text-text-primary">NVRs</h3>
                </Link>
                <Link to="/products?category=accessories" className="bg-card-bg p-6 rounded-lg shadow-md text-center hover:shadow-lg transition duration-300">
                  <h3 className="text-xl font-bold text-text-primary">Accesorios</h3>
                </Link>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center text-text-primary mb-8">Nuestros Servicios de Seguridad</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Service 1 */}
                <div className="bg-card-bg rounded-lg shadow-md p-6 text-center">
                  <h3 className="text-xl font-bold text-text-primary mb-2">Configuración Profesional</h3>
                  <p className="text-secondary">Aseguramos que tu sistema funcione a la perfección desde el primer día.</p>
                  <Link to="/services" className="text-primary hover:underline mt-4 inline-block">Más Detalles</Link>
                </div>
                {/* Service 2 */}
                <div className="bg-card-bg rounded-lg shadow-md p-6 text-center">
                  <h3 className="text-xl font-bold text-text-primary mb-2">Instalación Experta</h3>
                  <p className="text-secondary">Técnicos certificados para una instalación segura y eficiente.</p>
                  <Link to="/services" className="text-primary hover:underline mt-4 inline-block">Más Detalles</Link>
                </div>
                {/* Service 3 */}
                <div className="bg-card-bg rounded-lg shadow-md p-6 text-center">
                  <h3 className="text-xl font-bold text-text-primary mb-2">Mantenimiento y Soporte</h3>
                  <p className="text-secondary">Servicio continuo para garantizar la operatividad y seguridad de tus equipos.</p>
                  <Link to="/services" className="text-primary hover:underline mt-4 inline-block">Más Detalles</Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Home;