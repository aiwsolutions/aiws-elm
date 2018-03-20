import enhanceComponent from './enhanceComponent';

let cache = {};

export function cachedEnhanceComponent(Component, reducerPrefix, actionWrapper) {
    if (cache[reducerPrefix]) {
        return cache[reducerPrefix];
    }
    const enhancedComponent = enhanceComponent(Component, reducerPrefix, actionWrapper);
    cache[reducerPrefix] = enhancedComponent;
    return enhancedComponent;
}

export function clearCache(reducerPrefix) {
    cache[reducerPrefix] = null;
}

export function resetCache() {
    cache = {};
}
