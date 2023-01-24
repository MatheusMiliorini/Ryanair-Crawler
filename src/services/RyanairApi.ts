import { FetchFlightsResponse } from '../interfaces/responses/FetchFlightsResponse'
import { IRyanairApi } from '../interfaces/services/IRyanairApi'
import axios from 'axios'
import { IDateService } from '../interfaces/services/IDateService'

export class RyanairApi implements IRyanairApi {
  constructor(private readonly dateService: IDateService) {}

  async fetch(params: IRyanairApi.Params): Promise<FetchFlightsResponse> {
    const startDateStr = this.dateService.toDateString(params.startDate)
    const endDateStr = this.dateService.toDateString(params.endDate)
    const dayOfWeek = this.dateService.dayOfWeek(params.startDate.getDay())

    const { data } = await axios.get<FetchFlightsResponse>(
      'https://www.ryanair.com/api/farfnd/v4/roundTripFares',
      {
        params: {
          departureAirportIataCode: params.airport,
          outboundDepartureDateFrom: startDateStr,
          outboundDepartureDateTo: startDateStr,
          market: 'en-ie',
          adultPaxCount: 1,
          inboundDepartureDateFrom: endDateStr,
          inboundDepartureDateTo: endDateStr,
          durationFrom: params.daysMin,
          durationTo: params.daysMin,
          outboundDepartureTimeFrom: params.departureStart,
          outboundDepartureTimeTo: params.departureEnd,
          outboundDepartureDaysOfWeek: dayOfWeek,
          inboundDepartureTimeFrom: params.inboundStart,
          inboundDepartureTimeTo: params.inboundEnd,
        },
      }
    )
    return data
  }
}
