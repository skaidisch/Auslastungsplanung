// Kalenderwoche aus Datum berechnen (ISO 8601)
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

// Alle Tage eines Monats (inkl. Auffülltage für Kalender-Grid)
export function getDaysInMonth(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days: Date[] = [];

  // Auffüllen am Anfang (Mo = 1, So = 0 -> 7)
  const startDayOfWeek = firstDay.getDay() || 7; // Montag = 1
  for (let i = startDayOfWeek - 1; i > 0; i--) {
    const d = new Date(year, month, 1 - i);
    days.push(d);
  }

  // Alle Tage des Monats
  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day));
  }

  // Auffüllen am Ende bis 42 Tage (6 Wochen) oder 35 Tage (5 Wochen)
  const remainingDays = days.length <= 35 ? 35 - days.length : 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
}

// Ist Wochenende?
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

// Ist Feiertag?
export function isHoliday(date: Date, feiertage: string[]): boolean {
  const dateStr = formatDate(date);
  return feiertage.includes(dateStr);
}

// Datum formatieren: "2025-01-20"
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Datum lang formatieren: "Montag, 20. Januar 2025"
export function formatDateLong(date: Date): string {
  return date.toLocaleDateString('de-AT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

// Monat und Jahr formatieren: "Januar 2025"
export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('de-AT', {
    month: 'long',
    year: 'numeric'
  });
}

// Woche formatieren: "KW 3, 2025"
export function formatWeek(date: Date): string {
  return `KW ${getWeekNumber(date)}, ${date.getFullYear()}`;
}

// Ist heute?
export function isToday(date: Date): boolean {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

// Ist im aktuellen Monat?
export function isCurrentMonth(date: Date, currentDate: Date): boolean {
  return date.getMonth() === currentDate.getMonth() &&
    date.getFullYear() === currentDate.getFullYear();
}

// Tage einer Woche (Mo-So)
export function getDaysInWeek(date: Date): Date[] {
  const days: Date[] = [];
  const dayOfWeek = date.getDay() || 7; // Montag = 1
  const monday = new Date(date);
  monday.setDate(date.getDate() - dayOfWeek + 1);

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }

  return days;
}
