import TeamBans from './TeamBans';
import BotonAccion from './BotonAccion';

export default function BarraInferior({ blueBans, redBans, side, selectedChampion, roomId, draftStarted, team }){
    return (
        <div
            className="barra-inferior d-flex justify-content-between align-items-center gap-2 py-2"
            style={{ gridColumn: '1 / -1', borderTop: '1px solid #ccc' }}
        >
            <TeamBans
                bans={blueBans}
                team="blue"
            />
            
            <BotonAccion
                side={side}
                selectedChampion={selectedChampion}
                roomId={roomId}
                draftStarted={draftStarted}
                team={team}
            />

            <TeamBans
                bans={redBans}
                team="red"
            />
        </div>
    );
}