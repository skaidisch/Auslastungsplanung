import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Auftrag } from '../../types';
import { WARENGRUPPEN, VERKAEUFER } from '../../data/masterData';
import PlanningModal from './PlanningModal';

type SortKey = 'auftragsnummer' | 'kundenname' | 'warengruppe' | 'einheiten' | 'verkaeufer';
type SortDirection = 'asc' | 'desc';

export default function OrderPoolPage() {
  const { getUnplannedOrders, planOrder } = useApp();

  // Filter state
  const [warengruppe, setWarengruppe] = useState<string>('alle');
  const [verkaeufer, setVerkaeufer] = useState<string>('alle');
  const [searchTerm, setSearchTerm] = useState('');

  // Sort state
  const [sortKey, setSortKey] = useState<SortKey>('auftragsnummer');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Modal state
  const [selectedAuftrag, setSelectedAuftrag] = useState<Auftrag | null>(null);

  const unplannedOrders = getUnplannedOrders();

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    let result = [...unplannedOrders];

    // Apply filters
    if (warengruppe !== 'alle') {
      result = result.filter(a => a.warengruppe === warengruppe);
    }
    if (verkaeufer !== 'alle') {
      result = result.filter(a => a.verkaeufer === verkaeufer);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        a =>
          a.auftragsnummer.toLowerCase().includes(term) ||
          a.kundenname.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [unplannedOrders, warengruppe, verkaeufer, searchTerm, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) {
      return <span className="text-gray-300 ml-1">↕</span>;
    }
    return <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Auftragspool - Ungeplante Aufträge
      </h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Warengruppe Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Warengruppe
            </label>
            <select
              value={warengruppe}
              onChange={(e) => setWarengruppe(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="alle">Alle</option>
              {WARENGRUPPEN.map((wg) => (
                <option key={wg} value={wg}>
                  {wg}
                </option>
              ))}
            </select>
          </div>

          {/* Verkäufer Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Verkäufer
            </label>
            <select
              value={verkaeufer}
              onChange={(e) => setVerkaeufer(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="alle">Alle</option>
              {VERKAEUFER.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Suche
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Auftragsnummer oder Kunde..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        {filteredAndSortedOrders.length} von {unplannedOrders.length} Aufträgen
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('auftragsnummer')}
              >
                Auftragsnummer
                <SortIcon columnKey="auftragsnummer" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('kundenname')}
              >
                Kundenname
                <SortIcon columnKey="kundenname" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('warengruppe')}
              >
                Warengruppe
                <SortIcon columnKey="warengruppe" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('einheiten')}
              >
                Einheiten
                <SortIcon columnKey="einheiten" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('verkaeufer')}
              >
                Verkäufer
                <SortIcon columnKey="verkaeufer" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aktion
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAndSortedOrders.map((auftrag, index) => (
              <tr
                key={auftrag.id}
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-blue-50 transition-colors`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {auftrag.auftragsnummer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {auftrag.kundenname}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {auftrag.warengruppe}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-blue-600">
                  {auftrag.einheiten}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {auftrag.verkaeufer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => setSelectedAuftrag(auftrag)}
                    className="px-3 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded transition-colors"
                  >
                    Einplanen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSortedOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Keine ungeplanten Aufträge gefunden
          </div>
        )}
      </div>

      {/* Planning Modal */}
      {selectedAuftrag && (
        <PlanningModal
          auftrag={selectedAuftrag}
          onClose={() => setSelectedAuftrag(null)}
          onPlan={planOrder}
        />
      )}
    </div>
  );
}
