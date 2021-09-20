import React, {useCallback, useEffect, useRef, useState} from "react";
import ReactDOM from "react-dom";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams, useHistory
} from "react-router-dom";

import Chat from "./components/chat";
import Join from "./components/join";
import useForm from "./useForm";

const socket = io()
const App = () => {
    const formRef = useRef()
    const socketRef = useRef(socket)
    const history = useHistory()
    const {name, room, onNameChange, onRoomChange} = useForm()

    const joinRoom = useCallback(() => {
        socketRef.current.emit('room:join', {name, room})
        history.push('/chat')
    }, [name, room])

    return (
        <Switch>
            <Route exact path="/">
                <Join ref={socketRef} onNameChange={onNameChange} onRoomChange={onRoomChange} joinRoom={joinRoom}/>
            </Route>
            <Route path='/chat'>
                <Chat ref={socketRef} room={room} name={name}/>
            </Route>
        </Switch>
    )
};

ReactDOM.render(<Router><App/></Router>, document.getElementById("root"));
