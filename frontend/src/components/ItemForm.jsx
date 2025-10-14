import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const statusOptions = [
  { value: 'owned', label: 'Possédé' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'completed', label: 'Terminé' },
  { value: 'wishlist', label: 'Wishlist' }
];

function ItemForm({ initialValues, onSubmit, onCancel }) {
  const [formState, setFormState] = useState(initialValues);

  useEffect(() => {
    setFormState(initialValues);
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      ...formState,
      creator: formState.creator?.trim() || null,
      genre: formState.genre?.trim() || null,
      notes: formState.notes?.trim() || null,
      image_url: formState.image_url?.trim() || null,
      purchase_date: formState.purchase_date || null,
      rating: formState.rating ? Number(formState.rating) : null,
      price: formState.price ? Number(formState.price) : null,
      tags: formState.tags
        ? formState.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : []
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700">
          Titre
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formState.title}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="creator" className="block text-sm font-medium text-slate-700">
            Auteur / Créateur
          </label>
          <input
            id="creator"
            name="creator"
            type="text"
            value={formState.creator}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>
        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-slate-700">
            Genre
          </label>
          <input
            id="genre"
            name="genre"
            type="text"
            value={formState.genre}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-slate-700">
            Statut
          </label>
          <select
            id="status"
            name="status"
            value={formState.status}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-slate-700">
            Note (1-5)
          </label>
          <input
            id="rating"
            name="rating"
            type="number"
            min="1"
            max="5"
            step="0.5"
            value={formState.rating ?? ''}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="purchase_date" className="block text-sm font-medium text-slate-700">
            Date d'achat
          </label>
          <input
            id="purchase_date"
            name="purchase_date"
            type="date"
            value={formState.purchase_date ?? ''}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-slate-700">
            Prix (€)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={formState.price ?? ''}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>
      </div>
      <div>
        <label htmlFor="image_url" className="block text-sm font-medium text-slate-700">
          URL de l'image
        </label>
        <input
          id="image_url"
          name="image_url"
          type="url"
          value={formState.image_url ?? ''}
          onChange={handleChange}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formState.notes ?? ''}
          onChange={handleChange}
          rows="3"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
      </div>
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-slate-700">
          Tags (séparés par des virgules)
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          value={formState.tags ?? ''}
          onChange={handleChange}
          placeholder="ex: science fiction, classique"
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Sauvegarder
        </button>
      </div>
    </form>
  );
}

ItemForm.propTypes = {
  initialValues: PropTypes.shape({
    title: PropTypes.string.isRequired,
    creator: PropTypes.string,
    genre: PropTypes.string,
    status: PropTypes.string.isRequired,
    rating: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    notes: PropTypes.string,
    image_url: PropTypes.string,
    purchase_date: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    tags: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default ItemForm;
