export namespace FetchFlightsQuery {
  export type Query = {
    iterations: number
    startDate: string
    daysMin: number
    airport: string
    departureStart: string
    departureEnd: string
    inboundStart: string
    inboundEnd: string
    drop?: boolean
  }
}

export interface FetchFlightsQuery extends Express.Request {
  query: FetchFlightsQuery.Query
}
