const socket = io()

const $input = document.getElementById('input')
const $submit = document.getElementById('submit')
const $geo = document.getElementById('geo')
let text = ''

$input.addEventListener('change', (e) => {
    text = e.target.value
})

$submit.addEventListener('click', () => {
    socket.emit('sendMessage', text, (msg) => {
        $input.value = ''
        $input.focus()
        console.log(msg)
    })
})

$geo.addEventListener('click', () => {
    $geo.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((location) => {
        const {coords} = location
        const {latitude, longitude} = coords
        socket.emit('sendLocation', {latitude, longitude}, (msg) => {
            $geo.removeAttribute('disabled')
            console.log(msg)
        })
    })
})

socket.on('message', (data) => {
    console.log(data)
})
