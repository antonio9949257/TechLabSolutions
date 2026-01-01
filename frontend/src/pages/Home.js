import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { authenticatedFetch } from '../utils/api'; // Import authenticatedFetch
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

  const [featuredCameras, setFeaturedCameras] = useState([]);
  const [loadingCameras, setLoadingCameras] = useState(true);
  const [errorCameras, setErrorCameras] = useState(null);

  const [featuredKits, setFeaturedKits] = useState([]);
  const [loadingKits, setLoadingKits] = useState(true);
  const [errorKits, setErrorKits] = useState(null);

  useEffect(() => {
    const fetchFeaturedCameras = async () => {
      try {
        const response = await authenticatedFetch('/products?category=Cámaras de Seguridad&limit=3'); // Assuming a limit of 3 for featured
        if (response.ok) {
          const data = await response.json();
          if (data && data.products) { // Add check for data and data.products
            setFeaturedCameras(data.products);
          } else {
            setFeaturedCameras([]); // Ensure it's an empty array if data is malformed
          }
        } else {
          setErrorCameras('Error al cargar cámaras destacadas');
        }
      } catch (err) {
        console.error('Error fetching featured cameras:', err);
        setErrorCameras('Error de conexión al servidor');
      } finally {
        setLoadingCameras(false);
      }
    };

    const fetchFeaturedKits = async () => {
      try {
        const response = await authenticatedFetch('/kits?limit=2'); // Assuming a limit of 2 for featured kits
        if (response.ok) {
          const data = await response.json();
          if (data) { // Add check for data
            setFeaturedKits(data); // Kits endpoint returns an array directly
          } else {
            setFeaturedKits([]); // Ensure it's an empty array if data is malformed
          }
        } else {
          setErrorKits('Error al cargar kits destacados');
        }
      } catch (err) {
        console.error('Error fetching featured kits:', err);
        setErrorKits('Error de conexión al servidor');
      } finally {
        setLoadingKits(false);
      }
    };

    fetchFeaturedCameras();
    fetchFeaturedKits();
  }, []); // Empty dependency array means this runs once on mount

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
            Soluciones integrales en seguridad y vigilancia para hogares y negocios, garantizando tu tranquilidad.
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
              {loadingCameras ? (
                <p className="text-center text-text-primary">Cargando cámaras destacadas...</p>
              ) : errorCameras ? (
                <p className="text-center text-red-600">Error: {errorCameras}</p>
              ) : featuredCameras.length === 0 ? (
                <p className="text-center text-text-primary">No hay cámaras destacadas disponibles.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredCameras.map((camera) => (
                    <div key={camera._id} className="bg-card-bg rounded-lg shadow-md overflow-hidden">
                      <img src={camera.imagen || 'https://via.placeholder.com/300'} alt={camera.nombre} className="w-full h-48 object-cover" />
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-text-primary mb-2">{camera.nombre}</h3>
                        <p className="text-secondary mb-4">{camera.descripcion}</p>
                        <Link to={`/products/${camera._id}`} className="bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">Ver Producto</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Security Kits Section */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center text-text-primary mb-8">Kits de Seguridad Completos</h2>
              {loadingKits ? (
                <p className="text-center text-text-primary">Cargando kits destacados...</p>
              ) : errorKits ? (
                <p className="text-center text-red-600">Error: {errorKits}</p>
              ) : featuredKits.length === 0 ? (
                <p className="text-center text-text-primary">No hay kits destacados disponibles.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featuredKits.map((kit) => (
                    <div key={kit._id} className="bg-card-bg rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
                      <img src={kit.imageUrl || 'https://via.placeholder.com/300'} alt={kit.name} className="w-full md:w-1/3 h-48 md:h-auto object-cover" />
                      <div className="p-6 flex-1">
                        <h3 className="text-xl font-bold text-text-primary mb-2">{kit.name}</h3>
                        <p className="text-secondary mb-2">{kit.description}</p>
                        {kit.totalPriceBeforeDiscount && (
                          <p className="text-md text-gray-500 line-through">Precio Original: ${kit.totalPriceBeforeDiscount.toFixed(2)}</p>
                        )}
                        <p className="text-lg font-semibold text-text-primary mb-2">Precio Final: ${kit.finalPrice ? kit.finalPrice.toFixed(2) : kit.price.toFixed(2)}</p>
                        {kit.products && kit.products.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-md font-semibold text-text-primary">Incluye:</h4>
                            <ul className="list-disc list-inside text-secondary text-sm">
                              {kit.products.map((item, index) => (
                                <li key={index}>{item.productId.nombre} (x{item.quantity})</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <Link to={`/kits/${kit._id}`} className="bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">Ver Kit</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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