import { getLocation } from "../actions/geoActions";

const initState={
    captureCreated: null,
    captureSaved: null,
    projectDeleted: null,
    error: null
}

const captureReducer =(state = initState,action) => {
    switch(action.type)
    {
        case 'Project_Added':
            return {
                ...state,
                projectSaved: action.payload.id
            };
        case 'Project_Added_Error':
            return {
                ...state,
                error: action.err
            }
        case 'Capture_Saved':
            return {
                ...state,
                captureSaved: action.payload.id
            };
        case 'Project_Saved_Error':
            return {
                ...state,
                error: action.err
            }
        case 'Reset_Saved_Project':
            return {
                ...state,
                projectSaved: null,
                error: null
            }
        case 'Project_Deleted':
            return {
                ...state,
                projectDeleted: action.payload.id,
            }
        case 'Project_Deleted_Error':
            return {
                ...state,
                error: action.err,
            }
        default:
            return state;
    }

}

export default captureReducer
