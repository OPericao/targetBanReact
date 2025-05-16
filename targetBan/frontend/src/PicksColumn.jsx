export default function SideColumn({ champs, side }) {
    const defaultBanners = [
        "unknown",
        "unknown",
        "unknown",
        "unknown",
        "unknown"
    ];

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
                    <img src={`/assets/banners/${champ}Banner.png`} className="img-fluid" />
                </div>
            ))}
        </div>
    );
}
