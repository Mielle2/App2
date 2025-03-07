let currentDeckId = null;

const baseURL = "http://localhost:8000/temp/deck";

const newDeckButton = document.getElementById("new-deck");
const shuffleDeckButton = document.getElementById("shuffle-deck");
const drawCardButton = document.getElementById("draw-card");
const cardText = document.getElementById("card-text");
const cardImage = document.getElementById("card-image");
const drawnCardsContainer = document.getElementById("drawn-cards");
const remainingCardsContainer = document.getElementById("remaining-cards");

async function createDeck() {
    try {
      const response = await fetch(`${serverUrl}/temp/deck`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      console.log("Deck created:", data);

    } catch (error) {
      console.error("Error creating deck:", error);
    }
  }

function renderDeck(cards) {
    const deckContainer = document.getElementById("card-list");
    deckContainer.innerHTML = "";

    cards.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");

        const cardImage = document.createElement("img");
        cardImage.src = `img/${card.suit}_${card.value}.png`;
        cardImage.alt = `${card.value} of ${card.suit}`;
        cardImage.classList.add("card-image");

        cardElement.appendChild(cardImage);
        deckContainer.appendChild(cardElement);
    });
}

function displayDrawnCard(card) {
    const cardElement = document.createElement("img");
    cardElement.src = `img/${card.suit}_${card.value}.png`;
    cardElement.alt = `${card.value} of ${card.suit}`;
    cardElement.title = `${card.value} of ${card.suit}`;
    drawnCardsContainer.appendChild(cardElement);
}

function updateCards(remainingCards) {
    remainingCardsContainer.innerHTML = "";

    remainingCards.forEach(card => {
        const cardElement = document.createElement("img");
        cardElement.src = `img/${card.suit}_${card.value}.png`;
        cardElement.alt = `${card.value} of ${card.suit}`;
        cardElement.title = `${card.value} of ${card.suit}`;
        remainingCardsContainer.appendChild(cardElement);
    });

    if (remainingCards.length === 0) {
        remainingCardsContainer.innerHTML = "<p>No cards left</p>";
    }
}

// Event listeners
newDeckButton.addEventListener("click", async () => {
    try {
        const response = await fetch(`${baseURL}`, { method: "POST" });
        const data = await response.json();

        currentDeckId = data.deck_id;

        cardText.textContent = `New deck of cards! Deck ID: ${currentDeckId}`;
        cardImage.hidden = true;

        const drawnCardsContainer = document.getElementById("drawn-cards");
        drawnCardsContainer.innerHTML = "";

        const remainingCardsContainer = document.getElementById("remaining-cards");
        remainingCardsContainer.innerHTML = "";

        const deckResponse = await fetch(`${baseURL}/${currentDeckId}`);
        const deckData = await deckResponse.json();
        renderDeck(deckData.remaining_cards);

        shuffleDeckButton.disabled = false;
        drawCardButton.disabled = false;

    } catch (error) {
        console.error("Feil ved oppretting av kortstokk:", error);
        cardText.textContent = "An error occurred while creating deck.";
    }
});
shuffleDeckButton.addEventListener("click", async () => {
    if (!currentDeckId) return;
    try {
        const response = await fetch(`${baseURL}/shuffle/${currentDeckId}`, { method: "PATCH" });
        const data = await response.json();

        cardText.textContent = "Deck shuffled!";
        cardImage.hidden = true;

        const deckResponse = await fetch(`${baseURL}/${currentDeckId}`);
        const deckData = await deckResponse.json();

        renderDeck(deckData.remaining_cards);
    } catch (error) {
        console.error("Feil ved blanding av kortstokk:", error);
        cardText.textContent = "An error occurred while shuffling.";
    }
});

drawCardButton.addEventListener("click", async () => {
    try {
        const response = await fetch(`${baseURL}/${currentDeckId}/card`);
        const data = await response.json();

        cardText.textContent = `${data.card.value} of ${data.card.suit} was drawn!`;
        cardImage.src = `img/${data.card.suit}_${data.card.value}.png`;
        cardImage.hidden = false;

        displayDrawnCard(data.card);
        updateCards(data.remaining_cards);
    } catch (error) {
        console.error("Feil ved trekning av kort:", error);
        cardText.textContent = "An error occurred while drawing the card.";
    }
});

export async function loadModule(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        document.getElementById("module-content").innerHTML = html;
    } catch (error) {
        document.getElementById("module-content").innerHTML = `<p>Error loading module.</p>`;
        console.error("Error:", error);
    }
}