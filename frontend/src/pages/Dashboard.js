import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { People, BoxSeam, Briefcase, Folder, CardList } from 'react-bootstrap-icons';
import { authenticatedFetch } from '../utils/api';

const StatCard = ({ title, value, icon }) => (
  <div className="bg-card-bg p-6 rounded-lg shadow-lg text-center">
    <div className="text-primary mx-auto mb-4 w-min">{icon}</div>
    <h4 className="text-2xl font-bold text-text-primary">{value}</h4>
    <p className="text-text-secondary">{title}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await authenticatedFetch('/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          setError('No se pudieron cargar las estadísticas.');
        }
      } catch (err) {
        setError('Error de conexión al servidor.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const adminSections = [
    {
      name: 'Gestionar Usuarios',
      path: '/admin-users',
      icon: <People size={40} />,
      description: 'Añadir, editar o eliminar usuarios.',
    },
    {
      name: 'Gestionar Productos',
      path: '/admin-products',
      icon: <BoxSeam size={40} />,
      description: 'Gestionar los productos de la tienda.',
    },
    {
      name: 'Gestionar Servicios',
      path: '/admin-services',
      icon: <Briefcase size={40} />,
      description: 'Gestionar los servicios ofrecidos.',
    },
    {
      name: 'Gestionar Proyectos',
      path: '/admin-projects',
      icon: <Folder size={40} />,
      description: 'Gestionar los proyectos del portfolio.',
    },
    {
      name: 'Gestionar Pedidos',
      path: '/admin/orders',
      icon: <CardList size={40} />,
      description: 'Ver y gestionar los pedidos de los clientes.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Stats Section */}
      <div className="mb-10">
        {loading && <p>Cargando estadísticas...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard title="Usuarios" value={stats.users} icon={<People size={30} />} />
            <StatCard title="Productos" value={stats.products} icon={<BoxSeam size={30} />} />
            <StatCard title="Servicios" value={stats.services} icon={<Briefcase size={30} />} />
            <StatCard title="Proyectos" value={stats.projects} icon={<Folder size={30} />} />
            <StatCard title="Pedidos" value={stats.orders} icon={<CardList size={30} />} />
          </div>
        )}
      </div>

      <h1 className="text-4xl font-bold text-center mb-10">Panel de Administración</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {adminSections.map((section) => (
          <Link
            key={section.name}
            to={section.path}
            className="bg-card-bg p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="text-primary mb-4">{section.icon}</div>
            <h3 className="text-xl font-bold mb-2 text-text-primary">{section.name}</h3>
            <p className="text-text-secondary">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;