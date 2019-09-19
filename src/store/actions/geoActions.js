import sendRequest from '../actions/requestActions'
   
   export const  getLocation = (ref,km,mID,data) => {
        return (dispatch,getState,{getFirebase,getFirestore}) => {
            const geolocation = navigator.geolocation;
            geolocation.getCurrentPosition(position => {
                dispatch({
                    type: 'GET_LOCATION',
                    payload: {
                        position:position.coords,
                        id: ref,
                        km: km,
                        data: data,
                        mID: mID
                    }
                })
                dispatch(sendRequest({position:position.coords,
                    id: ref,
                    km: km,
                    data: data,
                    mID: mID}))
            });
        };
    }

    export default getLocation