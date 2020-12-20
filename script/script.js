
class HTMLCardCache {
    constructor() {
        this.cardCache = null;
    }

    async init() {
        // clear any existing cache
        await caches.delete('cardCache');
        // create a cache
        this.cardCache = await caches.open('cardCache');
    }

    async availableStorage() {
        if (navigator.storage && navigator.storage.estimate) {
            const quota = await navigator.storage.estimate();
            // quota.usage -> Number of bytes used.
            // quota.quota -> Maximum number of bytes available.
            const percentageUsed = (quota.usage / quota.quota) * 100;
            console.log(`You've used ${percentageUsed}% of the available storage.`);
            const remaining = quota.quota - quota.usage;
            console.log(`You can write up to ${remaining} more bytes.`);
        }
    }

    async addItem(url, html) {
        const card = JSON.stringify(html);
        try {
            await this.cardCache.put(url, new Response(JSON.stringify({ card })));
            await this.availableStorage();
        } catch (err) {
            if (error.name === 'QuotaExceededError') {
                //TODO: In future delete all but last few items
                console.error('QuotaExceededError');
                this.init();
                return addItem(url, html);
            }
        }
    }

    async getItem(url) {
        const response = await this.cardCache.match(url);
        const jsonResponse = await response.json();
        return JSON.parse(jsonResponse.card);
    }

    async itemExists(url) {
        const response = await this.cardCache.match(url);
        return response ? true : false;
    }

}

(function () {

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

    const randomInt0ToX = function (maxInteger) {
        return Math.floor(Math.random() * maxInteger);
    }

    const addNameToURL = function (name) {
        history.pushState({ 'name': name, }, '', `?page=${name}`);
        return window.location;
    }

    const randomName = function () {
        return `${adjectvies[randomInt0ToX(10)]} ${nouns[randomInt0ToX(10)]}`;
    }

    const storeCard = async function (cache, cardSelector) {
        const cardHTML = document.querySelector(cardSelector).innerHTML;
        await cache.addItem(window.location, cardHTML);
    }

    const replaceCardContentsFromCache = async function (cardSelector, cache) {
        const card = document.querySelector(cardSelector);
        const cardHTML = await cache.getItem(window.location);
        card.innerHTML = cardHTML;
    }

    const updateCardContents = function (cardSelector, name) {
        const cardContents = document.querySelector(`${cardSelector} .card-contents`);
        cardContents.style.backgroundColor = colors[randomInt0ToX(10)];
        cardContents.style.fontFamily = fonts[randomInt0ToX(10)];
        cardContents.querySelector('.card-name').innerHTML = name;
    }

    const newName = function (cardSelector, cache) {
        const name = randomName();
        updateCardContents(cardSelector, name);
        addNameToURL(name);
        storeCard(cache, cardSelector);
    }

    const initializeApp = async function () {
        const cardSelector = '#card';
        const cardCache = new HTMLCardCache();
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

        // listen for window's url to change
        window.addEventListener('popstate', () => {
            replaceCardContentsFromCache(cardSelector, cardCache);
        });


        // listen for next name button click
        document.getElementById('nextName').addEventListener('click', () => {
            newName(cardSelector, cardCache);
        });

    }

    initializeApp();
})();