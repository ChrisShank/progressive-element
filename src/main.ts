import { AnyEvent, ProgressiveElement, findClosestIntention } from './progressive-element';

class MyCounter extends ProgressiveElement {
  static delegatedEvents = ['click'];

  display: HTMLElement = this.querySelector('[slot="count-display"]')!;

  count: number = Number(this.display.innerText);

  handleEvent(event: AnyEvent) {
    const { intention } = findClosestIntention(event);

    // Handle events with no intention here...
    if (intention === undefined) return;

    event.stopPropagation(); // Stop event propagation of all events that have an intention

    switch (intention) {
      case 'INCREMENT': {
        this.count++;
        break;
      }
      case 'DECREMENT': {
        this.count--;
        break;
      }
    }

    this.display.innerText = this.count.toString();
  }
}

MyCounter.register();
