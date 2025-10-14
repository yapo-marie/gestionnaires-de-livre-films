import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import Stats from '../components/Stats.jsx';
import { fetchDashboardStats } from '../services/api.js';

function HomePage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (error) {
        toast.error("Impossible de charger les statistiques");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <p className="text-center text-slate-500">Chargement du tableau de bord...</p>;
  }

  if (!stats) {
    return <p className="text-center text-slate-500">Aucune donnée disponible pour l'instant.</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900">Vue d'ensemble</h2>
      <Stats totals={stats.totals} byType={stats.byType} byStatus={stats.byStatus} />
    </div>
  );
}

export default HomePage;
