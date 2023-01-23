export interface IDateService {
  dayOfWeek(day: number): string
  toDateString(dateTime: Date): string
  getEndDate(date: Date, days: number): Date
}
