## Introduction
Modelling statecharts is a challenging endeavour, as much an art as it is a science. And like artists sketch to train their eye, modelling exercises can serve as a way to practice and develop techniques that will hopefully be applicable to large production applications.

However, finding or indeed creating good examples is difficult. It's not easy to capture the essential complexities of an application in a miniature version - some complexity can only be observed at scale. It's equally possible for quite large applications to fail to contain a sufficient challenge to the model. They can have many UI components, without much behaviour. This Backlog application is an attempt to contain *just enough* complexity to be relatable to a production application, whilst still serving as a small study that can be completed relatively quickly.

It is recommended to develop the model as part of a real, working application, UI included. That the model has to expose values to the UI is an important factor in its design.

There are additional requirements, presented in the form of feature requests, at the bottom of this document. The point is to subject the statechart design to changing requirements in a manner that reflects real-world software development. A good model can be adapted and changed, a less suitable model is brittle and cannot be made to do so easily.

## Requirements
**Objective:** Develop a Backlog application that allows users to view a list of tickets and inspect ticket details.

**Backlog List**
- Displays a list of tickets. Each ticket item shows the `ticket id` and the `title`:
- The list shows
    - **Loading**: While fetching data.
    - **Success**: Data fetched successfully and displayed.
    - **Error**: An error occurred during data fetch. The user can click a button to retry

**Ticket Detail Sidebar**
- Clicking on a ticket in the backlog opens a sidebar that displays the ticket details.
- The sidebar shows the ticket ID, title and description
- The ticket details are loaded from the backend in a separate request from call to get the list.
- The sidebar shows:
    - **Loading**: While fetching the ticket details.
    - **Success**: Ticket details fetched and displayed.
    - **Error**: An error occurred during fetch. The user can click a button to retry. 
- The user can edit the ticket fields (title and description, not id). Fields update optimistically, on blur. For simplicity, assume the update api is always successful and ignore error and loading states.
- The user can close the sidebar

**Example services**
These can be used directly in XState, or as reference for the mock APIs:

```js
services: {
  loadBacklogService: (context): Promise<Ticket[]> => {
	return new Promise((resolve, reject) => {
	  setTimeout(() => {
	  	// use if testing api error
		// reject("Error");
		resolve(mockTicketList);
	  }, 1000); // Simulate network delay
	});
  },
  loadTicketDetailService: (ctx, event): Promise<Ticket> => {
	return new Promise((resolve, reject) => {
	  setTimeout(() => {
		// use if testing api error
		// reject("Error");
		resolve(
		  ctx.selectedTicketId
			? mockTicketDetails[ctx.selectedTicketId]
			: { id: "", title: "", description: "" }
		);
	  }, 1000); // Simulate network delay
	});
  },
  updateTicketService: (ctx, event): Promise<Ticket> => {
	return new Promise((resolve, reject) => {
	  setTimeout(() => {
	    // use if testing api error
		// reject("Error");
		resolve(
		  ctx.selectedTicketId
		    // adjust based on how the draft state is handled
			? {...mockTicketDetails[ctx.selectedTicketId], title: ctx.draftTitle}
			: { id: "", title: "", description: "" }
		);
	  }, 1000); // Simulate network delay
	});
  },
},
```


### Feature Request 1
The URL should reflect when a ticket is selected, so that the user can navigate to the page directly with a ticket already selected. 

(Note this isn't so much about the URL, but the fact that ticket details can be loaded in parallel with)

### Feature Request 2
Allow the user to edit ticket properties (currently just `title` ) directly from the table.




