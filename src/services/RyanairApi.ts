import { FetchFlightsResponse } from "../interfaces/responses/FetchFlightsResponse";
import { IRyanairApi } from "../interfaces/services/IRyanairApi";
import axios from 'axios';

export class RyanairApi implements IRyanairApi {

  async fetch(params: IRyanairApi.Params): Promise<FetchFlightsResponse> {
    const { data } = await axios.get<FetchFlightsResponse>(
      'https://www.ryanair.com/api/farfnd/v4/roundTripFares',
      {
        params: {
          departureAirportIataCode: params.airport,
          outboundDepartureDateFrom: params.startDate,
          outboundDepartureDateTo: params.startDate,
          market: 'en-ie',
          adultPaxCount: 1,
          inboundDepartureDateFrom: params.endDate,
          inboundDepartureDateTo: params.endDate,
          durationFrom: params.daysMin,
          durationTo: params.daysMin,
          outboundDepartureTimeFrom: params.departureStart,
          outboundDepartureTimeTo: params.departureEnd,
          outboundDepartureDaysOfWeek: params.dayOfWeek,
          inboundDepartureTimeFrom: params.inboundStart,
          inboundDepartureTimeTo: params.inboundEnd,
        },
      }
    )
    return data
  }
}