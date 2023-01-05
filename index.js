import * as dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import { MongoClient } from "mongodb";

const DATE_START = "2023-01-06";
const DEPARTURE_AIRPORT = "DUB"; // Shannon - SNN / Dublin - DUB
const DAYS_MIN = 3;
const DAYS_MAX = 3; // Apparently, this does nothing :)
const ITERATIONS = 50;
const WEEK = 7;
const OUTBOUND_TIME_START = "00:00";
const OUTBOUND_TIME_LIMIT = "12:00";
const RETURN_TIME_START = "12:00";
const RETURN_TIME_LIMIT = "23:59";

const client = new MongoClient(process.env.MONGO_URI);
const promises = [];

async function run() {
  const runId = Math.floor(Math.random() * 100000000);
  console.log("runId: ", runId);

  const flights = client
    .db(process.env.MONGO_DB)
    .collection(process.env.MONGO_COLLECTION);

  for (let i = 0; i < ITERATIONS; i++) {
    let startDate = new Date(DATE_START);
    startDate.setDate(startDate.getDate() + WEEK * i);
    let endDate = new Date(
      new Date(startDate.getTime()).setDate(startDate.getDate() + DAYS_MIN)
    );
    startDate = startDate.toISOString().split("T")[0];
    endDate = endDate.toISOString().split("T")[0];

    const { data } = await axios.get(
      `https://www.ryanair.com/api/farfnd/v4/roundTripFares?departureAirportIataCode=${DEPARTURE_AIRPORT}&outboundDepartureDateFrom=${startDate}&market=en-ie&adultPaxCount=1&outboundDepartureDateTo=${startDate}&inboundDepartureDateFrom=${endDate}&inboundDepartureDateTo=${endDate}&durationFrom=${DAYS_MIN}&durationTo=${DAYS_MAX}&outboundDepartureTimeFrom=${OUTBOUND_TIME_START}&outboundDepartureTimeTo=${OUTBOUND_TIME_LIMIT}&inboundDepartureTimeFrom=${RETURN_TIME_START}&inboundDepartureTimeTo=${RETURN_TIME_LIMIT}`
    );
    const { fares } = data;
    console.log(`[${i}] Inserting ${fares.length} flights into DB...`);
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
      };
      promises.push(
        flights.updateOne(
          { to: data.to, from: data.from, price: data.price, days: data.days },
          { $setOnInsert: data },
          { upsert: true }
        )
      );
    });
  }
  await Promise.all(promises);
  console.log("Finished all promises");
  await client.close();
  console.log("MongoDB connection closed.");
  process.exit();
}

run().catch((err) => console.error(err));
