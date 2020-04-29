import React from 'react'

const Notifications = (data) => {
    if (data.uploadJsonError == undefined){
        return (
                <p></p>
        )
    } else {
        return (
            <div className="s12 m5 " style={{ color: "Red", backgroundColor: "white" }}>
                <p>Error al intentar subir una mision. Se subieron {data.missionsUploaded} misiones correctamente.</p>
            </div>
        )
    }
}

export default Notifications