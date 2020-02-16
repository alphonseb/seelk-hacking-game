import React, { useState, useEffect } from 'react';
import axios from 'axios';
import uuid from 'uuid/v1';
import emailjs from 'emailjs-com';
import { useSelector, useDispatch } from 'react-redux';
import { addAlert, editAlert, deleteAlert } from '../../store/actions';
import { Input, Button, Select, Form, AssetList } from './form';

function AlertsForm ({ alert }) {
    const dispatch = useDispatch();

    const assets = useSelector(state => state.assets);
    const [proposedAssets, setProposedAssets] = useState([]);
    
    const [newAlertText, setnewAlertText] = useState('');
    const [selectedAsset, setSelectedAsset] = useState({});
    
    const [selectedCondition, setSelectedCondition] = useState('');
    const [selectedLimit, setSelectedLimit] = useState(0);
    const [newAlertEmail, setNewAlertEmail] = useState('');

    const [readOnly, setReadOnly] = useState(alert ? true : false);
    const [formError, setFormError] = useState(false);
    
    useEffect(() => {
        if (alert) {
            setnewAlertText(alert.assetName);
            setSelectedAsset({ id: alert.assetId, name: alert.assetName });
            setSelectedCondition(alert.condition);
            setSelectedLimit(alert.limit);
            setNewAlertEmail(alert.email);
        }
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const saveAlert = () => {
        if (!newAlertEmail || !selectedAsset.id || !selectedCondition || !selectedLimit) {
            setFormError(true);
        } else {
            setFormError(false);
            const newAlert = {};
            newAlert.id = (alert && alert.id) || uuid();
            newAlert.email = newAlertEmail;
            newAlert.assetId = selectedAsset.id;
            newAlert.assetName = selectedAsset.name;
            newAlert.emailSent = false;
            newAlert.condition = selectedCondition;
            newAlert.limit = selectedLimit;
            newAlert.interval = window.setInterval(() => {
                axios({
                    method: 'get',
                    url: `${ process.env.REACT_APP_COINAPI_BASE_URL }/exchangerate/${ selectedAsset.id }/USD`,
                    headers: {
                        'X-CoinAPI-Key': process.env.REACT_APP_API_KEY
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
                    if (condition() && !newAlert.emailSent) {
                        // send email
                        const templateParams = {
                            currency_name: newAlert.assetName,
                            threshold: newAlert.limit,
                            rate: data.rate,
                            to_email: newAlert.email
                        };
                        emailjs
                            .send(process.env.REACT_APP_EMAILJS_SERVICEID, process.env.REACT_APP_EMAILJS_TEMPLATEID, templateParams, process.env.REACT_APP_EMAILJS_USERID)
                            .then(res => console.log(res));
                        console.log('email sent to :', newAlert.email);
                        newAlert.emailSent = true;
                        clearInterval(newAlert.interval);
                        dispatch(editAlert(newAlert));
                    }
                }).catch((err) => {
                    console.error(err);
                    window.alert('Unfortunately we are currently not supporting this crypto currency. Try an other one !');
                    clearInterval(newAlert.interval);
                })
                
            }, 1000 * 60);
            if (alert) {
                console.log(alert, newAlert);
                dispatch(editAlert(newAlert));
                setReadOnly(true);
            } else {
                dispatch(addAlert(newAlert));
                setnewAlertText('');
                setSelectedAsset({});
                setSelectedCondition('');
                setSelectedLimit(0);
                setNewAlertEmail('');
            }
            getRate(newAlert);
        }
    }
    
    const removeAlert = () => {
        if (window.confirm('Are you sure you want to delete this alert ?')) {
            dispatch(deleteAlert(alert));
        }
    };
    
    const getRate = (alert) => {
        if (alert.assetId) {
            axios({
                method: 'get',
                url: `${ process.env.REACT_APP_COINAPI_BASE_URL}/exchangerate/${ alert.assetId }/USD`,
                headers: {
                    'X-CoinAPI-Key': process.env.REACT_APP_API_KEY
                }
            }).then(({ data }) => {
                window.alert(`Current ${ alert.assetId } is : ${ data.rate }$`);
            }).catch(() => {
                window.alert(`Sorry we currently do not support ${ alert.assetId } exchange rates notifications.`);
                dispatch(deleteAlert(alert));
            })
        }
        return false;
    };
    
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
        <div>
            <h3>Add an alert</h3>
            <Form action="#" onSubmit={ (e) => { e.preventDefault() } }>
                <Input readOnly={ readOnly } placeholder="btc, ethereum..." type="text" value={ newAlertText } onChange={ handleNewAlertTextChange } />
                <Select disabled={ readOnly } value={ selectedCondition } name="condition" onChange={ handleConditionChange }>
                    <option value="">Choose</option>
                    <option value="inferior">&#60;</option>
                    <option value="superior">&#62;</option>
                </Select>
                <Input readOnly={ readOnly } type="number" name="limit" value={ selectedLimit } onChange={ handleLimitChange } />
                <Input readOnly={ readOnly } type="email" name="email" value={ newAlertEmail } onChange={ handleEmailChange } placeholder="mail@example.com" />
                {
                    (alert && readOnly) ?
                        <Button onClick={ () => { setReadOnly(false)} }>Edit alert</Button>
                    : 
                        <Button onClick={ saveAlert }>Save alert</Button>
                }
                {
                    alert && <Button className="delete" onClick={ removeAlert }>Remove alert</Button>
                }
                {
                    (alert && alert.emailSent) && <p>Email sent !</p>
                }
                { formError && <p className="error">Please fill all of the fields.</p> }
                <AssetList>
                    {
                        proposedAssets.map(({ id, name }) => (
                            <li key={ id }>
                                <button data-asset-id={ id } onClick={ handleAssetClick }>
                                    { id } - { name }
                                </button>
                            </li>
                        ))
                    }
                </AssetList>
            </Form>
        </div>
    );
}

export default AlertsForm;