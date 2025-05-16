import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/CreateRoom.css';

export default function CreateRoom() {
  const navigate = useNavigate();
  const [roomId] = useState(nanoid(16));

  const createRoom = () => {
    navigate(`/draft/${roomId}`);
  };

  return (
    <div className="createRoomContainer d-flex flex-column justify-content-center align-items-center min-vh-100">
      <div className="card p-5 shadow-lg">
        <h1 className="text-center mb-4">TargetBan</h1>
        <button className="btn btn-primary btn-block" onClick={createRoom}>
          Crear Sala
        </button>
      </div>
    </div>
  );
}
