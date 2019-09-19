const initState={
    body: {},
    error: null
}

const serverReducer =(state = initState,action) => {
    switch(action.type){
        case 'Server_Response':
            console.log("IM HERE", action.payload)
            return {
                ...state,
                body: action.payload
            }
        case 'Server_Response_Bad':
                console.log("IM HER22E", action)
            return{
                body: { error:action.payload.message }
            }

        default:
            return state;
    }

}

export default serverReducer