type FlightInfo = {
  departureDate: string
  arrivalDate: string
  departureAirport: Airport
  arrivalAirport: Airport
}

type Airport = {
  name: string
  countryName: string
}

export interface FetchFlightsResponse extends Express.Response {
  fares: {
    outbound: FlightInfo
    inbound: FlightInfo
    summary: {
      price: {
        value: number
      }
      tripDurationDays: number
    }
  }[]
}
