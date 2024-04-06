document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById('toy-collection');

  let addToy = false;

  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  toyFormContainer.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Send a POST request to add the new toy
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        "name": "Anniee",
        "image": "https://vignette.wikia.nocookie.net/p__/images/8/88/Jessie_Toy_Story_3.png/revision/latest?cb=20161023024601&path-prefix=protagonist",
        "likes": 0
      })
    })
    .then(response => response.json())
    .then(data => {
      // If POST request is successful, add the new toy to the DOM
      addToyToDOM(data);
    })
    .catch(error => {
      console.error('Error adding toy:', error);
    });
  });

  toyCollection.addEventListener('click', function (event) {
    if (event.target.matches('.like-btn')) {
      const toyId = event.target.id;
      const currentLikesElement = event.target.previousSibling;
      const currentLikes = parseInt(currentLikesElement.textContent.split(' ')[0]); // Extract current likes count from DOM
      const newLikes = currentLikes + 1;

      updateLikesCount(toyId, newLikes)
        .then(updatedToy => {
          currentLikesElement.textContent = `${updatedToy.likes} Likes`;
        })
        .catch(error => {
          console.error('Error updating likes count:', error);
        });
    }
  });

  function updateLikesCount(toyId, newLikes) {
    return fetch(`http://localhost:3000/toys/${toyId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        likes: newLikes
      })
    })
    .then(response => response.json());
  }

  function addToyToDOM(toy) {
    const card = document.createElement('div');
    card.classList.add('card');

    const nameElement = document.createElement('h2');
    nameElement.textContent = toy.name;
    card.appendChild(nameElement);

    const imageElement = document.createElement('img');
    imageElement.src = toy.image;
    imageElement.classList.add('toy-avatar');
    card.appendChild(imageElement);

    const likesElement = document.createElement('p');
    likesElement.textContent = `${toy.likes} Likes`;
    card.appendChild(likesElement);

    const likeButton = document.createElement('button');
    likeButton.classList.add('like-btn');
    likeButton.textContent = 'Like';
    likeButton.id = toy.id;
    card.appendChild(likeButton);

    toyCollection.appendChild(card);
  }

  // Initial fetch to load existing toys
  fetchToys();

  function fetchToys() {
    fetch('http://localhost:3000/toys') 
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => {
          addToyToDOM(toy);
        });
      })
      .catch(error => {
        console.error('Error fetching toys:', error);
      });
  }
});
