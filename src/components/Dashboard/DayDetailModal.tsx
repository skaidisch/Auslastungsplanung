import { Auftrag, Kapazitaet } from '../../types';
import { formatDateLong, getWeekNumber, formatDate } from '../../utils/dateUtils';

interface DayDetailModalProps {
  date: Date;
  auftraege: Auftrag[];
  kapazitaet: Kapazitaet | null;
  onClose: () => void;
  onUnplan: (id: string) => void;
}

export default function DayDetailModal({
  date,
  auftraege,
  kapazitaet,
  onClose,
  onUnplan
}: DayDetailModalProps) {
  const dateStr = formatDate(date);
  const ordersForDay = auftraege.filter(a => a.zuschnittDatum === dateStr);
  const totalUnits = ordersForDay.reduce((sum, a) => sum + a.einheiten, 0);
  const kw = getWeekNumber(date);

  const standardOrders = ordersForDay.filter(a => a.abteilung === 'Standard');
  const sonderbauOrders = ordersForDay.filter(a => a.abteilung === 'Sonderbau');

  const standardUnits = standardOrders.reduce((sum, a) => sum + a.einheiten, 0);
  const sonderbauUnits = sonderbauOrders.reduce((sum, a) => sum + a.einheiten, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {formatDateLong(date)}
              </h2>
              <div className="text-sm text-gray-500 mt-1">
                Kalenderwoche {kw}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Capacity info */}
          {kapazitaet && kapazitaet.standard.tag > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 rounded p-3">
                <div className="font-medium text-gray-700 mb-2">Standard</div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-xs text-gray-500">Aktuell</div>
                    <div className={`font-bold ${
                      standardUnits > kapazitaet.standard.max ? 'text-red-600' :
                      standardUnits < kapazitaet.standard.min ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {standardUnits.toFixed(1)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Min</div>
                    <div className="font-medium">{kapazitaet.standard.min}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Max</div>
                    <div className="font-medium">{kapazitaet.standard.max}</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded p-3">
                <div className="font-medium text-gray-700 mb-2">Sonderbau</div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-xs text-gray-500">Aktuell</div>
                    <div className={`font-bold ${
                      sonderbauUnits > kapazitaet.sonderbau.max ? 'text-red-600' :
                      sonderbauUnits < kapazitaet.sonderbau.min ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {sonderbauUnits.toFixed(1)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Min</div>
                    <div className="font-medium">{kapazitaet.sonderbau.min}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Max</div>
                    <div className="font-medium">{kapazitaet.sonderbau.max}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Total summary */}
          <div className="mt-4 flex items-center justify-between bg-blue-50 rounded p-3">
            <span className="text-sm font-medium text-blue-800">
              Gesamt: {ordersForDay.length} Aufträge
            </span>
            <span className="text-lg font-bold text-blue-600">
              {totalUnits.toFixed(2)} Einheiten
            </span>
          </div>
        </div>

        {/* Order list */}
        <div className="flex-1 overflow-auto p-6">
          {ordersForDay.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Keine Aufträge für diesen Tag geplant
            </div>
          ) : (
            <div className="space-y-3">
              {ordersForDay.map(auftrag => (
                <div
                  key={auftrag.id}
                  className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">
                        {auftrag.auftragsnummer}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        auftrag.abteilung === 'Standard'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {auftrag.abteilung}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {auftrag.kundenname}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {auftrag.einheiten}
                      </div>
                      <div className="text-xs text-gray-500">Einheiten</div>
                    </div>
                    <button
                      onClick={() => onUnplan(auftrag.id)}
                      className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    >
                      Zurück in Pool
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
