import { getLocation } from "../actions/geoActions";

const initState={
    captureCreated: null
}

const projectReducer =(state = initState,action) => {
    switch(action.type)
    {
        case 'CREATE_PROJECT':
            return {
                ...state,
                captureCreated:'Project Created with id: ' + action.payload.id
            };
        case 'CREATE_PROJECT_ERROR':
            return state;
        default:
            return state;
    }

}

export default projectReducer
