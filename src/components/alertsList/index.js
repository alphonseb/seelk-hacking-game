import React from 'react';
import { useSelector } from 'react-redux';
import AlertsForm from '../alertsForm';

function AlertsLists () {
    const alerts = useSelector(state => state.alerts);
    
    return (
        <div>
            <h3>My alerts</h3>
            { alerts.length ?
                <ul>
                    { alerts && alerts.map((alert) => (
                        <li key={ alert.id }>
                            <AlertsForm alert={ alert } />
                        </li>
                    )) }
                </ul>
                : <p>No alerts right now</p>
            }
        </div>
    );
}

export default AlertsLists;