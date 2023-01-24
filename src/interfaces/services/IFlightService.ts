import { UpdateResult } from 'mongodb'

export namespace IFlightService {
  export type SaveData = {
    runId: number
    outbound: {
      departure: string
      arrival: string
    }
    return: {
      departure: string
      arrival: string
    }
    price: number
    from: string
    to: string
    country: string
    days: number
  }
}

export interface IFlightService {
  save(data: IFlightService.SaveData): Promise<any>
  drop(): Promise<any>
}
