# metaCrawlerRemoteStorage
---
This project has two parts:

## Server-Side:
### server.js

1. Install NPM packages in a new project/directory: npm install express cors
2. add server.js to the root of the same directory
3. start the server by using the following command in your terminal: node server
---
## Client-Side:
### browserInject.js

1. copy and paste the contents of this file into the console view of the browser.
2. Click Enter

The script will start on the injected page and crawl until it runs out of pages, or until the crawl limit has been reached. There is a semi-random delay timer that fluctuates the wait time between requests, lessening the chance of exceeding rate limits and/or getting robo-banned.
