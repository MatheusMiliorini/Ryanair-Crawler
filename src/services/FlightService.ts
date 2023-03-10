import { IFlightService } from '../interfaces/services/IFlightService'
import { Collection, Document } from 'mongodb'

export class FlightService implements IFlightService {
  constructor(private readonly flightsCollection: Collection<Document>) {}
  drop(): Promise<boolean> {
    return this.flightsCollection.drop()
  }

  save(data: IFlightService.SaveData): Promise<any> {
    return this.flightsCollection.updateOne(
      { to: data.to, from: data.from, price: data.price, days: data.days },
      { $setOnInsert: data },
      { upsert: true }
    )
  }
}
