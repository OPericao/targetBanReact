export default function Buscador ({ campeon, handleCampeonChange }){
    return (
        <div className="input-group mx-0" style={{ width: '25%' }}>
            <input type="text" className="form-control" value={campeon} placeholder="Buscar campeones..." onChange={handleCampeonChange} />
        </div>
    );
}