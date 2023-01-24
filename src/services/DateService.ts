import { IDateService } from '../interfaces/services/IDateService'

type DayOfWeekMap = {
  0: 'SUNDAY'
  1: 'MONDAY'
  2: 'TUESDAY'
  3: 'WEDNESDAY'
  4: 'THURSDAY'
  5: 'FRIDAY'
  6: 'SATURDAY'
}

export class DateService implements IDateService {
  getEndDate(date: Date, days: number): Date {
    return new Date(
      new Date(date.getTime()).setDate(date.getDate() + Number(days))
    )
  }

  dayOfWeek(day: keyof DayOfWeekMap): string {
    return {
      0: 'SUNDAY',
      1: 'MONDAY',
      2: 'TUESDAY',
      3: 'WEDNESDAY',
      4: 'THURSDAY',
      5: 'FRIDAY',
      6: 'SATURDAY',
    }[day]
  }

  toDateString(dateTime: Date): string {
    return dateTime.toISOString().split('T')[0]
  }
}
