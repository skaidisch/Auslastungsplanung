import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { KAPAZITAETEN } from '../../data/capacities';
import StatCards from './StatCards';
import CalendarGrid from './CalendarGrid';
import DayDetailModal from './DayDetailModal';
import {
  formatMonthYear,
  formatWeek,
  formatDateLong,
  getWeekNumber,
  getDaysInWeek,
  formatDate
} from '../../utils/dateUtils';

type ViewMode = 'month' | 'week' | 'day';

export default function DashboardPage() {
  const { auftraege, getPlannedOrders, getUnplannedOrders, unplanOrder } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Statistics calculations
  const stats = useMemo(() => {
    const planned = getPlannedOrders();
    const unplanned = getUnplannedOrders();

    // Units this week
    const weekDays = getDaysInWeek(new Date());
    const weekStart = formatDate(weekDays[0]);
    const weekEnd = formatDate(weekDays[6]);
    const unitsThisWeek = planned
      .filter(a => a.zuschnittDatum && a.zuschnittDatum >= weekStart && a.zuschnittDatum <= weekEnd)
      .reduce((sum, a) => sum + a.einheiten, 0);

    // Units this month
    const now = new Date();
    const monthStart = formatDate(new Date(now.getFullYear(), now.getMonth(), 1));
    const monthEnd = formatDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
    const unitsThisMonth = planned
      .filter(a => a.zuschnittDatum && a.zuschnittDatum >= monthStart && a.zuschnittDatum <= monthEnd)
      .reduce((sum, a) => sum + a.einheiten, 0);

    return {
      plannedCount: planned.length,
      unplannedCount: unplanned.length,
      unitsThisWeek,
      unitsThisMonth
    };
  }, [getPlannedOrders, getUnplannedOrders]);

  // Navigation handlers
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  const getHeaderTitle = () => {
    switch (viewMode) {
      case 'month':
        return formatMonthYear(currentDate);
      case 'week':
        return formatWeek(currentDate);
      case 'day':
        return formatDateLong(currentDate);
    }
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCloseModal = () => {
    setSelectedDate(null);
  };

  const selectedKapazitaet = selectedDate
    ? KAPAZITAETEN.find(k => k.kw === getWeekNumber(selectedDate)) || null
    : null;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Kapazitätsplanung 2025
        </h1>

        {/* View mode switcher */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
            {(['month', 'week', 'day'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  viewMode === mode
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {mode === 'month' ? 'Monat' : mode === 'week' ? 'Woche' : 'Tag'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={navigatePrevious}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            ← Zurück
          </button>
          <button
            onClick={navigateToday}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            Heute
          </button>
          <button
            onClick={navigateNext}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            Weiter →
          </button>
        </div>
        <h2 className="text-xl font-semibold text-gray-700">
          {getHeaderTitle()}
        </h2>
      </div>

      {/* Statistics Cards */}
      <StatCards
        plannedCount={stats.plannedCount}
        unplannedCount={stats.unplannedCount}
        unitsThisWeek={stats.unitsThisWeek}
        unitsThisMonth={stats.unitsThisMonth}
      />

      {/* Calendar View */}
      {viewMode === 'month' && (
        <CalendarGrid
          currentDate={currentDate}
          auftraege={auftraege}
          kapazitaeten={KAPAZITAETEN}
          onDayClick={handleDayClick}
        />
      )}

      {viewMode === 'week' && (
        <WeekView
          currentDate={currentDate}
          auftraege={auftraege}
          kapazitaeten={KAPAZITAETEN}
          onDayClick={handleDayClick}
        />
      )}

      {viewMode === 'day' && (
        <DayView
          date={currentDate}
          auftraege={auftraege}
          kapazitaet={KAPAZITAETEN.find(k => k.kw === getWeekNumber(currentDate)) || null}
          onUnplan={unplanOrder}
        />
      )}

      {/* Day Detail Modal */}
      {selectedDate && (
        <DayDetailModal
          date={selectedDate}
          auftraege={auftraege}
          kapazitaet={selectedKapazitaet}
          onClose={handleCloseModal}
          onUnplan={unplanOrder}
        />
      )}
    </div>
  );
}

// Week View Component
function WeekView({
  currentDate,
  auftraege,
  kapazitaeten,
  onDayClick
}: {
  currentDate: Date;
  auftraege: import('../../types').Auftrag[];
  kapazitaeten: import('../../types').Kapazitaet[];
  onDayClick: (date: Date) => void;
}) {
  const weekDays = getDaysInWeek(currentDate);
  const WEEKDAY_NAMES = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="grid grid-cols-7">
        {weekDays.map((date, index) => {
          const dateStr = formatDate(date);
          const orders = auftraege.filter(a => a.zuschnittDatum === dateStr);
          const totalUnits = orders.reduce((sum, a) => sum + a.einheiten, 0);
          const kw = getWeekNumber(date);
          const capacity = kapazitaeten.find(k => k.kw === kw);
          const isWeekendDay = index >= 5;

          return (
            <div
              key={index}
              onClick={() => onDayClick(date)}
              className={`min-h-[200px] p-3 border-r last:border-r-0 cursor-pointer hover:bg-blue-50 transition-colors ${
                isWeekendDay ? 'bg-gray-50' : ''
              }`}
            >
              <div className="text-center mb-3">
                <div className="text-xs text-gray-500">{WEEKDAY_NAMES[index]}</div>
                <div className="text-lg font-semibold text-gray-800">{date.getDate()}</div>
              </div>

              {capacity && capacity.standard.tag > 0 && (
                <div className="text-xs text-gray-500 text-center mb-2">
                  Max: {capacity.standard.max + capacity.sonderbau.max}
                </div>
              )}

              <div className="space-y-1">
                {orders.slice(0, 5).map(order => (
                  <div
                    key={order.id}
                    className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-1 truncate"
                  >
                    {order.einheiten}E - {order.kundenname.substring(0, 15)}
                  </div>
                ))}
                {orders.length > 5 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{orders.length - 5} weitere
                  </div>
                )}
              </div>

              {orders.length > 0 && (
                <div className="mt-2 pt-2 border-t text-center">
                  <span className="text-sm font-bold text-blue-600">
                    {totalUnits.toFixed(1)} E
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Day View Component
function DayView({
  date,
  auftraege,
  kapazitaet,
  onUnplan
}: {
  date: Date;
  auftraege: import('../../types').Auftrag[];
  kapazitaet: import('../../types').Kapazitaet | null;
  onUnplan: (id: string) => void;
}) {
  const dateStr = formatDate(date);
  const orders = auftraege.filter(a => a.zuschnittDatum === dateStr);
  const totalUnits = orders.reduce((sum, a) => sum + a.einheiten, 0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {formatDateLong(date)}
          </h3>
          <div className="text-sm text-gray-500">
            KW {getWeekNumber(date)}
          </div>
        </div>
        {kapazitaet && kapazitaet.standard.tag > 0 && (
          <div className="text-right">
            <div className="text-sm text-gray-500">Kapazität</div>
            <div className="text-lg font-semibold">
              {totalUnits.toFixed(1)} / {kapazitaet.standard.max + kapazitaet.sonderbau.max}
            </div>
          </div>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          Keine Aufträge für diesen Tag geplant
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{order.auftragsnummer}</span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    order.abteilung === 'Standard'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {order.abteilung}
                  </span>
                </div>
                <div className="text-sm text-gray-600">{order.kundenname}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-blue-600">
                  {order.einheiten}
                </div>
                <button
                  onClick={() => onUnplan(order.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                >
                  Entfernen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
