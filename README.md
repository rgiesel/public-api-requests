# public-api-requests

This project creates an app for a fictional company called Awesome Startup.
The app allows company employees an easy way to share contact information.<br>

Using the Random User Generator API, the app fetches information for 12 random
employees, returns that information as an array of JSON objects, and uses that
information to construct an employee gallery that displays a card for each
employee with their photograph and basic information.<br>

When an employee's card is clicked, a modal window is displayed with a larger
photo and more detailed employee information. From here, the user can click the
"prev" and "next" buttons to navigate to the previous and next employees without
having to close the modal window.<br>

On the main page, there is also a search input field that can be used to search
employees by first and/or last name. Upon submitting the search, the gallery
will display only the employees who match the search string.


The following changes were made to the default CSS:<br>
- Page background color<br>
- Header h1 font style, color, size, and letter-spacing<br>
- Card class background color<br>
- Card-text class text color<br>
- Modal-container class background color
