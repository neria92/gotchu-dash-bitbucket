import { getLocation } from "../actions/geoActions";

const initState={
    captureCreated: null,
    projectSaved: null,
}

const projectReducer =(state = initState,action) => {
    switch(action.type)
    {
        case 'CREATE_PROJECT':
            return {
                ...state,
                captureCreated: action.payload.id
            };
        case 'CREATE_PROJECT_ERROR':
            return state;
        case 'Project_Saved':
            return {
                ...state,
                projectSaved: action.payload.id
            };
        case 'Reset_Saved_Project':
            return {
                ...state,
                projectSaved: null,
            }
        case 'Project_Saved_Error':
            return {
                ...state,
                projectSaved: action.err
            }
        case 'DELETE_PROJECT':
            return state;
        case 'DELETE_PROJECT_ERROR':
            return state;
        default:
            return state;
    }

}

export default projectReducer
