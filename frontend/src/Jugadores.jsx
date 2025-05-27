import Select from 'react-select';

export default function Jugadores({ jugadores, handleJugadorChange }) {
    const opcionesJugadores = [
        { value: '0', label: 'Todos' },
        ...jugadores.map(j => ({ value: j.id, label: j.nombre }))
    ];

    return (
        <Select
        className="basic-single"
        placeholder="Buscar por jugador"
        options={opcionesJugadores}
        onChange={option => handleJugadorChange(option.value)}
        isSearchable={true}
        styles={{
            container: (base) => ({
            ...base,
            width: '200px',
            }),
        }}
        />

    );
}
