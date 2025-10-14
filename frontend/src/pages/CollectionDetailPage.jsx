import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import FilterBar from '../components/FilterBar.jsx';
import ItemCard from '../components/ItemCard.jsx';
import ItemForm from '../components/ItemForm.jsx';
import Modal from '../components/Modal.jsx';
import {
  createItem,
  deleteItem,
  fetchCollection,
  fetchItems,
  updateItem
} from '../services/api.js';

const emptyItem = (collectionId) => ({
  collection_id: Number(collectionId),
  title: '',
  creator: '',
  genre: '',
  status: 'owned',
  rating: '',
  notes: '',
  image_url: '',
  purchase_date: '',
  price: '',
  tags: ''
});

function CollectionDetailPage() {
  const { collectionId } = useParams();
  const [collection, setCollection] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', type: '', status: '', genre: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const loadCollection = async () => {
    try {
      const data = await fetchCollection(collectionId);
      setCollection(data);
    } catch (error) {
      toast.error('Collection introuvable');
    }
  };

  const loadItems = async () => {
    setLoading(true);
    try {
      const params = {
        collection_id: collectionId,
        status: filters.status || undefined,
        genre: filters.genre || undefined,
        search: filters.search || undefined
      };
      const data = await fetchItems(params);
      setItems(data);
    } catch (error) {
      toast.error("Impossible de charger les items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollection();
  }, [collectionId]);

  useEffect(() => {
    loadItems();
  }, [collectionId, filters.search, filters.status, filters.genre]);

  const handleCreateOrUpdate = async (payload) => {
    try {
      if (selectedItem) {
        await updateItem(selectedItem.id, payload);
        toast.success('Item mis à jour');
      } else {
        await createItem(payload);
        toast.success('Item créé');
      }
      setModalOpen(false);
      setSelectedItem(null);
      loadItems();
    } catch (error) {
      toast.error("Échec de l'enregistrement");
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Supprimer ${item.title} ?`)) {
      return;
    }
    try {
      await deleteItem(item.id);
      toast.success('Item supprimé');
      loadItems();
    } catch (error) {
      toast.error("Impossible de supprimer l'item");
    }
  };

  const preparedItem = useMemo(() => {
    if (!selectedItem) {
      return emptyItem(collectionId);
    }
    return {
      ...selectedItem,
      tags: selectedItem.tags ? selectedItem.tags.join(', ') : '',
      rating: selectedItem.rating ?? '',
      price: selectedItem.price ?? ''
    };
  }, [selectedItem, collectionId]);

  if (!collection) {
    return <p className="text-center text-slate-500">Chargement de la collection...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">{collection.name}</h2>
          <p className="text-sm text-slate-500">{collection.description}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSelectedItem(null);
            setModalOpen(true);
          }}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Nouvel item
        </button>
      </div>

      <FilterBar filters={filters} onChange={setFilters} showType={false} />

      {loading ? (
        <p className="text-center text-slate-500">Chargement des items...</p>
      ) : items.length === 0 ? (
        <p className="text-center text-slate-500">Aucun item pour cette collection.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={() => {
                setSelectedItem(item);
                setModalOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal
        title={selectedItem ? `Modifier ${selectedItem.title}` : 'Nouvel item'}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedItem(null);
        }}
      >
        <ItemForm
          initialValues={preparedItem}
          onCancel={() => {
            setModalOpen(false);
            setSelectedItem(null);
          }}
          onSubmit={(payload) => handleCreateOrUpdate({ ...payload, collection_id: Number(collectionId) })}
        />
      </Modal>
    </div>
  );
}

export default CollectionDetailPage;
