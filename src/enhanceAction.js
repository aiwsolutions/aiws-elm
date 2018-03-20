import _ from 'lodash';

const enhanceAction = (action, prefix, separator) => (...params) => {
    const actionPayload = action(...params);
    return {
        ...actionPayload,
        type: `${prefix}${separator}${actionPayload.type}`
    };
};

export default (actions, prefix, separator = '/') => {
    if (_.isArray(actions)) {
        return _.map(actions, action => enhanceAction(action, prefix, separator));
    }
    return enhanceAction(actions, prefix, separator);
};
