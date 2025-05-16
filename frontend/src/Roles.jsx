export default function Roles({ rol, handleRolChange, }){
    return( 
        <div className="d-flex flex-wrap justify-content-between" style={{ width: '45%' }}>
            {[0, 1, 2, 3, 4, 5].map((rolAux) => (
                <button
                    key={rolAux}
                    className={`btn ${rol === rolAux ? 'btn-light' : 'btn-outline-light'} mx-0`}
                    style={{ width: '12%', padding: 0 }}
                    onClick={() => handleRolChange(rolAux)}
                >
                    <img src={`/assets/roles/${getRolIcon(rolAux)}`} style={{ width: '100%', height: 'auto' }} />
                </button>
            ))}
        </div>
    );
}

function getRolIcon(id) {
    return [
        'generalIco.png',
        'topIco.png',
        'jgIco.png',
        'midIco.png',
        'adcIco.png',
        'suppIco.png'
    ][id];
}