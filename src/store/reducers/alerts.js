import { ADD_ALERT, EDIT_ALERT, DELETE_ALERT } from '../actions/types';

const alertsReducer = (state = [], action) => {
    switch (action.type) {
        case ADD_ALERT:
            return [...state, action.alert];
        case DELETE_ALERT:
            const alert = state.find(_alert => _alert.id === action.alert.id);
            window.clearInterval(alert.interval);
            return state.filter(_alert => _alert.id !== action.alert.id);
        case EDIT_ALERT:
            const newState = [...state];
            newState.splice(state.findIndex(_alert => _alert.id === action.alert.id), 1, action.alert);
            return newState;
        default:
            return state;
    };
};

export default alertsReducer;