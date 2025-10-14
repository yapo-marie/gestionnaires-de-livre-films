import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import Modal from '../components/Modal.jsx';
import {
  createCollection,
  deleteCollection,
  fetchCollections
} from '../services/api.js';

const typeLabels = {
  book: 'Livres',
  movie: 'Films',
  game: 'Jeux',
  card: 'Cartes'
};

const defaultForm = {
  name: '',
  type: 'book',
  description: ''
};

function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [formState, setFormState] = useState(defaultForm);

  const loadCollections = async () => {
    setLoading(true);
    try {
      const data = await fetchCollections();
      setCollections(data);
    } catch (error) {
      toast.error('Impossible de charger les collections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const handleCreateCollection = async (event) => {
    event.preventDefault();
    try {
      await createCollection(formState);
      toast.success('Collection créée');
      setOpenModal(false);
      setFormState(defaultForm);
      loadCollections();
    } catch (error) {
      const message = error?.response?.data?.detail ?? "Échec de la création";
      toast.error(message);
    }
  };

  const handleDelete = async (collectionId) => {
    if (!window.confirm('Supprimer cette collection ?')) {
      return;
    }
    try {
      await deleteCollection(collectionId);
      toast.success('Collection supprimée');
      loadCollections();
    } catch (error) {
      toast.error("Impossible de supprimer la collection");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Collections</h2>
          <p className="text-sm text-slate-500">Visualisez et gérez toutes vos collections</p>
        </div>
        <button
          type="button"
          onClick={() => setOpenModal(true)}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Nouvelle collection
        </button>
      </div>

      {loading ? (
        <p className="text-center text-slate-500">Chargement des collections...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              to={`/collections/${collection.id}`}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">{collection.name}</h3>
                <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-600">
                  {typeLabels[collection.type] ?? collection.type}
                </span>
              </div>
              {collection.description && (
                <p className="mt-3 line-clamp-3 text-sm text-slate-500">{collection.description}</p>
              )}
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>Créée le {new Date(collection.created_at).toLocaleDateString()}</span>
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    handleDelete(collection.id);
                  }}
                  className="rounded-lg px-2 py-1 font-medium text-rose-500 hover:bg-rose-50"
                >
                  Supprimer
                </button>
              </div>
              </Link>
          ))}
        </div>
      )}

      <Modal title="Nouvelle collection" open={openModal} onClose={() => setOpenModal(false)}>
        <form className="space-y-4" onSubmit={handleCreateCollection}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Nom
            </label>
            <input
              id="name"
              type="text"
              required
              value={formState.name}
              onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-slate-700">
              Type
            </label>
            <select
              id="type"
              value={formState.type}
              onChange={(event) => setFormState((prev) => ({ ...prev, type: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            >
              {Object.entries(typeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              id="description"
              rows="3"
              value={formState.description}
              onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Créer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default CollectionsPage;
