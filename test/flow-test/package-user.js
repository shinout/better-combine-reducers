// @flow

declare type State = Object;
declare type Action = { type: $Subtype<string> }
import { combineReducers } from 'redux'
import better from 'better-combine-reducers'

const reducerA = (state: State, action: Action) => state
const reducerB = (state: State, action: Action) => state
const reducer = better(combineReducers)({ reducerA, reducerB }, { reducerA: 1, reducerB: 2 })
