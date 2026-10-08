import { useEffect, useMemo, useRef, useState } from 'react';

const checklistStorageKey = 'mes-demarches-checklist-v1';

const procedures = [
  {
    id: 'bts',
    title: 'Faire certifier un diplôme BTS',
    shortTitle: 'Diplôme BTS',
    category: 'Études',
    office: 'Sous-préfecture',
    image: '/assets/images/etudiants-bts.jpeg',
    imageAlt: 'Étudiants diplômés',
    summary: 'Préparez les pièces à présenter pour demander la certification de votre diplôme.',
    fee: 'Timbre fiscal indiqué : 1 500 FCFA',
    documents: ['L’original du diplôme', 'Une photocopie du diplôme', 'Le timbre fiscal demandé'],
    steps: [
      'Rendez-vous à la sous-préfecture de votre lieu de résidence.',
      'Présentez l’original et la photocopie du diplôme.',
      'Demandez la certification au guichet compétent et confirmez le montant du timbre avant votre déplacement.',
    ],
  },
  {
    id: 'naissance',
    title: 'Obtenir ou légaliser un acte de naissance',
    shortTitle: 'Acte de naissance',
    category: 'État civil',
    office: 'Mairie / sous-préfecture',
    image: '/assets/images/batiment-administratif.jpg',
    imageAlt: 'Bâtiment administratif',
    summary: 'Repérez les premières étapes selon que vous déclarez une naissance ou légalisez un acte existant.',
    fee: 'Le site indique 2 000 FCFA pour la légalisation; à confirmer auprès du service concerné.',
    documents: [
      'Pour une déclaration : pièces d’identité des parents',
      'Pour une déclaration : certificat de naissance remis par le personnel de santé',
      'Pour une légalisation : original de l’acte de naissance',
    ],
    steps: [
      'Pour une nouvelle déclaration, contactez la mairie du lieu de naissance afin de confirmer la procédure et le délai applicables.',
      'Pour légaliser un acte existant, présentez l’original au service compétent indiqué par votre mairie.',
      'Confirmez les pièces à fournir et les frais avant de vous déplacer.',
    ],
  },
  {
    id: 'cni',
    title: 'Faire certifier une copie de la carte d’identité',
    shortTitle: 'Carte d’identité',
    category: 'Identité',
    office: 'Commissariat',
    image: '/assets/images/commissariat.jpeg',
    imageAlt: 'Bâtiment de police',
    summary: 'Préparez votre copie et vérifiez les modalités de certification auprès du commissariat.',
    fee: 'Timbre fiscal indiqué : 1 500 FCFA',
    documents: ['Une photocopie de la carte nationale d’identité', 'La carte originale, pour vérification', 'Le timbre fiscal demandé'],
    steps: [
      'Préparez une photocopie lisible de votre carte nationale d’identité.',
      'Vérifiez le montant et le format du timbre fiscal demandé.',
      'Présentez-vous au commissariat compétent pour faire vérifier et certifier la copie.',
    ],
  },
];

const categories = ['Tout', 'Études', 'État civil', 'Identité'];

function readSavedChecklist() {
  try {
    return JSON.parse(window.localStorage.getItem(checklistStorageKey) || '{}');
  } catch {
    return {};
  }
}

function App() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tout');
  const [selectedId, setSelectedId] = useState(() => window.location.hash.slice(1));
  const [checkedItems, setCheckedItems] = useState(readSavedChecklist);
  const searchInput = useRef(null);

  useEffect(() => {
    const syncFromUrl = () => setSelectedId(window.location.hash.slice(1));
    window.addEventListener('hashchange', syncFromUrl);
    return () => window.removeEventListener('hashchange', syncFromUrl);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(checklistStorageKey, JSON.stringify(checkedItems));
  }, [checkedItems]);

  useEffect(() => {
    const focusSearch = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInput.current?.focus();
      }
    };
    window.addEventListener('keydown', focusSearch);
    return () => window.removeEventListener('keydown', focusSearch);
  }, []);

  const visibleProcedures = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('fr');
    return procedures.filter((procedure) => {
      const matchesCategory = category === 'Tout' || procedure.category === category;
      const searchableText = `${procedure.title} ${procedure.office} ${procedure.category} ${procedure.summary}`.toLocaleLowerCase('fr');
      return matchesCategory && (!query || searchableText.includes(query));
    });
  }, [search, category]);

  const selectedProcedure = procedures.find((procedure) => procedure.id === selectedId);

  function openProcedure(id) {
    window.location.hash = id;
  }

  function closeProcedure() {
    window.location.hash = '';
  }

  function toggleChecklistItem(procedureId, itemIndex) {
    setCheckedItems((current) => {
      const nextForProcedure = [...(current[procedureId] || [])];
      nextForProcedure[itemIndex] = !nextForProcedure[itemIndex];
      return { ...current, [procedureId]: nextForProcedure };
    });
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Mes démarches, accueil" onClick={closeProcedure}>
          <span className="brand-mark" aria-hidden="true">M</span>
          <span>mes<span className="brand-accent">démarches</span></span>
        </a>
        <a className="topbar-link" href="#demarches">Explorer les démarches <span aria-hidden="true">↘</span></a>
      </header>

      {selectedProcedure ? (
        <ProcedureDetail
          procedure={selectedProcedure}
          checkedItems={checkedItems[selectedProcedure.id] || []}
          onBack={closeProcedure}
          onToggle={(index) => toggleChecklistItem(selectedProcedure.id, index)}
        />
      ) : (
        <>
          <main>
            <section className="hero" aria-labelledby="hero-title">
              <div className="hero-copy">
                <div className="eyebrow"><span className="eyebrow-dot" /> GUIDE PRATIQUE · CAMEROUN</div>
                <h1 id="hero-title">Les démarches,<br /><span>en toute simplicité.</span></h1>
                <p>Les étapes et les pièces à préparer pour vos formalités administratives, réunies au même endroit.</p>
                <a className="primary-button" href="#demarches">Trouver ma démarche <span aria-hidden="true">↓</span></a>
                <div className="hero-note"><span className="note-check">✓</span> Clair, pratique et accessible sur mobile</div>
              </div>
              <div className="hero-art" aria-hidden="true">
                <div className="art-orbit orbit-one" />
                <div className="art-orbit orbit-two" />
                <div className="art-card art-card-back"><span className="art-line short" /><span className="art-line" /><span className="art-line medium" /><span className="art-stamp">OK</span></div>
                <div className="art-card art-card-front"><div className="art-card-icon">✓</div><span className="art-line short" /><span className="art-line" /><span className="art-line medium" /><div className="art-card-footer"><span>DOCUMENT</span><span>01 / 03</span></div></div>
                <div className="art-badge"><span>✦</span> Un guide, pas à pas</div>
              </div>
              <div className="hero-index"><span>01</span> / 03</div>
            </section>

            <section className="steps-strip" aria-label="Comment utiliser le guide">
              <div><span className="strip-number">01</span><span>Choisissez<br />votre document</span></div>
              <span className="strip-arrow" aria-hidden="true">→</span>
              <div><span className="strip-number">02</span><span>Préparez<br />vos pièces</span></div>
              <span className="strip-arrow" aria-hidden="true">→</span>
              <div><span className="strip-number">03</span><span>Suivez<br />les étapes</span></div>
            </section>

            <section className="procedures-section" id="demarches" aria-labelledby="procedures-title">
              <div className="section-heading">
                <div>
                  <div className="eyebrow muted-eyebrow">VOTRE PROCHAINE ÉTAPE</div>
                  <h2 id="procedures-title">De quoi avez-vous besoin ?</h2>
                  <p>Choisissez une démarche pour découvrir les pièces et les étapes.</p>
                </div>
                <span className="result-count">{visibleProcedures.length.toString().padStart(2, '0')} démarches</span>
              </div>

              <label className="search-box">
                <span className="search-icon" aria-hidden="true">⌕</span>
                <span className="sr-only">Rechercher une démarche ou un service</span>
                <input ref={searchInput} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Ex. diplôme, mairie, identité…" />
                {search && <button type="button" className="clear-search" onClick={() => setSearch('')} aria-label="Effacer la recherche">×</button>}
                <kbd>⌘ K</kbd>
              </label>

              <div className="filters" role="group" aria-label="Filtrer par catégorie">
                {categories.map((item) => (
                  <button key={item} type="button" className={`filter-chip ${category === item ? 'active' : ''}`} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>
                ))}
              </div>

              {visibleProcedures.length ? (
                <div className="procedure-grid">
                  {visibleProcedures.map((procedure, index) => (
                    <button className="procedure-card" type="button" key={procedure.id} onClick={() => openProcedure(procedure.id)}>
                      <div className="card-image-wrap">
                        <img src={procedure.image} alt={procedure.imageAlt} className="card-image" />
                        <span className="card-number">0{index + 1}</span>
                        <span className="card-arrow" aria-hidden="true">↗</span>
                      </div>
                      <div className="card-content">
                        <div className="card-meta"><span>{procedure.category}</span><span className="meta-dot" />{procedure.office}</div>
                        <h3>{procedure.title}</h3>
                        <p>{procedure.summary}</p>
                        <span className="card-cta">Voir les étapes <span aria-hidden="true">→</span></span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="empty-state"><span aria-hidden="true">⌕</span><h3>Aucune démarche trouvée</h3><p>Essaie un autre mot ou affiche toutes les catégories.</p><button type="button" className="text-button" onClick={() => { setSearch(''); setCategory('Tout'); }}>Réinitialiser la recherche</button></div>
              )}
            </section>

            <section className="info-banner">
              <span className="info-symbol" aria-hidden="true">i</span>
              <div><strong>Un conseil avant de vous déplacer</strong><p>Les pièces, frais et délais peuvent varier. Confirmez toujours les informations auprès du service administratif concerné.</p></div>
              <span className="banner-spark" aria-hidden="true">✳</span>
            </section>
          </main>
          <footer className="footer"><a className="brand footer-brand" href="#" onClick={closeProcedure}><span className="brand-mark">M</span><span>mes<span className="brand-accent">démarches</span></span></a><span>Un guide pratique pour mieux préparer vos formalités.</span><span>© 2026 · Guide administratif</span></footer>
        </>
      )}
    </div>
  );
}

function ProcedureDetail({ procedure, checkedItems, onBack, onToggle }) {
  const completedCount = checkedItems.filter(Boolean).length;
  const progress = Math.round((completedCount / procedure.documents.length) * 100);

  return (
    <main className="detail-page">
      <button type="button" className="back-button" onClick={onBack}><span aria-hidden="true">←</span> Toutes les démarches</button>
      <div className="detail-layout">
        <section className="detail-main">
          <div className="eyebrow muted-eyebrow">{procedure.category.toUpperCase()} · GUIDE PRATIQUE</div>
          <h1>{procedure.title}</h1>
          <p className="detail-intro">{procedure.summary}</p>
          <div className="detail-tags"><span>⌖ &nbsp;{procedure.office}</span><span>◷ &nbsp;À confirmer avant le déplacement</span></div>
          <div className="detail-image"><img src={procedure.image} alt={procedure.imageAlt} /></div>

          <section className="detail-block" aria-labelledby="documents-title">
            <div className="detail-block-heading"><div><div className="eyebrow muted-eyebrow">ÉTAPE 01</div><h2 id="documents-title">Préparez vos pièces</h2></div><span className="progress-label">{completedCount} / {procedure.documents.length} prêtes</span></div>
            <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
            <div className="checklist">
              {procedure.documents.map((document, index) => (
                <label key={document} className={`check-row ${checkedItems[index] ? 'checked' : ''}`}>
                  <input type="checkbox" checked={Boolean(checkedItems[index])} onChange={() => onToggle(index)} />
                  <span className="custom-check" aria-hidden="true">✓</span>
                  <span>{document}</span>
                </label>
              ))}
            </div>
            <p className="saved-note"><span>✓</span> Ta checklist est enregistrée sur cet appareil.</p>
          </section>

          <section className="detail-block steps-block" aria-labelledby="steps-title">
            <div className="eyebrow muted-eyebrow">ÉTAPE 02</div><h2 id="steps-title">Comment procéder</h2>
            <ol className="step-list">{procedure.steps.map((step, index) => <li key={step}><span className="step-index">0{index + 1}</span><span>{step}</span></li>)}</ol>
          </section>
        </section>

        <aside className="detail-aside">
          <div className="aside-card"><div className="eyebrow muted-eyebrow">À SAVOIR</div><h2>Frais indiqués</h2><p>{procedure.fee}</p><div className="aside-divider" /><p className="aside-caution"><span aria-hidden="true">!</span> Les montants et formalités peuvent changer. Vérifie-les auprès du service avant de partir.</p></div>
          <div className="aside-tip"><span className="tip-icon" aria-hidden="true">✦</span><div><strong>Petit rappel</strong><p>Garde tes originaux avec toi et prépare les photocopies à l’avance.</p></div></div>
        </aside>
      </div>
    </main>
  );
}

export default App;
