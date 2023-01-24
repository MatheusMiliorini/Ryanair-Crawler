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
import { FlightsController } from './http/controllers/FlightsController'
dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3000
const client = new MongoClient(process.env.MONGO_URI || '')
const flights = client
  .db(process.env.MONGO_DB)
  .collection(process.env.MONGO_COLLECTION || '')
const dateService: IDateService = new DateService()
const ryanairApi: IRyanairApi = new RyanairApi(dateService)
const flightService: IFlightService = new FlightService(flights)

const flightsController = new FlightsController(
  dateService,
  ryanairApi,
  flightService
)

app.get('/', async (req: FetchFlightsQuery, res: Response) => {
  return res.json(await flightsController.get(req))
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
