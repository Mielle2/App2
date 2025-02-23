const decks = {};
let myDeckId = 1;

export function makeDeck(req, res, next) {
  const deckId = myDeckId++;

  const suits = ["hearts", "diamonds", "clubs", "spades"];
  const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  const deck = [];

  for (const suit of suits) {
    for (const value of values) {
        deck.push({ value, suit, drawn: false });
    }
  }

  decks[deckId] = { cards: deck, drawnCards: [] };
  const deckMSG = "New deck created";

  res.status(HTTP_CODES.SUCCESS.OK).json({ deckMSG, deck_id: deckId }).end();
}

export function shuffleDeck(req, res, next) {
  const { deck_id } = req.params;
  const deckData = decks[deck_id];

  if (!deckData) {
    return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).json({ message: "Deck not found" });
  }

  const shuffleMSG = "Deck shuffled";
  const deck = deckData.cards;

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  res.status(HTTP_CODES.SUCCESS.OK).json({ shuffleMSG, deck }).end();
}

export function getDeck(req, res, next) {
  const { deck_id } = req.params;
  const deckData = decks[deck_id];

  if (!deckData) {
    return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).json({ message: "Deck not found" });
  }

  const cardsInDeck = deckData.cards.filter(card => !card.drawn);
  const drawnCards = deckData.cards.filter((card) => card.drawn);
  const yourDeckMSG = "Here's your deck";

  res.status(HTTP_CODES.SUCCESS.OK).json({ yourDeckMSG, deck_id: deck_id, remaining_cards: cardsInDeck, drawn_cards: drawnCards }).end();
}

export function getCard(req, res, next) {
  const { deck_id } = req.params;
  const deckData = decks[deck_id];

  if (!deckData) {
    return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).json({ message: "Deck not found" });
  }

  const drawMSG = "Card drawn: ";
  const availableCards = deckData.cards.filter(card => !card.drawn);

  if (availableCards.length === 0) {
    return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).json({ message: "No cards left in the deck" });
  }

  const randomIndex = Math.floor(Math.random() * availableCards.length);
  const drawnCard = availableCards[randomIndex];

  drawnCard.drawn = true;
  deckData.drawnCards.push(drawnCard);

  let remaining = deckData.cards.filter(card => !card.drawn);

  res.status(HTTP_CODES.SUCCESS.OK).json({drawMSG, card: drawnCard, remaining_cards: remaining}).end();
}
