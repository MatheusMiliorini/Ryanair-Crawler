import { FetchFlightsResponse } from '../responses/FetchFlightsResponse'
export namespace IRyanairApi {
  export type Params = {
    airport: string
    startDate: Date
    endDate: Date
    daysMin: number
    departureStart: string
    departureEnd: string
    inboundStart: string
    inboundEnd: string
  }
}

export interface IRyanairApi {
  fetch(params: IRyanairApi.Params): Promise<FetchFlightsResponse>
}
