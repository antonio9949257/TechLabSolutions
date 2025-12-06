import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // We'll create this for custom styles

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section text-white text-center py-5">
        <div className="container">
          <h1 className="display-4 fw-bold mb-4">Innovación Tecnológica al Alcance de Todos</h1>
          <p className="lead mb-5 mx-auto" style={{ maxWidth: '800px' }}>
            Soluciones accesibles en automatización, electrónica e informática industrial
          </p>
          <div>
            <Link to="/products" className="btn btn-light btn-lg me-3">
              Nuestros Productos
            </Link>
            <Link to="/services" className="btn btn-outline-light btn-lg">
              Nuestros Servicios
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <h2 className="h1 fw-bold text-dark mb-4">¿Qué es TechLab Solutions?</h2>
              <p className="text-muted fs-5 mb-4">
                Un ecosistema donde integramos hardware educativo, desarrollo de software y servicios técnicos para acercar la tecnología a estudiantes, técnicos y pequeños emprendedores.
              </p>
              <ul className="list-unstyled space-y-4">
                <li className="d-flex align-items-start mb-3">
                  <i className="fas fa-microchip text-primary fs-4 me-3"></i>
                  <span>Diseñamos dispositivos educativos de bajo costo basados en ESP32</span>
                </li>
                <li className="d-flex align-items-start mb-3">
                  <i className="fas fa-tools text-primary fs-4 me-3"></i>
                  <span>Ofrecemos servicios técnicos y de fabricación para prototipos</span>
                </li>
                <li className="d-flex align-items-start">
                  <i className="fas fa-book-open text-primary fs-4 me-3"></i>
                  <span>Recursos educativos para aprender electrónica y automatización</span>
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop" alt="Tecnología educativa" className="img-fluid rounded shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="h1 fw-bold text-center text-dark mb-5">Nuestros Productos</h2>
          <div className="row">
            {/* Product 1 */}
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <div className="text-primary mb-3"><i className="fas fa-microchip fa-3x"></i></div>
                  <h3 className="card-title h4 fw-bold">PLC Educativo</h3>
                  <p className="card-text text-muted">Controlador programable basado en ESP32 para aprendizaje de automatización industrial.</p>
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <span className="text-primary fw-bold fs-5">$49.99</span>
                    <Link to="/products" className="fw-bold text-primary">
                      Más información <i className="fas fa-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* Product 2 */}
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <div className="text-primary mb-3"><i className="fas fa-layer-group fa-3x"></i></div>
                  <h3 className="card-title h4 fw-bold">Kit de Sensores</h3>
                  <p className="card-text text-muted">Conjunto de sensores industriales para proyectos educativos y prototipos.</p>
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <span className="text-primary fw-bold fs-5">$29.99</span>
                    <Link to="/products" className="fw-bold text-primary">
                      Más información <i className="fas fa-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* Product 3 */}
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <div className="text-primary mb-3"><i className="fas fa-desktop fa-3x"></i></div>
                  <h3 className="card-title h4 fw-bold">Panel de Control</h3>
                  <p className="card-text text-muted">Interfaz HMI básica para monitoreo y control de procesos automatizados.</p>
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <span className="text-primary fw-bold fs-5">$79.99</span>
                    <Link to="/products" className="fw-bold text-primary">
                      Más información <i className="fas fa-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="h1 fw-bold text-center text-dark mb-5">Nuestros Servicios</h2>
          <div className="row">
            {/* Service 1 */}
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="card h-100 text-center border-top-primary shadow-sm">
                <div className="card-body">
                  <div className="text-primary mb-3"><i className="fas fa-print fa-2x"></i></div>
                  <h3 className="h5 fw-bold">Impresión 3D</h3>
                  <p className="text-muted">Prototipado rápido de piezas mecánicas y componentes para tus proyectos.</p>
                </div>
              </div>
            </div>
            {/* Service 2 */}
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="card h-100 text-center border-top-primary shadow-sm">
                <div className="card-body">
                  <div className="text-primary mb-3"><i className="fas fa-microchip fa-2x"></i></div>
                  <h3 className="h5 fw-bold">PCB Caseras</h3>
                  <p className="text-muted">Fresado CNC para placas baquelitas y diseño de circuitos impresos.</p>
                </div>
              </div>
            </div>
            {/* Service 3 */}
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="card h-100 text-center border-top-primary shadow-sm">
                <div className="card-body">
                  <div className="text-primary mb-3"><i className="fas fa-cogs fa-2x"></i></div>
                  <h3 className="h5 fw-bold">Ensamblaje Electrónico</h3>
                  <p className="text-muted">Montaje profesional de componentes electrónicos para tus prototipos.</p>
                </div>
              </div>
            </div>
            {/* Service 4 */}
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="card h-100 text-center border-top-primary shadow-sm">
                <div className="card-body">
                  <div className="text-primary mb-3"><i className="fas fa-code fa-2x"></i></div>
                  <h3 className="h5 fw-bold">Programación</h3>
                  <p className="text-muted">Desarrollo de software para microcontroladores y sistemas de automatización.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section text-white text-center py-5">
        <div className="container">
          <h2 className="h1 fw-bold mb-4">¿Listo para llevar tus proyectos al siguiente nivel?</h2>
          <p className="lead mb-5 mx-auto" style={{ maxWidth: '800px' }}>
            Únete a nuestra comunidad y accede a recursos, productos y servicios diseñados para impulsar tu aprendizaje.
          </p>
          <div>
            <Link to="/register" className="btn btn-light btn-lg me-3">
              Contáctanos
            </Link>
            <Link to="/services" className="btn btn-outline-light btn-lg">
              Conoce más
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;