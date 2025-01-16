import express from 'express';
import HTTP_CODES from './utils/httpCodes.mjs';

const server = express();
const port = (process.env.PORT || 8000);

server.set('port', port);
server.use(express.static('public'));

function getRoot(req, res, next) {
    res.status(HTTP_CODES.SUCCESS.OK).send('Hello World').end();
}

function getPoem(req, res, next) {
    const poem = 
    `Roser er røde, 
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
        "The past is history, the future is a mystery, and today is a gift. That’s why we call it the present. - Master Oogway"
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    res.status(HTTP_CODES.SUCCESS.OK).send(randomQuote).end();
}

server.get("/", getRoot);
server.get("/tmp/poem", getPoem);
server.get("/tmp/quote", getQuote);

server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});