// This test code requires Node v6 or later.

const better = require('..')
const assert = require('assert')
const { combineReducers } = require('redux')

describe('betterCombineReducers', () => {
    it('creates a reducer compatible with original `combineReducers`', () => {
        const reducerA = (state, action) => action.type === 'x' ? 'X': 'Y'
        const initialState = { reducerA: 'I' }
        const reducer = better(combineReducers)({ reducerA }, initialState)
        assert(typeof reducer === 'function')
        assert(reducer.name === 'combination')

        assert.deepEqual(reducer(undefined, { type: 'x' }), { reducerA: 'I' })
    })

    it('calls original `combineReducers` and returns the returned value', () => {
        const reducerA = (state, action) => action.type === 'x' ? 'X': 'Y'
        const initialState = { reducerA: 'I' }
        const combineReducersMock = (reducers) => ({ reducers, mock: true })
        const returnedValue = better(combineReducersMock)({ reducerA }, initialState)
        assert(returnedValue.mock === true)
        assert.deepEqual(Object.keys(returnedValue.reducers), ['reducerA'])
    })

    it('omits non-function values in reducers', () => {
        const reducerA = (state, action) => state
        const initialState = { reducerA: 'I' }
        const combineReducersMock = (reducers) => reducers
        const returnedValue = better(combineReducersMock)({ reducerA, reducerB: 1 }, initialState)
        assert.deepEqual(Object.keys(returnedValue), ['reducerA'])
    })

    it('throws an error when initial state is not given', () => {
        const reducerA = (state, action) => state
        assert.throws(() => { better(combineReducers)({ reducerA }) }, /initial state/)
    })

    it('throws an error when initial state for some reducers are not given', () => {
        const reducerA = (state, action) => state
        const reducerB = (state, action) => state

        const initialState = { reducerA: 'I' }

        assert.throws(() => {
            better(combineReducers)({ reducerA, reducerB }, initialState)
        }, /reducerB/)
    })

    it('throws an error when initial state contains unnecessary keys', () => {
        const reducerA = (state, action) => state
        const initialState = { reducerA: 'I', reducerB: 'I' }
        assert.throws(() => { better(combineReducers)({ reducerA }, initialState) }, /Unnecessary/)
    })

})
