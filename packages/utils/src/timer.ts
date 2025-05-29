export default class Timer {
  startTime?: number;
  endTime?: number;

  start() {
    this.startTime = Date.now().valueOf();
  }

  end(): number {
    if (!this.startTime) {
      throw new Error("Timer not started");
    }
    const result = Date.now().valueOf() - this.startTime;
    this.startTime = undefined;
    return result;
  }
}
