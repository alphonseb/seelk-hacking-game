import React, { useState, useEffect } from 'react';
import axios from 'axios'
import './App.css';

function App () {
    const [alert, setAlert] = useState([]);
    const [newAlertText, setnewAlertText] = useState('');
    
    const [assets, setAssets] = useState([]);
    const [proposedAssets, setProposedAssets] = useState([]);
    const [selectedAsset, setSelectedAsset] = useState({});
    
    const [selectedAssetRate, setSelectedAssetRate] = useState(null);
    
    useEffect(() => {
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
    }, [assets]);
    
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
    
    // const addAlert = () => {
    //     const stream = new WebSocket()
    // };
    
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
                        <button>Set up alert</button>
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
