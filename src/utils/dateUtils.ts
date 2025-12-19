/**
 * Retorna a data no formato YYYY-MM-DD
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Retorna o número de dias no mês
 */
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * Retorna array com todos os dias do mês
 */
export const getDatesInMonth = (year: number, month: number): string[] => {
  const days = getDaysInMonth(year, month);
  const dates: string[] = [];

  for (let day = 1; day <= days; day++) {
    const date = new Date(year, month, day);
    dates.push(formatDate(date));
  }

  return dates;
};

/**
 * Converte string YYYY-MM-DD para objeto Date
 */
export const parseDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Retorna o nome do mês abreviado em português
 */
export const getMonthName = (month: number): string => {
  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  return months[month];
};

/**
 * Verifica se uma data é hoje
 */
export const isToday = (dateString: string): boolean => {
  return dateString === formatDate(new Date());
};

/**
 * Verifica se uma data já passou
 */
export const isPastDate = (dateString: string): boolean => {
  const date = parseDate(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

/**
 * Verifica é fim de semana
 */
export function isFimDeSemana(dia: number, mesAtual: Date) {
  const date = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), dia);

  const dayOfWeek = date.getDay(); // 0 = domingo, 6 = sábado
  return dayOfWeek === 0 || dayOfWeek === 6;
}