# better-combine-reducers

[![npm version](https://img.shields.io/npm/v/better-combine-reducers.svg)](https://www.npmjs.org/package/better-combine-reducers)
[![npm downloads](https://img.shields.io/npm/dm/better-combine-reducers.svg)](https://www.npmjs.org/package/better-combine-reducers)

Wrap function `combineReducers` in [Redux](redux.js.org) to set **initial state**.

# Concept
**Reducers should not know about the initial states**.

## Redux's reducers know about the initial state
When creating a reducer, we set default states as its default argument.

```js
function reducer(state = defaultState, action) {
}
```

Though it's the recommended way, (See http://redux.js.org/docs/basics/Reducers.html ),
we often meet some cases when it doesn't go well.

## Case: restarting an app
Consider an app that caches the last state and uses it as an initial state when the app restarts.
This means that initial states vary and reducers should be independent from them. However, current spec of `combineReducers` forces every reducer to return initial state when undefined is given. How should we tell them the initial state we want to set?

**This library combines reducers with initial state**.

# Installation
```sh
npm install redux better-combine-reducers
```

# Usage
```js
import { combineReducers } from 'redux'
import better from 'better-combine-reducers'

const reducerA = (state, action) => { counter: state.counter + 1 }
const reducerB = (state, action) => { counter: state.counter + 1 }

const initialState = {
    A: { counter: 100 },
    B: { counter: 100 },
}

const reducer = better(combineReducers)({ A: reducerA, B: reducerB }, initialState)
```

## Better Module Names?
Anyone who have an idea of better module name are welcomed write one in [#1](https://github.com/shinout/better-combine-reducers/issues/1)!
