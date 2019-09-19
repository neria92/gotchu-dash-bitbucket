import getLocation from '../actions/geoActions'
import { debug } from 'util';

export const sendRequest = (project) =>{
    return (dispatch,getState,{getFirebase,getFirestore}) => {

        if(project.id != null)
               {
                   var l=0
                   var l2=0
                   if(project.km > 0)
                   {
                        var l = (Math.random()*project.km) / 111
                        var l2 = (Math.random()*project.km) / 111
                        if( Math.random() > .5)
                            l = l* -1 
                        if( Math.random() > .5)
                            l2 = l2* -1
                   }
                   var request = require('request');
                if(project.data.url != null && project.data.url != "") 
                {
                   request.post(
                       'https://newapp3-dot-gchgame.appspot.com/',
                       { json: { 
                            "id": project.data.id,
                            "name": project.data.mID,
                            "id_mission": "9K05kgHaeeDHxeiakTW7",
                            "mission_name": "Mision Canino",
                            "Location_latitude": project.position.latitude + l,
                            "Location_longitude": project.position.longitude + l,
                            "Location_mission_latitude": project.position.latitude + l,
                            "Location_mission_longitude": project.position.longitude + l,
                            "Start_Date_mission": "2019-08-10 19:19:08.293319",
                            "End_Date_mission": "2019-08-10 19:19:08.293319",
                            "Target_time_mission": 9000,
                            "Location_mission_radio": 2,
                            url: project.data.url
                        } },
                       function (error, response, body) {
                           if (!error && response.statusCode == 200) {
                                dispatch({type:"Server_Response",payload:body});
                           }
                           if ( error)
                           {
                            dispatch({type:"Server_Response_Bad",payload:error});
                            }
                       }
                   );
                    }
                    else{
                        request.post(
                            'https://newapp-dot-gchgame.appspot.com/',
                            { json: { 
                                 "id": project.data.id,
                                 "name": project.data.mID,
                                 "id_mission": "9K05kgHaeeDHxeiakTW7",
                                 "mission_name": "Mision Canino",
                                 "Location_latitude": project.position.latitude + l,
                                 "Location_longitude": project.position.longitude + l,
                                 "Location_mission_latitude": project.position.latitude + l,
                                 "Location_mission_longitude": project.position.longitude + l,
                                 "Start_Date_mission": "2019-08-10 19:19:08.293319",
                                 "End_Date_mission": "2019-08-10 19:19:08.293319",
                                 "Target_time_mission": 9000,
                                 "Location_mission_radio": 2
                             } },
                            function (error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    dispatch({type:"Server_Response",payload:body});
                                }
                                if ( error)
                                {
                                 dispatch({type:"Server_Response_Bad",payload:error});
                                }
                            }
                        );

                    }

                    getFirestore().collection('capture').doc(project.id).update(
                    {
                        coords:
                        {
                            lat:project.position.latitude + l,
                            long:project.position.longitude +l2 
                        }
                    }
                )
               }
        
    }
};

export default sendRequest