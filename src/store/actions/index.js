import { ADD_ALERT, EDIT_ALERT, DELETE_ALERT, SET_ASSETS } from './types'

export const addAlert = (alert) => {
    return {
        type: ADD_ALERT,
        alert
    };
};

export const editAlert = (alert) => {
    return {
        type: EDIT_ALERT,
        alert
    };
};

export const deleteAlert = (alert) => {
    return {
        type: DELETE_ALERT,
        alert
    };
};

export const setAssets = (assets) => {
    return {
        type: SET_ASSETS,
        assets
    };
};