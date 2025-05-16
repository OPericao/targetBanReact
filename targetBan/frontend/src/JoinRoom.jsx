import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import socket from './js/socket';

import 'bootstrap/dist/css/bootstrap.min.css';

import './css/JoinRoom.css';

export default function JoinRoom() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [teamStatus, setTeamStatus] = useState({ blue: false, red: false });

  useEffect(() => {
    socket.emit('updateStatus', roomId);

    socket.on('updatedStatus', ({ blue, red }) => {
        setTeamStatus({ blue, red });
    });

    return () => {
      socket.off('updatedStatus');
    };
  }, []);

  const joinRoomAs = (teamChoice) => {
    navigate(`/draft/${roomId}/${teamChoice}`);
    socket.emit('updateStatus', roomId);
  };

  return (
    <div className="createRoomContainer d-flex flex-column justify-content-center align-items-center min-vh-100">
      <div className='card p-5 shadow-lg'>
        <h1>Elige tu equipo</h1>
        <p>Comparte este enlace con otro jugador para que se una a tu sala:</p>
        <input value={window.location.href} readOnly style={{ width: '100%' }} />
        <br></br>
        <button onClick={() => navigator.clipboard.writeText(window.location.href)}>
          Copiar enlace
        </button>

        <br /><br />

        <div className='d-flex flex-row justify-content-around'>
          <button className='btn btn-primary rounded-0'
            onClick={() => joinRoomAs('blue')} 
            disabled={teamStatus.blue}
            >
            Unirse como Azul
          </button>
          <button className='btn btn-danger rounded-0'
            onClick={() => joinRoomAs('red')} 
            disabled={teamStatus.red}
            >
            Unirse como Rojo
          </button>
        </div>
      </div>
    </div>
  );
}