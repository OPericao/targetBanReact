import { useState } from 'react';
import socket from './js/socket';


export default function BotonAccion({ side, selectedChampion, roomId, draftStarted, team }){
    const [isReady, setIsReady] = useState(false);

    const currentSide = side.replace('ban', '');
    const isMyTurn = team == currentSide;
    
    const isBanTurn = (side) => side === 'blueban' || side === 'redban';

    const handlePick = () => {
        if(selectedChampion == ''){
            return;
        }
        
        if (isBanTurn(side)) {
            socket.emit('banChampion', { user: currentSide, champion: selectedChampion, roomId });
        } else {
            socket.emit('pickChampion', { user: side, champion: selectedChampion, roomId });
        }
    };

    const handleReadyClick = () => {
        setIsReady(true);
        socket.emit('playerReady', { roomId, team });
    };

    return(
        <div className='d-flex justify-content-center'>
            {!draftStarted && (
                <button onClick={handleReadyClick}>
                    {isReady ? 'Esperando al otro jugador...' : 'Listo'}
                </button>
            )}

            {draftStarted && (
                <button
                    id="selectBtn"
                    className={`btn ${isBanTurn(side) ? 'btn-danger' : 'btn-primary'}`}
                    disabled={!(isMyTurn && draftStarted)}
                    onClick={handlePick}
                >
                {isBanTurn(side) ? 'Banear' : 'Seleccionar'}
                </button>
            )}
        </div>
    );
}