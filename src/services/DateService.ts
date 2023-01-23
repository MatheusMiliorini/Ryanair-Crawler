import { IDateService } from '../interfaces/services/IDateService'

export class DateService implements IDateService {
  getEndDate(date: Date, days: number): Date {
    return new Date(
      new Date(date.getTime()).setDate(date.getDate() + Number(days))
    )
  }

  dayOfWeek(day: number): string {
    return (
      {
        0: 'SUNDAY',
        1: 'MONDAY',
        2: 'TUESDAY',
        3: 'WEDNESDAY',
        4: 'THURSDAY',
        5: 'FRIDAY',
        6: 'SATURDAY',
      }[day] || 'SATURDAY'
    )
  }

  toDateString(dateTime: Date): string {
    return dateTime.toISOString().split('T')[0]
  }
}
