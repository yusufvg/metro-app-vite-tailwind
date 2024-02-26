class TripsModel {
  trips: Array<Trip> = [];
  private _nextId: number = 1;
  private _hasPass: boolean = false;

  addTrip(trip: Trip) {
    this.trips.push(trip);
  }

  deleteTrip(id: number) {
    this.trips = this.trips.filter((e) => e.id != id);
  }

  hideTrip(id: number) {
    this.trips.forEach((e) => {
      if (e.id === id) {
        e.hidden = true;
      }
    });
  }

  unhideTrip(id: number) {
    this.trips.forEach((e) => {
      if (e.id === id) {
        e.hidden = false;
      }
    });
  }

  get bestPass(): string {
    if (this.trips.length == 0)
      return "In order to calculate the best pass, please log some trips.";

    let regularPrice = this.activeTrips.reduce(
      (sum, trip) => (sum += trip.fare),
      0
    );
    let bestSavings = 0;
    let bestPassPrice = 0;

    for (let pass = 2; pass <= 6; pass += 0.25) {
      let reducedFares = this.activeTrips.reduce(
        (sum, trip) => (sum += Math.max(0, trip.fare - pass)),
        0
      );
      let passCost = pass * 32;

      let savings = regularPrice - reducedFares - passCost;
      if (savings > bestSavings) {
        bestSavings = savings;
        bestPassPrice = pass;
      }
    }

    this._hasPass = bestPassPrice != 0;

    return !this._hasPass
      ? "It is currently cheaper to ride without buying a pass."
      : "You should buy the $" +
          bestPassPrice +
          " pass, it will save you $" +
          bestSavings +
          " on fares.";
  }

  get nextId(): number {
    return this._nextId++;
  }

  get hasPass(): boolean {
    return this._hasPass;
  }

  get activeTrips(): Array<Trip> {
    return this.trips.filter((trip) => !trip.hidden);
  }

  get hiddenTrips(): Array<Trip> {
    return this.trips.filter((trip) => trip.hidden);
  }
}

class Trip {
  id: number;
  date: string;
  fare: number;
  note: string;
  hidden: boolean = false;

  constructor(id: number, date: string, fare: number, note: string) {
    this.id = id;
    this.date = date;
    this.fare = fare;
    this.note = note.length > 0 ? note : "---";
  }
}

export { Trip, TripsModel };
