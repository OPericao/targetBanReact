export default function ChampionsGrid({ campeonesFiltrados, selectedChampion, handleHoverChange }) {
    return (        
        <div
            className="d-flex flex-wrap justify-content-center align-content-start flex-grow-1 mt-3 pt-2"
            style={{ height: '520px', overflowY: 'auto' }}
            id="campeonesContainer"
        >
            {campeonesFiltrados.map((campeon) => (
                <div key={campeon.id} className="campeon-card">
                    <button
                        className={`btn ${campeon.nombre === selectedChampion ? 'boton-picked' : ''} btn-champ mx-0 p-0`}
                        onClick={handleHoverChange}
                    >
                        <img
                            src={`/assets/campeones/${campeon.nombre}.png`}
                            className="m-1"
                            id={campeon.nombre}
                            draggable="false"
                        />
                    </button>
                </div>
            ))}
        </div>
    );
}
