import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default (Component, reducerPrefix, actionWrapper, { storeKey = 'store', separator = '/' } = {}) =>
    class ElmComponent extends React.Component {
        static childContextTypes = {
            [storeKey]: PropTypes.object
        };
        static contextTypes = {
            [storeKey]: PropTypes.object.isRequired
        };

        getChildContext() {
            const store = this.context[storeKey];
            const actionMapping = _.isFunction(actionWrapper) ? actionWrapper :
                action => ({
                    ...action,
                    type: _.isNil(actionWrapper) ?
                        `${reducerPrefix}${separator}${action.type}` :
                        `${actionWrapper}${action.type}`
                });

            const dispatch = action => store.dispatch(actionMapping(action));

            // convert separator to dot inorder to get its proper state.
            const getState = () => _.get(store.getState(), _.replace(reducerPrefix, separator, '.'));

            return {
                [storeKey]: {
                    ...store,
                    dispatch,
                    getState
                }
            };
        }

        render() {
            return (
                <Component
                    {...this.props}
                />
            );
        }
    };
