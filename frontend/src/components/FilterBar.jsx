import PropTypes from 'prop-types';

const types = [
  { value: '', label: 'Tous les types' },
  { value: 'book', label: 'Livres' },
  { value: 'movie', label: 'Films' },
  { value: 'game', label: 'Jeux vidéo' },
  { value: 'card', label: 'Cartes' }
];

const statuses = [
  { value: '', label: 'Tous les statuts' },
  { value: 'owned', label: 'Possédé' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'completed', label: 'Terminé' },
  { value: 'wishlist', label: 'Wishlist' }
];

function FilterBar({ filters, onChange, showType }) {
  return (
    <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-2">
          <label htmlFor="search" className="text-sm font-medium text-slate-600">
            Recherche
          </label>
          <input
            id="search"
            type="search"
            value={filters.search}
            onChange={(event) => onChange({ ...filters, search: event.target.value })}
            placeholder="Titre, mots-clés..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>
        {showType && (
          <div className="flex flex-1 items-center gap-2">
            <label htmlFor="type" className="text-sm font-medium text-slate-600">
              Type
            </label>
            <select
              id="type"
              value={filters.type}
              onChange={(event) => onChange({ ...filters, type: event.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            >
              {types.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex flex-1 items-center gap-2">
          <label htmlFor="status" className="text-sm font-medium text-slate-600">
            Statut
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(event) => onChange({ ...filters, status: event.target.value })}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-1 items-center gap-2">
          <label htmlFor="genre" className="text-sm font-medium text-slate-600">
            Genre
          </label>
          <input
            id="genre"
            type="text"
            value={filters.genre}
            onChange={(event) => onChange({ ...filters, genre: event.target.value })}
            placeholder="Genre"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>
      </div>
    </div>
  );
}

FilterBar.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    type: PropTypes.string,
    status: PropTypes.string,
    genre: PropTypes.string
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  showType: PropTypes.bool
};

FilterBar.defaultProps = {
  showType: true
};

export default FilterBar;
