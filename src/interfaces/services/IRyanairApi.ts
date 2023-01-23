import { FetchFlightsResponse } from '../responses/FetchFlightsResponse';
export namespace IRyanairApi {
  export type Params = {
    airport: string
    startDate: string
    endDate: string
    daysMin: number
    departureStart: string
    departureEnd: string
    inboundStart: string
    inboundEnd: string
    dayOfWeek: string
  }
}

export interface IRyanairApi {
  fetch(params: IRyanairApi.Params): Promise<FetchFlightsResponse>
}