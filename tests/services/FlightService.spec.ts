import { FlightService } from '../../src/services/FlightService'
import { MongoClient, UpdateResult, Collection, Document } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()

let client: MongoClient
let collection: Collection<Document>

beforeAll(() => {
  client = new MongoClient(process.env.MONGO_URI || '')
  collection = client.db('test_db').collection('test_collection')
})

afterAll(async () => {
  await client.close()
})

describe('FlightService', () => {
  it('Should save data to the collection', async () => {
    const flightService = new FlightService(collection)
    const result: UpdateResult = await flightService.save({
      country: 'Ireland',
      days: 1,
      from: 'DUB',
      to: 'Milan',
      outbound: {
        departure: '2023-01-01 00:00:00',
        arrival: '2023-01-01 00:00:00',
      },
      return: {
        departure: '2023-01-01 00:00:00',
        arrival: '2023-01-01 00:00:00',
      },
      price: 50.99,
      runId: 123,
    })
    expect(result.upsertedCount).toBe(1)
  })

  it('Should drop the collection', async () => {
    const flightService = new FlightService(collection)
    const dropped = await flightService.drop()
    expect(dropped).toBe(true)
  })
})
