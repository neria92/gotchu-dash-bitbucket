
const initState = {
    init: 1,
    fin: 0
}

const pageReducer = (state = initState, action) => {
    switch (action.type) {
        case 'ON_PAGE_CHANGE':
            return {
                init:action.payload.init,
                fin:action.payload.fin
            };
        default:
            return state;
    }

}

export default pageReducer