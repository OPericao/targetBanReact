import ChampionsGrid from './ChampionsGrid';
import BarraFiltros from './BarraFiltros';

export default function ColumnaCentral({ rol, handleRolChange, campeon, handleCampeonChange, jugadores, handleJugadorChange, campeonesFiltrados, selectedChampion, handleHoverChange, canPick }){
    return (
        <div className="columnCenter d-flex flex-wrap flex-column justify-content-start mx-auto">
            <BarraFiltros
                rol={rol}
                handleRolChange={handleRolChange}
                campeon={campeon}
                handleCampeonChange={handleCampeonChange}
                jugadores={jugadores}
                handleJugadorChange={handleJugadorChange}
            />

            <ChampionsGrid
                campeonesFiltrados={campeonesFiltrados}
                selectedChampion={selectedChampion}
                handleHoverChange={handleHoverChange}
                canPick={canPick}
            />
        </div>
    );
}