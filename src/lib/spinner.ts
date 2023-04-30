const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export class Spinner {
  constructor(
    private message = "Loading...",
    private intervalId: NodeJS.Timer | undefined = undefined,
    private currentCharIndex = 0
  ) {}

  start() {
    this.intervalId = setInterval(() => {
      const spinner = FRAMES[this.currentCharIndex++];
      process.stderr.write(`\r${spinner}  ${this.message}`);
      this.currentCharIndex %= FRAMES.length;
    }, 100);
  }

  stop() {
    clearInterval(this.intervalId);
    process.stderr.write(`\r`);
  }
}
