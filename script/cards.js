

import HTMLPutCache from './html-put-cache.js'
import { randomInt0ToX, getURLQueryParameters } from './utilities.js'

const adjectvies = [
    'Attractive',
    'Smart',
    'Sexy',
    'Glamorous',
    'Handsome',
    'Mysterious',
    'Dazzling',
    'Jolly',
    'Witty',
    'Wonderous'
];

const nouns = [
    'Programmer',
    'Astronomer',
    'Chicken',
    'Penguin',
    'Fish',
    'Dragon',
    'Elf',
    'Dwarf',
    'Wizard',
    'Elephant',
];

const colors = [
    'DodgerBlue',
    'DarkSlateBlue',
    'GoldenRod',
    'DarkSeaGreen',
    'Orange',
    'OrangeRed',
    'SaddleBrown',
    'Teal',
    'Tomato',
    'Peru',
];

const fonts = [
    'Anton',
    'Balsamiq Sans',
    'Bungee',
    'Bungee Outline',
    'Langar',
    'Lobster',
    'Orbitron',
    'Parisienne',
    'Special Elite',
    'Ultra',
]

const addNameToURL = function (name) {
    history.pushState({ 'name': name, }, '', `?page=${name}`);
    return window.location;
}

const randomName = function () {
    return `${adjectvies[randomInt0ToX(10)]} ${nouns[randomInt0ToX(10)]}`;
}

const storeCard = async function (cache, cardSelector) {
    const cardHTML = document.getElementById(cardSelector).innerHTML;
    await cache.addItem(window.location, cardHTML);
}

const replaceCardContentsFromCache = async function (cardSelector, cache) {
    const card = document.getElementById(cardSelector);
    const cardHTML = await cache.getItem(window.location);
    card.innerHTML = cardHTML;
}


const showCard = function (cardItem, cardSelector) {
    const cardContents = document.querySelector(`#${cardSelector} .card-contents`);
    cardContents.style.backgroundColor = cardItem.backgroundColor;
    cardContents.style.fontFamily = cardItem.fontFamily;
    cardContents.querySelector('.card-name').innerHTML = cardItem.name;
}

const generateCardList = function () {
    const cardList = [];
    let cardCount = 0;
    while (cardCount < 10) {
        const newCard = {
            name: randomName(),
            fontFamily: fonts[randomInt0ToX(10)],
            backgroundColor: colors[randomInt0ToX(10)]
        }

        if (!cardList.some(item => item.name === newCard.name)) {
            cardList.push(newCard);
            cardCount += 1;
        }
    }
    return cardList;
}

const addCardControls = function (controlsSelector, cardSelector, cardCache) {
    const controls = document.getElementById(controlsSelector);
    generateCardList().forEach((cardItem, index) => {
        const button = document.createElement("button");
        button.innerHTML = index + 1;
        button.setAttribute('data-card', cardItem.name);
        button.addEventListener('click', function () {
            showCard(cardItem, cardSelector);
            addNameToURL(cardItem.name);
            storeCard(cardCache, cardSelector);
        }, false);
        controls.appendChild(button);
    });
}

const updatePage = function (controlsSelector, cardSelector, cardCache) {
    replaceCardContentsFromCache(cardSelector, cardCache);
    const page = getURLQueryParameters()['page'];
    // move focus to the corrsponding button
    if (page) {
        document.querySelector(`[data-card="${page}"]`).focus();
    } else {
        document.querySelectorAll(`#${controlsSelector} button`).forEach(item => item.blur());
    }
}

const initializeApp = async function () {
    const cardSelector = 'card';
    const controlsSelector = 'cardControls';
    const cardCache = new HTMLPutCache('cardCache');
    await cardCache.init();

    // TODO: Reset the card instead of the whole page! 
    if (window.location.search) {
        /* On initialize if there is are seach params in the window's url,
        then user probably refreshed the page. To prevent something weird 
        being stored in cache, reload the page without the parameters. */
        window.location = "/";
    }

    // store the initial (instructions) card
    storeCard(cardCache, cardSelector);

    addCardControls(controlsSelector, cardSelector, cardCache);

    // listen for window's url to change
    window.addEventListener('popstate', () => {
        updatePage(controlsSelector, cardSelector, cardCache);
    });

}

initializeApp();
