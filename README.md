# Progresive Element

Here lies some explorations about subtracting the "default web tooling" while maintaining similar affordances. Currently the classic TODO MVC is implemented to prove out these patterns:

- Use custom elements to organize & reuse behavior by the progressively enhancing the light DOM.
- Use event delegation to avoid needing to attach event listeners directly to DOM elements or attaching global event listeners.
- Declare "intentions" in HTML that map raw DOM event to semantically meaningful events. (e.g. `<form on:submit="ADD_TODO">`)
- Progressively hydrate custom elements based on when they are used. This could be when the CPU first becomes idle, when the custom element becomes visible on the page, or when the custom element was first interacted with.
- CSS "reactivity" that conditionally styles the page based on DOM attributes or other state-based selectors (e.g. `:has`). Originally [written](https://calendar.perfplanet.com/2022/an-html-first-mental-model/) about by Noam.

Provided in the repo are some optional/unopionated helpers that implement these patterns.




