import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAssets } from './store/actions';
import axios from 'axios'
import './App.css';
import AlertsList from './components/alertsList';
import AlertsForm from './components/alertsForm';

function App () {
    const dispatch = useDispatch();
    
    useEffect(() => {
        axios({
            method: 'get',
            url: `${ process.env.REACT_APP_COINAPI_BASE_URL }/assets`,
            headers: {
                'X-CoinAPI-Key': process.env.REACT_APP_API_KEY
            }
        }).then(res => {
            const newAssets = [];
            res.data.forEach(({ asset_id, name, type_is_crypto }) => {
                if (type_is_crypto) {
                    newAssets.push({ 'id': asset_id, name });
                }
            })
            dispatch(setAssets(newAssets));
        })
    }, []);// eslint-disable-line react-hooks/exhaustive-deps
    
    useEffect(() => {
        window.alert('This is a client-only app. You will need to keep the app running in your browser if you want to receive any notification.')
    }, [])// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="App">
            <h1>Crypto Alert</h1>
            <h2>Easily set up alerts about your favorite cryto-currencies movement</h2>
            <AlertsForm />
            <AlertsList />
        </div>
    );
}

export default App;
