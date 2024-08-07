# Awork Challenge

Hello ! Welcome to the awork challenge 🤩. We are looking forward to seeing what you will come up with!

Let us know if you have any questions and refer to the instructions sent to you. This readme contains mostly the install steps to get up and running with the application in its initial state.

## Challenges

- Show a list of users grouped by a specific category.

  - The grouping of the array of Users should be done via a Web Worker.
  - Criteria can be chosen: alphabetically, age, nationality, etc.
  - [Bonus Point] Add a button which switches the grouping between multiple categories.

  ```
  SOLUTION: What I've decided to do is basically to have a fetch the data from the API normally and once I have the data accessible open a new web worker in order to process the data in the web worker. I've created different methods to group by different categories, and if in the future some other like gender wanted to be created, it is easy to do by creating a new groupable category and grouping function.

  ISSUES: When working with large amounts of data the application freezes. Solved later in performance challenge.
  ```

- Groups should look nice in the UI

  - CHECK BELOW: Idea of result (Don’t limit yourself to this idea, make it look awesome!).

  ```
  SOLUTION: Since I did not have a large amount of time and I'm not a master of design, I decided to go for the same approach as the one shown in the screenshot, with some small improvements. I'd rather work with a proposed figma to make the look & feel pixel perfect.
  ```

- Show **5000 Users** on the page with good load and runtime performance without using pagination (even in mobile devices).

  - Improve components performance.
  - The page should load fast.
  - The page should be interactive fast.
  - No performance degradation when interacting with the page.
  - Optimize device resources usage: CPU, memory.

  ```
  SOLUTION: This has been by far the most challenging issue of this technical assesment. I'm not used to work with these amount of data, and to have a good performance, interaction times and loading times, I've applied several measures.
    - OnPush detection strategy
    - Virtual Scrolling in list component -> Avoid creating unnecessary (not viewed) DOM elements. This helped with the interaction times.
    - Splitting the data into several chunks to be processed separately and have better loading times.

  I want to add here that I was new to some Virtual scrolling, and at least now thanks to your assesment I've learned that :)
  ```

- When clicking on a User from the list, the item should expand inside the same list with a cool animation and show extra information the API provides in a nice and clear way.
  - Feel free to choose the information you display.
  ```
  SOLUTION: Done in the item component.
  ```
- Improve the overall UI/UX of the app until you are proud of it. The code provided already has some basic styles which are coming from our original awork app, but it still deserves some love.

  - Make it look awesome by, for example, adding a header for the list columns, an improved loading state, etc.
  - Here you can be creative about it, the sky is the limit!

  ```
  SOLUTION: Again, I'm not a master design, and I'm used to work with a Figma from which I can go to pixel perfect design implementation. Also, running short on time I decided to go deeper in other challenges such as the performance one.
  ```

- Write a documentation on how you approached the problem and what the solution consists of.
  ```
  SOLUTION: These README file is the documentation on where I'm explaining how I faced the problems and which solutions I decided to go for.
  ```
- [Bonus Point] Search users without using API.
  ```
  SOLUTION: I was running out of time. I thought of adding a input on top of the page, which could be located in the app.component. I'd then create a simple userFilterPipe to filter the list of users, checking if the first name of the user started with the value that the user typed in. This is easy and I could do this in the time I had, but the problem came when I thought  "OK, now I have to update the global users variable with the pipe, which is also easy, but then this change must trigger another grouping. It would take a lot of processing time if I had to do it every time the user was typing any letter, so I decided to go for an approach where the user has to click a submit button and with a minimum of an input of 3 letters to make sure that the results are not that many, in order to keep usability and performance.
  ```
- [Bonus Point] Add pagination using the page size of 5000 items
  The API documentation has the information on how to do this.
  ```
  SOLUTION: Again, running out of time I quickly implemented a reusable paginator component. This paginator can be improved, use icons instead of text directly, and have a better l&f. However, it works and I was trying to quickly get the challenge achieved.
  ```
