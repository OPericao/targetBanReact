export default function TeamBans({ bans, team }){
    return(
        <div className={`d-flex px-5 ${team == 'red' ? 'flex-row-reverse' : ''} mx-5`} style={{width: '30%'}}>
            {bans.map((campeon, index) => (
                <img key={index} src={`/assets/campeones/${campeon}.png`} style={{ height: '50px', width: '50px', marginRight: '20px', objectFit: 'cover' }} />
            ))}
        </div>
    );
}