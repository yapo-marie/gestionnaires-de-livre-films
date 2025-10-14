import PropTypes from 'prop-types';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function Stats({ totals, byType, byStatus }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Total items</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">{totals.items}</p>
        <p className="mt-2 text-sm text-slate-500">Collections: {totals.collections}</p>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
        <h3 className="text-sm font-medium text-slate-500">Répartition par type</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byType}>
              <XAxis dataKey="type" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
              <Tooltip cursor={false} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-3">
        <h3 className="text-sm font-medium text-slate-500">Statuts</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {byStatus.map((status) => (
            <div key={status.status} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">{status.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{status.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Stats.propTypes = {
  totals: PropTypes.shape({
    items: PropTypes.number.isRequired,
    collections: PropTypes.number.isRequired
  }).isRequired,
  byType: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired
    })
  ).isRequired,
  byStatus: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired
    })
  ).isRequired
};

export default Stats;
