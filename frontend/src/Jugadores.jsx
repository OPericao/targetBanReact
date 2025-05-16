export default function Jugadores({ jugadores, handleJugadorChange }){
    return (
        <div className="d-flex justify-content-center" style={{ width: '15%' }}>
            <select className="form-select" onChange={handleJugadorChange}>
                <option value="0">Todos</option>
                {jugadores.map((jugador) => (
                    <option key={jugador.id} value={jugador.id}>{jugador.nombre}</option>
                ))}
            </select>
        </div>
    );
}