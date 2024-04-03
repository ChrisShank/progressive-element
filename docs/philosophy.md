Herein outlines a vision for what a behavioral paradigm for building highly interactive, client-side heavy web applications could look like. It attempts to address problems and challenges with the component paradigm that is commonplace these days. Such challenges include:

- Component frameworks cluster on templates. Behavior/state is tightly co-located to a particular component in the tree and as requirements change this behavior must be refactored as it's needed in other places. Over time more and more state is hoisted up to the root of the component tree.
- Event listeners are directly attached to UI elements. This encourages the event-action paradigm, where event listeners have a increasing amount of conditional logic because it has to figure out the state the application is in to know what actions to execute. This leads to a large source of bugs (see Horrock's book "Constructing the USer Interface with Statecharts" for a more elaborate explanation).
- Behavior is scattered between components. By default there is no coherent way to understand what actions will be performed as a result of receiving an event. You have to trace the entire component tree to find out.
- State that already exists in the DOM (e.g. input values, focus, etc.) has to be duplicated in the component and synced back to the DOM. Additionally, it's not common to project state back into the DOM via attributes meaning conditional rendering and styling is done in templates instead of some simple CSS.
- Isomorphic JS means we can usually only use the least common denominator of Web APIs that also work on a server. This excludes undervalued web APIs like service workers, web workers, audio worklets, paint worklets, background fetch, etc.
- The firm encapsulation of components make them hard to extend without bloating the surface API of props/events.
- Declarative templates require hydration which has high overhead and notably a little fragile (e.g. hydration mismatches).

At a high level, here is how a behavioral paradigm would solve these challenges:

- Clustering on behavior creates a natural shearing layer between the behavior and the UI of an application. These two things likely change at different paces (at least in my own experience).
- Use notations like [state machines/statecharts](https://statecharts.dev/) to model the core behavior of the application. These paradigms will prevent the bug-riddled "event-action" approach and provide a deterministic and structured way to understand "when the app is in this state and we receive this event, what should happen". Behavior trees and behavior threads could be other notations helpful here.
- Leverage event bubbling (also know as event delegation) to decouple behavior from the UI. This makes it easy to progressively enhance HTML and has performance and memory benefits around initialization.
  - That said, don't rely on DOM structure to understand what a DOM event was meant to do. Instead use HTML attributes to map raw DOM events to their semantic _intention_. (e.g. `<button on:click="INCREMENT">+</button>`)
  - Longer explanation [here](https://x.com/chrisshank23/status/1715817743033696411?s=20).
  - [Repo](https://github.com/ChrisShank/progressive-element) with prototypes + examples
- Use custom elements (ideally without shadowDOM) to progressively enhance parts of the DOM tree in a composable manner. Use attributes on CE's to conditionally style the DOM with no JS and allow more extensible styling. Custom elements are also just classes so they can be easily extended.
- Routing should be decoupled from the component tree. The "router" should just focus on taking the current state of the application and flattening to into a URL and visa versa. Also maybe let a service worker handle the routing not the main thread.
  - An early prototype of those routing primitives can be found [here](https://github.com/ChrisShank/routtl)
- Be able to move expensive behavior off the main thread (e.g. web worker or service worker). Asynchronous message passing (e.g. actor model or observables) is necessary and can be orchestrated with state machines.
