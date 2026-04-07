/**
 * 🚂 IRCTC Train Ticket Booking - async/await
 *
 * IRCTC pe train ticket book karna India ka sabse mushkil kaam hai! Lekin
 * async/await se yeh kaam asan ho jaata hai. Simulate karo API calls ko
 * async functions se — seat check karo, ticket book karo, cancel karo,
 * aur status check karo. Sab kuch await se sequentially hoga.
 *
 * Function: checkSeatAvailability(trainNumber, date, classType)
 *   - async function, returns a Promise
 *   - Simulates API call with a small delay (~100ms)
 *   - Validates trainNumber: must be a string of exactly 5 digits (e.g., "12345")
 *   - Validates classType: must be one of "SL", "3A", "2A", "1A"
 *   - Validates date: must be a non-empty string
 *   - If invalid trainNumber: throws Error "Invalid train number! 5 digit hona chahiye."
 *   - If invalid classType: throws Error "Invalid class type!"
 *   - If invalid date: throws Error "Date required hai!"
 *   - If valid: returns {
 *       trainNumber, date, classType,
 *       available: true/false (randomly, ~70% chance true),
 *       seats: random number 0-50,
 *       waitlist: random number 0-20
 *     }
 *   - If seats > 0, available = true; if seats === 0, available = false
 *
 * Function: bookTicket(passenger, trainNumber, date, classType)
 *   - async function
 *   - passenger is { name, age, gender } object
 *   - Validates passenger has name, age, gender
 *   - Awaits checkSeatAvailability(trainNumber, date, classType)
 *   - If available: returns {
 *       pnr: "PNR" + Math.floor(Math.random() * 1000000),
 *       passenger, trainNumber, date,
 *       class: classType,
 *       status: "confirmed",
 *       fare: calculated (SL:250, 3A:800, 2A:1200, 1A:2000)
 *     }
 *   - If not available: returns with status: "waitlisted", waitlistNumber: random 1-20
 *
 * Function: cancelTicket(pnr)
 *   - async function
 *   - Simulates cancellation with small delay
 *   - Validates pnr: must be a non-empty string starting with "PNR"
 *   - If invalid: throws Error "Invalid PNR number!"
 *   - Returns { pnr, status: "cancelled", refund: random amount 100-1000 }
 *
 * Function: getBookingStatus(pnr)
 *   - async function
 *   - Simulates status check with small delay
 *   - Validates pnr: must start with "PNR"
 *   - If invalid: throws Error "Invalid PNR number!"
 *   - Returns { pnr, status: random from ["confirmed", "waitlisted", "cancelled"],
 *     lastUpdated: new Date().toISOString() }
 *
 * Function: bookMultipleTickets(passengers, trainNumber, date, classType)
 *   - async function
 *   - Takes array of passenger objects
 *   - Books for EACH passenger SEQUENTIALLY (await in loop, one by one)
 *   - Returns array of booking results (each is bookTicket result or error object)
 *   - If individual booking fails, catch error and include { passenger, error: message }
 *     in results, continue with next passenger
 *   - Agar passengers array empty, return empty array
 *
 * Function: raceBooking(trainNumbers, passenger, date, classType)
 *   - async function
 *   - Takes array of trainNumbers
 *   - Tries booking on ALL trains in PARALLEL
 *   - Returns first successful booking using Promise.any-like approach
 *   - If all fail, throws Error "Koi bhi train mein seat nahi mili!"
 *   - Hint: use Promise.any or map trainNumbers to bookTicket promises
 *
 * Rules:
 *   - ALL functions must be async
 *   - Use await for sequential operations
 *   - bookMultipleTickets must be sequential (one after another)
 *   - raceBooking must be parallel (all at once)
 *   - Proper error handling with try/catch
 *   - Train number format: exactly 5 digit string
 *   - PNR format: starts with "PNR"
 *
 * @example
 *   const availability = await checkSeatAvailability("12345", "2025-01-15", "3A");
 *   // => { trainNumber: "12345", date: "2025-01-15", classType: "3A",
 *   //      available: true, seats: 35, waitlist: 5 }
 *
 * @example
 *   const booking = await bookTicket(
 *     { name: "Rahul", age: 28, gender: "M" },
 *     "12345", "2025-01-15", "3A"
 *   );
 *   // => { pnr: "PNR483921", passenger: {...}, trainNumber: "12345",
 *   //      date: "2025-01-15", class: "3A", status: "confirmed", fare: 800 }
 *
 * @example
 *   const results = await bookMultipleTickets(
 *     [{ name: "Amit", age: 30, gender: "M" }, { name: "Priya", age: 25, gender: "F" }],
 *     "12345", "2025-01-15", "SL"
 *   );
 *   // => [{ pnr: "PNR...", ...}, { pnr: "PNR...", ...}]
 */
export async function checkSeatAvailability(trainNumber, date, classType) {
  // Your code here
  return new Promise((res, rej) => {
    if (typeof trainNumber !== "string" || trainNumber.length !== 5) {
      rej(new Error("Invalid train number! 5 digit hona chahiye."));
    }
    if (
      typeof classType !== "string" ||
      !["SL", "3A", "2A", "1A"].includes(classType)
    ) {
      rej(new Error("Invalid class type!"));
    }
    if (typeof date !== "string" || date.length < 1) {
      rej(new Error("Date required hai!"));
    }
    let seats = Math.floor(Math.random() * 50);
    setTimeout(() => {
      res({
        trainNumber,
        date,
        classType,
        available: seats === 0 ? false : true,
        seats,
        waitlist: Math.floor(Math.random() * 20),
      });
    }, 100);
  });
}

export async function bookTicket(passenger, trainNumber, date, classType) {
  // Your code here
  let price = { SL: 250, "3A": 800, "2A": 1200, "1A": 2000 };
  if (passenger.name && passenger.age && passenger.gender) {
    try {
      let status =await checkSeatAvailability(trainNumber, date, classType)
      
      if (status.available) {
        return {
          pnr: "PNR" + Math.floor(Math.random() * 1000000),
          passenger,
          trainNumber,
          date,
          class: classType,
          status: "confirmed",
          fare: price[classType],
        };
      } else {
        return {
          status: "waitlisted",
          waitlistNumber: Math.floor(Math.random() * 20),
        };
      }
    } catch (err) {
      return err.message;
    }
  }
}

export async function cancelTicket(pnr) {
  // Your code here
  if (typeof pnr === "string") {
    if (pnr.startsWith("PNR")) {
      return {
        pnr,
        status: "cancelled",
        refund: 100 + Math.floor(Math.random() * 900),
      };
    }
  }
  throw new Error("Invalid PNR number!");
}

export async function getBookingStatus(pnr) {
  // Your code here
  if (typeof pnr === "string") {
    if (pnr.startsWith("PNR")) {
      return {
        pnr,
        status: ["confirmed", "waitlisted", "cancelled"][
          Math.floor(Math.random() * 3)
        ],
        lastUpdated: new Date().toISOString(),
      };
    }
  }
  throw new Error("Invalid PNR number!");
}
async function multiBook(booking,element,trainNumber,date,classType) {
  let book = await bookTicket(element, trainNumber, date, classType);
  booking.push(book);
  
}
export async function bookMultipleTickets(
  passengers,
  trainNumber,
  date,
  classType,
) {
  // Your code here
  let bookings = [];
  for (let index = 0; index < passengers.length; index++) {
    const element = passengers[index];
    await multiBook(bookings,element,trainNumber,date,classType)
  }

  return bookings;
}

export async function raceBooking(trainNumbers, passenger, date, classType) {
  // Your code here
  let booking=await Promise.any( trainNumbers.map((element)=>bookTicket(passenger,element,date,classType)))
  console.log("my booking :",booking)
  return booking
}

raceBooking(["12374","25445","52145"],{name:"raj",age:45,gender:"M"},"any","1A")
