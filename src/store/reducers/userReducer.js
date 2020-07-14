
const initState={
    userSaved: null,
    projectDeleted: null,
    error: null,
    loggedUser: null
}

const userReducer =(state = initState,action) => {
    switch(action.type)
    {
        case 'User_Saved':
            return {
                ...state,
                userSaved: action.payload.id
            };
        case 'User_Saved_Error':
            return {
                ...state,
                error: action.err
            }
        case 'Reset_Saved_User':
            return {
                ...state,
                userSaved: null,
                error: null
            }
        default:
            return state;
    }
}

export default userReducer
