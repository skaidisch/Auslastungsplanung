import { createContext, useContext, useState, ReactNode } from 'react';
import { Auftrag } from '../types';
import { BEISPIEL_AUFTRAEGE } from '../data/sampleOrders';

interface AppContextType {
  auftraege: Auftrag[];
  planOrder: (id: string, zuschnittDatum: string, abteilung: 'Standard' | 'Sonderbau') => void;
  unplanOrder: (id: string) => void;
  getUnplannedOrders: () => Auftrag[];
  getPlannedOrders: () => Auftrag[];
  getOrdersByDate: (datum: string) => Auftrag[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [auftraege, setAuftraege] = useState<Auftrag[]>(BEISPIEL_AUFTRAEGE);

  const planOrder = (id: string, zuschnittDatum: string, abteilung: 'Standard' | 'Sonderbau') => {
    setAuftraege(prev =>
      prev.map(auftrag =>
        auftrag.id === id
          ? {
              ...auftrag,
              zuschnittDatum,
              abteilung,
              status: 'geplant' as const,
              kalenderwoche: getWeekNumber(new Date(zuschnittDatum))
            }
          : auftrag
      )
    );
  };

  const unplanOrder = (id: string) => {
    setAuftraege(prev =>
      prev.map(auftrag =>
        auftrag.id === id
          ? {
              ...auftrag,
              zuschnittDatum: null,
              abteilung: null,
              status: 'ungeplant' as const,
              kalenderwoche: null
            }
          : auftrag
      )
    );
  };

  const getUnplannedOrders = () => {
    return auftraege.filter(a => a.status === 'ungeplant');
  };

  const getPlannedOrders = () => {
    return auftraege.filter(a => a.status === 'geplant');
  };

  const getOrdersByDate = (datum: string) => {
    return auftraege.filter(a => a.zuschnittDatum === datum);
  };

  return (
    <AppContext.Provider
      value={{
        auftraege,
        planOrder,
        unplanOrder,
        getUnplannedOrders,
        getPlannedOrders,
        getOrdersByDate
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
