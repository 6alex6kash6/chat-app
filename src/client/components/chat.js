import React, {forwardRef, useEffect, useRef, useState} from "react";

const socket = io()

const Chat = (props, ref) => {
    const inputRef = useRef()
    const [message, setMessage] = useState()
    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])
    const [isDisabled, setIsDisabled] = useState(false)

    useEffect(() => {
        ref.current.on('message', (data) => {
            setMessages(allMessages => ([...allMessages, data]))
        })
        ref.current.on('message:geo', (data) => {
            setMessages(allMessages => ([...allMessages, data]))
        })
        ref.current.on('message:join', (data) => {
            console.log(data)
        })
        ref.current.on('roomData', (data) => {
            setUsers([...data.users])
        })
    }, [])


    const sendMessage = () => {
        ref.current.emit('sendMessage', {room: props.room, name: props.name, message}, (msg) => {
            inputRef.current.value = ''
            inputRef.current.focus()
            console.log(msg)
        })
    }

    const sendLocation = () => {
        setIsDisabled(true)
        navigator.geolocation.getCurrentPosition((location) => {
            const {coords} = location
            const {latitude, longitude} = coords
            ref.current.emit('sendLocation', {room: props.room, name: props.name, latitude, longitude}, (msg) => {
                setIsDisabled(false)
                console.log(msg)
            })
        })
    }

    const onInputChange = (val) => {
        setMessage(val)
    }

    return (
        <div style={{display: 'flex'}}>
            <div>
                {messages.map(msg => {
                    return (
                        <>
                            <p>{msg.date} <span>{msg.name}</span></p>
                            {
                                msg.isUrl ?
                                    <a href={msg.text} style={{display: 'block'}} target='_blank'>{msg.text}</a> :
                                    <div key={msg.text}>{msg.text}</div>
                            }
                        </>
                    )
                })}
                <input type="text" onChange={(e) => onInputChange(e.target.value)} ref={inputRef}/>
                <button onClick={sendMessage}>send message</button>
                <button onClick={sendLocation} disabled={isDisabled}>send location</button>
            </div>
            <div>
                {users.map(user => {
                    return <div key={user.id}>{user.name}</div>
                })}
            </div>
        </div>
    );
};

export default forwardRef(Chat)
