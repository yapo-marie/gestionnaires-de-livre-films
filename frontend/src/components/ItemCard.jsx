import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const statusColors = {
  owned: 'bg-slate-200 text-slate-700',
  in_progress: 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
  wishlist: 'bg-indigo-100 text-indigo-700'
};

function ItemCard({ item, onEdit, onDelete }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm">
      {item.image_url ? (
        <img src={item.image_url} alt={item.title} className="h-48 w-full object-cover" />
      ) : (
        <div className="flex h-48 w-full items-center justify-center bg-slate-100 text-slate-400">
          Aucun visuel
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[item.status]}`}>
            {item.status.replace('_', ' ')}
          </span>
        </div>
        {item.genre && <p className="text-sm text-slate-500">{item.genre}</p>}
        {item.rating && (
          <p className="text-sm font-medium text-amber-500">Note : {item.rating.toFixed(1)} / 5</p>
        )}
        <div className="mt-auto flex items-center justify-between text-sm text-slate-500">
          {item.creator && <span>{item.creator}</span>}
          <span>{new Date(item.created_at).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <Link
            to={`/items/${item.id}`}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Voir détails
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="rounded-lg border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Éditer
            </button>
            <button
              type="button"
              onClick={() => onDelete(item)}
              className="rounded-lg bg-rose-100 px-3 py-1 text-sm font-medium text-rose-600 hover:bg-rose-200"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

ItemCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    image_url: PropTypes.string,
    genre: PropTypes.string,
    rating: PropTypes.number,
    creator: PropTypes.string
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default ItemCard;
