export default function FearlessBans({ bans, team }) {
  return (
    <div className={`d-flex gap-3 ${team == 'red' ? 'flex-row-reverse ms-5 me-3' : 'me-5 ms-3'}`} style={{ width: '30%' }}>
      {bans.map((campeon, index) => (
        <img
          key={index}
          src={`/assets/campeones/${campeon}.png`}
          style={{
            height: '50px',
            width: '50px',
            gap: '1px',
            objectFit: 'cover',
            filter: 'grayscale(100%) brightness(80%)',
          }}
        />
      ))}
    </div>
  );
}
