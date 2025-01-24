import express from "express";
import HTTP_CODES from "./utils/httpCodes.mjs";

const server = express();
const port = process.env.PORT || 8000;

server.set("port", port);

server.use(express.static("public"));

/*-------------------------------------- Uke 2 --------------------------------------------------*/

function getRoot(req, res, next) {
  res.status(HTTP_CODES.SUCCESS.OK).send("Hello World").end();
}

/*-------------------------------------- Uke 3 --------------------------------------------------*/

function getPoem(req, res, next) {
  const poem = `Roser er røde, 
    fioler er blå.
    Druer er søte,
    og du er like så.
    `;

  res.status(HTTP_CODES.SUCCESS.OK).send(poem).end();
}

function getQuote(req, res, next) {
  const quotes = [
    "You lose yourself trying to hold on to someone who doesn't care about losing you. ― Tablo",
    "In the midst of chaos, there is also opportunity. - SunTzu",
    "Your mind is like this water, my friend. When it is agitated, it becomes difficult to see. But if you allow it to settle, the answer becomes clear. - Master Oogway",
    "The journey of a thousand miles begins with one step. - Master Oogway",
    "The greatest victory is that which requires no battle. - SunTzu",
    "The past is history, the future is a mystery, and today is a gift. That’s why we call it the present. - Master Oogway",
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  res.status(HTTP_CODES.SUCCESS.OK).send(randomQuote).end();
}

function getSum(req, res, next) {
  const a = parseFloat(req.params.a);
  const b = parseFloat(req.params.b);
  const sum = a + b;

  res
    .status(HTTP_CODES.SUCCESS.OK)
    .send(`The sum of ${a} and ${b} is ${sum}`)
    .end();
}

server.get("/", getRoot);
server.get("/tmp/poem", getPoem);
server.get("/tmp/quote", getQuote);
server.post("/tmp/sum/:a/:b", getSum);

/*-------------------------------------- Uke 4 --------------------------------------------------*/

const decks = {};
let myDeckId = 1;

function makeDeck(req, res, next) {
  const deckId = myDeckId++;

  const suits = ["hearts", "diamonds", "clubs", "spades"];
  const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A",];

  const deck = [];

  for (const suit of suits) {
    for (const value of values) {
      deck.push({ value, suit });
    }
  }

  decks[deckId] = deck;
  const deckMSG = "New deck created";

  res.status(HTTP_CODES.SUCCESS.OK).send({ deckMSG, deck_id: deckId }).end();
}

function shuffleDeck(req, res, next) {
  const { deck_id } = req.params;
  const deck = decks[deck_id];
  const shuffleMSG = "Deck shuffled";

  if (!deck) {
    return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send({ message: "Deck not found" });
  }

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  res.status(HTTP_CODES.SUCCESS.OK).send({ shuffleMSG, deck });
}

function getDeck(req, res, next) {
    const { deck_id } = req.params;
    const deck = decks[deck_id];
    const cardsInDeck = deck.filter(card => !card.drawn);
    const yourDeckMSG = "Heres your deck"

    res.status(HTTP_CODES.SUCCESS.OK).send({ yourDeckMSG, remaining_cards: cardsInDeck });
}

server.post("/temp/deck", makeDeck);
server.patch("/temp/deck/shuffle/:deck_id", shuffleDeck);
server.get("/temp/deck/:deck_id", getDeck);

server.listen(server.get("port"), function () {
  console.log("server running", server.get("port"));
});
