export default function SideColumn({ champs, side, pickingIndex }) {
    const defaultBanners = [
        "unknown",
        "unknown",
        "unknown",
        "unknown",
        "unknown"
    ];

    const indexSide = pickingIndex.slice(0, -1); 
    let realIndex = -1;

    if(indexSide == side){
        realIndex = parseInt(pickingIndex.slice(-1));
    }

    const bannersToShow = [];

    for (let i = 0; i < 5; i++) {
        if (champs[i]) {
        bannersToShow.push(champs[i]);
        } else {
        bannersToShow.push(defaultBanners[i]);
        }
    }

    return (
        <div className={`column${side} d-grid align-items-center align-content-start gap-2 py-2`}>
        {bannersToShow.map((champ, index) => (
            <div key={index} className="d-flex justify-content-center">
            <img
            src={`/assets/banners/${champ}Banner.jpg`}
            className={`
                img-fluid 
                border 
                rounded 
                p-1
                fade-in
                ${realIndex === index ? "border border-4 border-warning shadow" : "border border-secondary border-2"}
            `}
            draggable="false"
            alt={`Banner de ${champ}`}
            />
            </div>
        ))}
        </div>
    );
}
