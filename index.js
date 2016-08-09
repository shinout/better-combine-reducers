/**
 * combineReducers => (reducers, initialState) => Reducers
 */
function betterCombineReducers(original) {
    return function(reducers, initialState) {
        if (initialState == null) {
            throw new Error('Pass the initial state to the 2nd argument.')
        }
        var newReducers = {}

        Object.keys(reducers)
        .filter(function(key) { return typeof reducers[key] === 'function' })
        .forEach(function(key) {
            var fn = reducers[key]
            var defaultState = initialState[key]
            if (defaultState == null) {
                throw new Error('Initial state is not defined for key "'+ key +'".')
            }

            newReducers[key] = function (state, action) {
                if (state == null) return defaultState
                return fn(state, action)
            }
        })

        Object.keys(initialState).forEach(function(key) {
            if (newReducers[key] == null) {
                throw new Error('Unnecessary key in initial state. key: "' + key + '".')
            }
        })

        return original(newReducers)
    }
}

module.exports = betterCombineReducers
