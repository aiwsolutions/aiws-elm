import _ from 'lodash';

const enhanceReducer = (reducer, prefix, separator) => (state, action) => {
    const regex = new RegExp(`^(${prefix})${separator}(.+)`);
    const match = regex.exec(action.type);
    if (!match) {
        return state;
    }

    const reducerPrefix = match[1];
    const unwrappedType = match[2];
    if (!reducerPrefix || !unwrappedType) {
        return state;
    }

    const currentState = _.get(state, reducerPrefix);
    const newState = reducer(currentState, {
        ...action,
        type: unwrappedType
    });

    if (newState === currentState) {
        return state;
    }
    return {
        ...state,
        [reducerPrefix]: newState
    };
};

export default (initialState, map, separator = '/') => (state = { ...initialState }, action) => {
    const { root, ...childReducers } = map;
    const newState = _.reduce(
        childReducers,
        (acc, reducer, prefix) => enhanceReducer(reducer, prefix, separator)(acc, action),
        state
    );
    if (_.isFunction(root)) {
        return root(newState, action);
    }
    return newState;
};
