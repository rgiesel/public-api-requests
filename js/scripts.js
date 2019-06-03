
// Assigns an empty array to the variable that will later hold the fetch user info
let users = [];

// Assigns an empty array to the variable that will hold the user info for the search feature
let searchRes = [];

// Creates a number variable to represent an index for the modal windows
let modalNum = 0;

/* Delcares a function that checks the status of the API response. If the response
   is successful, the resolved promise is returned, otherwise a rejected promise
   is returned with an error response of the status text */
function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

/* Creates a function to fetch data from a URL and return it as a promise in
   JSON format, or logs an error message to the console if there is a problem */
function fetchData(url) {
  return fetch(url)
           .then(checkStatus)
           .then(res => res.json())
           .catch(error => console.log('Looks like there was a problem', error));
}

/* Creates a function that generates the HTML for a user card and returns it to
   be used in the displayGallery function */
function createCard(user) {
  const card = `
  <div class="card">
      <div class="card-img-container">
          <img class="card-img" src="${user.picture.thumbnail}" alt="profile picture">
      </div>
      <div class="card-info-container">
          <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
          <p class="card-text">${user.email}</p>
          <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
      </div>
  </div>
  `;
  return card;
}

/* Creates a function that accepts an array argument, creates a user card for
   each user in that array, adding each card to the string of HTML that will be
   be displayed on the page as a gallery */
function displayGallery (arr) {
      let cardsHTML = ``;
      arr.forEach(user => {
        cardsHTML += createCard(user);
      });
      document.querySelector('#gallery').innerHTML = cardsHTML;
}


// Creates the function that will be called to open the modal window for each user
function createModal(user) {
  // Variable represents the modal window HTML that will be inserted
  const modal = `
    <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${user.picture.medium}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                <p class="modal-text">${user.email}</p>
                <p class="modal-text cap">${user.location.city}</p>
                <hr>
                <p class="modal-text">Cell: ${user.cell}</p>
                <p class="modal-text">${user.location.street}, ${user.location.city},
                  ${user.location.state} ${user.location.postcode}</p>
            </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
  `;
  if (document.querySelector('.modal-container')) {
    document.querySelector('.modal-container').remove();
  }
  const div = document.createElement('div');
  div.setAttribute('class', 'modal-container');
  div.innerHTML = modal;
  document.querySelector('body').insertBefore(div, document.querySelector('script'));
  document.querySelector('#modal-close-btn').addEventListener('click', () => div.remove())
}


// Adds an event listener to each user card to display a modal window when the card is clicked
function modalListeners(arr) {
  const cards = document.querySelectorAll('.card');
  for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener('click', () => {
      createModal(arr[i])
      modalNum = i;
    });
  }
}

/* Adds an event listener to the "next" & "previous" buttons on the modal window
   to change the display to that of the next and previous users. Receives one of
   two functions as an argument, depending on whether this is the initial page
   load or users from a search */
function prevNextListeners(func) {
  document.querySelector('body').addEventListener('click', func);
}

// One of two possible functions called in the prevNextListeners function (see above)
function attachListenersInitial(e) {
  if (e.target.id === "modal-prev" && modalNum >= 1) {
    createModal(users[modalNum - 1]);
    modalNum -= 1;
  } else if (e.target.id === "modal-next" && modalNum <= users.length - 2) {
    createModal(users[modalNum + 1]);
    modalNum += 1;
  }
  if (modalNum === 0) {
    document.querySelector('#modal-prev').style.display = 'none';
  } else if (modalNum === users.length - 1) {
    document.querySelector('#modal-next').style.display = 'none';
  } else {
    document.querySelector('#modal-prev').style.display = '';
    document.querySelector('#modal-next').style.display = '';
  }
}

// One of two possible functions called in the prevNextListeners function (see above)
function attachListenersSearch(e) {
  if (e.target.id === "modal-prev" && modalNum >= 1) {
    createModal(searchRes[modalNum - 1]);
    modalNum -= 1;
  } else if (e.target.id === "modal-next" && modalNum <= searchRes.length - 2) {
    createModal(searchRes[modalNum + 1]);
    modalNum += 1;
  }
  if (searchRes.length === 1) {
    document.querySelector('#modal-prev').style.display = 'none';
    document.querySelector('#modal-next').style.display = 'none';
  } else if (modalNum === 0) {
    document.querySelector('#modal-prev').style.display = 'none';
  } else if (modalNum === searchRes.length - 1) {
    document.querySelector('#modal-next').style.display = 'none';
  } else {
    document.querySelector('#modal-prev').style.display = '';
    document.querySelector('#modal-next').style.display = '';
  }
}

// Declares a function that adds the search input and submit features to the page
function addSearch() {
  const searchHTML = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
  `;
  document.querySelector('.search-container').innerHTML = searchHTML;
}

// Creates a function that will be called when the search input is submitted
function search() {
  const searchInput = document.querySelector('#search-input');
  // Creates an empty array in which to store the user search results
  searchRes = [];
  // Removes any current event listeners on the modal prev/next buttons
  document.querySelector('body').removeEventListener('click', attachListenersInitial);
  document.querySelector('body').removeEventListener('click', attachListenersSearch);
  // Searches each user's first and last name and pushes any matches to the searchRes array
  users.forEach(user => {
    if (`${user.name.first.toLowerCase()} ${user.name.last.toLowerCase()}`
      .includes(searchInput.value.toLowerCase())) {
        searchRes.push(user);
      }
  });
  /* Displays the gallery of user search results, attaches a click event listener
     to each to display a modal, and adds functionality to the prev/next buttons */
  displayGallery(searchRes);
  modalListeners(searchRes);
  prevNextListeners(attachListenersSearch);
  if (searchRes.length === 0) {
    document.querySelector('#gallery').innerHTML =
      `<h2 class="no-results">No employee names match your search criteria</h2>`;
    document.querySelector('.no-results').style.color = "white";
  }
}

// Fetches user data from the API, displays users, and attaches event listeners
fetchData('https://randomuser.me/api/?nat=au,ca,gb,nz,us&results=12')
  .then(data => {
    users = data.results;
    displayGallery(users);
    modalListeners(users);
    prevNextListeners(attachListenersInitial);
  });

// Calls the addSearch function to display its features to the page
addSearch();

// Adds a click event listener to the search submit to call the above search function
document.querySelector('#search-submit').addEventListener('click', search);
document.querySelector('#search-input').addEventListener('keyup', search);
