// import './tabs/element.ts'

interface Intention {
  intention: string;
  target: HTMLElement;
}

function findClosestIntention(event: Event): Intention | Record<string, never> {
  if (event.target instanceof Element) {
    const target = event.target.closest(`[on\\:${event.type}]`) as HTMLElement | null;

    if (target !== null) {
      const intention = target.getAttribute(`on:${event.type}`)!;
      return { intention, target };
    }
  }
  return {};
}

class MyElement extends HTMLElement {
  count: HTMLElement = this.querySelector('#count')!;

  constructor() {
    super();

    this.addEventListener('click', this);
  }

  handleEvent(event: Event) {
    const { intention } = findClosestIntention(event);

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

customElements.define('my-element', MyElement);
