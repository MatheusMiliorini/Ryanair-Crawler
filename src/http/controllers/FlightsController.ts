import { UpdateResult } from 'mongodb'
import { FetchFlightsQuery } from '../../interfaces/requests/FetchFlightsQuery'
import { IDateService } from '../../interfaces/services/IDateService'
import { IRyanairApi } from '../../interfaces/services/IRyanairApi'
import { IFlightService } from '../../interfaces/services/IFlightService'
import { Response } from 'express'

export class FlightsController {
  constructor(
    private readonly dateService: IDateService,
    private readonly ryanairApi: IRyanairApi,
    private readonly flightService: IFlightService
  ) {}

  async get(req: FetchFlightsQuery, res: Response): Promise<Response> {
    const promises: Promise<UpdateResult>[] = []
    const runId = Math.floor(Math.random() * 100000000)

    let dropped = false
    if (req.query.drop) {
      dropped = await this.flightService.drop()
    }

    for (let i = 0; i < req.query.iterations; i++) {
      let startDate: Date = new Date(req.query.startDate)
      startDate.setDate(startDate.getDate() + 7 * i)
      let endDate: Date = this.dateService.getEndDate(
        startDate,
        req.query.daysMin
      )

      const { fares } = await this.ryanairApi.fetch({
        airport: req.query.airport,
        startDate,
        endDate,
        daysMin: req.query.daysMin,
        departureStart: req.query.departureStart,
        departureEnd: req.query.departureEnd,
        inboundStart: req.query.inboundStart,
        inboundEnd: req.query.inboundEnd,
      })
      console.log(`[${i}] Inserting ${fares.length} flights into DB...`)
      fares.forEach((fare) => {
        const data = {
          runId,
          outbound: {
            departure: fare.outbound.departureDate,
            arrival: fare.outbound.arrivalDate,
          },
          return: {
            departure: fare.inbound.departureDate,
            arrival: fare.inbound.arrivalDate,
          },
          price: fare.summary.price.value,
          from: fare.outbound.departureAirport.name,
          to: fare.outbound.arrivalAirport.name,
          country: fare.outbound.arrivalAirport.countryName,
          days: fare.summary.tripDurationDays,
        }
        promises.push(this.flightService.save(data))
      })
    }
    await Promise.all(promises)
    return res.json({
      runId,
      dropped,
      imported: promises.length,
    })
  }
}
