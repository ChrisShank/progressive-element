# Towards a behavioral paradigm for building web interfaces

<img width="604" alt="image" src="https://github.com/ChrisShank/progressive-element/assets/19981604/950c27cf-be24-41d9-8571-27f61c96c284">


## Principles

- Subtractive mindset + remove layers of abstraction
- Behavior is more important to understanding than UI hierarchy.
- Leverage new (and old) features of the browser.
- Optional patterns than can be layered together.
- Stop combining the server/client into one.

## Patterns

- Use event delegation to avoid needing to attach event listeners directly to DOM elements or attaching global event listeners.
- Declare "intentions" in HTML that map raw DOM event to semantically meaningful events. (e.g. `<form on:submit="ADD_TODO">`)
- Use custom elements to organize & reuse behavior by the progressively enhancing the light DOM.
- Progressively hydrate custom elements based on when they are used. This could be when the CPU first becomes idle, when the custom element becomes visible on the page, or when the custom element was first interacted with.
- CSS "reactivity" that conditionally styles the page based on DOM attributes or other state-based selectors (e.g. `:has`). Originally [written](https://calendar.perfplanet.com/2022/an-html-first-mental-model/) about by Noam.

Provided in the repo are some optional/unopionated helpers that implement these patterns.
