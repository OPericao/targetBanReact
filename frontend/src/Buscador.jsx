export default function Buscador({ campeon, handleCampeonChange }) {
  return (
    <div className="input-group mx-0" style={{ width: '25%' }}>
      <input
        type="text"
        className="form-control"
        value={campeon}
        placeholder="Buscar campeones..."
        onChange={handleCampeonChange}
        style={{
          backgroundColor: '#ddd',
          border: '2px solid #888',
          borderRadius: '4px',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          outline: 'none',
        }}
        onFocus={e => {
          e.target.style.borderColor = '#222';
          e.target.style.boxShadow = '0 0 8px 2px rgba(34, 34, 34, 0.7)';
        }}
        onBlur={e => {
          e.target.style.borderColor = '#888';
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );
}
