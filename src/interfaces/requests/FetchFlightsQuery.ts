export interface FetchFlightsQuery extends Express.Request {
  query: {
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
