export class TestModel {
  private tripValue: number | null = null;

  addTrip(value: number) {
    this.tripValue = value;
  }

  clearTrip() {
    this.tripValue = null;
  }

  get copy(): string {
    return this.tripValue == null
      ? "There is no logged trip."
      : `The fare of the trip was $${this.tripValue}.`;
  }
}
