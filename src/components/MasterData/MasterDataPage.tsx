import {
  FEIERTAGE,
  WARENGRUPPEN,
  PROFILTYPEN,
  PROFILFARBEN,
  ALUFARBEN,
  VERKAEUFER,
  ABTEILUNGEN
} from '../../data/masterData';

interface DataCardProps {
  title: string;
  items: string[];
  columns?: number;
}

function DataCard({ title, items, columns = 1 }: DataCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
        {title}
      </h2>
      <ul className={`grid gap-1 ${columns > 1 ? `grid-cols-${columns}` : ''}`} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {items.map((item, index) => (
          <li key={index} className="text-sm text-gray-600 py-1">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-AT', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export default function MasterDataPage() {
  const formattedFeiertage = FEIERTAGE.map(formatDate);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Stammdaten
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DataCard
          title="Feiertage 2025"
          items={formattedFeiertage}
        />

        <DataCard
          title="Warengruppen"
          items={WARENGRUPPEN}
        />

        <DataCard
          title="Profiltypen"
          items={PROFILTYPEN}
        />

        <DataCard
          title="Profilfarben"
          items={PROFILFARBEN}
          columns={2}
        />

        <DataCard
          title="Alufarben"
          items={ALUFARBEN}
          columns={2}
        />

        <DataCard
          title="Verkaeufer"
          items={VERKAEUFER}
        />

        <DataCard
          title="Abteilungen"
          items={ABTEILUNGEN}
        />
      </div>
    </div>
  );
}
