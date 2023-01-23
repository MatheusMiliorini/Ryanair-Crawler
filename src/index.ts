import express, { Express, Response } from 'express'
import dotenv from 'dotenv'
import { MongoClient, UpdateResult } from 'mongodb'
import { DateService } from './services/DateService'
import { FetchFlightsQuery } from './interfaces/requests/FetchFlightsQuery'
import { IDateService } from './interfaces/services/IDateService'
import { IRyanairApi } from './interfaces/services/IRyanairApi'
import { RyanairApi } from './services/RyanairApi'
import { IFlightService } from './interfaces/services/IFlightService'
import { FlightService } from './services/FlightService'
dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3000
const client = new MongoClient(process.env.MONGO_URI || '')
const flights = client
  .db(process.env.MONGO_DB)
  .collection(process.env.MONGO_COLLECTION || '')
const dateService: IDateService = new DateService()
const ryanairApi: IRyanairApi = new RyanairApi()
const flightService: IFlightService = new FlightService(flights)

app.get('/', async (req: FetchFlightsQuery, res: Response) => {
  const promises: Promise<UpdateResult>[] = []
  const runId = Math.floor(Math.random() * 100000000)

  for (let i = 0; i < req.query.iterations; i++) {
    let startDate: Date | string = new Date(req.query.startDate)
    startDate.setDate(startDate.getDate() + 7 * i)
    let endDate: Date | string = dateService.getEndDate(
      startDate,
      req.query.daysMin
    )
    const dayOfWeek = dateService.dayOfWeek(startDate.getDay())
    startDate = dateService.toDateString(startDate)
    endDate = dateService.toDateString(endDate)

    const { fares } = await ryanairApi.fetch({
      airport: req.query.airport,
      dayOfWeek,
      daysMin: req.query.daysMin,
      endDate,
      startDate,
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
      promises.push(flightService.save(data))
    })
  }
  await Promise.all(promises)
  return res.json({
    runId,
    imported: promises.length,
  })
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
