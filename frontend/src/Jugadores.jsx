import Select from 'react-select';

export default function Jugadores({ jugadores, handleJugadorChange }) {
  const opcionesJugadores = [
    { value: '0', label: 'Todos' },
    ...jugadores.map(j => ({ value: j.id, label: j.nombre }))
  ];

  const customStyles = {
    container: (base) => ({
      ...base,
      width: '200px',
    }),
    control: (base, state) => ({
      ...base,
      backgroundColor: '#ddd', 
      borderColor: state.isFocused ? '#222' : '#888',
      boxShadow: state.isFocused ? '0 0 8px 2px rgba(34, 34, 34, 0.7)' : 'none',
      '&:hover': {
        borderColor: '#222',
      },
      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    }),
    input: (base) => ({
      ...base,
      color: '#000',
    }),
    placeholder: (base) => ({
      ...base,
      color: '#555',
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: '#eee',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? '#ccc' : 'transparent',
      color: '#000',
      cursor: 'pointer',
    }),
  };

  return (
    <Select
      className="basic-single"
      placeholder="Buscar por jugador"
      options={opcionesJugadores}
      onChange={option => handleJugadorChange(option.value)}
      isSearchable={true}
      styles={customStyles}
    />
  );
}
