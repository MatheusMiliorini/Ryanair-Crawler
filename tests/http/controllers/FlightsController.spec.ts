import { FlightsController } from '../../../src/http/controllers/FlightsController'
import { DateService } from '../../../src/services/DateService'
import { IRyanairApi } from '../../../src/interfaces/services/IRyanairApi'
import { FetchFlightsResponse } from '../../../src/interfaces/responses/FetchFlightsResponse'
import { IFlightService } from '../../../src/interfaces/services/IFlightService'
import { FetchFlightsQuery } from '../../../src/interfaces/requests/FetchFlightsQuery'
import apiResponse from '../../files/fetch.json'

class RyanairApiSpy implements IRyanairApi {
  async fetch(params: IRyanairApi.Params): Promise<FetchFlightsResponse> {
    return Promise.resolve(apiResponse)
  }
}

class FlightServiceSpy implements IFlightService {
  dropped: boolean = false
  saved: number = 0

  save(data: IFlightService.SaveData): Promise<any> {
    this.saved++
    return Promise.resolve(true)
  }

  drop(): Promise<any> {
    this.dropped = true
    return Promise.resolve(this.dropped)
  }
}

describe('FlightsController', () => {
  it('Should drop (or not) collection', () => {
    const ds = new DateService()
    const ras = new RyanairApiSpy()
    const fss = new FlightServiceSpy()
    const flightsController = new FlightsController(ds, ras, fss)
    const query: FetchFlightsQuery.Query = {
      iterations: 10,
      airport: 'DUB',
      daysMin: 2,
      startDate: '2023-03-17',
      departureStart: '00:00',
      departureEnd: '23:59',
      inboundStart: '00:00',
      inboundEnd: '23:59',
    }
    flightsController.get({ query })
    expect(fss.dropped).toBe(false)
    query.drop = true
    flightsController.get({ query })
    expect(fss.dropped).toBe(true)
  })

  it('Should match expected response with good request', async () => {
    const dateService = new DateService()
    const ryanairApiSpy = new RyanairApiSpy()
    const flightServiceSpy = new FlightServiceSpy()
    const flightsController = new FlightsController(
      dateService,
      ryanairApiSpy,
      flightServiceSpy
    )
    const query: FetchFlightsQuery.Query = {
      iterations: 1,
      airport: 'DUB',
      daysMin: 2,
      startDate: '2023-03-17',
      departureStart: '00:00',
      departureEnd: '23:59',
      inboundStart: '00:00',
      inboundEnd: '23:59',
    }
    const response = await flightsController.get({ query })
    expect(response.dropped).toBe(false)
    expect(response.runId).toBeGreaterThan(0)
    expect(response.imported).toBe(flightServiceSpy.saved)
  })
})
