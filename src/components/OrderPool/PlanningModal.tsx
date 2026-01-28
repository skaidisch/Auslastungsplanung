import { useState } from 'react';
import { Auftrag } from '../../types';
import { ABTEILUNGEN } from '../../data/masterData';

interface PlanningModalProps {
  auftrag: Auftrag;
  onClose: () => void;
  onPlan: (id: string, datum: string, abteilung: 'Standard' | 'Sonderbau') => void;
}

export default function PlanningModal({ auftrag, onClose, onPlan }: PlanningModalProps) {
  const [datum, setDatum] = useState('');
  const [abteilung, setAbteilung] = useState<'Standard' | 'Sonderbau'>('Standard');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (datum && abteilung) {
      onPlan(auftrag.id, datum, abteilung);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Auftrag einplanen
        </h2>

        {/* Auftragsinfo */}
        <div className="bg-gray-50 rounded p-4 mb-6">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-500">Auftragsnummer:</div>
            <div className="font-medium">{auftrag.auftragsnummer}</div>
            <div className="text-gray-500">Kunde:</div>
            <div className="font-medium">{auftrag.kundenname}</div>
            <div className="text-gray-500">Einheiten:</div>
            <div className="font-bold text-blue-600 text-lg">{auftrag.einheiten}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Datepicker */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Produktionsdatum
            </label>
            <input
              type="date"
              value={datum}
              onChange={(e) => setDatum(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Abteilung Dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Abteilung
            </label>
            <select
              value={abteilung}
              onChange={(e) => setAbteilung(e.target.value as 'Standard' | 'Sonderbau')}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {ABTEILUNGEN.map((abt) => (
                <option key={abt} value={abt}>
                  {abt}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
            >
              Einplanen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
