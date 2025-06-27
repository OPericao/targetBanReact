import TeamBans from './TeamBans';
import FearlessBans from './FearlessBans';
import BotonAccion from './BotonAccion';

export default function BarraInferior({ blueFearless, redFearless, blueBans, redBans, side, selectedChampion, roomId, draftStarted, team }){
    return (
        <div
            className="barra-inferior d-flex align-items-between py-2"
            style={{
                gridColumn: '1 / -1',
                borderTop: '1px solid #ccc',
                justifyContent: 'space-between',
            }}
            >

            <FearlessBans bans={blueFearless} team="blue" />

            <div className="d-flex align-items-center gap-2 justify-content-center flex-grow-1">
                <TeamBans bans={blueBans} team="blue" />
                <BotonAccion
                side={side}
                selectedChampion={selectedChampion}
                roomId={roomId}
                draftStarted={draftStarted}
                team={team}
                />
                <TeamBans bans={redBans} team="red" />
            </div>

            <FearlessBans bans={redFearless} team="red" />
        </div>
    );
}