import { AnyEvent, ProgressiveElement, findClosestIntention } from './progressive-element';

class MyCounter extends ProgressiveElement {
  static delegatedEvents = ['click'];

  count: HTMLElement = this.querySelector('[slot="count-display"]')!;

  handleEvent(event: AnyEvent) {
    const { intention } = findClosestIntention(event);

    // Handle events with no intention here...
    if (intention === undefined) return;

    event.stopPropagation(); // Stop event propagation of all events that have an intention

    switch (intention) {
      case 'INCREMENT': {
        this.count.innerText = (Number(this.count.innerText) + 1).toString();
        break;
      }
      case 'DECREMENT': {
        this.count.innerText = (Number(this.count.innerText) - 1).toString();
        break;
      }
    }
  }
}

MyCounter.register();
