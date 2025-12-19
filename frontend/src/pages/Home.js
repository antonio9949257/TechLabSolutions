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
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            {user ? `Bienvenido, ${user.name}` : 'Innovación Tecnológica al Alcance de Todos'}
          </h1>
          <p className="text-lg mb-5 mx-auto max-w-3xl">
            Soluciones accesibles en automatización, electrónica e informática industrial
          </p>
          <div>
            <Link to="/products" className="bg-card-bg text-primary hover:bg-background py-3 px-6 text-lg rounded-md mr-3 transition duration-300">
              Nuestros Productos
            </Link>
            <Link to="/services" className="border border-white text-white hover:bg-white hover:text-primary py-3 px-6 text-lg rounded-md transition duration-300">
              Nuestros Servicios
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full md:w-1/2 px-4 mb-4 md:mb-0">
              <h2 className="text-4xl font-bold text-text-primary mb-4">¿Qué es TechLab Solutions?</h2>
              <p className="text-secondary text-lg mb-4">
                Un ecosistema donde integramos hardware educativo, desarrollo de software y servicios técnicos para acercar la tecnología a estudiantes, técnicos y pequeños emprendedores.
              </p>
              <ul className="list-none space-y-4">
                <li className="flex items-start mb-3">
                  <i className="fas fa-microchip text-primary text-2xl mr-3"></i>
                  <span>Diseñamos dispositivos educativos de bajo costo basados en ESP32</span>
                </li>
                <li className="flex items-start mb-3">
                  <i className="fas fa-tools text-primary text-2xl mr-3"></i>
                  <span>Ofrecemos servicios técnicos y de fabricación para prototipos</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-book-open text-primary text-2xl mr-3"></i>
                  <span>Recursos educativos para aprender electrónica y automatización</span>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/2 px-4">
              <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop" alt="Tecnología educativa" className="max-w-full h-auto rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-text-primary mb-8">Nuestros Productos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product 1 */}
            <div className="bg-card-bg rounded-lg shadow-md h-full">
              <div className="p-6 text-center">
                <div className="text-primary mb-3"><i className="fas fa-microchip text-5xl"></i></div>
                <h3 className="text-xl font-bold">PLC Educativo</h3>
                <p className="text-secondary">Controlador programable basado en ESP32 para aprendizaje de automatización industrial.</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-primary font-bold text-lg">Bs 49.99</span>
                  <Link to="/products" className="font-bold text-primary hover:underline">
                    Más información <i className="fas fa-arrow-right ml-1"></i>
                  </Link>
                </div>
              </div>
            </div>
            {/* Product 2 */}
            <div className="bg-card-bg rounded-lg shadow-md h-full">
              <div className="p-6 text-center">
                <div className="text-primary mb-3"><i className="fas fa-layer-group text-5xl"></i></div>
                <h3 className="text-xl font-bold">Kit de Sensores</h3>
                <p className="text-secondary">Conjunto de sensores industriales para proyectos educativos y prototipos.</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-primary font-bold text-lg">Bs 29.99</span>
                  <Link to="/products" className="font-bold text-primary hover:underline">
                    Más información <i className="fas fa-arrow-right ml-1"></i>
                  </Link>
                </div>
              </div>
            </div>
            {/* Product 3 */}
            <div className="bg-card-bg rounded-lg shadow-md h-full">
              <div className="p-6 text-center">
                <div className="text-primary mb-3"><i className="fas fa-desktop text-5xl"></i></div>
                <h3 className="text-xl font-bold">Panel de Control</h3>
                <p className="text-secondary">Interfaz HMI básica para monitoreo y control de procesos automatizados.</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-primary font-bold text-lg">Bs 79.99</span>
                  <Link to="/products" className="font-bold text-primary hover:underline">
                    Más información <i className="fas fa-arrow-right ml-1"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-text-primary mb-8">Nuestros Servicios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Service 1 */}
            <div className="bg-card-bg rounded-lg shadow-md h-full text-center border-t-4 border-primary">
              <div className="p-6">
                <div className="text-primary mb-3"><i className="fas fa-print text-4xl"></i></div>
                <h3 className="text-xl font-bold">Impresión 3D</h3>
                <p className="text-secondary">Prototipado rápido de piezas mecánicas y componentes para tus proyectos.</p>
              </div>
            </div>
            {/* Service 2 */}
            <div className="bg-card-bg rounded-lg shadow-md h-full text-center border-t-4 border-primary">
              <div className="p-6">
                <div className="text-primary mb-3"><i className="fas fa-microchip text-4xl"></i></div>
                <h3 className="text-xl font-bold">PCB Caseras</h3>
                <p className="text-secondary">Fresado CNC para placas baquelitas y diseño de circuitos impresos.</p>
              </div>
            </div>
            {/* Service 3 */}
            <div className="bg-card-bg rounded-lg shadow-md h-full text-center border-t-4 border-primary">
              <div className="p-6">
                <div className="text-primary mb-3"><i className="fas fa-cogs text-4xl"></i></div>
                <h3 className="text-xl font-bold">Ensamblaje Electrónico</h3>
                <p className="text-secondary">Montaje profesional de componentes electrónicos para tus prototipos.</p>
              </div>
            </div>
            {/* Service 4 */}
            <div className="bg-card-bg rounded-lg shadow-md h-full text-center border-t-4 border-primary">
              <div className="p-6">
                <div className="text-primary mb-3"><i className="fas fa-code text-4xl"></i></div>
                <h3 className="text-xl font-bold">Programación</h3>
                <p className="text-secondary">Desarrollo de software para microcontroladores y sistemas de automatización.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section bg-primary text-white text-center py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">¿Listo para llevar tus proyectos al siguiente nivel?</h2>
          <p className="text-lg mb-5 mx-auto max-w-3xl">
            Únete a nuestra comunidad y accede a recursos, productos y servicios diseñados para impulsar tu aprendizaje.
          </p>
          <div>
            <Link to="/register" className="bg-card-bg text-primary hover:bg-background py-3 px-6 text-lg rounded-md mr-3 transition duration-300">
              Contáctanos
            </Link>
            <Link to="/services" className="border border-white text-white hover:bg-white hover:text-primary py-3 px-6 text-lg rounded-md transition duration-300">
              Conoce más
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;