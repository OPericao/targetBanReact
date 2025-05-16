import Roles from './Roles';
import Buscador from './Buscador';
import Jugadores from './Jugadores';

export default function BarraFiltros({ rol, handleRolChange, campeon, handleCampeonChange, jugadores, handleJugadorChange}){
    return(
        <div className="d-flex justify-content-between">
            <Roles
                rol={rol}
                handleRolChange={handleRolChange}
            />
            
            <Buscador
                campeon={campeon}
                handleCampeonChange={handleCampeonChange}
            />
            
            <Jugadores
                jugadores={jugadores}
                handleJugadorChange={handleJugadorChange}
            />
        </div>
    );
}
