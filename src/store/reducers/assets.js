import { SET_ASSETS } from '../actions/types';

const assetsReducer = (state = [], action) => {
    switch (action.type) {
        case SET_ASSETS:
            return action.assets;
        default:
            return state;
    };
};

export default assetsReducer;