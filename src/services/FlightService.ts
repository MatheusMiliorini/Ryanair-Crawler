import { IFlightService } from '../interfaces/services/IFlightService'
import { UpdateResult, Collection, Document } from 'mongodb'

export class FlightService implements IFlightService {
  constructor(private readonly flightsCollection: Collection<Document>) {}

  save(data: IFlightService.SaveData): Promise<UpdateResult> {
    return this.flightsCollection.updateOne(
      { to: data.to, from: data.from, price: data.price, days: data.days },
      { $setOnInsert: data },
      { upsert: true }
    )
  }
}
