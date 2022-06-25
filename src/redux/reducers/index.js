import { combineReducers } from "redux";
import earthquakeReducer from "./earthquakeReducer";

export default combineReducers({
    earthquakes: earthquakeReducer
});