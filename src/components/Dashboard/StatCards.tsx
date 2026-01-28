interface StatCardProps {
  title: string;
  value: number | string;
  color?: string;
}

function StatCard({ title, value, color = 'text-gray-800' }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="text-sm text-gray-500 mb-1">{title}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}

interface StatCardsProps {
  plannedCount: number;
  unplannedCount: number;
  unitsThisWeek: number;
  unitsThisMonth: number;
}

export default function StatCards({
  plannedCount,
  unplannedCount,
  unitsThisWeek,
  unitsThisMonth
}: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Geplante Aufträge"
        value={plannedCount}
        color="text-green-600"
      />
      <StatCard
        title="Ungeplante Aufträge"
        value={unplannedCount}
        color="text-orange-500"
      />
      <StatCard
        title="Einheiten diese Woche"
        value={unitsThisWeek.toFixed(2)}
        color="text-blue-600"
      />
      <StatCard
        title="Einheiten diesen Monat"
        value={unitsThisMonth.toFixed(2)}
        color="text-blue-600"
      />
    </div>
  );
}
