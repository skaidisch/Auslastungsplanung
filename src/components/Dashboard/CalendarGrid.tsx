import { useMemo } from 'react';
import { Auftrag, Kapazitaet } from '../../types';
import { FEIERTAGE } from '../../data/masterData';
import {
  getDaysInMonth,
  getWeekNumber,
  isWeekend,
  isHoliday,
  formatDate,
  isToday,
  isCurrentMonth
} from '../../utils/dateUtils';

interface CalendarGridProps {
  currentDate: Date;
  auftraege: Auftrag[];
  kapazitaeten: Kapazitaet[];
  onDayClick: (date: Date) => void;
}

interface DayData {
  date: Date;
  orders: Auftrag[];
  totalUnits: number;
  capacity: Kapazitaet | null;
  status: 'normal' | 'under' | 'over' | 'inactive';
}

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

export default function CalendarGrid({
  currentDate,
  auftraege,
  kapazitaeten,
  onDayClick
}: CalendarGridProps) {
  const days = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());

    return daysInMonth.map((date): DayData => {
      const dateStr = formatDate(date);
      const orders = auftraege.filter(a => a.zuschnittDatum === dateStr);
      const totalUnits = orders.reduce((sum, a) => sum + a.einheiten, 0);
      const kw = getWeekNumber(date);
      const capacity = kapazitaeten.find(k => k.kw === kw) || null;

      // Determine status
      let status: DayData['status'] = 'normal';

      if (isWeekend(date) || isHoliday(date, FEIERTAGE) || !capacity || capacity.standard.tag === 0) {
        status = 'inactive';
      } else {
        const maxCapacity = capacity.standard.max + capacity.sonderbau.max;
        const minCapacity = capacity.standard.min + capacity.sonderbau.min;

        if (totalUnits > maxCapacity) {
          status = 'over';
        } else if (totalUnits < minCapacity && totalUnits > 0) {
          status = 'under';
        } else if (totalUnits >= minCapacity && totalUnits <= maxCapacity) {
          status = 'normal';
        }
      }

      return { date, orders, totalUnits, capacity, status };
    });
  }, [currentDate, auftraege, kapazitaeten]);

  const getCapacityBarColor = (status: DayData['status']) => {
    switch (status) {
      case 'normal':
        return 'bg-green-500';
      case 'under':
        return 'bg-yellow-500';
      case 'over':
        return 'bg-red-500';
      case 'inactive':
        return 'bg-gray-300';
    }
  };

  const getCapacityPercentage = (dayData: DayData): number => {
    if (dayData.status === 'inactive' || !dayData.capacity) return 0;
    const maxCapacity = dayData.capacity.standard.max + dayData.capacity.sonderbau.max;
    if (maxCapacity === 0) return 0;
    return Math.min((dayData.totalUnits / maxCapacity) * 100, 100);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 bg-gray-50 border-b">
        {WEEKDAYS.map((day, index) => (
          <div
            key={day}
            className={`px-2 py-3 text-center text-sm font-medium ${
              index >= 5 ? 'text-gray-400' : 'text-gray-700'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {days.map((dayData, index) => {
          const inCurrentMonth = isCurrentMonth(dayData.date, currentDate);
          const today = isToday(dayData.date);
          const weekend = isWeekend(dayData.date);
          const holiday = isHoliday(dayData.date, FEIERTAGE);

          return (
            <div
              key={index}
              onClick={() => onDayClick(dayData.date)}
              className={`
                min-h-[90px] p-2 border-b border-r cursor-pointer transition-colors
                ${!inCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
                ${weekend || holiday ? 'bg-gray-100' : ''}
                ${today ? 'ring-2 ring-blue-500 ring-inset' : ''}
                hover:bg-blue-50
              `}
            >
              {/* Date number */}
              <div className={`text-sm font-medium mb-1 ${
                today ? 'text-blue-600' : inCurrentMonth ? 'text-gray-800' : 'text-gray-400'
              }`}>
                {dayData.date.getDate()}
              </div>

              {/* Capacity bar */}
              {dayData.status !== 'inactive' && dayData.totalUnits > 0 && (
                <div className="mb-1">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getCapacityBarColor(dayData.status)} transition-all`}
                      style={{ width: `${getCapacityPercentage(dayData)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Order count and units */}
              {dayData.orders.length > 0 && (
                <div className="text-xs">
                  <div className="text-gray-500">{dayData.orders.length} Aufträge</div>
                  <div className={`font-semibold ${
                    dayData.status === 'over' ? 'text-red-600' :
                    dayData.status === 'under' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {dayData.totalUnits.toFixed(1)} E
                  </div>
                </div>
              )}

              {/* Holiday/Weekend indicator */}
              {(holiday || (weekend && inCurrentMonth)) && dayData.orders.length === 0 && (
                <div className="text-xs text-gray-400 mt-1">
                  {holiday ? 'Feiertag' : 'Wochenende'}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
