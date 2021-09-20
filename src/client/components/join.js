import React, {forwardRef} from "react";

const Join = (props, ref) => {

    return (
        <>
            <form action="" style={{display: 'flex', flexDirection: 'column'}}>
                <label>Name</label>
                <input type="text" name='username' required onChange={(e) => props.onNameChange(e)}/>
                <label>Room</label>
                <input type="text" name='room' required onChange={(event) => props.onRoomChange(event)}/>
            </form>
            <button onClick={() => props.joinRoom()}>
                join
            </button>
        </>
    )
}

export default forwardRef(Join)