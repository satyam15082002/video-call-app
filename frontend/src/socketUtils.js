import {io} from 'socket.io-client'

export const socket=io(`${process.env.REACT_APP_SERVER_URI}`,{
    'force-new-connection': true,
    reconnectionAttempt : 'Infinity',
    timeout: 10000,
    transports: ['websocket']
});
