import { getFirestore } from "redux-firestore";
import { debug } from "util";

const initState={
    jsonResponse : null
}

const geoReducer =(state = initState,action) => {
    switch(action.type){
        case 'GET_LOCATION':
                return state;
        default:
            return state;
    }

}

export default geoReducer