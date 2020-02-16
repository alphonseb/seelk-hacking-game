# Crypto Alert

Easily set up alerts about your favorite crypto-currencies.

## Installation
You can check out the live version [here](https://seelk-hack-alphonseb.netlify.com/).
1. Clone this project
2. Get an API Key from CoinAPI and set up Email JS
3. Set up a ```.env``` file with 5 variables :
    - REACT_APP_COINAPI_BASE_URL : should be https://rest.coinapi.io/v1
    - REACT_APP_API_KEY : you coinapi key
    - REACT_APP_EMAILJS_USERID : your emailjs user id
    - REACT_APP_EMAILJS_TEMPLATEID : your emailjs templateid
    - REACT_APP_EMAILJS_SERVICEID : your emailjs serviceid
4. Install the project
    ```
    yarn
    ```
5. Launch dev server
    ```
    yarn start
    ```

## Features
- Add alerts concerning currencies, with a threshold and an email to get notified to
- Edit your alerts
- Delete your alerts

## Stack
- React, bootstrapped with CRA
- Redux for state management
- Axios for network calls
- Styled Components
- CoinAPI to get crypto currencies exchange rates
- EmailJS to quickly send emails without a backend