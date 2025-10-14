import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import ItemForm from '../components/ItemForm.jsx';
import Modal from '../components/Modal.jsx';
import { deleteItem, fetchItem, updateItem } from '../services/api.js';

function ItemDetailPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const loadItem = async () => {
    try {
      const data = await fetchItem(itemId);
      setItem(data);
    } catch (error) {
      toast.error('Item introuvable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItem();
  }, [itemId]);

  const handleDelete = async () => {
    if (!window.confirm('Supprimer cet item ?')) {
      return;
    }
    try {
      await deleteItem(item.id);
      toast.success('Item supprimé');
      navigate(`/collections/${item.collection_id}`);
    } catch (error) {
      toast.error("Impossible de supprimer l'item");
    }
  };

  const preparedItem = useMemo(() => {
    if (!item) {
      return null;
    }
    return {
      ...item,
      tags: item.tags ? item.tags.join(', ') : '',
      rating: item.rating ?? '',
      price: item.price ?? ''
    };
  }, [item]);

  const handleUpdate = async (payload) => {
    try {
      await updateItem(item.id, payload);
      toast.success('Item mis à jour');
      setModalOpen(false);
      loadItem();
    } catch (error) {
      toast.error("Échec de la mise à jour");
    }
  };

  if (loading) {
    return <p className="text-center text-slate-500">Chargement de l'item...</p>;
  }

  if (!item) {
    return <p className="text-center text-slate-500">Item introuvable.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            ← Retour
          </button>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">{item.title}</h2>
          <p className="text-sm text-slate-500">{item.creator}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Modifier
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg bg-rose-100 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-200"
          >
            Supprimer
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Informations</h3>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-slate-500">Statut</dt>
                <dd className="text-sm text-slate-900">{item.status.replace('_', ' ')}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Genre</dt>
                <dd className="text-sm text-slate-900">{item.genre ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Note</dt>
                <dd className="text-sm text-slate-900">{item.rating ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Prix</dt>
                <dd className="text-sm text-slate-900">{item.price ? `${item.price} €` : '—'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Date d'achat</dt>
                <dd className="text-sm text-slate-900">
                  {item.purchase_date ? new Date(item.purchase_date).toLocaleDateString() : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Tags</dt>
                <dd className="text-sm text-slate-900">
                  {item.tags && item.tags.length > 0 ? item.tags.join(', ') : '—'}
                </dd>
              </div>
            </dl>
            {item.notes && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-slate-500">Notes</h4>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{item.notes}</p>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            {item.image_url ? (
              <img src={item.image_url} alt={item.title} className="h-80 w-full object-cover" />
            ) : (
              <div className="flex h-80 items-center justify-center bg-slate-100 text-slate-400">
                Aucun visuel
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal title={`Modifier ${item.title}`} open={modalOpen} onClose={() => setModalOpen(false)}>
        {preparedItem && (
          <ItemForm
            initialValues={preparedItem}
            onCancel={() => setModalOpen(false)}
            onSubmit={handleUpdate}
          />
        )}
      </Modal>
    </div>
  );
}

export default ItemDetailPage;
