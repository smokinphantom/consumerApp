# consumerapp
Consumer app for interaction between a buyer and seller

Project Structure

Overview

├── client
│   ├── app                 - All of our app specific components go in here
│   ├── assets              - Custom assets: fonts, images, etc…
│   ├── components          - Our reusable components, non-specific to to our app
│
├── e2e                     - Our protractor end to end tests
│
└── server
    ├── api                 - Our apps server api
    ├── auth                - For handling authentication with different auth strategies
    ├── components          - Our reusable or app-wide components
    ├── config              - Where we do the bulk of our apps configuration
    │   └── local.env.js    - Keep our environment variables out of source control
    │   └── environment     - Configuration specific to the node environment
    └── views               - Server rendered views
An example client component in client/app

main
├── main.js                 - Routes
├── main.controller.js      - Controller for our main route
├── main.controller.spec.js - Test
├── main.html               - View
└── main.less               - Styles
An example server component in server/api

thing
├── index.js                - Routes
├── thing.controller.js     - Controller for our `thing` endpoint
├── thing.model.js          - Database model
├── thing.socket.js         - Register socket events
└── thing.spec.js           - Test
