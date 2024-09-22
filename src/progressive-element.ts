export interface AnyEvent {
  type: string;
  [key: string]: any;
}

// Any string is valid, but we can provide auto-complete for built-in event.
type AnyEventType = keyof HTMLElementEventMap | (string & {});

/**
 * A tiny base class to define custom elements with. It provides a static `register` method and delegates events based on the `delegatedEvents` static property. All delegated events are called with the `handleEvent` method.
 */
export class ProgressiveElement extends HTMLElement implements EventListenerObject {
  static tagName = '';

  /**
   * Register the custom element with the window. By default then name of the custom element is the kebab-case of the class name.
   */
  static register() {
    if (!this.tagName) throw new Error('`tagName` must be defined as a static property.');
    customElements.define(this.tagName, this);
  }

  /**
   * A list of event types to be delegated for the lifetime of the custom element.
   */
  static delegatedEvents?: AnyEventType[];

  constructor() {
    super();

    const constructor = this.constructor as typeof ProgressiveElement;
    constructor.delegatedEvents?.forEach((event) => this.addEventListener(event, this));
  }

  /**
   * This method is called any time an event is delegated. It's a central handler to handle events for this custom element. No need to call `super.handleEvent()`.
   * @param event
   */
  // @ts-ignore unused parameter
  handleEvent(event: Event): void {}
}

/* 
["readystatechange","pointerlockchange","pointerlockerror","beforecopy","beforecut","beforepaste","freeze","prerenderingchange","resume","search","visibilitychange","fullscreenchange","fullscreenerror","webkitfullscreenchange","webkitfullscreenerror","beforexrselect","abort","beforeinput","beforematch","beforetoggle","blur","cancel","canplay","canplaythrough","change","click","close","contentvisibilityautostatechange","contextlost","contextmenu","contextrestored","cuechange","dblclick","drag","dragend","dragenter","dragleave","dragover","dragstart","drop","durationchange","emptied","ended","error","focus","formdata","input","invalid","keydown","keypress","keyup","load","loadeddata","loadedmetadata","loadstart","mousedown","mouseenter","mouseleave","mousemove","mouseout","mouseover","mouseup","mousewheel","pause","play","playing","progress","ratechange","reset","resize","scroll","securitypolicyviolation","seeked","seeking","select","slotchange","stalled","submit","suspend","timeupdate","toggle","volumechange","waiting","webkitanimationend","webkitanimationiteration","webkitanimationstart","webkittransitionend","wheel","auxclick","gotpointercapture","lostpointercapture","pointerdown","pointermove","pointerrawupdate","pointerup","pointercancel","pointerover","pointerout","pointerenter","pointerleave","selectstart","selectionchange","animationend","animationiteration","animationstart","transitionrun","transitionstart","transitionend","transitioncancel","copy","cut","paste","scrollend"]
*/
