
/** Class for storing html in the browser cache utilizine the Cache API's put method. */
export default class HTMLPutCache {

    /** HTMLPutCache constructor
    * @param  {string} cacheKey This is the key or name of the cache that will be managed by HTMLPutCache
    */
    constructor(cacheKey) {
        this.cacheKey = cacheKey;
        this.htmlCache = null;
    }

    async init() {
        // clear any existing cache
        await caches.delete(this.cacheKey);
        // create a cache
        this.htmlCache = await caches.open(this.cacheKey);
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
            console.log('---------');
        }
    }

    async addItem(url, html) {
        const card = JSON.stringify(html);
        try {
            await this.htmlCache.put(url, new Response(JSON.stringify({ card })));
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
        const response = await this.htmlCache.match(url);
        const jsonResponse = await response.json();
        return JSON.parse(jsonResponse.card);
    }

    async itemExists(url) {
        const response = await this.htmlCache.match(url);
        return response ? true : false;
    }

}