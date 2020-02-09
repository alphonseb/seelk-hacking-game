import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'
import './App.css';

function App () {
    const [alert, setAlert] = useState([]);
    const [newAlertText, setnewAlertText] = useState('');
    
    const [assets, setAssets] = useState([]);
    const [proposedAssets, setProposedAssets] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState({});
    
    const [selectedAssetRate, setSelectedAssetRate] = useState(null);
    
    const [selectedCondition, setSelectedCondition] = useState('');
    const [selectedLimit, setSelectedLimit] = useState(0);
    const [newAlertEmail, setNewAlertEmail] = useState('');
    
    const addAlert = () => {
        const alert = {};
        alert.email = newAlertEmail;
        alert.emailSent = false;
        alert.interval = window.setInterval(() => {
            axios({
                method: 'get',
                url: `https://rest.coinapi.io/v1/exchangerate/${ selectedAsset.id }/USD`,
                headers: {
                    'X-CoinAPI-Key': 'D4AFF4EF-F2BF-429E-9042-C8D11C68C30D'
                }
            }).then(({ data }) => {
                const condition = () => {
                    switch (selectedCondition) {
                        case 'inferior':
                            return data.rate < selectedLimit;
                        case 'superior':
                            return data.rate > selectedLimit;
                        default:
                            return false;
                    }
                }
                if (condition() && !alert.emailSent) {
                    // send email
                    console.log('email sent to :', alert.email);
                    alert.emailSent = true
                }
            })
        }, 1000*60);
        setAlert(prevAlerts => [...prevAlerts, alert]);
    }

    
    /**
     * TRIED WEBSOCKET, BUT I AM NOT GETTING THE RESPONSES I WANT
     */

    // const stream = useRef(null);

    // useEffect(() => {
    //     stream.current = new WebSocket('wss://ws-sandbox.coinapi.io/v1/');
    //     stream.current.addEventListener('open', () => {
    //         stream.current.addEventListener('message', (response) => {
    //             console.log(JSON.parse(response.data));
    //         });
    //     });
    //     return () => {
    //         stream.current.close();
    //     };
    // })

    // const addAlert = () => {
    //     console.log(selectedAsset);

    //     stream.current.send(JSON.stringify({
    //         type: 'hello',
    //         apikey: 'D4AFF4EF-F2BF-429E-9042-C8D11C68C30D',
    //         heartbeat: false,
    //         subscribe_data_type: ['exrate'],
    //         subscribe_filter_asset_id: [selectedAsset.id],
    //         subscribe_filter_exchange_id: ['USD'],
    //     }));
    // };
    
    useEffect(() => {
        console.log('hello', assets);
        
        axios({
            method: 'get',
            url: 'https://rest.coinapi.io/v1/assets',
            headers: {
                'X-CoinAPI-Key': 'D4AFF4EF-F2BF-429E-9042-C8D11C68C30D'
            }
        }).then(res => {
            const newAssets = [];
            res.data.forEach(({ asset_id, name, type_is_crypto }) => {
                if (type_is_crypto) {
                    newAssets.push({ 'id': asset_id, name });
                }
            })
            setAssets(newAssets);
        })
    }, []);// eslint-disable-line react-hooks/exhaustive-deps
    
    const handleNewAlertTextChange = (e) => {
        setnewAlertText(e.target.value);
        const proposedAssets = [];
        assets.forEach(({ id, name }) => {
            if (
                e.target.value.length
                && (
                    (name && name.toLowerCase().includes(e.target.value.toLowerCase()))
                    ||
                    (id.toLowerCase() && id.includes(e.target.value.toLowerCase()))
                )
            ) {
                proposedAssets.push({ id, name });
            }
        });
        setProposedAssets(proposedAssets);
    };
    
    const handleGetRateClick = () => {
        if (selectedAsset.id) {
            axios({
                method: 'get',
                url: `https://rest.coinapi.io/v1/exchangerate/${ selectedAsset.id }/USD`,
                headers: {
                    'X-CoinAPI-Key': 'D4AFF4EF-F2BF-429E-9042-C8D11C68C30D'
                }
            }).then(({ data }) => {
                setSelectedAssetRate(data.rate)
            })
        }
    };
    
    const handleAssetClick = (e) => {
        const selectedAsset = proposedAssets.find(asset => asset.id === e.target.dataset.assetId);
        setProposedAssets([]);
        setnewAlertText(selectedAsset.name);
        setSelectedAsset(selectedAsset);
    };
    
    const handleLimitChange = ({ target }) => {
        setSelectedLimit(target.value);
    };
    
    const handleConditionChange = ({ target }) => {
        setSelectedCondition(target.value);
    };
    
    const handleEmailChange = ({ target }) => {
        setNewAlertEmail(target.value);
    };
    
    return (
        <div className="App">
            <h1>Cryto Alert</h1>
            <h2>Easily set up alerts about your favorite cryto-currencies movement</h2>
            <div>
                <form action="#" onSubmit={ (e) => { e.preventDefault() }}>
                    <input placeholder="btc, ethereum..." type="text" value={ newAlertText } onChange={ handleNewAlertTextChange }/>
                    <button onClick={ handleGetRateClick }>Get usd rate</button>
                </form>
                { selectedAssetRate && (
                    <>
                        <p>Rate of { selectedAsset.name } is at { selectedAssetRate } USD.</p>
                        <form action="#">
                            <select value={ selectedCondition } name="condition" onChange={ handleConditionChange }>
                                <option value="">Choose</option>
                                <option value="inferior">&#60;</option>
                                <option value="superior">&#62;</option>
                            </select>
                            <input type="email" name="email" value={ newAlertEmail } onChange={ handleEmailChange } />
                            <input type="number" name="limit" value={ selectedLimit } onChange={ handleLimitChange } />
                        </form>
                        <button onClick={ addAlert }>Set up alert</button>
                    </>
                ) }
                <ul>
                    {
                        proposedAssets.map(({ id, name}) => (
                            <li key={ id }>
                                <button data-asset-id={id} onClick={ handleAssetClick }>
                                    { id } - { name }
                                </button>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    );
}

export default App;
