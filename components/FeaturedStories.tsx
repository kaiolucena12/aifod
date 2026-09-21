"use client";

import { useState } from "react";

const stories = [
  { name: "Marina", city: "Recife", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=90", photos: ["https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1300&q=90", "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1300&q=90"] },
  { name: "Camila", city: "Aracaju", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=90", photos: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1300&q=90", "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1300&q=90"] },
  { name: "Lívia", city: "Recife", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=90", photos: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1300&q=90", "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1300&q=90"] },
  { name: "Isabela", city: "Boa Viagem", image: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=900&q=90", photos: ["https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=1300&q=90", "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1300&q=90"] },
  { name: "Bianca", city: "Olinda", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=90", photos: ["https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1300&q=90", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1300&q=90"] },
  { name: "Sophia", city: "Piedade", image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=90", photos: ["https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1300&q=90", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1300&q=90"] }
];

export default function FeaturedStories() {
  const [active, setActive] = useState<number | null>(null);
  const [photo, setPhoto] = useState(0);
  const close = () => { setActive(null); setPhoto(0); };
  const next = () => {
    if (active === null) return;
    const current = stories[active];
    if (photo < current.photos.length - 1) setPhoto(photo + 1);
    else if (active < stories.length - 1) { setActive(active + 1); setPhoto(0); }
    else close();
  };
  const prev = () => {
    if (active === null) return;
    if (photo > 0) setPhoto(photo - 1);
    else if (active > 0) { setActive(active - 1); setPhoto(stories[active - 1].photos.length - 1); }
  };

  return (
    <>
      <section className="storiesSection">
        <div className="container">
          <div className="storiesTitle"><div><span className="eyebrow">DESTAQUES</span><strong>Perfis em evidência</strong></div><span>toque para abrir</span></div>
          <div className="storiesRow">
            {stories.map((s, i) => (
              <button className="story" key={s.name} onClick={() => { setActive(i); setPhoto(0); }}>
                <span className="storyRing"><span><img src={s.image} alt={s.name} /></span></span>
                <strong>{s.name}</strong><small>{s.city}</small>
              </button>
            ))}
          </div>
        </div>
      </section>

      {active !== null && (
        <div className="storyOverlay" onClick={close}>
          <div className="storyViewer" onClick={(e) => e.stopPropagation()}>
            <div className="storyBars">{stories[active].photos.map((_, i) => <i className={i <= photo ? "on" : ""} key={i} />)}</div>
            <div className="storyHead"><div><img src={stories[active].image} alt="" /><span><strong>{stories[active].name}</strong><small>{stories[active].city} · destaque</small></span></div><button onClick={close}>×</button></div>
            <img className="storyPhoto" src={stories[active].photos[photo]} alt={stories[active].name} />
            <button className="storyPrev" onClick={prev}>‹</button><button className="storyNext" onClick={next}>›</button>
            <button className="storyProfileButton">Ver perfil</button>
          </div>
        </div>
      )}
    </>
  );
}
