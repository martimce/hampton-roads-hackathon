import React from "react";
import keplerGlReducer from "kepler.gl/reducers";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { taskMiddleware } from "react-palm/tasks";
import { Provider } from "react-redux";
import Map from "./components/Map";

const keplerReducer = keplerGlReducer.initialState({
  uiState: {
    activeSidePanel: null,
    currentModal: null,
  },
});

const reducers = combineReducers({
  keplerGl: keplerReducer,
});

const store = createStore(reducers, {}, applyMiddleware(taskMiddleware));

export default function App() {
  return (
    <Provider store={store}>
      <Map />
    </Provider>
  );
}
