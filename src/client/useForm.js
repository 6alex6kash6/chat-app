import {useState} from "react";

const useForm = () => {
    const [name, setName] = useState()
    const [room, setRoom] = useState()

    const onNameChange = e => setName(e.target.value)
    const onRoomChange = e => setRoom(e.target.value)

    return {
        name, room, onNameChange, onRoomChange
    }
}

export default useForm