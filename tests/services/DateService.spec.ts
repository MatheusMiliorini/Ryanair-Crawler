import { IDateService } from '../../src/interfaces/services/IDateService'
import { DateService } from '../../src/services/DateService'

describe('DateService', () => {
  it('should return FRIDAY', () => {
    const dateService: IDateService = new DateService()
    expect(dateService.dayOfWeek(5)).toBe('FRIDAY')
  })

  it('should return SATURDAY', () => {
    const dateService: IDateService = new DateService()
    expect(dateService.dayOfWeek(6)).toBe('SATURDAY')
  })

  it('Should return 2023-01-27', () => {
    const dateService: IDateService = new DateService()
    const date = new Date('2023-01-27 00:00:00')
    const dateStr = dateService.toDateString(date)
    expect(dateStr).toBe('2023-01-27')
  })

  it('Should return 2023-01-29', () => {
    const dateService: IDateService = new DateService()
    const date = new Date('2023-01-27 00:00:00')
    const endDate = dateService.getEndDate(date, 2)
    const endDateStr = dateService.toDateString(endDate)
    expect(endDateStr).toBe('2023-01-29')
  })
})
