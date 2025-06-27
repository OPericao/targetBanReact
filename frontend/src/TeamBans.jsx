export default function TeamBans({ bans, team }) {
  return (
    <div className={`d-flex gap-3 ${team === 'red' ? 'flex-row-reverse ms-5' : 'me-5'}`} style={{ width: '100%' }}>
      {bans.map((campeon, index) => (
        <img
          key={index}
          src={`/assets/campeones/${campeon}.png`}
          style={{
            height: '67px',
            width: '67px',
            objectFit: 'cover',
            boxShadow: '0 0 8px 3px rgba(150, 0, 0, 0.7)', 
            borderRadius: '5px',
          }}
        />
      ))}
    </div>
  );
}
