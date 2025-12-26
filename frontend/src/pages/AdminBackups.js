import React, { useState, useEffect } from 'react';
import { authenticatedFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AdminBackups = () => {
  const [backups, setBackups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const {  } = useAuth();

  const fetchBackups = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authenticatedFetch('/backup');
      if (!response.ok) {
        throw new Error('Failed to fetch backups.');
      }
      const data = await response.json();
      setBackups(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleCreateBackup = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await authenticatedFetch('/backup/export', { method: 'POST' });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create backup.');
      }
      setSuccess(data.message);
      fetchBackups(); // Refresh the list
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (filename) => {
    if (window.confirm(`Are you sure you want to restore from "${filename}"? This will overwrite the current database.`)) {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const response = await authenticatedFetch(`/backup/import/${filename}`, { method: 'POST' });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to restore backup.');
        }
        setSuccess(data.message);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async (filename) => {
    if (window.confirm(`Are you sure you want to delete "${filename}"? This action cannot be undone.`)) {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const response = await authenticatedFetch(`/backup/${filename}`, { method: 'DELETE' });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to delete backup.');
        }
        setSuccess(data.message);
        fetchBackups(); // Refresh the list
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDownload = async (filename) => {
    try {
      const response = await authenticatedFetch(`/backup/download/${filename}`);
      if (!response.ok) {
        throw new Error('Download failed.');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message);
    }
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Database Backups</h1>

      {isLoading && <p>Loading...</p>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{success}</div>}

      <div className="mb-4">
        <button
          onClick={handleCreateBackup}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300"
        >
          {isLoading ? 'Creating...' : 'Create New Backup'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Filename</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Size</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {backups.map((backup) => (
              <tr key={backup.filename} className="border-b">
                <td className="py-3 px-4">{backup.filename}</td>
                <td className="py-3 px-4">{formatBytes(backup.size)}</td>
                <td className="py-3 px-4">{new Date(backup.createdAt).toLocaleString()}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleRestore(backup.filename)}
                    disabled={isLoading}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2 disabled:bg-yellow-300"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => handleDownload(backup.filename)}
                    disabled={isLoading}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2 disabled:bg-green-300"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(backup.filename)}
                    disabled={isLoading}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded disabled:bg-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {backups.length === 0 && !isLoading && <p className="text-center my-4">No backups found.</p>}
      </div>
    </div>
  );
};

export default AdminBackups;
