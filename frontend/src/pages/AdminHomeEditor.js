import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { authenticatedFetch } from '../utils/api';
import SectionEditModal from '../components/SectionEditModal'; // Import the modal component

const AdminHomeEditor = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch('/home-sections/admin');
      const data = await response.json();
      if (response.ok) {
        setSections(data);
      } else {
        throw new Error(data.message || 'Failed to fetch sections');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const reorderedSections = Array.from(sections);
    const [movedSection] = reorderedSections.splice(result.source.index, 1);
    reorderedSections.splice(result.destination.index, 0, movedSection);

    // Update order property
    const updatedSections = reorderedSections.map((section, index) => ({
      ...section,
      order: index + 1,
    }));

    setSections(updatedSections);

    try {
      const response = await authenticatedFetch('/home-sections/admin/order', { // Use the new order route
        method: 'PUT',
        body: JSON.stringify({ sections: updatedSections }),
      });
      if (!response.ok) {
        throw new Error('Failed to update section order');
      }
    } catch (err) {
      console.error('Error updating section order:', err);
      setError('Error al actualizar el orden de las secciones.');
      // Optionally revert to original order if update fails
      fetchSections(); 
    }
  };

  const toggleSectionEnabled = async (id, currentStatus) => {
    try {
      const response = await authenticatedFetch(`/home-sections/admin/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ enabled: !currentStatus }),
        headers: {
            'Content-Type': 'application/json', // Explicitly set Content-Type for JSON body
        },
      });
      if (!response.ok) {
        throw new Error('Failed to toggle section status');
      }
      fetchSections(); // Re-fetch to get updated status
    } catch (err) {
      console.error('Error toggling section status:', err);
      setError('Error al cambiar el estado de la sección.');
    }
  };

  const handleEditClick = (section) => {
    setSelectedSection(section);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSection(null);
  };

  const handleModalSave = () => {
    fetchSections(); // Re-fetch sections after saving
    handleModalClose();
  };

  if (loading) return <div className="text-center py-12">Cargando...</div>;
  if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Editor de la Página de Inicio</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Secciones Actuales</h2>
        <p className="text-gray-600 mb-4">
          Arrastra y suelta para reordenar las secciones. Haz clic en "Editar" para modificar el contenido o "Ocultar/Mostrar" para cambiar su visibilidad.
        </p>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="home-sections">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {sections.map((section, index) => (
                  <Draggable key={section._id} draggableId={section._id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex items-center justify-between bg-gray-100 p-4 rounded-md shadow-sm"
                      >
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-4 cursor-grab">☰</span>
                          <span className="font-medium">{section.title}</span>
                          <span className={`ml-4 px-2 py-0.5 text-xs rounded-full ${section.enabled ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                            {section.enabled ? 'Visible' : 'Oculto'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button 
                            onClick={() => handleEditClick(section)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => toggleSectionEnabled(section._id, section.enabled)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {section.enabled ? 'Ocultar' : 'Mostrar'}
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {isModalOpen && (
        <SectionEditModal 
          section={selectedSection} 
          onClose={handleModalClose} 
          onSave={handleModalSave} 
        />
      )}
    </div>
  );
};

export default AdminHomeEditor;
