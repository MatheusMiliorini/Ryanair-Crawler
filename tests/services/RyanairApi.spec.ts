import { IRyanairApi } from '../../src/interfaces/services/IRyanairApi'
import { RyanairApi } from '../../src/services/RyanairApi'
import { IDateService } from '../../src/interfaces/services/IDateService'
import { DateService } from '../../src/services/DateService'

describe('RyanairApi', () => {
  it('Should return a valid list of flights', async () => {
    const dateService: IDateService = new DateService()
    const ryanairApi: IRyanairApi = new RyanairApi(dateService)
    const data = await ryanairApi.fetch({
      airport: 'DUB',
      daysMin: 2,
      startDate: new Date('2023-03-17 00:00:00'),
      endDate: new Date('2023-03-19 00:00:00'),
      departureStart: '00:00',
      departureEnd: '23:59',
      inboundStart: '00:00',
      inboundEnd: '23:59',
    })
    expect(data.fares.length).toBeGreaterThan(0)
    expect(data.fares[0].summary.price.value).toBeGreaterThan(0)
    expect(data.fares[0].outbound.departureAirport.countryName).toBe('Ireland')
  })
})
