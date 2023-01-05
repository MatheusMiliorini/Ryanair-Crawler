import * as dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import { MongoClient } from "mongodb";

const DATE_START = "2023-01-07";
const DEPARTURE_AIRPORT = "DUB"; // Shannon - SNN / Dublin - DUB
const DAYS = 2;
const ITERATIONS = 50;
const WEEK = 7;
const OUTBOUND_TIME_LIMIT = "12:00";
const RETURN_TIME_LIMIT = "12:00";

const client = new MongoClient(process.env.MONGO_URI);

async function run() {
  const flights = client
    .db(process.env.MONGO_DB)
    .collection(process.env.MONGO_COLLECTION);

  for (let i = 0; i < ITERATIONS; i++) {
    let startDate = new Date(DATE_START);
    startDate.setDate(startDate.getDate() + WEEK * i);
    let endDate = new Date(
      new Date(startDate.getTime()).setDate(startDate.getDate() + DAYS)
    );
    startDate = startDate.toISOString().split("T")[0];
    endDate = endDate.toISOString().split("T")[0];

    const { data } = await axios.get(
      `https://www.ryanair.com/api/farfnd/v4/roundTripFares?departureAirportIataCode=${DEPARTURE_AIRPORT}&outboundDepartureDateFrom=${startDate}&market=en-ie&adultPaxCount=1&outboundDepartureDateTo=${startDate}&inboundDepartureDateFrom=${endDate}&inboundDepartureDateTo=${endDate}&outboundDepartureDaysOfWeek=SATURDAY&durationFrom=${DAYS}&durationTo=${DAYS}&outboundDepartureTimeFrom=00:00&outboundDepartureTimeTo=${OUTBOUND_TIME_LIMIT}&inboundDepartureTimeFrom=00:00&inboundDepartureTimeTo=${RETURN_TIME_LIMIT}`
    );
    const { fares } = data;
    console.log(`[${i}] Inserting ${fares.length} flights into DB...`);
    for (let j = 0; j < fares.length; j++) {
      const data = {
        outbound: {
          departure: fares[j].outbound.departureDate,
          arrival: fares[j].outbound.arrivalDate,
        },
        return: {
          departure: fares[j].inbound.departureDate,
          arrival: fares[j].inbound.arrivalDate,
        },
        price: fares[j].summary.price.value,
        from: fares[j].outbound.departureAirport.name,
        to: fares[j].outbound.arrivalAirport.name,
        country: fares[j].outbound.arrivalAirport.countryName,
        days: fares[j].summary.tripDurationDays,
      };
      await flights.updateOne(
        { to: data.to, from: data.from, price: data.price, days: data.days },
        { $setOnInsert: data },
        { upsert: true }
      );
    }
    console.log(`[${i}] Inserted ${fares.length} flights into DB.`);
  }
  client.close();
}

run().catch((err) => console.error(err));
