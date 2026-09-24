// ==UserScript==
// @name         Prompt Genius — Médical (FMPM)
// @namespace    https://github.com/mohamed-aymane/prompt-genius-medical
// @version      3.0.0
// @description  ⌘⇧P pour ouvrir une palette de commandes de 226 prompts médicaux et paramédicaux (21 métiers de santé). Remplissage des variables de contexte 100% clavier, injection directe. Basé sur le catalogue Lonasanté « 226 Prompts IA Santé ».
// @author       Mohamed-aymane
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @match        https://claude.ai/*
// @match        https://gemini.google.com/*
// @match        https://labs.google/*
// @match        https://deepseek.com/*
// @match        https://chat.deepseek.com/*
// @match        https://labs.perplexity.ai/*
// @match        https://www.perplexity.ai/*
// @match        https://chat.mistral.ai/*
// @match        https://grok.com/*
// @match        https://x.com/i/grok*
// @match        https://copilot.microsoft.com/*
// @match        https://you.com/*
// @match        https://poe.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  // ═══════════════════════════════════════════════════════════
  //  CATÉGORIES — 21 métiers du catalogue Lonasanté
  // ═══════════════════════════════════════════════════════════
  const CATS = [
    { key: 'all',    label: 'Tous',                         icon: '✦',  color: '#c8ff00' },
    { key: 'mg',     label: 'Médecin généraliste',           icon: '🩺', color: '#4d9fff' },
    { key: 'ide',    label: 'Infirmier(ère) IDE',            icon: '💉', color: '#2dd4bf' },
    { key: 'as',     label: 'Aide-soignant(e)',              icon: '🤝', color: '#ff8c42' },
    { key: 'sm',     label: 'Secrétaire médicale',           icon: '📋', color: '#a78bfa' },
    { key: 'sf',     label: 'Sage-femme',                    icon: '🤰', color: '#f472b6' },
    { key: 'kine',   label: 'Kinésithérapeute',              icon: '🦵', color: '#34d399' },
    { key: 'pharma', label: 'Pharmacien(ne)',                icon: '💊', color: '#60a5fa' },
    { key: 'ap',     label: 'Auxiliaire de puériculture',    icon: '🍼', color: '#fbbf24' },
    { key: 'amb',    label: 'Ambulancier(ère)',              icon: '🚑', color: '#ef4444' },
    { key: 'merm',   label: 'Manipulateur en radiologie',    icon: '🩻', color: '#8b5cf6' },
    { key: 'rh',     label: 'Établissement / RH',            icon: '🏥', color: '#06b6d4' },
    { key: 'dent',   label: 'Chirurgien-dentiste',           icon: '🦷', color: '#f59e0b' },
    { key: 'ergo',   label: 'Ergothérapeute',                icon: '🖐️', color: '#ec4899' },
    { key: 'psy',    label: 'Psychologue / Psychomotricien', icon: '🧠', color: '#a855f7' },
    { key: 'labo',   label: 'Technicien de laboratoire',     icon: '🧪', color: '#14b8a6' },
    { key: 'diet',   label: 'Diététicien(ne)',               icon: '🥗', color: '#84cc16' },
    { key: 'prep',   label: 'Préparateur en pharmacie',      icon: '🧴', color: '#0ea5e9' },
    { key: 'ortho',  label: 'Orthophoniste',                 icon: '🗣️', color: '#eab308' },
    { key: 'geria',  label: 'Gériatre / EHPAD',              icon: '👴', color: '#94a3b8' },
    { key: 'admin',  label: 'Administrateur / Acheteur',     icon: '📊', color: '#64748b' },
    { key: 'cadre',  label: 'Cadre de santé',                icon: '👔', color: '#dc2626' },
  ];
  const CAT_BY_KEY = Object.fromEntries(CATS.map(c => [c.key, c]));

  // ═══════════════════════════════════════════════════════════
  //  PROMPT DATABASE — 226 prompts du catalogue Lonasanté
  //  Chaque `prompt` garde EXACTEMENT sa structure d'origine
  //  (RÔLE / MON CONTEXTE / TA MISSION / MODÈLE / RÈGLES).
  //  Seuls les [crochets] du bloc "MON CONTEXTE" sont traités
  //  comme variables à remplir.
  // ═══════════════════════════════════════════════════════════
  const BUILTIN_PROMPTS = [

    // ═════════════════════════════════════════════════════════
    //  1. MÉDECIN GÉNÉRALISTE — 12 prompts
    // ═════════════════════════════════════════════════════════
    {
      id: 'mg-1', catKey: 'mg', cat: 'Médecin généraliste', icon: '🩺', color: '#4d9fff',
      title: "Rédiger un courrier d'adressage à un spécialiste",
      prompt: `**RÔLE**
Tu es un médecin généraliste qui rédige des courriers d'adressage confraternels conformes aux usages de la profession.

**MON CONTEXTE**
- Spécialiste destinataire : [cardiologue / dermatologue / gastro-entérologue / rhumatologue / pneumologue / autre]
- Patient (anonymisé) : âge [X] ans, sexe [H/F]
- Motif : [symptômes, durée, évolution]
- Antécédents pertinents : [médicaux, chirurgicaux, familiaux]
- Traitements en cours : [DCI, posologie]
- Examens déjà réalisés : [biologie, imagerie, dates, résultats]
- Mes hypothèses diagnostiques : [liste]
- Degré d'urgence : [standard / sous 15 jours / sous 48h]
- Mes coordonnées : [Dr Nom Prénom, adresse, téléphone, RPPS]

**TA MISSION**
Rédige le courrier d'adressage complet, prêt à être imprimé sur papier à en-tête. Je dois pouvoir le copier directement dans mon traitement de texte sans rien retoucher. Pas de bullets, pas de résumé, le document fini.

**LE COURRIER À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

[En-tête : Dr Nom Prénom, spécialité, adresse, téléphone, RPPS, mail]

[Date du courrier], [Ville]

[Coordonnées du destinataire : Dr Nom, Spécialité, Adresse]

Objet : Adressage pour avis [spécialité]
Concerne : [Initiales patient], [date de naissance]

Cher Confrère, (ou Chère Consœur,)

Je me permets de vous adresser [Mr/Mme X], [âge] ans, pour [motif synthétique en une phrase].

[Paragraphe 1 - Histoire de la maladie : présenter en 4 à 6 lignes l'évolution des symptômes, leur chronologie, le retentissement fonctionnel. Phrases pleines, pas de bullets.]

[Paragraphe 2 - Antécédents pertinents : citer uniquement ce qui éclaire le tableau actuel, en prose continue. Pas de liste à puces.]

[Paragraphe 3 - Examen clinique récent : rédiger en quelques lignes les éléments objectivables. Format : « À l'examen du [date], j'ai noté... »]

[Paragraphe 4 - Examens complémentaires déjà réalisés : présenter les résultats marquants en prose, en mentionnant les dates. Si trois examens ou plus, intégrer un petit tableau à 4 colonnes (Examen / Date / Résultat / Interprétation).]

[Paragraphe 5 - Hypothèses et attentes : « Devant ce tableau évoquant [hypothèse], je sollicite votre avis sur [question précise]. Je vous serais reconnaissant de bien vouloir [examen complémentaire / prise en charge / suivi]. »]

[Paragraphe 6 - Si urgence : « Le caractère [semi-urgent / urgent] de la situation justifierait une consultation dans les [délai]. »]

Je reste à votre disposition pour tout complément d'information.

Je vous prie d'agréer, Cher Confrère (ou Chère Consœur), l'expression de mes salutations confraternelles.

[Signature : Dr Nom Prénom]

P.J. : [liste des documents joints : copie biologie du JJ/MM/AAAA, compte-rendu radiologique, etc.]

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets. Le seul élément en tableau autorisé : les résultats d'examens si trois ou plus.
- Longueur cible : une demi-page A4 (250 à 350 mots de corps)
- Pas de phrases de remplissage type « Je vous remercie par avance »
- Vocabulaire médical adapté au confrère destinataire
- Si une donnée manque dans mon contexte (motif, hypothèse, urgence), demande-la-moi avant de rédiger`
    },
    {
      id: 'mg-2', catKey: 'mg', cat: 'Médecin généraliste', icon: '🩺', color: '#4d9fff',
      title: 'Expliquer un diagnostic complexe en langage patient',
      prompt: `**RÔLE**
Tu es un médecin généraliste habitué à expliquer des diagnostics à des patients non médecins. Tu écris pour être lu à voix haute en consultation.

**MON CONTEXTE**
- Diagnostic à expliquer : [diabète type 2 / hypothyroïdie / HTA / fibrillation auriculaire / BPCO / IRC / autre]
- Profil patient : âge [X] ans, niveau de compréhension [bon / moyen / faible]
- Contexte émotionnel : [inquiet / dans le déni / motivé / résigné / en colère]
- Particularités : [analphabétisme / non francophone / déficience cognitive légère / aucune]
- Temps disponible en consultation : [5 / 10 / 15 minutes]

**TA MISSION**
Rédige le texte parlé que je vais dire à mon patient. Pas de slide, pas de bullets, pas de plan. Un monologue rédigé en phrases complètes, naturel à dire, qui couvre les cinq questions implicites du patient.

**LE TEXTE À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

[Paragraphe d'ouverture - 2 phrases]
Commence par poser le contexte de la conversation : « Je voulais qu'on prenne le temps de parler de ce que j'ai trouvé. Vous avez ce qu'on appelle [maladie en termes simples]. »

[Paragraphe « Qu'est-ce que c'est exactement »]
Trois à quatre phrases qui expliquent la maladie avec une analogie concrète tirée de la vie quotidienne. Exemple pour le diabète type 2 : « Imaginez votre sang comme une rivière. Le sucre, lui, c'est l'énergie qu'il transporte aux muscles. Chez vous, le sucre n'arrive plus à entrer correctement dans les cellules, alors il s'accumule dans la rivière. C'est ça, le diabète. » Pas de jargon. Pas de chiffre médical.

[Paragraphe « Pourquoi vous »]
Trois à quatre phrases. Causes principales en termes simples, déculpabilisation si nécessaire. « Ce n'est ni de votre faute, ni un hasard total. Plusieurs choses jouent : [facteur 1], [facteur 2], la part héréditaire. »

[Paragraphe « Qu'est-ce que ça veut dire pour vous »]
Trois à cinq phrases. Pronostic honnête, ni alarmiste ni minimisant. Toujours finir par une phrase rassurante. « Bien suivi, ce n'est pas une maladie qui empêche de vivre normalement. »

[Paragraphe « Ce qu'on va faire ensemble »]
Quatre à cinq phrases qui présentent : le médicament principal et à quoi il sert (en termes simples), le rythme de suivi prévu, les examens à venir et leur but. « Je vais vous prescrire [traitement]. Son rôle, c'est de [action concrète]. On se reverra dans [délai] pour [objectif]. »

[Paragraphe « Ce que vous pouvez faire vous-même »]
Trois à cinq actions concrètes et réalistes, formulées au sein d'un paragraphe naturel. Pas « faites du sport » mais « marchez 30 minutes après le déjeuner, 5 jours sur 7 ». Termine par : « Vous voyez, c'est progressif. On y va à votre rythme. »

[Phrase de clôture]
Une phrase qui ouvre l'échange : « Avant qu'on continue, qu'est-ce qui n'est pas clair pour vous ? »

**RÈGLES DE RÉDACTION**
- Tout en prose continue, naturel à dire à voix haute. Aucune liste à puces dans le rendu final.
- Vocabulaire niveau CE2-CM1. Si un terme médical est inévitable, explique-le entre parenthèses.
- Pas de chiffres compliqués (pas « HbA1c à 8,2 % » mais « votre sucre est trop haut depuis longtemps »)
- Pas de « il convient de », « il est important de ». Style parlé, vouvoiement.
- Inclure une phrase rassurante dans chaque paragraphe.
- Longueur totale : 250 à 350 mots (ce qui correspond à 3 à 4 minutes de parole posée)
- Si le contexte (profil, émotion) manque, demande avant de rédiger.`
    },
    {
      id: 'mg-3', catKey: 'mg', cat: 'Médecin généraliste', icon: '🩺', color: '#4d9fff',
      title: 'Créer un protocole de suivi pour pathologie chronique',
      prompt: `**RÔLE**
Tu es un médecin généraliste expert en suivi de pathologies chroniques. Tu connais les recommandations HAS et tu rédiges des protocoles opérationnels utilisables au cabinet.

**MON CONTEXTE**
- Pathologie : [diabète type 2 / HTA / BPCO / insuffisance cardiaque / dyslipidémie / autre]
- Profil patient cible : [adulte / sujet âgé / patient polypathologique / femme enceinte]
- Mode d'exercice : [cabinet seul / MSP / centre de santé]
- Outil de suivi disponible : [logiciel métier / dossier papier / application patient]
- Objectif : [structurer mon suivi / former une remplaçante / faire valider en groupe de pairs]

**TA MISSION**
Rédige le protocole de suivi complet, prêt à imprimer en fiche A4 recto-verso. Document structuré en sections nommées avec contenu en prose et un tableau central de planification. Pas de bullets résumant la démarche : produis directement le document opérationnel.

**LE PROTOCOLE À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
PROTOCOLE DE SUIVI - [Nom de la pathologie]
Cabinet du Dr [Nom] - Version [date]
═══════════════════════════════════════════════

**1. Patients concernés**
[Paragraphe rédigé décrivant la population cible : critères d'inclusion, critères d'exclusion, particularités du profil. 4 à 6 lignes.]

**2. Référentiel utilisé**
[Citer la recommandation HAS de référence avec date, et les éventuelles sociétés savantes. 2 à 3 lignes.]

**3. Bilan initial à réaliser**
[Paragraphe d'introduction en 2 lignes, puis liste numérotée des examens à prévoir au diagnostic, avec justification clinique pour chaque. Format : « 1. [Examen]. Objectif : [pourquoi]. Délai : [quand]. »]

**4. Calendrier de suivi - tableau opérationnel**

Tableau à 5 colonnes prêt à utiliser :

| Échéance | Consultation | Examens biologiques | Examens spécialisés | Points de vigilance |
|---|---|---|---|---|
| M0 (diagnostic) | ... | ... | ... | ... |
| M3 | ... | ... | ... | ... |
| M6 | ... | ... | ... | ... |
| M12 (annuel) | ... | ... | ... | ... |
| Annuel par la suite | ... | ... | ... | ... |

**5. Objectifs thérapeutiques cibles**
[Paragraphe rédigé qui présente les cibles de référence (ex. HbA1c, PA, LDL) en citant la recommandation HAS, avec adaptation possible selon le profil patient. 6 à 8 lignes.]

**6. Critères d'adressage en spécialité**
[Paragraphe rédigé qui liste, en phrases pleines, les situations imposant l'avis du spécialiste. 5 à 7 situations.]

**7. Éducation thérapeutique du patient**
[Paragraphe qui détaille les messages clés à transmettre, les outils disponibles, et les indicateurs d'observance. 5 à 6 lignes.]

**8. Coordination des soins**
[Paragraphe qui précise le rôle de chaque acteur : IDE, pharmacien, kiné, diététicienne. En phrases pleines.]

**9. Mise à jour**
[Date de prochaine révision, fréquence prévue. 2 lignes.]

═══════════════════════════════════════════════
Validé le [date] - À revoir le [date + 12 mois]
═══════════════════════════════════════════════

**RÈGLES DE RÉDACTION**
- Sections rédigées en prose. Le seul tableau autorisé : le calendrier de suivi.
- Vocabulaire médical professionnel
- Citations HAS précises (titre, année). Pas d'invention de référence.
- Longueur cible : 1 à 1,5 page A4
- Ton factuel et opérationnel
- Si la pathologie n'est pas précisée, demande avant de rédiger`
    },
    {
      id: 'mg-4', catKey: 'mg', cat: 'Médecin généraliste', icon: '🩺', color: '#4d9fff',
      title: "Aide à la cotation CCAM / NGAP d'un acte complexe",
      prompt: `**RÔLE**
Tu es un médecin généraliste qui maîtrise la nomenclature NGAP et CCAM, les règles de cumul et les majorations applicables.

**MON CONTEXTE**
- Acte ou consultation à coter : [description précise de la séance]
- Spécialité du praticien : [généraliste / médecin coordonnateur / autre]
- Lieu : [cabinet / domicile / EHPAD / hospitalisation à domicile]
- Horaire : [jour ouvrable / nuit / dimanche / férié]
- Profil patient : [enfant < 6 ans / adulte / patient ALD / patient en zone sous-dense]
- Particularités de la séance : [acte technique réalisé / examens complémentaires / consultation longue ALD / coordination pluri-professionnelle]

**TA MISSION**
Rédige une fiche de cotation prête à utiliser, qui me donne en clair la cotation correcte avec ses justifications. Pas de cours théorique : la fiche pratique opérationnelle.

**LA FICHE À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
FICHE DE COTATION - [type d'acte]
═══════════════════════════════════════════════

**1. Cotation recommandée**
[Une ligne synthétique : code(s) + libellé(s) + montant total.]

**2. Détail des codes utilisés**

| Code | Libellé NGAP/CCAM | Montant unitaire | Conditions d'application |
|---|---|---|---|
| ... | ... | ... | ... |

**3. Justification de la cotation**
[Paragraphe rédigé, 5 à 8 lignes, citant les règles applicables.]

**4. Cotations alternatives (si plusieurs options possibles)**
[Sinon, écrire « Cotation unique défendable. ».]

**5. Pièges à éviter dans cette situation**
[4 à 6 lignes : cumuls interdits, oublis de majoration, justification documentaire insuffisante.]

**6. Justification documentaire à conserver**
[3 à 5 lignes : ce qu'il faut tracer dans le dossier patient.]

**7. Sources réglementaires**
[Liste numérotée de 2 à 4 sources : Convention médicale, NGAP, CCAM, fiches Ameli pro.]

═══════════════════════════════════════════════

**RÈGLES DE RÉDACTION**
- Toutes les sections en prose continue, sauf le tableau central des codes.
- Citer les références réglementaires exactes
- Si tu n'es pas certain d'une cotation, écris-le explicitement et invite à vérifier sur ameli.fr
- Ne jamais inventer un code
- Si le contexte ne précise pas un élément critique (zone, horaire, ALD), demande-le avant de rédiger`
    },
    {
      id: 'mg-5', catKey: 'mg', cat: 'Médecin généraliste', icon: '🩺', color: '#4d9fff',
      title: 'Rédiger un certificat médical (modèle)',
      prompt: `**RÔLE**
Tu es un médecin généraliste qui rédige des certificats médicaux conformes aux règles déontologiques du Conseil de l'Ordre. Tu connais les obligations médico-légales et tu refuses les certificats de complaisance.

**MON CONTEXTE**
- Type de certificat demandé : [aptitude au sport / non contre-indication / dispense scolaire / coups et blessures / certificat initial accident travail / arrêt de travail / autre]
- Demandeur : [le patient lui-même / un tiers / l'employeur / l'administration]
- Patient : [identité, âge]
- Constatations objectives à mentionner : [examen clinique, antécédents pertinents]
- Usage prévu du certificat : [à qui il sera remis]
- Mes coordonnées : [Dr Nom Prénom, RPPS, adresse]

**TA MISSION**
Rédige le certificat médical complet, prêt à être imprimé sur ordonnance, signé et tamponné. Document fini, pas un guide de rédaction.

**LE CERTIFICAT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

[En-tête imprimé : Dr Nom Prénom, qualité, adresse, téléphone, RPPS]

CERTIFICAT MÉDICAL

Je soussigné(e), Dr [Nom Prénom], docteur en médecine, certifie avoir examiné ce jour, [date d'examen],

[Nom Prénom du patient], né(e) le [date de naissance], demeurant [adresse],

[Paragraphe central - constatations rédigées en prose à la première personne du singulier, adaptées au type de certificat demandé, strictement factuel, sans imputer une cause au-delà de ce que dit le patient.]

[Mention finale obligatoire]
« Certificat établi à la demande de [le patient lui-même / le représentant légal] et remis en main propre, pour faire valoir ce que de droit. »

Fait à [Ville], le [date]

[Signature manuscrite + cachet du praticien]

**RÈGLES DE RÉDACTION**
- Aucune mention de tiers nommé sauf si la loi l'exige
- Aucune imputation causale (ne pas écrire « agressé par M. X » mais « selon les déclarations du patient... »)
- Aucune affirmation médicale au-delà de ce qui a été constaté objectivement
- Vouvoiement à la première personne (« Je soussigné »)
- Mention « remis en main propre » obligatoire
- Pas de bullets dans le certificat (document juridique en prose)
- Si le type de certificat n'est pas clair ou la demande paraît douteuse, refuse poliment et propose une alternative
- Pour un arrêt de travail, rappeler que le CERFA dédié est obligatoire`
    },
    {
      id: 'mg-6', catKey: 'mg', cat: 'Médecin généraliste', icon: '🩺', color: '#4d9fff',
      title: 'Préparer une présentation pour un groupe de pairs (15 min)',
      prompt: `**RÔLE**
Tu es un médecin généraliste qui anime régulièrement des groupes de pairs et de FMC. Tu sais structurer une présentation interactive de 15 minutes qui suscite la discussion.

**MON CONTEXTE**
- Sujet à présenter : [pathologie / situation clinique / nouveau référentiel / cas complexe]
- Public : [médecins généralistes / équipe pluri-professionnelle / internes]
- Effectif : [4 à 8 / 8 à 15 / plus de 15]
- Durée : 15 minutes de présentation + 15 minutes de discussion
- Objectif : [partager un cas / actualiser sur un référentiel / valider une pratique / présenter un protocole]
- Support souhaité : [diaporama / fiche A4 / cas oral sans support]

**TA MISSION**
Rédige le script complet de la présentation orale, dans l'ordre où je vais le dire. Le texte parlé, ponctué de pauses, de questions au groupe et d'instructions de support visuel.

**LE SCRIPT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
SCRIPT DE PRÉSENTATION - [Sujet]
Durée : 15 minutes - Discussion : 15 minutes
═══════════════════════════════════════════════

**[Minute 0-1] Ouverture (60 secondes)**
[Accroche + question au groupe. Slide 1.]

**[Minute 1-3] Le cas ou la situation déclenchante (2 minutes)**
[Cas clinique court en 4 à 6 phrases + pause de 30 secondes pour réaction du groupe. Slide 2.]

**[Minute 3-7] Repères de pratique (4 minutes)**
[Recommandations en vigueur, 3 à 4 paragraphes oraux, source citée précisément. Slides 3-4.]

**[Minute 7-10] Retour au cas et débriefing (3 minutes)**
[Suite réelle du cas, choix faits, alternatives défendables, autocritique. Slide 5.]

**[Minute 10-13] Trois messages à retenir (3 minutes)**
[Trois messages courts, 2 à 3 phrases chacun. Slide 6.]

**[Minute 13-15] Question lancée au groupe (2 minutes)**
[Deux questions ouvertes pour amorcer la discussion. Slide 7.]

═══════════════════════════════════════════════

**ANNEXE : DOCUMENT REMIS AU GROUPE EN FIN DE SÉANCE**
[Fiche A4 recto-verso résumant les 3 messages clés, l'arbre décisionnel et les références bibliographiques.]

**RÈGLES DE RÉDACTION**
- Tout en prose parlée. Les bullets uniquement dans la fiche A4 finale.
- Inclure des pauses, questions au groupe, anecdotes courtes
- Citer les sources précisément. Pas d'invention.
- Longueur du script : 1500 à 2000 mots
- Si le sujet n'est pas précisé, demande-le avant de rédiger`
    },
    {
      id: 'mg-7', catKey: 'mg', cat: 'Médecin généraliste', icon: '🩺', color: '#4d9fff',
      title: 'Rédiger une réponse à un patient mécontent',
      prompt: `**RÔLE**
Tu es un médecin généraliste qui sait gérer les patients mécontents avec professionnalisme. Tu connais les principes de communication non-violente et les règles juridiques (pas d'aveu de faute, pas d'admission de responsabilité avant analyse).

**MON CONTEXTE**
- Nature de la plainte : [retard / refus de soins / désaccord sur le diagnostic / facture / attitude perçue comme désagréable / autre]
- Forme reçue : [courrier postal / mail / message vocal / oral en consultation]
- Demande explicite du patient : [excuses / explications / remboursement / changer de médecin / aller au Conseil de l'Ordre]
- Position défendable de mon côté : [erreur réelle / malentendu / pratique conforme / écart sans gravité]
- Antériorité de la relation : [patient récent / patient suivi depuis X années]
- Mes coordonnées : [Dr Nom, adresse]

**TA MISSION**
Rédige le courrier de réponse complet et prêt à envoyer. Le courrier fini, en prose, signable en l'état.

**LE COURRIER À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

[En-tête : Dr Nom Prénom, adresse, téléphone, RPPS]

[Date], [Ville]

[Coordonnées du patient]

Objet : Suite à votre [courrier / message / conversation] du [date]

Madame, Monsieur,

[Paragraphe 1 - Accusé de réception et reconnaissance du ressenti, sans aveu de faute. 3 à 4 lignes.]

[Paragraphe 2 - Reformulation neutre des faits tels qu'ils se sont déroulés du côté du médecin. 5 à 8 lignes.]

[Paragraphe 3 - Adapté à la position défendable : reconnaissance précise si erreur réelle, ou explication du raisonnement médical si pratique conforme.]

[Paragraphe 4 - Proposition concrète de la suite. 3 à 4 lignes.]

[Paragraphe 5 - Information neutre sur les recours possibles (Conseil de l'Ordre, CCI). 2 à 3 lignes.]

Je vous prie de croire, Madame, Monsieur, en l'expression de mes sincères salutations.

[Signature : Dr Nom Prénom]

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets. Aucun bullet.
- Vouvoiement constant. Ton calme, factuel, jamais défensif ni accusatoire.
- Aucun aveu général de responsabilité. Reconnaître uniquement un fait précis si reconnu.
- Reformulation neutre des faits invoqués par le patient
- Mention des voies de recours systématique
- Si la plainte est grave, recommander de contacter sa RCP avant d'envoyer
- Si une information manque, demande-la avant de rédiger`
    },
    {
      id: 'mg-8', catKey: 'mg', cat: 'Médecin généraliste', icon: '🩺', color: '#4d9fff',
      title: "Tableau de synthèse et révision d'ordonnance",
      prompt: `**RÔLE**
Tu es un médecin généraliste expert en révision d'ordonnance. Tu maîtrises la pharmacologie clinique et tu repères les redondances, interactions et adaptations posologiques.

**MON CONTEXTE**
- Patient : [âge, sexe, poids, clairance estimée si connue]
- Pathologies : [liste exhaustive avec dates de diagnostic]
- Ordonnance actuelle complète : [DCI, dosage, posologie, durée, prescripteur initial]
- Allergies / intolérances connues : [liste]
- Fonction rénale : [DFG estimé / inconnu]
- Fonction hépatique : [normale / altérée]
- Objectif de la révision : [adhésion / interactions / adaptation âge / déprescription]

**TA MISSION**
Rédige le document de synthèse thérapeutique complet, exploitable en consultation et copiable dans le dossier patient.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
RÉVISION D'ORDONNANCE - [Initiales patient]
Date de la révision : [date]
═══════════════════════════════════════════════

**1. Profil patient en synthèse**
[4 à 6 lignes.]

**2. Tableau de synthèse de l'ordonnance actuelle**

| DCI | Dosage | Posologie | Indication | Adaptation rénale ? | Avis |
|---|---|---|---|---|---|

**3. Interactions médicamenteuses identifiées**
[Un paragraphe par interaction : molécules, niveau de risque, mécanisme, conduite à tenir. Si aucune, l'écrire.]

**4. Redondances thérapeutiques**
[Si aucune, l'écrire.]

**5. Adaptations posologiques recommandées**
[4 à 8 lignes, référence Vidal / sources officielles.]

**6. Propositions de déprescription**
[Argumenter chaque proposition en 2 à 3 lignes. Si aucune, l'écrire.]

**7. Plan d'action pour la consultation**
[3 à 5 actions concrètes, numérotées.]

**8. Sources consultées**
[Vidal, ANSM, HAS, Thériaque, Stockley. Pas d'invention de référence.]

═══════════════════════════════════════════════

**RÈGLES DE RÉDACTION**
- Sections en prose, sauf le tableau central de synthèse de l'ordonnance.
- Citer la source pour chaque interaction ou contre-indication signalée
- Si une donnée critique manque, demander avant de rédiger
- Ne jamais affirmer une recommandation sans source vérifiable
- Vocabulaire médical professionnel`
    },
    {
      id: 'mg-9', catKey: 'mg', cat: 'Médecin généraliste', icon: '🩺', color: '#4d9fff',
      title: 'Créer un questionnaire de pré-consultation',
      prompt: `**RÔLE**
Tu es un médecin généraliste qui veut optimiser le temps de consultation grâce à un recueil structuré d'informations en salle d'attente.

**MON CONTEXTE**
- Type de consultation visée : [première consultation / consultation de suivi annuel / consultation pédiatrique / consultation gynécologique / consultation gériatrique / autre]
- Profil patient : [adulte / personne âgée / enfant accompagné / adolescent / patient ALD]
- Mode de remplissage : [papier en salle d'attente / tablette numérique / formulaire en ligne avant le RDV]
- Temps de remplissage cible : [3 / 5 / 10 minutes]
- Objectif : [gagner 5 min de consultation / repérer les patients à risque / améliorer la traçabilité]

**TA MISSION**
Rédige le questionnaire complet, prêt à imprimer ou à intégrer dans un formulaire. Toutes les questions formulées, pas un plan de questionnaire.

**LE QUESTIONNAIRE À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
QUESTIONNAIRE DE PRÉ-CONSULTATION
Cabinet du Dr [Nom] - [type de consultation]
Temps estimé : [X] minutes
═══════════════════════════════════════════════

[Note d'introduction : 3 à 4 lignes expliquant l'utilité du questionnaire et la confidentialité.]

**Section 1 - Identité et contexte**
**Section 2 - Motif principal de la consultation**
**Section 3 - Antécédents médicaux**
**Section 4 - Traitements et allergies**
**Section 5 - Mode de vie**
**Section 6 - Section optionnelle selon le type de consultation** (gériatrique / gynécologique / pédiatrique)
**Section 7 - Avant de venir**

[Rédiger chaque question en clair, avec format de réponse adapté : case à cocher, ligne libre, échelle.]

═══════════════════════════════════════════════
Merci pour votre temps. Le Dr [Nom] reprendra ces éléments avec vous.
═══════════════════════════════════════════════

**RÈGLES DE RÉDACTION**
- Toutes les questions formulées en clair, pas en libellé technique
- Mélange de QCM et de questions ouvertes selon ce qui est utile
- Vouvoiement, ton chaleureux, vocabulaire grand public
- Mention RGPD obligatoire en pied de page
- Si le type de consultation n'est pas précisé, demande-le avant de rédiger`
    },
    {
      id: 'mg-10', catKey: 'mg', cat: 'Médecin généraliste', icon: '🩺', color: '#4d9fff',
      title: 'Synthétiser une recommandation HAS en fiche pratique',
      prompt: `**RÔLE**
Tu es un médecin généraliste en formation continue. Tu sais extraire d'une recommandation HAS l'information opérationnelle utile en consultation, en éliminant le superflu.

**MON CONTEXTE**
- Recommandation HAS à synthétiser : [titre exact + année]
- Pathologie ou situation clinique concernée : [...]
- Mon usage : [aide-mémoire de consultation / présentation FMC / mise à jour personnelle]
- Niveau de détail souhaité : [synthèse 1 page / fiche détaillée 2 pages]
- Public destinataire (si autre que moi) : [moi-même / équipe MSP / interne]

**TA MISSION**
Rédige la fiche-mémo complète, prête à imprimer en A4. Document fini, structuré, exploitable d'un coup d'œil en consultation.

**LA FICHE À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
FICHE PRATIQUE - [Pathologie]
Source : Recommandation HAS [titre exact, année]
═══════════════════════════════════════════════

**1. À retenir en 5 lignes**
**2. Quand y penser - critères diagnostiques**
**3. Bilan initial recommandé**
**4. Prise en charge - ce qui change concrètement**

| Situation | Conduite à tenir | Référence dans la reco |
|---|---|---|
| 1ère intention | ... | § X.X |
| 2ème intention | ... | § X.X |
| Échec ou complication | ... | § X.X |

**5. Cibles thérapeutiques chiffrées**
**6. Ce qui est nouveau par rapport à la version précédente**
**7. Pièges à éviter en pratique courante**
**8. Critères d'adressage en spécialité**
**9. Pour aller plus loin**

═══════════════════════════════════════════════
Fiche réalisée le [date] - À actualiser à la prochaine version de la reco
═══════════════════════════════════════════════

**RÈGLES DE RÉDACTION**
- Sections en prose, sauf le tableau central de prise en charge
- Citer les chiffres exacts tels qu'ils figurent dans la HAS
- Pas d'extrapolation au-delà de ce que dit la recommandation
- Si la reco précise n'est pas indiquée, demander avant de rédiger
- Indiquer la date de version de la reco utilisée`
    },
    {
      id: 'mg-11', catKey: 'mg', cat: 'Médecin généraliste', icon: '🩺', color: '#4d9fff',
      title: 'Optimiser la gestion des créneaux de consultation',
      prompt: `**RÔLE**
Tu es un médecin généraliste libéral qui a optimisé son planning. Tu connais les techniques pour réduire les retards, le no-show et augmenter la rentabilité sans dégrader la qualité.

**MON CONTEXTE**
- Mode d'exercice : [seul / cabinet de groupe / MSP]
- Volume actuel de consultations : [N par jour]
- Durée moyenne par consultation : [10 / 15 / 20 / 25 minutes]
- Outil de prise de RDV : [Doctolib / Mondoctor / Maiia / agenda papier / standard téléphonique]
- Problèmes identifiés : [retards systématiques / pic de demandes le matin / no-show élevé / consultations en débordement / fatigue en fin de journée]
- Objectif : [réduire les retards / augmenter la file active / mieux répartir la charge / dégager du temps administratif]

**TA MISSION**
Rédige le plan d'action complet, prêt à mettre en œuvre dès la semaine prochaine. Le plan opérationnel concret.

**LE PLAN À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
PLAN D'OPTIMISATION DU PLANNING
Cabinet du Dr [Nom] - Semaine du [date]
═══════════════════════════════════════════════

**1. Diagnostic actuel**
**2. Trame hebdomadaire cible** (tableau 7 jours x plages horaires)
**3. Règles de répartition**
**4. Mesures contre le no-show**
**5. Mesures contre les retards**
**6. Plages administratives sanctuarisées**
**7. Indicateurs à suivre sur 3 mois**
**8. Plan de mise en œuvre - 4 semaines**

═══════════════════════════════════════════════

**RÈGLES DE RÉDACTION**
- Sections en prose, sauf le tableau central de planning hebdomadaire
- Mesures réalistes et contextualisées au mode d'exercice
- Pas d'objectif chiffré irréaliste
- Si le contexte ne précise pas le volume actuel ou les outils, demander avant de rédiger
- Penser au bien-être du praticien et pas seulement à la rentabilité`
    },
    {
      id: 'mg-12', catKey: 'mg', cat: 'Médecin généraliste', icon: '🩺', color: '#4d9fff',
      title: 'Transformer des notes brutes en compte-rendu structuré',
      prompt: `**RÔLE**
Tu es un médecin généraliste expérimenté en rédaction de comptes-rendus médicaux. Tu transformes des notes manuscrites ou dictées en compte-rendu professionnel et structuré, sans rien inventer.

**MON CONTEXTE**
- Type de consultation : [première consultation / suivi / téléconsultation / visite à domicile / consultation pré-opératoire / autre]
- Patient (anonymisé) : âge, sexe
- Motif de consultation : [...]
- Mes notes brutes (à transformer) : [coller tel quel le bloc de notes manuscrites ou dictées, même incomplet, mal orthographié, avec abréviations]
- Destinataire du compte-rendu : [dossier patient interne / médecin spécialiste / médecin du travail / autre]
- Niveau de confidentialité : [usage interne / transmission externe]

**TA MISSION**
Rédige le compte-rendu complet, mis au propre, structuré en sections, prêt à être collé dans le dossier patient.

**LE COMPTE-RENDU À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

[En-tête : Dr Nom Prénom, qualité, RPPS, adresse cabinet, téléphone]

COMPTE-RENDU DE CONSULTATION

Patient : [Initiales / Numéro dossier]
Date de naissance : [JJ/MM/AAAA]
Date de la consultation : [JJ/MM/AAAA] - Durée : [X] minutes
Type : [première consultation / suivi / téléconsultation]

**Motif de consultation**
**Histoire de la maladie**
**Antécédents pertinents**
**Traitements en cours**
**Examen clinique**
**Examens complémentaires apportés ou prescrits**
**Synthèse et hypothèses diagnostiques**
**Conduite à tenir**
**Information donnée au patient**
**Prochaine échéance**

[Signature : Dr Nom Prénom]

**RÈGLES DE RÉDACTION**
- Tout en prose médicale continue. Pas de bullets, pas de listes à puces.
- Reformuler les abréviations des notes brutes (ex. « TA 14/9 » → « tension artérielle à 140/90 mmHg »)
- Ne RIEN ajouter qui ne soit pas dans les notes brutes. Rubrique non documentée → « Non documenté ce jour. »
- Vocabulaire médical professionnel
- Longueur cible : 1 page A4 (350 à 500 mots)
- Si les notes brutes sont incomplètes ou ambiguës, demander avant de rédiger`
    },

    // ═════════════════════════════════════════════════════════
    //  2. INFIRMIER(ÈRE) IDE — 12 prompts
    // ═════════════════════════════════════════════════════════
    {
      id: 'ide-1', catKey: 'ide', cat: 'Infirmier(ère) IDE', icon: '💉', color: '#2dd4bf',
      title: 'Rédiger un BSI (Bilan de Soins Infirmiers)',
      prompt: `**RÔLE**
Tu es infirmier(ère) libéral(e) qui rédige des BSI conformes au modèle Assurance Maladie.

**MON CONTEXTE**
- Patient : âge [X] ans, sexe [H/F]
- Pathologies : [liste]
- Niveau d'autonomie : [autonome / partiellement dépendant / totalement dépendant - préciser pour quoi]
- Entourage : [vit seul / avec conjoint / aide à domicile X h/sem / famille présente]
- Soins nécessaires : [liste détaillée]
- Environnement : [étage sans ascenseur, salle de bain non accessible...]

**TA MISSION**
Rédige le BSI complet rempli avec mes informations, prêt à être saisi dans amelipro. Le BSI fini, en prose médicale.

**LE BSI À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
BILAN DE SOINS INFIRMIERS
Patient : [Initiales] - Date du bilan : [date]
═══════════════════════════════════════════════

**Volet 1 - Données administratives et cliniques**
[4 à 6 lignes.]

**Volet 2 - Évaluation des besoins**
Pour chacun des 6 domaines (Habillage, Locomotion, Alimentation, Élimination, Hygiène corporelle, Comportement/relation/communication) : description en 3-4 lignes de ce que le patient peut faire seul / ce qui nécessite une aide, puis score motivé de 1 (autonome) à 4 (totalement dépendant).

**Volet 3 - Plan de soins et classification**
[Actes infirmiers nécessaires, fréquence, durée par passage. Puis proposition de classement BSI léger/intermédiaire/lourd, justifiée par les scores et la charge en soins.]

═══════════════════════════════════════════════
Signature et tampon de l'IDEL
═══════════════════════════════════════════════

**RÈGLES DE RÉDACTION**
- Sections rédigées en prose, pas en bullets
- Vocabulaire médical mais accessible à un contrôleur CPAM
- Justifier chaque score (un score sans justification fait rejeter le BSI)
- Cohérence entre les scores et la classification proposée
- Si une donnée critique manque, demander avant de rédiger`
    },
    {
      id: 'ide-2', catKey: 'ide', cat: 'Infirmier(ère) IDE', icon: '💉', color: '#2dd4bf',
      title: 'Créer une fiche de surveillance post-opératoire',
      prompt: `**RÔLE**
Tu es infirmier(ère) en service de chirurgie qui crée des fiches de surveillance post-opératoire opérationnelles.

**MON CONTEXTE**
- Service : [viscérale / orthopédique / cardiaque / urologique]
- Intervention : [cholécystectomie / PTH / appendicectomie / pontage / prostatectomie]
- Patient : âge [X] ans, antécédents [liste]
- Anesthésie : [AG / rachianesthésie / locale]
- Heure de retour de bloc : [heure]

**TA MISSION**
Produis la fiche de surveillance complète, prête à imprimer en A4 et à remplir au stylo au lit du patient.

**LA FICHE À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
FICHE DE SURVEILLANCE POST-OPÉRATOIRE
Patient : [Initiales] - Intervention : [acte] - Bloc : [heure]
═══════════════════════════════════════════════

**Grille horaire des paramètres vitaux**
Tableau : Heure (H0, H1, H2, H4, H6, H12, H24, H48) × TA, FC, FR, SpO2, T°, EVA, Score sédation, Diurèse.

**Surveillance spécifique à l'intervention**
[Drainage, pansement, miction, mobilisation, reprise alimentaire. 6 à 8 lignes.]

**Prescriptions post-opératoires courantes**
[Antalgiques, anticoagulant, reprise alimentaire, mobilisation. 5 à 6 lignes.]

**Signes d'alerte par appareil et conduite à tenir**
[Hémorragie, détresse respiratoire, chute tensionnelle, fièvre > 38,5°C, douleur incontrôlée : signes, action, qui prévenir.]

═══════════════════════════════════════════════
Signature de l'IDE en charge - Date :
═══════════════════════════════════════════════

**RÈGLES DE RÉDACTION**
- Sections en prose, sauf le tableau central horaire
- Adapter aux particularités de l'acte
- Vocabulaire médical professionnel
- Si l'intervention n'est pas précisée, demander avant de rédiger`
    },
    {
      id: 'ide-3', catKey: 'ide', cat: 'Infirmier(ère) IDE', icon: '💉', color: '#2dd4bf',
      title: 'Préparer une transmission ciblée (format DAR)',
      prompt: `**RÔLE**
Tu es IDE qui rédige des transmissions ciblées au format DAR pour la relève.

**MON CONTEXTE**
- Service : [médecine / chirurgie / EHPAD / psychiatrie / urgences]
- Patient : âge [X] ans, motif d'hospitalisation
- Mes observations brutes de la journée : [coller tel quel le bloc d'observations]

**TA MISSION**
Rédige les 2 à 3 transmissions ciblées finies, en prose médicale, prêtes à être saisies dans le logiciel de soins.

**LES TRANSMISSIONS À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

Pour chaque cible identifiée à partir des observations brutes :

═══════════════════════════════════════════════
**Cible : [intitulé court - douleur, plaie, sommeil, etc.]**

D - Données
[3 à 4 lignes : observations objectives, ce que le patient a dit, depuis quand.]

A - Actions
[3 à 4 lignes : ce que j'ai fait, ce que le médecin a prescrit, à quelle heure.]

R - Résultats
[2 à 3 lignes : effet des actions, nouvelle évaluation, situation à transmettre.]
═══════════════════════════════════════════════

**RÈGLES DE RÉDACTION**
- Tout en prose médicale continue, pas de bullets
- Une cible = un sujet clinique distinct
- Formulations factuelles : « le patient signale » et non « le patient se plaint de »
- 5 à 8 lignes maximum par transmission
- Pas d'opinion, pas d'interprétation médicale
- Si les observations brutes sont absentes, demander avant de rédiger`
    },
    {
      id: 'ide-4', catKey: 'ide', cat: 'Infirmier(ère) IDE', icon: '💉', color: '#2dd4bf',
      title: "Calculer la rentabilité d'une tournée IDEL",
      prompt: `**RÔLE**
Tu es infirmier(ère) libéral(e) qui maîtrise la cotation NGAP et le calcul de rentabilité.

**MON CONTEXTE**
- Zone d'exercice : [urbaine / semi-rurale / rurale / sous-dotée]
- Statut : [seul(e) / en cabinet de X IDE]
- Tournée du matin (7h-12h) : [lister chaque patient avec ses actes et l'heure]
- Distances entre patients : [estimations en km]

**TA MISSION**
Produis le rapport de rentabilité complet et chiffré, prêt à être présenté à un comptable ou utilisé pour mes décisions de gestion.

**LE RAPPORT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
RAPPORT DE RENTABILITÉ - TOURNÉE TYPE
Cabinet de [Nom] - Date : [date]
═══════════════════════════════════════════════

**1. Décomposition de la tournée et chiffre d'affaires brut**
Tableau : Heure | Patient | Acte 1 | Acte 2 | Cumul appliqué | IFD/IK | Sous-total, + ligne TOTAL.

**2. Projection mensuelle et annuelle**
**3. Charges mensuelles** (URSSAF, CARPIMKO, RCP, frais véhicule, logiciel, Ordre, formation)
**4. Bénéfice net estimé**
**5. Pistes d'optimisation**

═══════════════════════════════════════════════

**RÈGLES DE RÉDACTION**
- Tableau central pour la décomposition, prose pour les sections d'analyse
- Citer les valeurs NGAP en vigueur (vérifier sur ameli.fr/infirmier)
- Pas d'invention de tarifs : si une valeur est incertaine, le mentionner
- Si la tournée n'est pas détaillée, demander avant de calculer`
    },
    {
      id: 'ide-5', catKey: 'ide', cat: 'Infirmier(ère) IDE', icon: '💉', color: '#2dd4bf',
      title: 'Rédiger un protocole de soins infirmiers',
      prompt: `**RÔLE**
Tu es infirmier(ère) qui rédige des protocoles de service conformes au décret R4311 du CSP.

**MON CONTEXTE**
- Soin à protocoliser : [pose de perfusion sous-cutanée / sondage urinaire / pansement VAC / injection insuline stylo / prélèvement sur cathéter central / pose SNG]
- Cadre d'utilisation : [service hospitalier / libéral / encadrement étudiants]
- Référentiel : [recommandations société savante / protocole institutionnel]

**TA MISSION**
Rédige le protocole complet, prêt à être validé par le cadre et le médecin chef puis intégré au classeur de protocoles.

**LE PROTOCOLE À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
PROTOCOLE DE SOINS INFIRMIERS - [Intitulé du soin]
Version [X] - Date [date] - Révision [date + 2 ans]
═══════════════════════════════════════════════

**1. Objet et champ d'application**
**2. Matériel nécessaire**
**3. Déroulement du soin** (7 étapes numérotées, prose)
**4. Surveillance après le soin**
**5. Traçabilité dans le dossier de soins**
**6. Conduite à tenir en cas de complication** (3 blocs : signes - action - qui prévenir)

═══════════════════════════════════════════════
Validé par : Cadre de santé - Médecin chef - Date
═══════════════════════════════════════════════

**RÈGLES DE RÉDACTION**
- Étapes numérotées avec contenu en prose, pas en bullets
- Citer le décret R4311 et la recommandation applicable
- Format opérationnel utilisable par un IDE remplaçant
- Si le soin n'est pas précisé, demander avant de rédiger`
    },
    {
      id: 'ide-6', catKey: 'ide', cat: 'Infirmier(ère) IDE', icon: '💉', color: '#2dd4bf',
      title: 'Gérer un refus de soins - trame de dialogue',
      prompt: `**RÔLE**
Tu es infirmier(ère) qui sait gérer un refus de soins dans le respect du droit du patient (loi du 4 mars 2002).

**MON CONTEXTE**
- Service : [hospitalier / libéral / EHPAD]
- Soin refusé : [prise de sang / injection anticoagulant / toilette / médicaments / pansement]
- Patient : prescription médicale [oui / non], capacité de décision préservée [oui / non]
- Raison invoquée : [peur, conviction, ras-le-bol, incompréhension, conflit antérieur]
- Risque en cas de non-réalisation : [faible / modéré / élevé]

**TA MISSION**
Rédige le dialogue complet en prose, prêt à être lu et adapté en situation réelle, avec la fiche de traçabilité associée.

**LE DIALOGUE ET LA FICHE À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
**DIALOGUE GUIDÉ EN 5 ÉTAPES**
Étape 1 - Accueil et reconnaissance du refus
Étape 2 - Exploration de la raison
Étape 3 - Information sur les risques (sans chantage)
Étape 4 - Proposition d'alternative
Étape 5 - Acceptation du refus si maintenu
[Chaque étape : 3 à 5 lignes en prose parlée, discours direct entre guillemets.]
═══════════════════════════════════════════════
**FICHE DE TRAÇABILITÉ DU REFUS**
[Bloc prêt à recopier dans le dossier patient.]
═══════════════════════════════════════════════
**CADRE LÉGAL APPLICABLE**
[Article L1111-4 du CSP, obligation d'information, procédure collégiale si patient incapable. 5 à 6 lignes.]

**RÈGLES DE RÉDACTION**
- Dialogue en prose parlée, pas en bullets
- Vouvoiement constant, ton bienveillant et respectueux
- Aucune phrase qui culpabilise
- Document directement réutilisable en situation réelle
- Si la situation n'est pas précisée, demander avant de rédiger`
    },
    {
      id: 'ide-7', catKey: 'ide', cat: 'Infirmier(ère) IDE', icon: '💉', color: '#2dd4bf',
      title: 'Expliquer un soin technique à un étudiant (fiche pédagogique)',
      prompt: `**RÔLE**
Tu es IDE tuteur(trice) de stage qui rédige des fiches pédagogiques pour étudiants en soins infirmiers.

**MON CONTEXTE**
- Étudiant(e) : [2e / 3e année]
- Geste à enseigner : [pose SNG / gazométrie / injection SC anticoagulant / pose VVP / ECG 12 dérivations / aspiration trachéo-bronchique]
- Contexte : première réalisation supervisée

**TA MISSION**
Rédige la fiche pédagogique complète, prête à remettre à l'étudiant avant la séance pratique. 2 pages A4.

**LA FICHE À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
FICHE PÉDAGOGIQUE - [Geste technique]
Pour étudiants IDE - [niveau]
═══════════════════════════════════════════════

**1. Rappel anatomique**
**2. Indications et contre-indications**
**3. Matériel à préparer**
**4. Étapes du geste** (7 étapes numérotées, avec discours direct entre guillemets et points critiques soulignés)
**5. Critères de réussite**
**6. Erreurs fréquentes des étudiants**
**7. Questions de débriefing après le geste** (3 questions formatrices)

═══════════════════════════════════════════════

**RÈGLES DE RÉDACTION**
- Sections en prose, sauf l'étape 4 (numérotation pédagogique)
- Vocabulaire professionnel mais explicité
- 2 pages A4 maximum
- Si le geste n'est pas précisé, demander avant de rédiger`
    },
    {
      id: 'ide-8', catKey: 'ide', cat: 'Infirmier(ère) IDE', icon: '💉', color: '#2dd4bf',
      title: 'Créer un planning de tournée optimisé',
      prompt: `**RÔLE**
Tu es infirmier(ère) libéral(e) qui sait optimiser une tournée matinale en respectant les contraintes médicales et géographiques.

**MON CONTEXTE**
- Patients à voir entre 7h00 et 12h30 : [lister chaque patient avec soins et contraintes]
- Contraintes du service : [petit-déjeuner à X h, IDE de relais à Y h, kiné entre A et B h]

**TA MISSION**
Produis le planning final optimisé, prêt à imprimer et utiliser dans le véhicule.

**LE PLANNING À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
TOURNÉE OPTIMISÉE - [Jour, date]
═══════════════════════════════════════════════

**Tableau des passages** : Heure | Patient | Soins prévus | Durée estimée | Quartier | Km cumulés

**Synthèse de la tournée**
[4 à 5 lignes : durée totale, kilométrage total, créneau tampon, marge de fin.]

**Justification de l'ordre choisi**
[5 à 7 lignes.]

**Plan B en cas d'aléa**
[4 à 5 lignes.]

═══════════════════════════════════════════════

**RÈGLES DE RÉDACTION**
- Tableau central pour le planning, prose pour les sections d'analyse
- Respecter scrupuleusement les contraintes médicales (priorité absolue)
- Prévoir 15 minutes de tampon non comptées
- Si la liste des patients est absente, demander avant de planifier`
    },
    {
      id: 'ide-9', catKey: 'ide', cat: 'Infirmier(ère) IDE', icon: '💉', color: '#2dd4bf',
      title: "Rédiger une déclaration d'événement indésirable",
      prompt: `**RÔLE**
Tu es IDE qui rédige des déclarations d'événement indésirable (EI) factuelles et constructives pour le service qualité.

**MON CONTEXTE**
- Lieu : [établissement de santé / EHPAD / libéral]
- Nature de l'EI : [erreur médicamenteuse / chute du patient / problème d'identification / défaut matériel / extravasation]
- Faits bruts : [décrire chronologiquement ce qui s'est passé, sans interprétation]
- Conséquences pour le patient : [aucune / mineures / modérées / graves]

**TA MISSION**
Rédige la fiche de déclaration complète, prête à être saisie dans le logiciel qualité ou imprimée.

**LA DÉCLARATION À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
DÉCLARATION D'ÉVÉNEMENT INDÉSIRABLE
N° : [à attribuer] - Date : [date]
═══════════════════════════════════════════════

**1. Identification de l'événement**
**2. Description chronologique des faits** (strictement factuel, 8 à 12 lignes)
**3. Conséquences pour le patient**
**4. Actions immédiates entreprises**
**5. Causes identifiées (analyse à chaud)** (pas de mise en cause nominative)
**6. Mesures correctives proposées**

═══════════════════════════════════════════════
**ANNEXE** - phrase d'information au médecin + note de transmission dans le dossier patient
═══════════════════════════════════════════════

**RÈGLES DE RÉDACTION**
- Sections en prose factuelle, pas en bullets
- Strictement factuel, jamais accusatoire ni nominatif
- Pas d'auto-accusation excessive non plus
- Vocabulaire professionnel
- Si les faits ne sont pas précisés, demander avant de rédiger`
    },
    {
      id: 'ide-10', catKey: 'ide', cat: 'Infirmier(ère) IDE', icon: '💉', color: '#2dd4bf',
      title: 'Choisir une spécialisation ou un DU infirmier',
      prompt: `**RÔLE**
Tu es infirmier(ère) qui aide à comparer des formations spécialisées et à formaliser un projet professionnel.

**MON CONTEXTE**
- Diplôme d'État obtenu en : [année], expérience : [X ans]
- Lieu d'exercice actuel : [service / libéral / EHPAD / réa / psychiatrie]
- 2 ou 3 spécialisations qui m'intéressent : [liste]
- Contraintes : [emploi à conserver / financement à organiser / mobilité géographique]

**TA MISSION**
Produis l'aide à la décision finale, sous forme de note structurée prête à être discutée avec mon cadre ou un conseiller en évolution professionnelle.

**LA NOTE À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
AIDE À LA DÉCISION - PROJET DE SPÉCIALISATION
[Nom] - [date]
═══════════════════════════════════════════════

**1. Contexte personnel et professionnel**
**2. Tableau comparatif des options envisagées** (diplôme, durée, coût, financements, débouchés, impact rémunération)
**3. Analyse personnalisée pour chaque option** (freins, leviers, impact réel)
**4. Recommandation**
**5. Plan d'action**

═══════════════════════════════════════════════

**RÈGLES DE RÉDACTION**
- Tableau central pour la comparaison, prose pour les sections d'analyse
- Citer les sources de financement (FIFPL, ANDPC, plan de formation employeur)
- Pas d'idéalisation : signaler aussi les freins
- Si les options envisagées ne sont pas précisées, demander avant de rédiger`
    },
    {
      id: 'ide-11', catKey: 'ide', cat: 'Infirmier(ère) IDE', icon: '💉', color: '#2dd4bf',
      title: "Préparer un entretien annuel d'évaluation",
      prompt: `**RÔLE**
Tu es IDE qui prépare un entretien annuel constructif avec son cadre.

**MON CONTEXTE**
- Service : [médecine / chirurgie / EHPAD / réa / urgences / etc.]
- Réalisations de l'année : [lister]
- Difficultés rencontrées : [lister]
- Formations suivies : [lister]
- Objectifs reçus l'an dernier : [lister, atteints / non atteints]

**TA MISSION**
Produis le support d'auto-bilan complet, en prose, prêt à apporter à l'entretien et à remettre au cadre.

**LE SUPPORT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
PRÉPARATION ENTRETIEN ANNUEL
[Nom] - [Service] - Date : [date]
═══════════════════════════════════════════════

**1. Auto-bilan de l'année écoulée**
**2. Points forts identifiés** (3-4, illustrés d'un exemple)
**3. Difficultés rencontrées et leçons tirées**
**4. Axes d'amélioration personnels** (2 axes)
**5. Objectifs proposés pour l'année à venir** (3 objectifs SMART)
**6. Questions stratégiques pour le cadre** (3 questions)

═══════════════════════════════════════════════

**RÈGLES DE RÉDACTION**
- Tout en prose, pas de bullets sauf pour les objectifs et questions
- Ton professionnel, positif sans naïveté, honnête sur les difficultés
- Objectifs SMART
- Si le contexte n'est pas suffisant, demander avant de rédiger`
    },
    {
      id: 'ide-12', catKey: 'ide', cat: 'Infirmier(ère) IDE', icon: '💉', color: '#2dd4bf',
      title: "Créer un livret d'accueil pour un nouveau patient à domicile",
      prompt: `**RÔLE**
Tu es infirmier(ère) libéral(e) qui rédige des documents d'information conformes au droit du patient.

**MON CONTEXTE**
- Cabinet : [X] IDE, zone [ville/quartier]
- Horaires : [matin et soir]
- Spécificités : [soins palliatifs / perfusions / pansements complexes / pédiatrique]

**TA MISSION**
Rédige le livret d'accueil complet, prêt à imprimer en A5 plié (4 pages), lisible par une personne âgée.

**LE LIVRET À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
LIVRET D'ACCUEIL
Cabinet infirmier de [Nom] - [Ville]
═══════════════════════════════════════════════

**Page 1 - Bienvenue**
**Page 2 - Notre fonctionnement** (horaires, comment nous joindre, absence/remplacement)
**Page 3 - Vos droits, nos engagements** (déroulement des soins, droits du patient, aspects financiers)
**Page 4 - Numéros utiles** (SAMU 15, pompiers 18, médecin traitant, pharmacie, HAD, notre numéro)

═══════════════════════════════════════════════

**RÈGLES DE RÉDACTION**
- Tout en prose continue, pas de bullets
- Vouvoiement constant, ton chaleureux
- Vocabulaire grand public (« chez vous » plutôt que « domicile »)
- Si les coordonnées et spécificités ne sont pas précisées, demander avant de rédiger`
    },

    // ═════════════════════════════════════════════════════════
    //  3. AIDE-SOIGNANT(E) — 12 prompts
    // ═════════════════════════════════════════════════════════
    {
      id: 'as-1', catKey: 'as', cat: 'Aide-soignant(e)', icon: '🤝', color: '#ff8c42',
      title: "Créer une grille d'observation quotidienne (EHPAD)",
      prompt: `**RÔLE**
Tu es aide-soignant(e) en EHPAD qui rédige des outils d'observation utilisables au fil de la journée.

**MON CONTEXTE**
- Service : EHPAD [traditionnel / unité protégée Alzheimer]
- Effectif : [X] AS pour [X] résidents
- Format souhaité : 1 page A4 recto, à remplir 3 fois par jour

**TA MISSION**
Produis la grille complète prête à imprimer, photocopier en 30 exemplaires et utiliser dès demain. Document fini avec rubriques formulées et cases à cocher.

**LA GRILLE À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
GRILLE D'OBSERVATION QUOTIDIENNE
Résident : ________________  Chambre : ____  Date : ___/___/___
═══════════════════════════════════════════════

Tableau central à 4 colonnes (Domaine | Matin | Après-midi | Soir), domaines : Alimentation, Élimination, État cutané, Mobilité, Humeur et comportement, Sommeil, Soins réalisés — chacun avec ses items à cocher.

═══════════════════════════════════════════════
**Zone « Transmission prioritaire pour l'IDE »**
Signature AS : ________________  Heure : ____
═══════════════════════════════════════════════

**RÈGLES DE RÉDACTION**
- Format tableau structuré avec cases à cocher
- Items formulés clairement, pas en jargon
- Document directement copiable dans Word/Google Docs avec mise en page tableau
- Si les spécificités du service ne sont pas précisées, demander`
    },
    {
      id: 'as-2', catKey: 'as', cat: 'Aide-soignant(e)', icon: '🤝', color: '#ff8c42',
      title: 'Structurer une transmission orale (format SBAR)',
      prompt: `**RÔLE**
Tu es aide-soignant(e) qui transmet des informations à l'IDE de relève au format SBAR (Situation - Background - Assessment - Recommendation).

**MON CONTEXTE**
- Service : [EHPAD / médecine / SSR / chirurgie]
- Mes observations brutes du jour : [coller le bloc d'observations]

**TA MISSION**
Rédige la transmission orale complète, en prose parlée de 2 minutes maximum, prête à être lue ou récitée à l'IDE qui prend la relève.

**LA TRANSMISSION À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
TRANSMISSION SBAR - [Initiales résident, Chambre]
═══════════════════════════════════════════════

**S - Situation** (1 phrase)
**B - Background** (3 à 4 phrases : habituel vs changement du jour)
**A - Assessment** (3 à 5 phrases : observations factuelles, ce qui inquiète)
**R - Recommendation** (2 à 3 phrases : ce que j'attends de l'IDE)

═══════════════════════════════════════════════
**Informations secondaires à donner si l'IDE pose des questions**
═══════════════════════════════════════════════
**Ce qu'il ne faut PAS dire** (pas d'opinion, pas d'interprétation médicale, pas de jugement)

**RÈGLES DE RÉDACTION**
- Tout en prose parlée, naturel à dire à voix haute
- Concis : 2 minutes maximum
- Factuel : « le résident a toussé 5 fois pendant le repas » et non « il tousse beaucoup »
- Si les observations brutes sont absentes, demander avant de rédiger`
    },
    {
      id: 'as-3', catKey: 'as', cat: 'Aide-soignant(e)', icon: '🤝', color: '#ff8c42',
      title: 'Fiche pratique : prévention des escarres',
      prompt: `**RÔLE**
Tu es aide-soignant(e) référent(e) prévention des escarres qui forme l'équipe.

**MON CONTEXTE**
- Service : [EHPAD / SSR / médecine / long séjour]
- Public visé : équipe AS (titulaires, remplaçants, étudiants)
- Format souhaité : poster A3 ou A4 recto-verso affichable en salle de soins

**TA MISSION**
Rédige la fiche pratique complète, prête à imprimer, plastifier et afficher.

**LA FICHE À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
PRÉVENTION DES ESCARRES - FICHE PRATIQUE AS
[Nom du service] - Mise à jour [date]
═══════════════════════════════════════════════

**1. Les 7 facteurs de risque à repérer** (immobilité, dénutrition, incontinence, macération, troubles de la conscience, antécédent d'escarre, frictions/cisaillements)
**2. Les zones à surveiller selon la position** (décubitus dorsal, latéral, position assise)
**3. Les gestes de prévention - rôle AS** (changements de position, effleurage, observation cutanée, nutrition/hydratation, supports)
**4. Quand alerter l'IDE immédiatement** (5 situations)
**5. Échelle de Braden simplifiée pour AS** (3 niveaux de risque)
**6. Ce qu'il ne faut JAMAIS faire**

═══════════════════════════════════════════════

**RÈGLES DE RÉDACTION**
- Sections en prose, sauf les listes des 7 facteurs et des 5 alertes
- Vocabulaire de terrain accessible à un AS de tous niveaux
- Citer la source des recommandations (HAS prévention escarres)
- Si les particularités du service ne sont pas précisées, demander`
    },
    {
      id: 'as-4', catKey: 'as', cat: 'Aide-soignant(e)', icon: '🤝', color: '#ff8c42',
      title: 'Gérer un résident agité ou agressif pendant un soin',
      prompt: `**RÔLE**
Tu es aide-soignant(e) formé(e) aux approches non médicamenteuses des troubles du comportement (Humanitude, Validation).

**MON CONTEXTE**
- Service : [EHPAD / gériatrie / psychiatrie]
- Pathologie du résident : [Alzheimer / démence vasculaire / troubles psychiatriques / confusion aiguë]
- Stade : [débutant / modéré / sévère]
- Manifestations observées : [crie / frappe / griffe / mord / pleure / refuse tout contact]
- Soin qui déclenche : [toilette / repas / coucher / soin technique]
- Déclencheur probable supposé : [contexte]

**TA MISSION**
Rédige le guide pratique complet en 3 phases, prêt à appliquer dès le prochain soin, avec phrases prêtes à dire.

**LE GUIDE À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
GUIDE D'APPROCHE - [Type de soin] AVEC RÉSIDENT AGITÉ
═══════════════════════════════════════════════

**Phase 1 - Avant d'entrer dans la chambre** (5 techniques : préparation, frapper/attendre/annoncer, premier contact, environnement, ancres positives)
**Phase 2 - Pendant le soin** (5 techniques : communication verbale, non verbale, diversion, le choix, savoir s'arrêter)
**Phase 3 - Après l'épisode** (traçabilité factuelle + prendre soin de soi)

═══════════════════════════════════════════════

**RÈGLES DE RÉDACTION**
- Paragraphes courts et concrets, prêts à être appliqués
- Phrases de communication entre guillemets, en discours direct
- Pas de jugement sur le résident (« il est agressif » devient « il manifeste de l'agitation »)
- Si la pathologie ou le déclencheur ne sont pas précisés, demander`
    },
    {
      id: 'as-5', catKey: 'as', cat: 'Aide-soignant(e)', icon: '🤝', color: '#ff8c42',
      title: 'Accompagner un patient en fin de vie et soutenir la famille',
      prompt: `**RÔLE**
Tu es aide-soignant(e) qui accompagne les fins de vie en s'appuyant sur les principes des soins palliatifs.

**MON CONTEXTE**
- Service : [soins palliatifs / EHPAD / médecine]
- Patient : pathologie [cancer / insuffisance d'organe / grand âge], conscience [conscient / somnolent / inconscient]
- Famille : [très présente / dépassée / absente / dans le déni]
- Directives anticipées : [rédigées / non]

**TA MISSION**
Rédige le guide d'accompagnement complet en 3 dimensions (confort physique, communication famille, soin de soi), avec phrases prêtes à dire. Document humain, pas clinique.

**LE GUIDE À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
GUIDE D'ACCOMPAGNEMENT EN FIN DE VIE
═══════════════════════════════════════════════

**Dimension 1 - Confort physique du patient** (soins de bouche, positionnement, hygiène adaptée, râles agoniques, ambiance)
**Dimension 2 - Communication avec la famille** (phrases types pour « Il souffre ? » et « Combien de temps ? », ce qu'il ne faut jamais dire, inviter la famille à participer)
**Dimension 3 - Prendre soin de soi** (gestion des émotions, recours à l'aide, deuil du soignant)

═══════════════════════════════════════════════

**RÈGLES DE RÉDACTION**
- Tout en prose, ton humain et concret
- Phrases types entre guillemets, en discours direct
- Pas de phrases toutes faites, pas de jargon palliatif inaccessible
- Si la situation n'est pas précisée, demander avant de rédiger`
    },
    {
      id: 'as-6', catKey: 'as', cat: 'Aide-soignant(e)', icon: '🤝', color: '#ff8c42',
      title: 'Rédiger une lettre de motivation pour une VAE (DEAS)',
      prompt: `**RÔLE**
Tu es candidat(e) à la VAE DEAS, en train de constituer ton Livret 1 (recevabilité).

**MON CONTEXTE**
- Poste actuel : [AS faisant fonction / ASH / auxiliaire de vie / AES]
- Durée d'expérience : [X] ans
- Type d'établissement : [EHPAD / hôpital / domicile]
- Types de patients : [personnes âgées dépendantes / post-op / psychiatriques / personnes handicapées]
- Formations complémentaires : [AFGSU 2, gestes et postures, bientraitance]

**TA MISSION**
Rédige la lettre de motivation complète, prête à signer et à intégrer au Livret 1, plus la cartographie des 5 blocs de compétences DEAS avec un exemple concret pour chacun.

**LE DOSSIER À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
**LETTRE DE MOTIVATION - LIVRET 1 VAE DEAS**

[Coordonnées candidat]

[Lieu, date]

À l'attention de [autorité d'instruction]

Objet : Demande de recevabilité - VAE Diplôme d'État d'Aide-Soignant

Madame, Monsieur,

[Paragraphe 1 - Présentation du parcours, 4 à 5 lignes]
[Paragraphe 2 - Motivation, 4 à 5 lignes]
[Paragraphe 3 - Compétences acquises sur le terrain, 5 à 6 lignes]
[Paragraphe 4 - Pourquoi la VAE plutôt que la formation initiale, 3 à 4 lignes]
[Paragraphe 5 - Engagement et ouverture, 2 à 3 lignes]

Je vous prie d'agréer, Madame, Monsieur, l'expression de ma considération distinguée.

[Signature]

═══════════════════════════════════════════════
**CARTOGRAPHIE DES 5 BLOCS DE COMPÉTENCES DEAS**

[Bloc 1 - Accompagnement et soins de la personne]
[Bloc 2 - Appréciation de l'état clinique et mise en œuvre de soins adaptés]
[Bloc 3 - Information et accompagnement des personnes et de leur entourage]
[Bloc 4 - Entretien de l'environnement immédiat et des matériels]
[Bloc 5 - Travail en équipe pluri-professionnelle]

═══════════════════════════════════════════════

**RÈGLES DE RÉDACTION**
- Lettre en prose continue, sans bullets
- Ton sincère et concret, pas de superlatifs
- Exemples datés et situés
- Vocabulaire AS, pas IDE
- Si le parcours n'est pas précisé, demander avant de rédiger`
    },
    {
      id: 'as-7', catKey: 'as', cat: 'Aide-soignant(e)', icon: '🤝', color: '#ff8c42',
      title: "Préparer l'oral de sélection IFSI (passerelle AS)",
      prompt: `**RÔLE**
Tu es candidat(e) AS qui prépare l'oral IFSI par la voie professionnelle.

**MON CONTEXTE**
- Expérience AS : [X] ans
- Services fréquentés : [liste]
- Formations complémentaires : [AFGSU, DPC]
- Motivation : [2 à 3 phrases sincères]
- Points forts personnels : [3]
- Zones d'inquiétude pour l'oral : [liste]

**TA MISSION**
Produis le support de préparation complet : projet professionnel rédigé, 8 questions types avec pistes de réponse personnalisées, conseils pratiques.

**LE SUPPORT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
PRÉPARATION ORAL IFSI - VOIE AS
═══════════════════════════════════════════════

**1. Le déroulement de l'épreuve**
**2. Mon projet professionnel - texte de présentation (5 minutes)**
**3. Les 8 questions types du jury**
**4. Les 5 erreurs qui font échouer**
**5. Conseils pratiques pour le jour J**

═══════════════════════════════════════════════

**RÈGLES DE RÉDACTION**
- Projet professionnel et pistes de réponse en prose parlée naturelle
- Ne pas mémoriser mot à mot, comprendre la structure et reformuler
- Pas de superlatifs, sincérité et concret
- Si l'expérience et la motivation ne sont pas précisées, demander`
    },
    {
      id: 'as-8', catKey: 'as', cat: 'Aide-soignant(e)', icon: '🤝', color: '#ff8c42',
      title: 'Comprendre ma fiche de paie et mes droits salariaux',
      prompt: `**RÔLE**
Tu es aide-soignant(e) titulaire FPH qui veut comprendre sa rémunération et anticiper son évolution.

**MON CONTEXTE**
- Grade : [classe normale / classe supérieure]
- Échelon : [X], ancienneté dans l'échelon : [X ans]
- Établissement : [hôpital public / EHPAD public / médico-social public]
- Travail : [jour / nuit / alternance]
- Dimanches/fériés : [environ X par mois / non]

**TA MISSION**
Rédige le décryptage complet de ma rémunération, prêt à comparer ligne à ligne avec ma fiche de paie, avec projection d'évolution.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
DÉCRYPTAGE DE MA RÉMUNÉRATION - AS FPH
[Nom] - [date]
═══════════════════════════════════════════════

**1. Traitement indiciaire**
**2. Primes et indemnités** (CTI/Ségur, prime de service, ISS, indemnités nuit, majoration dimanches/fériés, NBI)
**3. Mon salaire net approximatif**
**4. Évolution de carrière prévisible**
**5. Ce que je peux demander ou négocier**

═══════════════════════════════════════════════

**RÈGLES DE RÉDACTION**
- Tout en prose, sauf les blocs des primes
- Chiffres concrets et à jour
- Pas d'invention de montants
- Si l'échelon ou l'établissement ne sont pas précisés, demander`
    },
    {
      id: 'as-9', catKey: 'as', cat: 'Aide-soignant(e)', icon: '🤝', color: '#ff8c42',
      title: 'Créer un planning de toilettes pour un service de 20 lits',
      prompt: `**RÔLE**
Tu es aide-soignant(e) responsable de l'organisation des soins du matin dans un service.

**MON CONTEXTE**
- Service : [médecine / chirurgie / SSR / EHPAD] - 20 lits
- Effectif AS du matin : [2 / 3]
- Liste des patients avec niveau d'autonomie et contraintes : [coller la liste]
- Contraintes : petit-déjeuner à [X] h, IDE tours techniques à [X] h, kiné entre [X] et [X] h, visite médicale à [X] h

**TA MISSION**
Produis le planning final de répartition entre AS, prêt à imprimer et à afficher en salle de soins.

**LE PLANNING À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
PLANNING DES SOINS DU MATIN
[Service] - [date] - Équipe : AS1 [Nom], AS2 [Nom], AS3 [Nom]
═══════════════════════════════════════════════

**Tableau central à 4 colonnes (5 si 3 AS)**

| Tranche horaire | AS 1 | AS 2 | AS 3 (si présent) | Coordination IDE |

**Synthèse de la répartition**
**Justification des choix**
**Plan B en cas d'imprévu**

═══════════════════════════════════════════════

**RÈGLES DE RÉDACTION**
- Tableau central pour le planning, prose pour les sections d'analyse
- Patients dépendants en priorité, alternance avec patients plus légers
- Respect des contraintes horaires médicales
- Si la liste des patients ou l'effectif AS n'est pas précisé, demander`
    },
    {
      id: 'as-10', catKey: 'as', cat: 'Aide-soignant(e)', icon: '🤝', color: '#ff8c42',
      title: 'Adapter les soins aux spécificités culturelles et religieuses',
      prompt: `**RÔLE**
Tu es aide-soignant(e) qui sait articuler respect des convictions et exigences professionnelles dans un cadre laïque.

**MON CONTEXTE**
- Service : [hôpital public / EHPAD / établissement privé]
- Public accueilli : [varié / majorité de personnes âgées / contexte multiculturel]
- Situations rencontrées : [refus de soignant du sexe opposé / régime religieux / pratiques de fin de vie / demandes liées à des fêtes religieuses]

**TA MISSION**
Rédige le guide pratique complet, situations par situations, avec réponse juridique et réponse de terrain pour chacune.

**LE GUIDE À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
GUIDE - SOINS ET SPÉCIFICITÉS CULTURELLES OU RELIGIEUSES
═══════════════════════════════════════════════

**Situation 1 - Toilette et pudeur**
**Situation 2 - Vêtement religieux pendant le soin**
**Situation 3 - Alimentation - régimes religieux**
**Situation 4 - La prière et l'aumônier**
**Situation 5 - Fin de vie et rites mortuaires**
**Situation 6 - Limites - ce que le soignant doit refuser**

═══════════════════════════════════════════════

**RÈGLES DE RÉDACTION**
- Ton respectueux, factuel, jamais moralisateur
- Tout en prose, pas de bullets
- Citer la charte du patient hospitalisé et le principe de laïcité
- Si une situation spécifique vous concerne, demander pour cibler la réponse`
    },
    {
      id: 'as-11', catKey: 'as', cat: 'Aide-soignant(e)', icon: '🤝', color: '#ff8c42',
      title: 'Rédiger un rapport de stage (élève AS)',
      prompt: `**RÔLE**
Tu es élève aide-soignant(e) en formation DEAS qui rédige un rapport de stage évaluable.

**MON CONTEXTE**
- Stage de [X] semaines en [EHPAD / médecine / chirurgie / SSR / psychiatrie / domicile / crèche / maternité]
- Établissement : [type, taille], service : [nombre de lits, type de patients]
- Activités réalisées : [lister les soins et activités menés]
- Une situation marquante vécue : [décrire brièvement]

**TA MISSION**
Rédige le rapport complet, prêt à imprimer et à remettre au formateur référent. 4 à 5 pages A4.

**LE RAPPORT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
RAPPORT DE STAGE - DEAS - PROMOTION [Année]
[Nom] - Lieu : [structure] - Période : [dates]
═══════════════════════════════════════════════

**Introduction (10 à 12 lignes)**
**1. Présentation du lieu de stage (15 à 20 lignes)**
**2. Analyse d'une situation de soin vécue (1 page)**
**3. Bilan des compétences acquises (tableau)**

| Bloc DEAS | Ce que j'ai appris | Exemple concret du stage | Niveau |

**4. Conclusion (10 lignes)**

═══════════════════════════════════════════════

**RÈGLES DE RÉDACTION**
- Tout en prose réflexive, pas de bullets sauf le tableau central
- Vouvoiement, anonymisation systématique des patients (initiales)
- Ton personnel et honnête
- Pas de phrases toutes faites
- Si le stage et la situation marquante ne sont pas précisés, demander`
    },
    {
      id: 'as-12', catKey: 'as', cat: 'Aide-soignant(e)', icon: '🤝', color: '#ff8c42',
      title: 'Créer une check-list bientraitance pour le service',
      prompt: `**RÔLE**
Tu es aide-soignant(e) référent(e) bientraitance qui fait progresser l'équipe sur la base des recommandations ANESM/HAS.

**MON CONTEXTE**
- Service : [EHPAD / SSR / long séjour]
- Public : équipe AS et IDE
- Usage : auto-évaluation individuelle ou évaluation d'équipe lors d'une réunion qualité

**TA MISSION**
Produis la grille d'auto-évaluation finale, prête à imprimer en 1 page A4 recto, à remplir individuellement puis discuter en équipe.

**LA GRILLE À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

═══════════════════════════════════════════════
CHECK-LIST BIENTRAITANCE - AUTO-ÉVALUATION
Service : [nom] - Date : ____  Soignant : ________________
═══════════════════════════════════════════════

**Présentation (en haut de la page)**
**Tableau central à 5 colonnes** : Item | Toujours | Souvent | Parfois | Jamais
15 items répartis en 5 thèmes (3 items par thème)
**Score total**
**Mon plan personnel d'amélioration**
**Note pour les responsables**

═══════════════════════════════════════════════

**RÈGLES DE RÉDACTION**
- Items formulés à la première personne, en positif, observables
- Tableau central pour la cotation
- Sections de cadrage rédigées en prose
- Pas de jugement moralisateur
- Si le service ou le public ne sont pas précisés, demander`
    },

    // ═════════════════════════════════════════════════════════
    //  4. SECRÉTAIRE MÉDICALE — 12 prompts
    // ═════════════════════════════════════════════════════════
    {
      id: 'sm-1', catKey: 'sm', cat: 'Secrétaire médicale', icon: '📋', color: '#a78bfa',
      title: "Modèle de courrier d'adressage spécialiste",
      prompt: `**RÔLE**
Tu es secrétaire médicale expérimentée en cabinet de médecine générale, maîtrisant la rédaction administrative médicale et le secret professionnel partagé.

**MON CONTEXTE**
- Médecin prescripteur : [Dr X, spécialité, ADELI/RPPS]
- Patient : [identité, date de naissance, n° dossier]
- Spécialiste destinataire : [Dr Y, spécialité, adresse]
- Motif de consultation : [résumé clinique fourni par le médecin]
- Degré d'urgence : [routine / semi-urgent / urgent]

**TA MISSION**
Rédige un courrier d'adressage type que je pourrai personnaliser avec le médecin, format A4 prêt à imprimer ou PDF.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**[En-tête cabinet, pré-rempli]**
Dr [Nom], Médecin généraliste
[Adresse, téléphone, mail sécurisé]
RPPS : [numéro]

**[Date et lieu]**

**[Destinataire]**
Docteur [Nom du spécialiste]
[Spécialité]
[Adresse]

**Objet** : Demande d'avis spécialisé, [Patient initiales], né(e) le [date]

**Cher Confrère, Chère Consœur,**

Je vous adresse [Mme/M. Initiales], [âge] ans, pour [motif principal en une phrase].

**Antécédents pertinents**
**Histoire de la maladie**
**Examen clinique**
**Examens complémentaires déjà réalisés**
**Traitement en cours**
**Question posée**

Avec mes confraternels remerciements pour la prise en charge.

**Dr [Nom]**
Signature

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Respect strict du secret médical
- Formule confraternelle obligatoire
- Validation médecin obligatoire avant envoi`
    },
    {
      id: 'sm-2', catKey: 'sm', cat: 'Secrétaire médicale', icon: '📋', color: '#a78bfa',
      title: 'Réponse à demande de dossier médical',
      prompt: `**RÔLE**
Tu es secrétaire médicale formée à la réglementation Loi Kouchner du 4 mars 2002 et au RGPD, en charge de la gestion des dossiers patients.

**MON CONTEXTE**
- Demandeur : [patient lui-même / ayant droit / tiers avec mandat]
- Pièces fournies : [carte identité, attestation décès, mandat]
- Type de dossier demandé : [intégral / partiel]
- Format souhaité : [papier / numérique / clé USB]
- Délai légal : 8 jours si moins de 5 ans, 2 mois si plus de 5 ans

**TA MISSION**
Rédige le courrier de réponse type avec procédure complète d'envoi, conforme à l'article L1111-7 du CSP.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Vérification préalable (checklist)**
**2. Courrier de réponse**
**3. Bordereau de remise (en cas de retrait)**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme article L1111-7 CSP et arrêté du 5 mars 2004
- Aucune transmission sans vérification d'identité
- Validation médecin pour consultations psychiatriques`
    },
    {
      id: 'sm-3', catKey: 'sm', cat: 'Secrétaire médicale', icon: '📋', color: '#a78bfa',
      title: 'Script appel téléphonique difficile',
      prompt: `**RÔLE**
Tu es secrétaire médicale expérimentée en cabinet pluriprofessionnel, formée à la communication non-violente et à la gestion des appels conflictuels.

**MON CONTEXTE**
- Type d'appel difficile : [patient mécontent délai RDV / réclamation honoraires / agressivité verbale / urgence non médicale]
- Profil appelant : [agité / pleurs / menaces / insistance]
- Motif réel suspecté : [angoisse santé / problème admin / quête écoute]

**TA MISSION**
Rédige un script de gestion d'appel structuré en 5 étapes avec phrases-types et alternatives.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**Étape 1, Accueil et identification (30 secondes)**
**Étape 2, Écoute active (2-3 minutes)**
**Étape 3, Délimitation du périmètre**
**Étape 4, Proposition de solution**
**Étape 5, Clôture sécurisante**
**Phrases pivots en cas d'agressivité**
**Si menace ou insulte caractérisée**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Garder son calme et sa posture professionnelle
- Ne jamais s'engager sur un acte médical
- Tracer tout appel difficile dans le dossier`
    },
    {
      id: 'sm-4', catKey: 'sm', cat: 'Secrétaire médicale', icon: '📋', color: '#a78bfa',
      title: "Procédure d'archivage dossiers patients",
      prompt: `**RÔLE**
Tu es secrétaire médicale référente RGPD en cabinet médical, en charge de l'organisation documentaire et du respect des durées légales de conservation.

**MON CONTEXTE**
- Volume dossiers actifs : [nombre]
- Espace disponible : [archivage local / externalisé / numérique]
- Logiciel métier : [LGC, Hellodoc, Doctolib, autre]
- Périodicité du tri : [annuel / semestriel]

**TA MISSION**
Rédige une procédure complète d'archivage et de purge conforme à la réglementation.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Cadre légal (référence)**
**2. Procédure de tri annuel (5 étapes)**
**3. Archivage actif vs intermédiaire**
**4. Sécurité physique et numérique**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Strictement conforme au RGPD et au CSP
- Validation médecin obligatoire avant toute destruction
- Pas d'archivage chez un prestataire non HDS`
    },
    {
      id: 'sm-5', catKey: 'sm', cat: 'Secrétaire médicale', icon: '📋', color: '#a78bfa',
      title: 'Mail de relance facture impayée',
      prompt: `**RÔLE**
Tu es secrétaire médicale en charge du recouvrement amiable des honoraires non réglés en cabinet libéral.

**MON CONTEXTE**
- Patient : [identité, n° dossier]
- Acte concerné : [nature, date, montant]
- Précédentes relances : [aucune / 1 SMS / 1 mail]
- Délai depuis émission : [X jours]

**TA MISSION**
Rédige le mail de relance ferme mais courtois adapté au stade (R1, R2, R3 avant mise en demeure).

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**Version 1, Relance amicale (J+30)**
**Version 2, Relance ferme (J+60)**
**Version 3, Mise en demeure (J+90)**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Pas de menace illégale
- Pas de divulgation de nature des soins
- Mise en demeure obligatoirement par LR/AR
- Validation médecin avant procédure judiciaire`
    },
    {
      id: 'sm-6', catKey: 'sm', cat: 'Secrétaire médicale', icon: '📋', color: '#a78bfa',
      title: 'Réponse à demande de certificat médical (refus motivé)',
      prompt: `**RÔLE**
Tu es secrétaire médicale formée à la déontologie médicale, en charge du tri des demandes de certificats abusives.

**MON CONTEXTE**
- Type de demande : [aptitude sport sans visite / arrêt rétroactif / certificat de complaisance]
- Demandeur : [patient / employeur / association]
- Motif refus : [pas de visite / hors compétence / non médical]

**TA MISSION**
Rédige le courrier de refus diplomatique en orientant le demandeur vers la bonne procédure.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**Objet** : Votre demande de certificat du [date]
**Cas 1, Pas de visite récente**
**Cas 2, Arrêt rétroactif**
**Cas 3, Certificat non requis légalement**
**Cas 4, Demande non médicale**
**Orientation**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Référence légale obligatoire
- Pas de jugement sur la demande
- Toujours proposer une alternative
- Conforme déontologie (article R4127-28 CSP)`
    },
    {
      id: 'sm-7', catKey: 'sm', cat: 'Secrétaire médicale', icon: '📋', color: '#a78bfa',
      title: 'Trame newsletter patientèle (information cabinet)',
      prompt: `**RÔLE**
Tu es secrétaire médicale en charge de la communication patientèle d'un cabinet médical pluridisciplinaire.

**MON CONTEXTE**
- Type d'information : [nouveaux horaires / nouvel associé / vaccination saisonnière / fermeture estivale / nouvelle adresse]
- Public cible : [patientèle active / patients chroniques / nouveaux patients]
- Canal d'envoi : [mail RGPD-conforme / SMS / affichage]

**TA MISSION**
Rédige la newsletter type, courte et claire, conforme au RGPD avec opt-out visible.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**Objet** (40 caractères max)
**Corps du mail**
**Mention RGPD obligatoire**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Aucune information médicale individualisée
- Opt-out obligatoire en bas de mail
- Validation médecin avant envoi`
    },
    {
      id: 'sm-8', catKey: 'sm', cat: 'Secrétaire médicale', icon: '📋', color: '#a78bfa',
      title: "Procédure d'accueil nouveau patient",
      prompt: `**RÔLE**
Tu es secrétaire médicale référente accueil dans un cabinet recevant 30 nouveaux patients par mois.

**MON CONTEXTE**
- Type cabinet : [généraliste / spécialiste]
- Outils utilisés : [LGC, Doctolib, télétransmission]
- Volume RDV/jour : [nombre]

**TA MISSION**
Crée une procédure d'accueil standardisée applicable par toute l'équipe, du premier contact au premier RDV.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Premier contact (téléphone ou Doctolib)**
**2. Préparation du dossier (avant RDV)**
**3. Accueil le jour J**
**4. Après la consultation**
**5. Suivi à J+7**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme RGPD (consentement éclairé)
- Pas d'information médicale entre patients en salle d'attente
- Tarifs affichés conformes article R1111-21 CSP`
    },
    {
      id: 'sm-9', catKey: 'sm', cat: 'Secrétaire médicale', icon: '📋', color: '#a78bfa',
      title: 'Trame de réponse aux avis Google négatifs',
      prompt: `**RÔLE**
Tu es secrétaire médicale chargée de la e-réputation du cabinet, formée aux contraintes du secret médical sur les espaces publics.

**MON CONTEXTE**
- Avis reçu : [contenu de l'avis]
- Plateforme : [Google / Doctolib / Pages Jaunes]
- Patient identifiable : [oui/non]
- Type de critique : [délai RDV / accueil / honoraires / soins]

**TA MISSION**
Rédige 3 versions de réponse adaptées : neutre, factuelle, ferme. Toutes conformes au secret médical.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**Version A, Réponse neutre (cas général)**
**Version B, Réponse factuelle (informations erronées)**
**Version C, Réponse ferme (diffamation)**
**Règles à respecter dans toute réponse**
**Procédure interne**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Strict respect du secret médical (R4127-4 CSP)
- Aucune confirmation de statut de patient
- Validation médecin obligatoire`
    },
    {
      id: 'sm-10', catKey: 'sm', cat: 'Secrétaire médicale', icon: '📋', color: '#a78bfa',
      title: 'Modèle convocation patient pour résultat à risque',
      prompt: `**RÔLE**
Tu es secrétaire médicale aguerrie aux situations sensibles, en charge de transmettre les convocations urgentes ou semi-urgentes.

**MON CONTEXTE**
- Niveau de gravité (selon médecin) : [urgent / semi-urgent / suivi normal]
- Mode de contact validé : [téléphone / SMS / mail]
- Disponibilité créneaux : [liste créneaux médecin]

**TA MISSION**
Rédige les scripts de convocation gradués sans alarmer inutilement, sans révéler la nature du résultat.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**Script 1, Convocation urgente (téléphone)**
**Script 2, Convocation semi-urgente (SMS)**
**Script 3, Convocation suivi normal (mail ou SMS)**
**Procédure de traçabilité**
**Si patient injoignable urgent**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Aucune information médicale au téléphone
- Ton calme, ne pas dramatiser ni minimiser
- Toujours proposer un créneau concret
- Tracer chaque tentative`
    },
    {
      id: 'sm-11', catKey: 'sm', cat: 'Secrétaire médicale', icon: '📋', color: '#a78bfa',
      title: 'Aide à la cotation NGAP/CCAM (rôle propre AS administratif)',
      prompt: `**RÔLE**
Tu es secrétaire médicale formée à la NGAP, à la CCAM et aux règles de cumul d'actes, en charge du contrôle des FSE avant télétransmission.

**MON CONTEXTE**
- Spécialité du médecin : [généraliste / spécialiste : préciser]
- Type d'acte : [consultation / acte technique / téléconsultation]
- Patient : [adulte / enfant / ALD / CMU / AME]
- Heure et jour : [horaire normal / nuit / dimanche-férié]

**TA MISSION**
Aide-moi à vérifier la cotation appropriée et les éventuels suppléments avant validation.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Cotation principale suggérée**
**2. Majorations applicables**
**3. Règles de cumul (cas fréquents)**
**4. Cas particuliers**
**5. Vérification finale avant FSE**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Référence à la NGAP en vigueur (consulter ameli.fr)
- En cas de doute : ne pas coder, demander au médecin
- Pas d'invention de cotation`
    },
    {
      id: 'sm-12', catKey: 'sm', cat: 'Secrétaire médicale', icon: '📋', color: '#a78bfa',
      title: "Procédure de gestion d'urgence en salle d'attente",
      prompt: `**RÔLE**
Tu es secrétaire médicale formée AFGSU 2, référente de la conduite à tenir en cas d'urgence dans le cabinet.

**MON CONTEXTE**
- Type de cabinet : [étage / RDC / accès handicapés]
- Présence médecin : [permanente / partagée]
- Matériel d'urgence disponible : [DAE, oxygène, trousse]

**TA MISSION**
Rédige une procédure d'urgence affichable, applicable par tous les agents d'accueil sans formation médicale.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Reconnaissance des signes graves (à mémoriser)**
**2. Conduite à tenir, 5 étapes**
**3. Numéros et matériel**
**4. Après l'incident**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Ne jamais dépasser ses compétences
- Pas de geste médical sans formation (AFGSU 2 conseillé)
- Toujours alerter le médecin d'abord
- Si seul : 15 immédiatement
- Pas d'auto-médication ni administration médicament`
    },

    // ═════════════════════════════════════════════════════════
    //  5. SAGE-FEMME — 12 prompts
    // ═════════════════════════════════════════════════════════
    {
      id: 'sf-1', catKey: 'sf', cat: 'Sage-femme', icon: '🤰', color: '#f472b6',
      title: 'Compte-rendu consultation prénatale (T2)',
      prompt: `**RÔLE**
Tu es sage-femme libérale ou hospitalière, formée au suivi de grossesse et conforme aux recommandations HAS 2016 (suivi de grossesse normale).

**MON CONTEXTE**
- Patiente : [G P A, âge, terme en SA]
- Antécédents pertinents : [obstétricaux, médicaux]
- Examens du jour : [TA, poids, BU, MAF, BCF, HU]
- Examens biologiques disponibles : [résultats]
- Symptômes rapportés : [contractions, douleurs, écoulements]

**TA MISSION**
Rédige le compte-rendu de consultation prénatale T2 structuré, intégrant l'examen, l'analyse et le plan de suivi.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Identification**
**2. Antériorité**
**3. Examen clinique**
**4. Examens complémentaires**
**5. Synthèse et orientation**
**6. Conseils donnés**
**7. Prochain RDV**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme aux recommandations HAS suivi grossesse
- Référence obstétricien obligatoire si pathologie
- Respect du secret professionnel`
    },
    {
      id: 'sf-2', catKey: 'sf', cat: 'Sage-femme', icon: '🤰', color: '#f472b6',
      title: 'Plan de naissance personnalisé',
      prompt: `**RÔLE**
Tu es sage-femme accompagnante, formée à l'éducation périnatale et au respect des choix éclairés des femmes.

**MON CONTEXTE**
- Profil patiente : [âge, parité, ATCD, projet de naissance]
- Lieu d'accouchement prévu : [maternité niveau 1/2/3, plateau technique, domicile]
- Souhaits exprimés : [analgésie, position, peau-à-peau, allaitement]

**TA MISSION**
Construis un plan de naissance personnalisé sous forme de document remis à la maternité, équilibrant souhaits de la patiente et impératifs médicaux.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Identification**
**2. Souhaits pendant le travail**
**3. Souhaits pendant l'accouchement**
**4. Premières heures**
**5. Allaitement**
**6. Imprévus médicaux**
**7. Coordonnées**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Document non opposable juridiquement (mais respect éthique)
- Validation préalable sage-femme et obstétricien si grossesse à risque
- Conforme aux recommandations HAS accouchement normal 2017`
    },
    {
      id: 'sf-3', catKey: 'sf', cat: 'Sage-femme', icon: '🤰', color: '#f472b6',
      title: 'Synthèse rééducation périnéale',
      prompt: `**RÔLE**
Tu es sage-femme libérale spécialisée en rééducation périnéo-sphinctérienne, formée aux recommandations CNGOF.

**MON CONTEXTE**
- Patiente : [parité, âge, mode d'accouchement, lésion périnéale]
- Plaintes : [incontinence urinaire/anale / prolapsus / dyspareunie]
- Bilan initial : [testing, sensibilité, contraction]
- Nombre de séances réalisées : [X / 10]

**TA MISSION**
Rédige la synthèse de fin de prise en charge, transmissible au médecin traitant et à la patiente.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Bilan initial (rappel)**
**2. Séances réalisées**
**3. Bilan final**
**4. Conclusion**
**5. Suite à donner**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Respecter le périmètre de compétence sage-femme (article L4151-1 CSP)
- Recours médecin pour pathologies suspectées
- Cotation NGAP appropriée (AMK 8)`
    },
    {
      id: 'sf-4', catKey: 'sf', cat: 'Sage-femme', icon: '🤰', color: '#f472b6',
      title: 'Information allaitement maternel personnalisée',
      prompt: `**RÔLE**
Tu es sage-femme consultante en lactation IBCLC, formée aux recommandations OMS et HAS sur l'allaitement.

**MON CONTEXTE**
- Profil mère : [primipare/multipare, ATCD allaitement, mode de vie]
- Nouveau-né : [terme, poids, comportement, succion]
- Difficultés rencontrées : [crevasses, engorgement, prise pondérale, doutes]
- Souhaits maternels : [allaitement exclusif / mixte / sevrage progressif]

**TA MISSION**
Rédige un document d'information personnalisé adressé à la mère, intégrant conseils pratiques et signes d'alerte.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Votre situation aujourd'hui**
**2. Les bases qui rassurent**
**3. Position et succion**
**4. Les difficultés courantes et leurs solutions**
**5. Signes qui doivent alerter**
**6. Vos contacts**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Information neutre, sans culpabilisation
- Respect des choix maternels
- Conforme code OMS commercialisation substituts du lait`
    },
    {
      id: 'sf-5', catKey: 'sf', cat: 'Sage-femme', icon: '🤰', color: '#f472b6',
      title: 'Consultation post-natale standardisée',
      prompt: `**RÔLE**
Tu es sage-femme spécialisée en suivi post-natal, conforme aux recommandations HAS sur le post-partum.

**MON CONTEXTE**
- Patiente : [accouchement à J+X]
- Mode accouchement : [voie basse / césarienne, déchirure éventuelle]
- Allaitement : [maternel / artificiel / mixte]
- Plaintes : [physiques / psychologiques]
- Contraception envisagée : [aucune / méthode]

**TA MISSION**
Conduis l'examen post-natal complet (J6-J8 et 6 semaines), puis rédige le compte-rendu structuré.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Anamnèse**
**2. Examen clinique**
**3. Évaluation psychologique**
**4. Allaitement**
**5. Contraception**
**6. Examens complémentaires**
**7. Conseils**
**8. Prochain RDV**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme HAS recommandation post-partum 2014
- Dépistage dépression post-natale systématique (EPDS)
- Orientation médecin si pathologie`
    },
    {
      id: 'sf-6', catKey: 'sf', cat: 'Sage-femme', icon: '🤰', color: '#f472b6',
      title: 'Conseils post-IVG médicamenteuse',
      prompt: `**RÔLE**
Tu es sage-femme habilitée à pratiquer l'IVG médicamenteuse depuis la loi du 2 mars 2022, formée à l'accompagnement post-IVG.

**MON CONTEXTE**
- Patiente : [âge, terme à l'IVG, technique utilisée]
- Délai depuis IVG : [J+X]
- Plaintes éventuelles : [saignements, douleurs, fièvre, état émotionnel]

**TA MISSION**
Rédige un document d'information remis à la patiente après l'IVG médicamenteuse, avec consignes claires et orientation.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Ce qui est normal dans les jours qui suivent**
**2. Ce qui doit alerter (consultation immédiate)**
**3. Contraception immédiate**
**4. Consultation de contrôle obligatoire**
**5. Reprise activités**
**6. Soutien psychologique**
**7. Suivi proposé**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Cadre légal : article L2212-2 CSP (loi 2 mars 2022)
- Pas de jugement, accueil bienveillant
- Confidentialité absolue
- Consultation de contrôle obligatoire`
    },
    {
      id: 'sf-7', catKey: 'sf', cat: 'Sage-femme', icon: '🤰', color: '#f472b6',
      title: 'Préparation séance PNP (préparation à la naissance)',
      prompt: `**RÔLE**
Tu es sage-femme animatrice de séances PNP en cabinet ou en maternité, formée à la pédagogie active et à l'éducation thérapeutique.

**MON CONTEXTE**
- Type de séance : [découverte / accouchement / allaitement / post-natal / spécifique]
- Public : [primipares / multipares / mixte]
- Durée : [60 / 90 / 120 minutes]
- Effectif : [individuel / 4-8 couples]

**TA MISSION**
Construis un plan de séance PNP avec objectifs pédagogiques, supports et déroulé minuté.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Objectifs de la séance**
**2. Public et prérequis**
**3. Plan détaillé (90 minutes)**
**4. Supports utilisés**
**5. Évaluation**
**6. Consignes pratiques**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme cadre HAS PNP 2005
- Pédagogie non culpabilisante
- Cotation NGAP : 7 séances de 45 min remboursées (PRENAT)`
    },
    {
      id: 'sf-8', catKey: 'sf', cat: 'Sage-femme', icon: '🤰', color: '#f472b6',
      title: 'Bilan prénatal précoce (BPP entretien du 4ème mois)',
      prompt: `**RÔLE**
Tu es sage-femme formée à l'entretien prénatal précoce (EPP) selon HAS 2007 et conforme à l'article L2122-1 CSP.

**MON CONTEXTE**
- Patiente : [G P A, terme, suivi]
- Contexte personnel : [conjugal, professionnel, social]
- Vulnérabilités potentielles : [violences, addictions, précarité, isolement]

**TA MISSION**
Conduis un entretien prénatal précoce structuré et rédige la synthèse avec orientation si nécessaire.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Cadre de l'entretien**
**2. Domaines à explorer**
**3. Repérage des vulnérabilités**
**4. Information donnée**
**5. Synthèse et orientation**
**6. Co-rédaction projet de naissance**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Strict respect du secret professionnel
- Pas de signalement sans consentement (sauf danger)
- Conforme article L2122-1 CSP
- Cotation NGAP : EPP 47,50 €`
    },
    {
      id: 'sf-9', catKey: 'sf', cat: 'Sage-femme', icon: '🤰', color: '#f472b6',
      title: 'Synthèse violences conjugales repérées',
      prompt: `**RÔLE**
Tu es sage-femme référente violences faites aux femmes, formée au repérage et à l'accompagnement, conforme à la loi du 30 juillet 2020.

**MON CONTEXTE**
- Patiente : [statut, grossesse / post-partum / suivi gynéco]
- Type de violence repérée : [psychologique / physique / sexuelle / économique]
- Contexte familial : [enfants, conjoint, hébergement]
- Niveau de danger immédiat : [faible / modéré / élevé]

**TA MISSION**
Rédige la synthèse de prise en charge avec plan d'action gradué, dans le respect du secret professionnel et du consentement.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Cadre légal de la levée du secret**
**2. Repérage et entretien**
**3. Évaluation du danger immédiat**
**4. Information donnée à la patiente**
**5. Plan d'action proposé**
**6. Si danger immédiat sans accord patiente**
**7. Suivi proposé**
**8. Numéros utiles**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Respect absolu du consentement (sauf danger immédiat)
- Documentation systématique au dossier
- Pas de confrontation au conjoint`
    },
    {
      id: 'sf-10', catKey: 'sf', cat: 'Sage-femme', icon: '🤰', color: '#f472b6',
      title: 'Lettre de transmission à pédiatre',
      prompt: `**RÔLE**
Tu es sage-femme libérale en charge du suivi à domicile mère-enfant après sortie précoce de maternité (PRADO).

**MON CONTEXTE**
- Nouveau-né : [terme, poids naissance, mode allaitement]
- Sortie maternité : [J+X]
- Examens à transmettre : [Guthrie, audition, examen sortie]
- Visites SF effectuées : [nombre, dates]
- Plaintes ou observations : [poids, ictère, alimentation]

**TA MISSION**
Rédige la lettre de transmission au pédiatre traitant pour la consultation des 8 jours.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**[En-tête sage-femme]**
**[Date]**
**[Destinataire]**

**Objet** : Transmission suivi nouveau-né, [Initiales], né(e) le [date]

**Cher Confrère, Chère Consœur,**
[Corps structuré : données naissance, évolution, examen, allaitement, évaluation maternelle, examens, synthèse]

**Sage-femme [Nom]**
ADELI [numéro]

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme PRADO maternité (CNAM)
- Respect partage d'information loi 26 janvier 2016
- Validation parents pour transmission`
    },
    {
      id: 'sf-11', catKey: 'sf', cat: 'Sage-femme', icon: '🤰', color: '#f472b6',
      title: 'Procédure protocolisée AMP (insémination)',
      prompt: `**RÔLE**
Tu es sage-femme en centre d'AMP, formée à la coordination des protocoles d'insémination intra-utérine (IIU).

**MON CONTEXTE**
- Type AMP : [IIU spermatique conjoint / IIU don]
- Protocole : [stimulation simple / cycle naturel]
- Couple : [couple hétéro / couple femmes / femme seule]
- Antécédents AMP : [aucun / X tentatives]

**TA MISSION**
Construis le protocole détaillé par étapes avec planning patient et checklist équipe.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Phase pré-traitement (J-30)**
**2. Démarches administratives**
**3. Cycle de stimulation (planning patiente)**
**4. Le jour de l'insémination**
**5. Après l'insémination**
**6. Si grossesse**
**7. Si échec**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme loi bioéthique du 2 août 2021
- Information éclairée à chaque étape
- Délai de réflexion respecté
- Confidentialité absolue`
    },
    {
      id: 'sf-12', catKey: 'sf', cat: 'Sage-femme', icon: '🤰', color: '#f472b6',
      title: 'Information ménopause et THM',
      prompt: `**RÔLE**
Tu es sage-femme habilitée au suivi gynécologique de prévention (article L4151-1 CSP), formée à la périménopause et à la décision partagée THM.

**MON CONTEXTE**
- Patiente : [âge, dernières règles, symptômes]
- Symptômes : [bouffées de chaleur, troubles sommeil, sécheresse vaginale, troubles humeur]
- Antécédents : [médicaux, gynéco, familiaux : cancer sein, MTEV]
- Souhaits : [information / traitement / suivi simple]

**TA MISSION**
Rédige une fiche d'information décisionnelle équilibrée sur le THM, présentant bénéfices, risques et alternatives.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Comprendre la ménopause**
**2. Vos symptômes, Évaluation**
**3. Les options de prise en charge**
**4. Bénéfices et risques du THM**
**5. Contre-indications absolues**
**6. Suivi sous THM**
**7. Décision partagée**
**Points clés**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme HAS recommandations ménopause
- Décision partagée (consentement éclairé)
- Pas de prescription en cas de contre-indication
- Information écrite remise systématiquement`
    },

    // ═════════════════════════════════════════════════════════
    //  6. KINÉSITHÉRAPEUTE — 12 prompts
    // ═════════════════════════════════════════════════════════
    {
      id: 'kine-1', catKey: 'kine', cat: 'Kinésithérapeute', icon: '🦵', color: '#34d399',
      title: 'Bilan diagnostic kinésithérapique (BDK)',
      prompt: `**RÔLE**
Tu es masseur-kinésithérapeute conforme au décret de compétence (R4321-1 CSP) et aux recommandations CNOMK 2023.

**MON CONTEXTE**
- Patient : [âge, profession, latéralité]
- Prescription : [diagnostic médical, nombre de séances, techniques]
- Plaintes : [douleur EVA, gêne fonctionnelle, retentissement]
- Tests réalisés : [amplitudes, force, équilibre, douleur provoquée]

**TA MISSION**
Rédige le BDK conforme aux exigences CNAM (traçabilité), structuré pour transmission au médecin prescripteur.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Identification**
**2. Anamnèse**
**3. Examen clinique kinésithérapique**
**4. Diagnostic kinésithérapique**
**5. Objectifs de rééducation**
**6. Programme de soins prévu**
**7. Réévaluation**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme article R4321-2 CSP (BDK obligatoire)
- Référentiel HAS pour pathologies courantes
- Cotation NGAP appropriée (AMS, AMK, AMC)
- Pas de diagnostic médical (réservé médecin)`
    },
    {
      id: 'kine-2', catKey: 'kine', cat: 'Kinésithérapeute', icon: '🦵', color: '#34d399',
      title: "Programme d'exercices à domicile",
      prompt: `**RÔLE**
Tu es masseur-kinésithérapeute formé à l'éducation thérapeutique et à l'auto-rééducation dirigée.

**MON CONTEXTE**
- Pathologie : [zone, diagnostic médical]
- Phase de rééducation : [aiguë / sub-aiguë / consolidation]
- Capacités du patient : [autonomie, compréhension, motivation]
- Matériel disponible : [aucun / élastique / haltères / ballon]

**TA MISSION**
Rédige un programme d'auto-rééducation à domicile avec photos/schémas et grille de suivi.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Pourquoi ces exercices ?**
**2. Règles d'or**
**3. Programme du jour (20-30 minutes)**
**4. Grille de suivi à remplir**
**5. Quand consulter ?**
**6. Progression**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme aux objectifs du BDK
- Pas d'exercice contre-indiqué
- Auto-rééducation = complément (pas remplacement)
- Réévaluation à chaque séance kiné`
    },
    {
      id: 'kine-3', catKey: 'kine', cat: 'Kinésithérapeute', icon: '🦵', color: '#34d399',
      title: 'Compte-rendu de fin de rééducation',
      prompt: `**RÔLE**
Tu es masseur-kinésithérapeute libéral en charge du suivi et de la transmission au médecin prescripteur en fin de prise en charge.

**MON CONTEXTE**
- Patient : [identité, pathologie, prescription initiale]
- Nombre de séances réalisées : [X]
- Évolution constatée : [favorable / partielle / défavorable]
- Objectifs atteints / non atteints : [liste]

**TA MISSION**
Rédige le compte-rendu de fin de rééducation transmis au médecin prescripteur.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**[En-tête cabinet]**
**Objet** : Compte-rendu de fin de rééducation, [Patient initiales]

**Cher Confrère, Chère Consœur,**
[Corps structuré : bilan initial, programme réalisé, bilan final, synthèse, conseils, suite proposée]

**[Signature MK]**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme exigences CNAM (justification du nombre de séances)
- Argumentation chiffrée (avant/après)
- Référence au médecin pour renouvellement`
    },
    {
      id: 'kine-4', catKey: 'kine', cat: 'Kinésithérapeute', icon: '🦵', color: '#34d399',
      title: 'Programme rééducation respiratoire BPCO',
      prompt: `**RÔLE**
Tu es masseur-kinésithérapeute spécialisé en rééducation respiratoire, formé aux recommandations GOLD 2024 et HAS BPCO.

**MON CONTEXTE**
- Patient : [âge, BPCO stade GOLD]
- EFR récente : [VEMS, CVF, Tiffeneau]
- Symptômes : [dyspnée mMRC, expectorations, asthénie]
- Comorbidités : [cardiovasculaires, ostéoporose, dépression]

**TA MISSION**
Construis un programme structuré de réhabilitation respiratoire en 20 séances.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Bilan initial**
**2. Objectifs**
**3. Programme type (90 min/séance)**
**4. Surveillance pendant la séance**
**5. Éducation thérapeutique**
**6. Auto-réentraînement à domicile**
**7. Évaluation finale (séance 20)**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme recommandations GOLD 2024
- Surveillance permanente SpO2
- Référence pneumologue si dégradation
- Cotation NGAP : AMK 9 (rééducation respiratoire)`
    },
    {
      id: 'kine-5', catKey: 'kine', cat: 'Kinésithérapeute', icon: '🦵', color: '#34d399',
      title: 'Plan de prévention chute personne âgée',
      prompt: `**RÔLE**
Tu es masseur-kinésithérapeute spécialisé en gériatrie, formé aux recommandations HAS prévention des chutes (2024).

**MON CONTEXTE**
- Patient : [âge, autonomie GIR, vie à domicile/EHPAD]
- ATCD chutes : [nombre/an]
- Tests réalisés : [Tinetti, Timed Up and Go, station unipodale]
- Comorbidités : [Parkinson, AVC, arthrose, polymédication]

**TA MISSION**
Construis un plan de prévention des chutes en 12 séances avec objectifs mesurables.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Évaluation initiale**
**2. Évaluation environnementale (questionnaire patient)**
**3. Programme rééducatif (12 séances)**
**4. Travail de la chute (séances 8-12)**
**5. Conseils environnementaux**
**6. Éducation et orientation**
**7. Évaluation finale**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme recommandations HAS 2024
- Coordination ergothérapeute pour aménagement
- Référence médecin pour bilan polymédication`
    },
    {
      id: 'kine-6', catKey: 'kine', cat: 'Kinésithérapeute', icon: '🦵', color: '#34d399',
      title: "Demande d'entente préalable rééducation lourde",
      prompt: `**RÔLE**
Tu es masseur-kinésithérapeute libéral en charge des dossiers d'entente préalable auprès du service médical CPAM.

**MON CONTEXTE**
- Patient : [identité, pathologie, ALD]
- Prescription initiale : [nombre séances déjà réalisées]
- Argumentation médicale : [pathologie chronique, complications]
- Renouvellement souhaité : [nombre séances supplémentaires]

**TA MISSION**
Rédige le dossier d'entente préalable avec argumentation factuelle et chiffrée.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**[En-tête cabinet]**
**Demande d'entente préalable, Rééducation kinésithérapique**
**Patient / Pathologie / Référentiel HAS appliqué / Bilan diagnostic kinésithérapique / Évolution constatée / Objectifs restants / Programme proposé / Réévaluation prévue / Date, signature MK / Pièces jointes**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Argumentation chiffrée obligatoire
- Référence au référentiel HAS
- Pas de demande forfaitaire sans justification
- Dépôt avant épuisement des séances initiales`
    },
    {
      id: 'kine-7', catKey: 'kine', cat: 'Kinésithérapeute', icon: '🦵', color: '#34d399',
      title: 'Information patient post-PTH',
      prompt: `**RÔLE**
Tu es masseur-kinésithérapeute spécialisé en rééducation post-chirurgicale orthopédique.

**MON CONTEXTE**
- Patient : [âge, profession, latéralité, type prothèse]
- Délai post-op : [J+X]
- Voie d'abord : [antérieure / postérieure / latérale]
- Consignes chirurgien : [appui, mouvements interdits, durée]

**TA MISSION**
Rédige une fiche d'information remise au patient à la sortie d'hospitalisation, claire et rassurante.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Votre prothèse de hanche**
**2. Les 6 premières semaines, Précautions**
**3. Programme de rééducation**
**4. Signes qui doivent alerter**
**5. Suivi à prévoir**
**6. Reprise des activités**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Validation chirurgien orthopédiste
- Adaptation aux consignes spécifiques
- Pas d'invention de protocole
- Conforme protocoles SOFCOT`
    },
    {
      id: 'kine-8', catKey: 'kine', cat: 'Kinésithérapeute', icon: '🦵', color: '#34d399',
      title: 'Trame de réunion pluridisciplinaire MSP/CPTS',
      prompt: `**RÔLE**
Tu es masseur-kinésithérapeute coordonnateur dans une CPTS, en charge de l'animation des réunions de concertation pluriprofessionnelle.

**MON CONTEXTE**
- Type réunion : [RCP cas complexe / coordination patient chronique]
- Participants : [médecin, IDE, kiné, ergo, AS, psy, assistante sociale]
- Patient présenté : [âge, pathologie, situation]

**TA MISSION**
Construis la trame de réunion avec ordre du jour, déroulé minuté et compte-rendu type.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Convocation (envoyée 7 jours avant)**
**2. Ordre du jour type**
**3. Présentation du patient (10 min)**
**4. Tour des intervenants (10 min)**
**5. Construction du plan personnalisé**
**6. Compte-rendu type**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Confidentialité absolue (initiales si compte-rendu diffusé)
- Validation patient pour partage information (loi 26 janvier 2016)
- Cotation forfait coordination CPTS`
    },
    {
      id: 'kine-9', catKey: 'kine', cat: 'Kinésithérapeute', icon: '🦵', color: '#34d399',
      title: 'Protocole rééducation post-AVC',
      prompt: `**RÔLE**
Tu es masseur-kinésithérapeute spécialisé en neurologie, formé aux recommandations HAS AVC et aux concepts Bobath et Perfetti.

**MON CONTEXTE**
- Patient : [âge, type AVC, hémiparésie côté]
- Délai post-AVC : [phase aiguë / sub-aiguë / chronique]
- Capacités actuelles : [Barthel, MIF, Fugl-Meyer]
- Objectifs patient : [marche, AVQ, retour domicile]

**TA MISSION**
Construis le protocole de rééducation adapté à la phase, avec progression et critères de réévaluation.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Évaluation initiale**
**2. Phase aiguë (J0 - J15), 30 min/séance**
**3. Phase sub-aiguë (J15 - 3 mois), 45-60 min/séance**
**4. Phase chronique (>3 mois)**
**5. Coordination pluridisciplinaire**
**6. Critères de réévaluation**
**7. Éducation thérapeutique**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme HAS AVC 2018
- Coordination équipe MPR
- Cotation appropriée (AMK 9 ou 10)`
    },
    {
      id: 'kine-10', catKey: 'kine', cat: 'Kinésithérapeute', icon: '🦵', color: '#34d399',
      title: 'Conseils ergonomie pour patient sédentaire',
      prompt: `**RÔLE**
Tu es masseur-kinésithérapeute formé en ergonomie et prévention TMS, intervenant en cabinet et en entreprise.

**MON CONTEXTE**
- Patient : [profession, poste de travail]
- Symptômes : [cervicalgie / lombalgie / TMS membre supérieur]
- Heures écran/jour : [X]
- Aménagements actuels : [siège, écran, repose-pieds]

**TA MISSION**
Rédige une fiche conseils ergonomie personnalisée avec photos et exercices micro-pauses.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Votre poste de travail, Vérification**
**2. Les micro-pauses, 1 minute toutes les heures**
**3. Programme global**
**4. Aménagements à demander à l'employeur**
**5. Symptômes à surveiller**
**6. Activités physiques recommandées**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Évaluation individualisée nécessaire
- Pas de prescription matériel sans évaluation médecin/ergo
- Coordination médecin du travail`
    },
    {
      id: 'kine-11', catKey: 'kine', cat: 'Kinésithérapeute', icon: '🦵', color: '#34d399',
      title: 'Bilan kinésithérapie respiratoire pédiatrique',
      prompt: `**RÔLE**
Tu es masseur-kinésithérapeute formé à la kinésithérapie respiratoire pédiatrique selon recommandations conférence consensus 2000 et HAS bronchiolite 2019.

**MON CONTEXTE**
- Enfant : [âge en mois, poids, ATCD]
- Pathologie : [bronchiolite / mucoviscidose / asthme]
- Symptômes : [encombrement, dyspnée, alimentation, sommeil]
- Saturation : [valeur si mesurée]

**TA MISSION**
Réalise un bilan complet et rédige la transmission au pédiatre.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Anamnèse**
**2. Examen clinique**
**3. Évaluation gravité (HAS bronchiolite)**
**4. Modalités de prise en charge**
**5. Signes d'alerte (consultation immédiate)**
**6. Compte-rendu pédiatre**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme HAS bronchiolite 2019
- Pas de kinésithérapie systématique en bronchiolite
- Référence pédiatrique immédiate si gravité`
    },
    {
      id: 'kine-12', catKey: 'kine', cat: 'Kinésithérapeute', icon: '🦵', color: '#34d399',
      title: 'Préparation participation à un congrès professionnel',
      prompt: `**RÔLE**
Tu es masseur-kinésithérapeute en charge de votre développement professionnel continu (DPC) et de la valorisation de votre pratique.

**MON CONTEXTE**
- Type de participation : [auditeur / poster / communication orale]
- Sujet de la présentation : [thème, public]
- Niveau : [régional / national / international]
- Durée disponible : [10 min / 20 min / 45 min]

**TA MISSION**
Construis la structure complète de la communication scientifique.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Choix du format**
**2. Structure type d'une communication**
**3. Préparation pratique**
**4. Questions fréquemment posées**
**5. Après la communication**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Respect des règles déontologiques
- Déclaration des conflits d'intérêts
- Protection des patients (anonymisation)`
    },

    // ═════════════════════════════════════════════════════════
    //  7. PHARMACIEN(NE) — 12 prompts
    // ═════════════════════════════════════════════════════════
    {
      id: 'pharma-1', catKey: 'pharma', cat: 'Pharmacien(ne)', icon: '💊', color: '#60a5fa',
      title: "Conciliation médicamenteuse à l'admission",
      prompt: `**RÔLE**
Tu es pharmacien clinicien hospitalier, formé à la conciliation médicamenteuse selon recommandations HAS 2018.

**MON CONTEXTE**
- Patient : [âge, motif hospitalisation, service]
- Sources d'information : [ordonnances, dossier pharmaceutique DP, médecin traitant, famille, pharmacie de ville]
- Médicaments à domicile : [liste fournie]

**TA MISSION**
Conduis la conciliation médicamenteuse d'entrée (CME) et rédige la fiche de conciliation transmise au médecin prescripteur.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Sources consultées (minimum 3)**
**2. Bilan médicamenteux optimisé (BMO)**
**3. Comparaison BMO vs prescription d'entrée**
**4. Divergences non intentionnelles repérées**
**5. Transmission au médecin**
**6. Traçabilité**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme HAS conciliation 2018
- Sources multiples obligatoires (3 minimum)
- Pas d'oubli médicaments d'automédication`
    },
    {
      id: 'pharma-2', catKey: 'pharma', cat: 'Pharmacien(ne)', icon: '💊', color: '#60a5fa',
      title: 'Avis pharmaceutique sur ordonnance complexe',
      prompt: `**RÔLE**
Tu es pharmacien clinicien spécialisé dans l'optimisation thérapeutique du sujet âgé polymédiqué (critères Beers, STOPP/START).

**MON CONTEXTE**
- Patient : [âge, fonction rénale DFG, comorbidités]
- Ordonnance complète : [DCI, dosages, posologies]
- Antécédents : [insuffisance rénale, hépatique, troubles cognitifs]

**TA MISSION**
Réalise l'analyse pharmaceutique complète et rédige l'avis transmis au prescripteur.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Analyse globale**
**2. Vérifications systématiques**
**3. Synthèse et propositions**
**4. Avis transmis au prescripteur**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Référentiels validés (Beers, STOPP/START, Thériaque)
- Pas de modification sans accord prescripteur
- Référence à la fonction rénale obligatoire`
    },
    {
      id: 'pharma-3', catKey: 'pharma', cat: 'Pharmacien(ne)', icon: '💊', color: '#60a5fa',
      title: 'Entretien pharmaceutique patient sous AVK',
      prompt: `**RÔLE**
Tu es pharmacien d'officine formé aux entretiens pharmaceutiques anticoagulants oraux (avenant n°1 convention pharmaceutique).

**MON CONTEXTE**
- Patient : [âge, indication AVK, durée traitement]
- AVK : [warfarine / fluindione / acénocoumarol]
- INR cible : [2-3 / 2,5-3,5]
- INR récents : [valeurs]

**TA MISSION**
Conduis l'entretien pharmaceutique structuré et rédige la fiche de suivi transmise au médecin.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Éducation thérapeutique, Compréhension du traitement**
**2. Adhésion au traitement**
**3. Alimentation**
**4. Médicaments à éviter en automédication**
**5. Signes d'alerte**
**6. Conduite à tenir si oubli**
**7. Synthèse pour le médecin**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme avenant convention nationale pharmaceutique
- Coordination médecin
- Documentation (cotation TIRF AVK)`
    },
    {
      id: 'pharma-4', catKey: 'pharma', cat: 'Pharmacien(ne)', icon: '💊', color: '#60a5fa',
      title: "Gestion de rupture d'approvisionnement",
      prompt: `**RÔLE**
Tu es pharmacien titulaire d'officine, formé à la gestion des ruptures conformément aux décrets ANSM 2021-2024.

**MON CONTEXTE**
- Médicament en rupture : [DCI, dosage, forme]
- Cause de rupture : [tension d'approvisionnement / arrêt commercial]
- Patients concernés : [nombre, profil]
- Indication : [pathologie traitée]

**TA MISSION**
Construis le plan d'action complet : information patient, alternatives, coordination prescripteur.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Vérification du statut**
**2. Alternatives possibles**
**3. Information patient**
**4. Coordination prescripteur**
**5. Documentation et déclaration**
**6. Suivi**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme article L5121-30 CSP
- Pas de substitution sans information patient
- Validation médecin pour changement`
    },
    {
      id: 'pharma-5', catKey: 'pharma', cat: 'Pharmacien(ne)', icon: '💊', color: '#60a5fa',
      title: 'Plan de pharmacovigilance officinale',
      prompt: `**RÔLE**
Tu es pharmacien d'officine formé à la pharmacovigilance et à la déclaration des effets indésirables (signalement.social-sante.gouv.fr).

**MON CONTEXTE**
- Effet indésirable observé : [description]
- Médicament suspecté : [DCI, dosage, durée]
- Patient : [âge, sexe, poids, ATCD]
- Gravité : [non grave / grave / décès]

**TA MISSION**
Rédige le signalement de pharmacovigilance via le portail des signalements.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Évaluation de la déclaration**
**2. Patient**
**3. Médicament suspecté**
**4. Médicaments associés**
**5. Effet indésirable**
**6. Imputabilité (méthode française)**
**7. Examens réalisés**
**8. Issue**
**9. Notifiant**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Obligation de déclaration article R5121-161 CSP
- Délai 15 jours (effets graves : 24h-72h)
- Anonymisation patient`
    },
    {
      id: 'pharma-6', catKey: 'pharma', cat: 'Pharmacien(ne)', icon: '💊', color: '#60a5fa',
      title: 'Conseil officinal pour pathologie courante',
      prompt: `**RÔLE**
Tu es pharmacien d'officine formé au conseil et à l'orientation, conforme aux recommandations CESPHARM et HAS premier recours.

**MON CONTEXTE**
- Pathologie : [rhinopharyngite / gastro-entérite / lombalgie / poux / brûlure légère]
- Patient : [âge, profil, comorbidités, traitements]
- Demande : [conseil seul / médicaments OTC]

**TA MISSION**
Construis l'arbre de décision conseil avec critères d'orientation médicale.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Recueil information**
**2. Critères d'orientation médicale (consultation immédiate)**
**3. Conseil officinal (si pas d'orientation médicale)**
**4. Information patient**
**5. Suivi**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Pas de diagnostic médical
- Référence médecin systématique si red flag
- Conformité RCP des produits conseillés`
    },
    {
      id: 'pharma-7', catKey: 'pharma', cat: 'Pharmacien(ne)', icon: '💊', color: '#60a5fa',
      title: 'Procédure de préparation magistrale',
      prompt: `**RÔLE**
Tu es pharmacien d'officine ou hospitalier en charge des préparations magistrales selon BPP (Bonnes Pratiques de Préparation).

**MON CONTEXTE**
- Type de préparation : [gélules / pommade / solution / suppositoire]
- Composition : [principe actif, excipients]
- Volume / quantité : [unitaire ou multiple]
- Patient : [allergies, contre-indications]

**TA MISSION**
Rédige la procédure complète conforme aux BPP, traçable et reproductible.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Validation préalable de la prescription**
**2. Documentation**
**3. Mode opératoire**
**4. Contrôles**
**5. Étiquette réglementaire**
**6. Traçabilité (ordonnancier)**
**7. Conservation et délivrance**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme BPP du 21 novembre 2006
- Documentation rigoureuse (article R5125-29 CSP)
- Étiquetage réglementaire complet`
    },
    {
      id: 'pharma-8', catKey: 'pharma', cat: 'Pharmacien(ne)', icon: '💊', color: '#60a5fa',
      title: 'Plan de communication vaccination en officine',
      prompt: `**RÔLE**
Tu es pharmacien d'officine vaccinateur (compétence depuis arrêté 8 août 2023), formé au protocole de vaccination des personnes de 11 ans et plus.

**MON CONTEXTE**
- Vaccins proposés : [grippe / COVID / DTP / coqueluche / VHB / méningo / pneumo]
- Saison : [campagne grippe / hors saison]
- Public cible : [tout public éligible]

**TA MISSION**
Construis le plan de communication officinal pour la campagne vaccination.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Vaccins éligibles à la pharmacie (pharmacien)**
**2. Communication en vitrine**
**3. Posters et flyers**
**4. Procédure d'accueil**
**5. Traçabilité**
**6. Coordination**
**7. Tarification**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Formation DPC vaccination obligatoire
- Conforme arrêté 8 août 2023
- Matériel d'urgence anaphylaxie obligatoire`
    },
    {
      id: 'pharma-9', catKey: 'pharma', cat: 'Pharmacien(ne)', icon: '💊', color: '#60a5fa',
      title: 'Bilan partagé de médication (BPM)',
      prompt: `**RÔLE**
Tu es pharmacien d'officine formé au Bilan Partagé de Médication (BPM) selon convention nationale 2018 et avenants suivants.

**MON CONTEXTE**
- Patient éligible : [65+ avec ALD ou polymédiqué (≥5 lignes), 75+]
- Médecin traitant : [coordonnées]
- Première séance ou suivi : [BPM 1 / Renouvellement]
- Médicaments : [liste complète]

**TA MISSION**
Conduis le BPM en 4 étapes et rédige la synthèse partagée avec le médecin traitant.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**Étape 1, Recueil d'information (30-45 min)**
**Étape 2, Analyse pharmaceutique**
**Étape 3, Entretien conseils**
**Étape 4, Synthèse partagée**
**Prochain RDV**
**Cotation**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme convention pharmaceutique (avenant 11)
- Validation médecin traitant
- Pas de modification ordonnance sans accord`
    },
    {
      id: 'pharma-10', catKey: 'pharma', cat: 'Pharmacien(ne)', icon: '💊', color: '#60a5fa',
      title: 'Procédure pour dispensation stupéfiants',
      prompt: `**RÔLE**
Tu es pharmacien titulaire ou adjoint, en charge de la dispensation des médicaments stupéfiants (annexe arrêté 22 février 1990).

**MON CONTEXTE**
- Médicament : [DCI, dosage, forme]
- Type prescription : [ambulatoire / établissement]
- Quantité prescrite : [unités]
- Durée : [respect maximum réglementaire]

**TA MISSION**
Vérifie la conformité de la prescription et procède à la dispensation tracée.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Contrôle de la prescription**
**2. Vérification de la durée maximale**
**3. Mode de délivrance**
**4. Inscription au registre des stupéfiants**
**5. Marquage de l'ordonnance**
**6. Information patient**
**7. Cas particuliers**
**8. Stockage en officine**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme article R5132-29 et suivants CSP
- Registre obligatoire 10 ans
- Coffre sécurisé avec inventaire`
    },
    {
      id: 'pharma-11', catKey: 'pharma', cat: 'Pharmacien(ne)', icon: '💊', color: '#60a5fa',
      title: 'Plan de formation continue équipe officinale',
      prompt: `**RÔLE**
Tu es pharmacien titulaire en charge du développement professionnel continu de votre équipe officinale (préparateurs, étudiants en pharmacie, adjoints).

**MON CONTEXTE**
- Effectif équipe : [X préparateurs, Y adjoints]
- Domaines à renforcer : [vente conseil, fidélisation, vaccination, pharmacovigilance]
- Budget formation : [annuel]

**TA MISSION**
Construis le plan de formation annuel intégrant DPC obligatoire et besoins équipe.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Cadre légal DPC**
**2. Diagnostic des besoins (questionnaire équipe)**
**3. Plan annuel par axe**
**4. Modalités pratiques**
**5. Suivi et évaluation**
**6. Budget annuel**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme obligation DPC (article L4021-1 CSP)
- Validation organismes agréés ANDPC
- Plan validé avec équipe`
    },
    {
      id: 'pharma-12', catKey: 'pharma', cat: 'Pharmacien(ne)', icon: '💊', color: '#60a5fa',
      title: 'Audit qualité officinale (BPO)',
      prompt: `**RÔLE**
Tu es pharmacien titulaire référent qualité, en charge de l'audit annuel selon Bonnes Pratiques de Dispensation (arrêté 28 novembre 2016).

**MON CONTEXTE**
- Type d'audit : [annuel / suite à incident / pré-inspection]
- Équipe : [titulaire, adjoints, préparateurs]
- Outils qualité disponibles : [SOP, manuel qualité, indicateurs]

**TA MISSION**
Construis la grille d'audit qualité officinale avec critères et plan d'action.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Domaines à auditer**
**2. Indicateurs de suivi**
**3. Synthèse**
**4. Plan d'action**
**5. Réévaluation**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme BPD arrêté 28 nov 2016
- Documentation systématique
- Conservation 5 ans`
    },

    // ═════════════════════════════════════════════════════════
    //  8. AUXILIAIRE DE PUÉRICULTURE — 10 prompts
    // ═════════════════════════════════════════════════════════
    {
      id: 'ap-1', catKey: 'ap', cat: 'Auxiliaire de puériculture', icon: '🍼', color: '#fbbf24',
      title: 'Transmission ciblée nourrisson en crèche',
      prompt: `**RÔLE**
Tu es un(e) auxiliaire de puériculture (AP) diplômé(e) DEAP exerçant en crèche collective (multi-accueil).

**MON CONTEXTE**
- Enfant : [prénom, âge en mois]
- Date / horaire d'accueil : [date, heure d'arrivée et de départ]
- Sieste : [heure de coucher, heure de réveil, durée totale, qualité]
- Repas : [matin/midi/goûter, ce qui a été pris ou refusé, quantités]
- Selles / change : [nombre, aspect, anomalies éventuelles]
- Comportement / interactions : [éveil, jeu, pleurs, séparation parents]
- Acquisitions du jour : [motricité, langage, propreté]
- Élément à signaler aux parents : [chute, bobo, fièvre, contact familial]

**TA MISSION**
Rédige une transmission écrite quotidienne destinée aux parents et au cahier de transmission interne, factuelle et bienveillante.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Transmission parents (5 lignes maximum, ton chaleureux)**
**2. Transmission interne équipe (tableau)**
**3. Point à signaler aux parents oralement**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Vocabulaire simple, jamais de jargon médical
- Pas de jugement sur les parents ni l'enfant
- Conforme aux pratiques de transmission en EAJE`
    },
    {
      id: 'ap-2', catKey: 'ap', cat: 'Auxiliaire de puériculture', icon: '🍼', color: '#fbbf24',
      title: "Activité d'éveil adaptée à l'âge",
      prompt: `**RÔLE**
Tu es un(e) auxiliaire de puériculture en charge des activités d'éveil dans une section de [bébés / moyens / grands].

**MON CONTEXTE**
- Tranche d'âge : [ex. 12 à 18 mois]
- Nombre d'enfants : [n]
- Durée disponible : [15-30 min]
- Saison / thème : [automne, animaux, couleurs]
- Matériel disponible : [feuilles, peinture comestible, foulards, instruments]
- Objectif visé : [motricité fine, langage, sensoriel, socialisation]

**TA MISSION**
Propose une fiche d'activité d'éveil détaillée, sécurisée et adaptée au stade de développement.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Fiche activité**
**2. Déroulement (étapes numérotées)**
**3. Points de vigilance sécurité**
**4. Adaptations possibles**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme aux recommandations de la Charte nationale d'accueil du jeune enfant
- Aucun matériel dangereux
- Respect du rythme de l'enfant`
    },
    {
      id: 'ap-3', catKey: 'ap', cat: 'Auxiliaire de puériculture', icon: '🍼', color: '#fbbf24',
      title: 'Réponse à un parent inquiet',
      prompt: `**RÔLE**
Tu es un(e) auxiliaire de puériculture confronté(e) à un parent inquiet ou contrarié.

**MON CONTEXTE**
- Sujet de la préoccupation : [ex. l'enfant a peu mangé, pleure beaucoup, a une rougeur]
- Ce que les parents demandent : [explications, solutions, rassurance]
- Tonalité parentale : [inquiète / anxieuse / agacée]
- Ce qui s'est réellement passé : [faits observés à la crèche]

**TA MISSION**
Rédige une réponse orale type, empathique et factuelle, à dire au parent au moment des retrouvailles.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Phrase d'accueil (reconnaissance émotion)**
**2. Restitution factuelle**
**3. Action mise en place**
**4. Conseil ou prochaine étape**
**5. Ouverture au dialogue**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Empathie sans flatterie
- Aucune posture défensive
- Pas de promesse impossible à tenir
- Renvoyer vers la directrice ou le médecin de crèche pour toute question médicale`
    },
    {
      id: 'ap-4', catKey: 'ap', cat: 'Auxiliaire de puériculture', icon: '🍼', color: '#fbbf24',
      title: 'Aide aux soins en service de néonatalogie',
      prompt: `**RÔLE**
Tu es un(e) auxiliaire de puériculture en service de néonatalogie ou unité kangourou.

**MON CONTEXTE**
- Profil bébé : [terme, poids actuel, jour de vie]
- Soin à réaliser : [bain, change, peau à peau, aide tétée, pesée]
- Équipement de monitoring : [scope, SpO2, sonde de gavage]
- Présence parentale : [oui / non, niveau d'autonomie]

**TA MISSION**
Décris la procédure de soin sécurisée et l'accompagnement parental associé.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Préparation (checklist)**
**2. Déroulement du soin**
**3. Surveillance pendant le soin**
**4. Accompagnement parental**
**5. Traçabilité**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Aucun acte délégué non autorisé
- Alerter IDE/IPDE pour toute modification clinique
- Respect du décret de compétences AP`
    },
    {
      id: 'ap-5', catKey: 'ap', cat: 'Auxiliaire de puériculture', icon: '🍼', color: '#fbbf24',
      title: "Préparation de l'adaptation en crèche",
      prompt: `**RÔLE**
Tu es un(e) auxiliaire de puériculture référent(e) d'une nouvelle famille entrant en crèche.

**MON CONTEXTE**
- Enfant : [prénom, âge]
- Date d'entrée prévue : [date]
- Mode d'accueil : [temps plein, temps partiel]
- Antécédents particuliers : [allergie, PAI, suivi spécifique]
- Disponibilité parents pour l'adaptation : [nombre de jours, demi-journées]

**TA MISSION**
Construis un planning d'adaptation progressive sur 1 à 2 semaines et la trame de l'entretien d'accueil.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Planning type adaptation (tableau)**
**2. Trame entretien d'accueil parents**
**3. Document à remettre aux parents**
**4. Communication équipe**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Respect du rythme propre à chaque enfant
- Pas de séparation forcée
- Recueil signé du consentement parental`
    },
    {
      id: 'ap-6', catKey: 'ap', cat: 'Auxiliaire de puériculture', icon: '🍼', color: '#fbbf24',
      title: 'Conseil sur le sommeil du nourrisson',
      prompt: `**RÔLE**
Tu es un(e) auxiliaire de puériculture qui répond aux questions des parents sur le sommeil.

**MON CONTEXTE**
- Âge de l'enfant : [mois]
- Difficulté décrite par les parents : [endormissement, réveils nocturnes, sieste courte]
- Habitudes actuelles : [bercement, biberon nuit, cododo, doudou, tétine]
- Environnement de couchage : [lit à barreaux, gigoteuse, température chambre]

**TA MISSION**
Rédige une réponse écrite ou orale destinée aux parents, basée sur les recommandations officielles du sommeil sécurisé du nourrisson.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Rappel des règles de sécurité (tableau)**
**2. Conseils adaptés à la situation**
**3. Ce qu'il faut éviter**
**4. Quand orienter vers le médecin**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Sources : Santé Publique France, recommandations MIN
- Aucun conseil médical individuel
- Renvoyer au pédiatre si doute clinique`
    },
    {
      id: 'ap-7', catKey: 'ap', cat: 'Auxiliaire de puériculture', icon: '🍼', color: '#fbbf24',
      title: 'Détection précoce de troubles du développement',
      prompt: `**RÔLE**
Tu es un(e) auxiliaire de puériculture, professionnel(le) de proximité observant les enfants au quotidien.

**MON CONTEXTE**
- Âge de l'enfant : [mois]
- Observation depuis : [n semaines]
- Signaux qui m'inquiètent : [ex. pas de babillage, pas de marche à 18 mois, pas de regard]
- Comportement décrit : [retrait, agitation, refus de contact]

**TA MISSION**
Aide-moi à structurer mes observations pour les transmettre à la directrice et au médecin de crèche, en référence aux signaux d'alerte développementaux.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Tableau d'observation structurée**
**2. Signaux d'alerte repérés**
**3. Pré-rapport à la directrice**
**4. Orientation suggérée**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Aucun diagnostic posé
- Vocabulaire descriptif, pas étiquetant
- Référence aux repères de développement officiels`
    },
    {
      id: 'ap-8', catKey: 'ap', cat: 'Auxiliaire de puériculture', icon: '🍼', color: '#fbbf24',
      title: 'Repas du jeune enfant et diversification',
      prompt: `**RÔLE**
Tu es un(e) auxiliaire de puériculture en charge des repas en crèche ou à domicile.

**MON CONTEXTE**
- Âge enfant : [mois]
- Étape de diversification : [purée lisse, morceaux écrasés, finger food, repas familial]
- Allergies / PAI : [oui / non, lesquelles]
- Comportement à table : [bonne participation, refus, lenteur, pleurs]

**TA MISSION**
Propose une approche d'accompagnement du repas adaptée à l'âge et au comportement de l'enfant, conforme aux repères PNNS et recommandations de diversification.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Texture et types d'aliments adaptés (tableau)**
**2. Posture professionnelle au repas**
**3. Gestion d'un refus alimentaire**
**4. Sécurité (anti étouffement)**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Référence PNNS et carnet de santé
- Aucun forcing alimentaire
- Respect du PAI s'il existe`
    },
    {
      id: 'ap-9', catKey: 'ap', cat: 'Auxiliaire de puériculture', icon: '🍼', color: '#fbbf24',
      title: 'Hygiène et désinfection des locaux',
      prompt: `**RÔLE**
Tu es un(e) auxiliaire de puériculture responsable du protocole hygiène d'une section de crèche.

**MON CONTEXTE**
- Type de surface ou matériel : [tapis d'éveil, jouets, table à langer, poignées, sols]
- Produit utilisé : [détergent-désinfectant, virucide, eau de Javel diluée]
- Fréquence actuelle : [quotidienne, après chaque change, hebdomadaire]
- Contexte épidémique : [oui / non, GEA, bronchiolite, gale]

**TA MISSION**
Rédige le protocole de nettoyage et désinfection adapté, conforme aux recommandations HCSP et au guide pratique du jeune enfant.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Protocole en 5 étapes**
**2. Tableau de fréquence**
**3. Cas particulier épidémie**
**4. Sécurité produit**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme HCSP et guide pratique du jeune enfant en collectivité
- Respect dilution fabricant
- Aucun mélange produit`
    },
    {
      id: 'ap-10', catKey: 'ap', cat: 'Auxiliaire de puériculture', icon: '🍼', color: '#fbbf24',
      title: "Accueil d'un enfant en situation de handicap",
      prompt: `**RÔLE**
Tu es un(e) auxiliaire de puériculture impliqué(e) dans l'accueil d'un enfant en situation de handicap (loi du 11 février 2005).

**MON CONTEXTE**
- Type de handicap ou trouble : [moteur, sensoriel, autisme, polyhandicap, retard global]
- Âge enfant : [mois]
- Documents disponibles : [PAI, GEVA-Sco, comptes-rendus pédiatriques]
- Aménagements nécessaires : [matériels, humains, organisationnels]
- Accompagnement extérieur : [SESSAD, CAMSP, PMI]

**TA MISSION**
Construis un projet d'accueil individualisé adapté pour l'inclusion en collectivité.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Synthèse du profil enfant**
**2. Aménagements (tableau)**
**3. Coordination des partenaires**
**4. Trame de réunion d'élaboration du PAI**
**5. Suivi**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Loi du 11 février 2005 sur l'inclusion
- Respect du secret partagé
- Validation médicale obligatoire`
    },

    // ═════════════════════════════════════════════════════════
    //  9. AMBULANCIER(ÈRE) — 10 prompts
    // ═════════════════════════════════════════════════════════
    {
      id: 'amb-1', catKey: 'amb', cat: 'Ambulancier(ère)', icon: '🚑', color: '#ef4444',
      title: 'Bilan secouriste structuré ABCDE',
      prompt: `**RÔLE**
Tu es ambulancier(ère) DEA en intervention sur SAMU/SMUR ou transport sanitaire urgent.

**MON CONTEXTE**
- Patient : [âge, sexe, antécédents connus]
- Lieu : [domicile, voie publique, EHPAD, cabinet médical]
- Motif d'appel : [malaise, chute, douleur, dyspnée]
- Présence d'un médecin sur place : [oui / non]
- Constantes initiales : [PA, FC, FR, SpO2, T°, glycémie, Glasgow]

**TA MISSION**
Rédige un bilan ambulancier structuré ABCDE à transmettre au régulateur SAMU 15.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Identification de la situation**
**2. Bilan ABCDE (tableau)**
**3. Anamnèse SAMPLE**
**4. Hypothèses et orientation proposée**
**5. Demande au régulateur**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme aux référentiels SAMU
- Vocabulaire standardisé
- Aucun diagnostic posé
- Décret 2007-1301 sur les actes professionnels ambulanciers`
    },
    {
      id: 'amb-2', catKey: 'amb', cat: 'Ambulancier(ère)', icon: '🚑', color: '#ef4444',
      title: "Fiche d'intervention transport bariatrique",
      prompt: `**RÔLE**
Tu es ambulancier(ère) en charge d'un transport bariatrique programmé.

**MON CONTEXTE**
- Patient : [poids, taille, IMC, mobilité]
- Trajet : [domicile, hôpital, distance, étage, ascenseur]
- Type de transport : [VSL, ambulance bariatrique, brancard renforcé]
- Équipement à mobiliser : [sangle bariatrique, lève-personne, brancard renforcé]
- Personnel mobilisable : [n ambulanciers, renfort SDIS éventuel]

**TA MISSION**
Construis la fiche de préparation d'intervention pour sécuriser le transport.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Évaluation préalable (check-list)**
**2. Matériel à charger**
**3. Étapes du transfert**
**4. Prévention TMS équipe**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Respect dignité patient (ne pas commenter le poids)
- Vérification charge maximale matériel
- Décret 2007-1301
- Réglementation transport sanitaire ARS`
    },
    {
      id: 'amb-3', catKey: 'amb', cat: 'Ambulancier(ère)', icon: '🚑', color: '#ef4444',
      title: 'Conduite à tenir face à un malaise en transport',
      prompt: `**RÔLE**
Tu es ambulancier(ère) avec un patient se dégradant en cours de transport.

**MON CONTEXTE**
- Type de transport : [VSL, ambulance, urgent ou programmé]
- Trajet en cours : [origine, destination, durée restante]
- Symptômes apparus : [douleur thoracique, dyspnée, malaise, perte de connaissance, vomissements]
- Constantes au départ et actuelles : [comparaison]
- Matériel disponible à bord : [O2, DSA, aspirateur, scope]

**TA MISSION**
Établis la conduite à tenir immédiate, l'arbre décisionnel et la transmission au régulateur.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Évaluation immédiate (60 secondes)**
**2. Arbre décisionnel (tableau)**
**3. Bilan radio à transmettre**
**4. Réorientation possible**
**5. Traçabilité écrite**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Référentiel ambulancier
- Décret 2007-1301
- Aucun acte non autorisé
- Communication permanente avec le régulateur`
    },
    {
      id: 'amb-4', catKey: 'amb', cat: 'Ambulancier(ère)', icon: '🚑', color: '#ef4444',
      title: 'Réponse à un patient agressif ou anxieux',
      prompt: `**RÔLE**
Tu es ambulancier(ère) face à un patient ou un proche en état d'agitation, anxiété ou agressivité verbale.

**MON CONTEXTE**
- Profil : [patient, accompagnant, témoin]
- Situation : [refus de soin, refus de transport, agressivité verbale, alcoolisation]
- Risque vital : [oui / non]
- Présence forces de l'ordre : [oui / non]

**TA MISSION**
Propose-moi une stratégie de désescalade verbale et la conduite à tenir.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Phase d'évaluation (sécurité)**
**2. Phrases de désescalade (3 niveaux)**
**3. Conduite à tenir si refus de soin**
**4. Conduite à tenir si agressivité physique**
**5. Débriefing post-intervention**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Pas de contact physique de contention sans cadre légal
- Pas de jugement moral
- Respect autonomie patient capable
- Traçabilité écrite obligatoire`
    },
    {
      id: 'amb-5', catKey: 'amb', cat: 'Ambulancier(ère)', icon: '🚑', color: '#ef4444',
      title: 'Vérification matériel quotidienne',
      prompt: `**RÔLE**
Tu es ambulancier(ère) responsable de la vérification quotidienne d'une UMH ou ambulance privée.

**MON CONTEXTE**
- Type de véhicule : [Cat A, B ou C]
- Équipement présent : [O2, DSA, aspirateur, brancard, KTT, mallette urgence]
- Fréquence vérification : [début / fin de garde, chaque jour]

**TA MISSION**
Construis une check-list de vérification quotidienne complète.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Véhicule (extérieur, intérieur)**
**2. Matériel médical (tableau)**
**3. Documents administratifs**
**4. Consommables et hygiène**
**5. Traçabilité**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme arrêté du 12 décembre 2017 sur l'équipement des véhicules sanitaires
- Traçabilité ARS
- Aucun consommable périmé
- Hygiène conforme protocole entreprise`
    },
    {
      id: 'amb-6', catKey: 'amb', cat: 'Ambulancier(ère)', icon: '🚑', color: '#ef4444',
      title: "Préparation d'un transport longue distance",
      prompt: `**RÔLE**
Tu es ambulancier(ère) chargé(e) d'un transport longue distance (> 200 km) ou inter-régional.

**MON CONTEXTE**
- Patient : [pathologie, autonomie, traitements en cours]
- Trajet : [origine, destination, durée estimée, étapes]
- Type de transport : [VSL, ambulance simple, ambulance avec O2, transport médicalisé]
- Accompagnement : [seul, médecin, IDE, famille]

**TA MISSION**
Établis la fiche de préparation et le plan de mission.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Préparation patient (check-list)**
**2. Préparation véhicule**
**3. Plan de mission (tableau)**
**4. Surveillance pendant trajet**
**5. Procédure de repli**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Respect temps de conduite réglementaire
- Validation prescription médicale du transport (CERFA 11574)
- Sécurité routière prioritaire
- Pause toutes les 2h`
    },
    {
      id: 'amb-7', catKey: 'amb', cat: 'Ambulancier(ère)', icon: '🚑', color: '#ef4444',
      title: 'Document de transmission au service receveur',
      prompt: `**RÔLE**
Tu es ambulancier(ère) en fin d'intervention transmettant un patient à un service hospitalier.

**MON CONTEXTE**
- Patient : [identité, âge]
- Origine : [domicile, EHPAD, autre hôpital]
- Destination : [SAU, service spécialisé]
- Motif du transport : [pathologie, intervention programmée]
- Surveillance pendant trajet : [stabilité, dégradation, événement]

**TA MISSION**
Rédige la transmission orale et écrite à l'IDE d'accueil.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Transmission orale (90 secondes)**
**2. Transmission écrite (fiche bilan)**
**3. Effets personnels remis**
**4. Signature contradictoire**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Confidentialité respectée (transmission hors couloir)
- Pas d'interprétation diagnostique
- Lisibilité écrite
- Conservation copie 5 ans`
    },
    {
      id: 'amb-8', catKey: 'amb', cat: 'Ambulancier(ère)', icon: '🚑', color: '#ef4444',
      title: 'Réflexes en cas de tri / afflux de victimes',
      prompt: `**RÔLE**
Tu es ambulancier(ère) sur les lieux d'un événement à victimes multiples.

**MON CONTEXTE**
- Type d'événement : [AVP grave, incendie, effondrement, attaque]
- Nombre estimé de victimes : [n]
- Présence sur place : [pompiers, SMUR, force de l'ordre]
- Mon rôle : [premier sur place, renfort, ramassage]

**TA MISSION**
Décris les réflexes à appliquer, le tri START et la conduite à tenir.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Premiers réflexes (90 secondes)**
**2. Tri START (tableau)**
**3. Organisation du PRV (point de regroupement victimes)**
**4. Communication radio**
**5. Sortie de poste / débriefing**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme plan ORSEC NOVI
- Aucun engagement individuel sans coordination
- EPI adaptés
- Préservation des indices si scène criminelle`
    },
    {
      id: 'amb-9', catKey: 'amb', cat: 'Ambulancier(ère)', icon: '🚑', color: '#ef4444',
      title: 'Hygiène des mains et désinfection cellule sanitaire',
      prompt: `**RÔLE**
Tu es ambulancier(ère) en charge de la décontamination de la cellule sanitaire entre 2 transports.

**MON CONTEXTE**
- Type de patient transporté : [non infectieux, BMR, COVID, GEA, gale, plaie souillée]
- Matériel utilisé : [brancard, drap, électrodes, masque, KTT]
- Produits disponibles : [détergent-désinfectant, virucide, sporicide]
- Niveau de désinfection requis : [niveau 1, 2 ou 3]

**TA MISSION**
Décris le protocole de désinfection adapté au niveau requis.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Niveau de désinfection (tableau)**
**2. Étapes du protocole**
**3. Équipement à traiter spécifiquement**
**4. Cas particulier : suspicion COVID / BHRe**
**5. Traçabilité**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme HCSP, INRS
- Respect FDS produit
- DASRI / DAOM correctement triés
- Cahier de bord à jour`
    },
    {
      id: 'amb-10', catKey: 'amb', cat: 'Ambulancier(ère)', icon: '🚑', color: '#ef4444',
      title: 'Recyclage AFGSU 2 et entretien des compétences',
      prompt: `**RÔLE**
Tu es ambulancier(ère) souhaitant maintenir ses compétences AFGSU 2 et préparer ton recyclage.

**MON CONTEXTE**
- Date dernier AFGSU 2 : [JJ/MM/AAAA]
- Date prévisionnelle recyclage : [JJ/MM/AAAA]
- Temps disponible auto-formation : [h / mois]
- Situations rares déjà rencontrées : [ACR, accouchement inopiné, OAP, brûlé]

**TA MISSION**
Construis-moi un plan d'entretien des compétences sur 12 mois.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Compétences à entretenir (tableau)**
**2. Plan 12 mois**
**3. Ressources gratuites recommandées**
**4. Auto-évaluation**
**5. Préparation J-30 du recyclage**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Référentiel AFGSU 2 (arrêté du 1er juillet 2019)
- Pas de remplacement de la session présentielle
- Sources institutionnelles uniquement
- Recyclage tous les 4 ans obligatoire`
    },

    // ═════════════════════════════════════════════════════════
    //  10. MANIPULATEUR EN RADIOLOGIE — 10 prompts
    // ═════════════════════════════════════════════════════════
    {
      id: 'merm-1', catKey: 'merm', cat: 'Manipulateur en radiologie', icon: '🩻', color: '#8b5cf6',
      title: 'Préparation patient avant scanner injecté',
      prompt: `**RÔLE**
Tu es manipulateur(trice) en électroradiologie médicale (MERM) en service d'imagerie en coupe.

**MON CONTEXTE**
- Type d'examen : [TDM thoracique, abdominale, cérébrale]
- Patient : [âge, sexe, poids]
- Antécédents : [allergie iode, asthme, IRC, diabète]
- Traitement en cours : [metformine, AVK, corticoïde]
- DFG récent : [valeur en mL/min/1,73m²]

**TA MISSION**
Établis la check-list de préparation patient et la conduite avant injection de produit de contraste iodé.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Vérification administrative**
**2. Vérification clinique (tableau)**
**3. Information patient**
**4. Préparation matériel**
**5. Conduite à tenir si réaction**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme bonnes pratiques SFR / SFRMM
- Décret de compétences MERM
- Décision médicale d'injection sous responsabilité radiologue
- Aucune injection sans validation médicale`
    },
    {
      id: 'merm-2', catKey: 'merm', cat: 'Manipulateur en radiologie', icon: '🩻', color: '#8b5cf6',
      title: 'Optimisation des paramètres scanner pour réduction de dose',
      prompt: `**RÔLE**
Tu es MERM impliqué(e) dans la radioprotection patient et l'optimisation des examens scanner.

**MON CONTEXTE**
- Examen type : [TDM thoracique, abdomino-pelvienne]
- Patient : [adulte, pédiatrique, gabarit]
- Indication : [bilan, contrôle, urgence]
- Constructeur scanner : [marque, génération]
- Paramètres habituels (kV, mAs, pitch, NRD locale)

**TA MISSION**
Propose une optimisation des paramètres pour respecter le principe ALARA tout en préservant la qualité diagnostique.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Tableau d'optimisation (référence ALARA)**
**2. NRD de référence**
**3. Cas pédiatrique**
**4. Communication avec le radiologue**
**5. Traçabilité dose**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Code de la santé publique articles R.1333-57 à R.1333-67
- Niveaux de référence diagnostiques ASN
- Validation médecin radiologue obligatoire`
    },
    {
      id: 'merm-3', catKey: 'merm', cat: 'Manipulateur en radiologie', icon: '🩻', color: '#8b5cf6',
      title: 'Information patient avant IRM',
      prompt: `**RÔLE**
Tu es MERM en service d'IRM accueillant un patient pour un examen.

**MON CONTEXTE**
- Type d'examen : [IRM cérébrale, ostéo-articulaire, abdominale]
- Antécédents : [implants, prothèses, claustrophobie, grossesse]
- Préparation requise : [à jeun ou non, gel rectal, perfusion]
- Durée : [n minutes]

**TA MISSION**
Rédige le script d'accueil et d'information patient avant IRM.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Phrase d'accueil**
**2. Questionnaire de sécurité IRM (tableau)**
**3. Information sur le déroulement**
**4. Préparation pratique**
**5. Phrase de réassurance**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme bonnes pratiques SFR
- Vérification systématique des contre-indications absolues / relatives
- Validation médecin radiologue avant toute exception`
    },
    {
      id: 'merm-4', catKey: 'merm', cat: 'Manipulateur en radiologie', icon: '🩻', color: '#8b5cf6',
      title: "Compte rendu technique d'examen",
      prompt: `**RÔLE**
Tu es MERM rédigeant la fiche technique d'un examen pour le dossier patient et le radiologue.

**MON CONTEXTE**
- Type d'examen : [scanner, IRM, radio standard]
- Indication clinique : [résumé du bon de demande]
- Protocole utilisé : [séquences, plans, injection]
- Difficultés rencontrées : [agitation, claustrophobie, mauvais positionnement]

**TA MISSION**
Rédige une fiche technique structurée pour faciliter l'interprétation par le radiologue.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Identification examen**
**2. Informations cliniques retenues**
**3. Protocole réalisé (tableau)**
**4. Injection produit de contraste**
**5. Dose délivrée (si rayonnant)**
**6. Difficultés et adaptations**
**7. Transmission au radiologue**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Vocabulaire technique standardisé
- Pas d'interprétation diagnostique
- Traçabilité conforme dossier patient`
    },
    {
      id: 'merm-5', catKey: 'merm', cat: 'Manipulateur en radiologie', icon: '🩻', color: '#8b5cf6',
      title: 'Préparation séance de radiothérapie',
      prompt: `**RÔLE**
Tu es MERM en radiothérapie externe.

**MON CONTEXTE**
- Patient : [identité, n° dossier]
- Localisation traitée : [sein, prostate, ORL, autre]
- Étape : [scanner de centrage, premier traitement, séance courante]
- Matériel d'immobilisation : [masque thermo, cale-genoux, repose-bras]
- Tatouages / repères : [oui/non]

**TA MISSION**
Décris le déroulement type de séance et les vérifications de sécurité.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Vérifications avant séance (check-list)**
**2. Installation patient (tableau)**
**3. Délivrance du faisceau**
**4. Surveillance pendant et après séance**
**5. Traçabilité**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme INCa, SFRO
- Radioprotection patient et équipe
- Décret de compétences MERM
- Validation médicale obligatoire pour tout écart`
    },
    {
      id: 'merm-6', catKey: 'merm', cat: 'Manipulateur en radiologie', icon: '🩻', color: '#8b5cf6',
      title: "Dossier de demande d'examen incomplet",
      prompt: `**RÔLE**
Tu es MERM réceptionnant une demande d'examen présentant des éléments manquants ou incohérents.

**MON CONTEXTE**
- Type d'examen demandé : []
- Élément manquant : [indication, antécédents, DFG, latéralité, signature, identité]
- Demandeur : [médecin traitant, urgentiste, spécialiste]
- Caractère urgent : [oui / non]

**TA MISSION**
Rédige la procédure de réponse au prescripteur et la traçabilité.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Identification du défaut**
**2. Communication avec le prescripteur (tableau)**
**3. Modèle de phrase au prescripteur**
**4. Décision finale**
**5. Traçabilité**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Bonnes pratiques d'identitovigilance
- Pas d'examen rayonnant sans indication tracée
- Pas d'injection iodée sans DFG`
    },
    {
      id: 'merm-7', catKey: 'merm', cat: 'Manipulateur en radiologie', icon: '🩻', color: '#8b5cf6',
      title: 'Hygiène et désinfection en imagerie',
      prompt: `**RÔLE**
Tu es MERM responsable de l'hygiène d'une salle d'imagerie.

**MON CONTEXTE**
- Type d'équipement : [scanner, IRM, salle de radio, échographe]
- Type de patient transporté : [tout-venant, isolement contact, isolement gouttelette]
- Produits disponibles : [détergent-désinfectant, lingette virucide]

**TA MISSION**
Décris le protocole de bionettoyage entre 2 patients.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Protocole standard (tableau)**
**2. Protocole renforcé (isolement)**
**3. Sondes échographiques (tableau spécifique)**
**4. Hygiène des mains**
**5. Traçabilité**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme HAS, HCSP, SF2H
- Respect FDS
- Aucun mélange produit
- Cahier traçabilité tenu à jour`
    },
    {
      id: 'merm-8', catKey: 'merm', cat: 'Manipulateur en radiologie', icon: '🩻', color: '#8b5cf6',
      title: "Gestion d'un événement indésirable en imagerie",
      prompt: `**RÔLE**
Tu es MERM impliqué(e) dans la déclaration d'un événement indésirable.

**MON CONTEXTE**
- Type d'événement : [extravasation produit, mauvaise latéralité, mauvais patient, dose hors NRD]
- Gravité : [mineure, significative, grave]
- Patient impliqué : [identité, conséquences]
- Personnes témoins : [médecin, autre MERM]

**TA MISSION**
Rédige le compte rendu d'événement indésirable et le plan d'action immédiat.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Description factuelle de l'événement**
**2. Conduite à tenir immédiate**
**3. Analyse des causes (5 pourquoi)**
**4. Actions correctives proposées**
**5. Suivi et retour d'expérience**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Pas de désignation de coupable
- Démarche apprenante
- Confidentialité patient
- Conforme HAS gestion des risques`
    },
    {
      id: 'merm-9', catKey: 'merm', cat: 'Manipulateur en radiologie', icon: '🩻', color: '#8b5cf6',
      title: 'Échographie : assistance MERM au radiologue',
      prompt: `**RÔLE**
Tu es MERM en assistance d'examen échographique en service d'imagerie.

**MON CONTEXTE**
- Type d'examen : [écho abdominale, écho pelvienne, écho cardiaque, écho vasculaire]
- Patient : [adulte, enfant, particularités]
- Préparation requise : [vessie pleine, à jeun, autre]
- Médecin opérateur : [radiologue, cardiologue]

**TA MISSION**
Décris l'organisation de la salle, l'installation patient et l'assistance pendant l'examen.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Préparation salle**
**2. Accueil et installation patient (tableau)**
**3. Pendant l'examen**
**4. Fin d'examen**
**5. Traçabilité**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Décret de compétences MERM
- Aucun acte échographique autonome (médecin uniquement)
- Confidentialité respectée
- Bionettoyage entre chaque patient`
    },
    {
      id: 'merm-10', catKey: 'merm', cat: 'Manipulateur en radiologie', icon: '🩻', color: '#8b5cf6',
      title: 'Formation continue et maintien des compétences',
      prompt: `**RÔLE**
Tu es MERM souhaitant structurer ton plan de formation continue (DPC).

**MON CONTEXTE**
- Modalité d'exercice : [scanner, IRM, médecine nucléaire, radiothérapie, polyvalent]
- Date dernier DPC validé : [JJ/MM/AAAA]
- Compétences à renforcer : [radioprotection, IRM cardiaque, pédiatrie, dosimétrie]
- Temps disponible / mois : [h]

**TA MISSION**
Construis un plan DPC sur 3 ans et un plan d'auto-formation continue.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Obligation DPC**
**2. Plan triennal (tableau)**
**3. Auto-formation mensuelle**
**4. Indicateurs de suivi**
**5. Budget et financement**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Cadre DPC ANDPC
- Référentiel métier MERM
- Sources institutionnelles uniquement (SFR, AFPPE, ASN)
- Traçabilité dans portefeuille de compétences`
    },

    // ═════════════════════════════════════════════════════════
    //  11. ÉTABLISSEMENT / RH — 12 prompts
    // ═════════════════════════════════════════════════════════
    {
      id: 'rh-1', catKey: 'rh', cat: 'Établissement / RH', icon: '🏥', color: '#06b6d4',
      title: 'Fiche de poste IDE de service',
      prompt: `**RÔLE**
Tu es responsable RH d'un établissement de santé chargé de rédiger les fiches de poste.

**MON CONTEXTE**
- Type d'établissement : [CHU, CH, clinique, EHPAD, HAD]
- Service : [médecine, chirurgie, gériatrie, USC]
- Type de poste : [IDE jour, IDE nuit, IDE coordinateur]
- Conventions / statut : [FPH, CCN51, CCN66, CCU, autre]
- Encadrement direct : [cadre, IDEC]

**TA MISSION**
Rédige une fiche de poste complète, conforme au cadre légal et au référentiel métier.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Identification du poste**
**2. Missions (tableau)**
**3. Activités principales**
**4. Compétences requises**
**5. Conditions d'exercice**
**6. Évolution possible**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme statut FPH ou CCN applicable
- Référentiel d'activités IDE (annexe arrêté 31 juillet 2009)
- Pas de mention discriminante
- Validation cadre supérieur santé et DRH`
    },
    {
      id: 'rh-2', catKey: 'rh', cat: 'Établissement / RH', icon: '🏥', color: '#06b6d4',
      title: 'Annonce de recrutement IDE',
      prompt: `**RÔLE**
Tu es chargé(e) de recrutement d'un établissement de santé.

**MON CONTEXTE**
- Établissement : [nom, ville, type]
- Poste : [intitulé, service]
- Type de contrat : [CDI, CDD, vacation, mutation FPH]
- Quotité : [100%, temps partiel]
- Fourchette salariale : [grille FPH ou conventionnelle]
- Spécificités : [primes, logement, parking, restauration, crèche]

**TA MISSION**
Rédige une annonce de recrutement attractive, claire et juridiquement conforme.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Titre de l'annonce**
**2. Présentation de l'établissement (3-4 lignes)**
**3. Le poste**
**4. Profil recherché (tableau)**
**5. Conditions et avantages**
**6. Modalités de candidature**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Pas de critère discriminant (article L1132-1 Code du travail)
- Mention "rémunération selon grille" si pas de chiffre
- Conforme RGPD pour le recueil des données candidat`
    },
    {
      id: 'rh-3', catKey: 'rh', cat: 'Établissement / RH', icon: '🏥', color: '#06b6d4',
      title: "Trame d'entretien annuel d'évaluation",
      prompt: `**RÔLE**
Tu es cadre de santé ou cadre administratif menant les entretiens annuels d'évaluation.

**MON CONTEXTE**
- Métier de l'évalué : [IDE, AS, ASH, secrétaire médicale]
- Statut : [FPH, CDI privé]
- Période évaluée : [JJ/MM - JJ/MM]
- Objectifs précédents : [résumé]

**TA MISSION**
Construis-moi la trame complète de l'entretien annuel d'évaluation et le compte rendu type.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Préparation entretien**
**2. Trame entretien (tableau)**
**3. Questions ouvertes par étape**
**4. Compte rendu type**
**5. Suite donnée**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme décret évaluation FPH (décret n°2010-1153) ou statut applicable
- Pas de jugement personnel
- Faits objectifs uniquement
- Droit de réponse de l'agent respecté`
    },
    {
      id: 'rh-4', catKey: 'rh', cat: 'Établissement / RH', icon: '🏥', color: '#06b6d4',
      title: 'Plan de formation établissement',
      prompt: `**RÔLE**
Tu es responsable formation d'un établissement sanitaire ou médico-social.

**MON CONTEXTE**
- Effectif : [n agents, ETP]
- Budget formation annuel : [€ ou %]
- Obligations légales identifiées : [AFGSU, hygiène, incendie, gestes et postures, DPC]
- Axes stratégiques : [qualité de vie au travail, prévention TMS, e-santé]
- Période de référence : [année N+1]

**TA MISSION**
Construis-moi le plan de formation pluriannuel structuré.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Cadre de référence**
**2. Diagnostic des besoins**
**3. Plan annuel (tableau)**
**4. Suivi et indicateurs**
**5. Communication interne**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Code du travail / FPH selon statut
- Obligations DPC ANDPC pour soignants
- Égalité d'accès à la formation
- Validation IRP (CSE, CT)`
    },
    {
      id: 'rh-5', catKey: 'rh', cat: 'Établissement / RH', icon: '🏥', color: '#06b6d4',
      title: "Procédure d'accueil nouvel arrivant",
      prompt: `**RÔLE**
Tu es responsable de l'intégration d'un nouvel arrivant en établissement de santé.

**MON CONTEXTE**
- Métier : [IDE, AS, médecin, secrétaire]
- Service d'affectation : []
- Date de prise de poste : [JJ/MM/AAAA]
- Durée d'intégration prévue : [n jours]

**TA MISSION**
Rédige le programme d'accueil complet sur la première semaine et le mois suivant.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Accueil J1 (tableau)**
**2. Première semaine (planning par jour)**
**3. Premier mois (objectifs)**
**4. Documents remis (check-list)**
**5. Suivi à 3 mois**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme accord d'établissement
- Confidentialité (engagement signé)
- Visite médecine du travail dans le mois
- Formation sécurité incendie obligatoire`
    },
    {
      id: 'rh-6', catKey: 'rh', cat: 'Établissement / RH', icon: '🏥', color: '#06b6d4',
      title: 'Note RH sur la prévention des risques psychosociaux',
      prompt: `**RÔLE**
Tu es DRH d'un établissement de santé confronté à une remontée de tension dans une équipe.

**MON CONTEXTE**
- Service concerné : []
- Indicateurs : [absentéisme, turnover, accidents, signalements]
- Sources d'alerte : [CSE, médecine du travail, manager, salariés]
- Actions déjà engagées : []

**TA MISSION**
Rédige une note interne structurée pour le CODIR sur la situation et le plan d'action RPS.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Synthèse de la situation**
**2. Indicateurs (tableau)**
**3. Hypothèses de causes**
**4. Plan d'action en 3 niveaux**
**5. Communication**
**6. Suivi**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Obligation employeur santé physique et mentale (article L4121-1 Code du travail)
- DUERP à actualiser
- Confidentialité des situations individuelles
- Implication CSE`
    },
    {
      id: 'rh-7', catKey: 'rh', cat: 'Établissement / RH', icon: '🏥', color: '#06b6d4',
      title: 'Convocation à entretien préalable',
      prompt: `**RÔLE**
Tu es DRH menant une procédure disciplinaire dans un établissement de santé.

**MON CONTEXTE**
- Statut salarié : [CDI privé, FPH titulaire, FPH contractuel]
- Niveau de sanction envisagée : [avertissement, mise à pied, licenciement]
- Faits reprochés : [résumé général sans nominatif]
- Date des faits : [JJ/MM/AAAA]

**TA MISSION**
Rédige la lettre de convocation à entretien préalable conforme à la réglementation.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Cadre légal applicable**
**2. Mentions obligatoires de la convocation**
**3. Modèle de lettre**
**4. Modalités d'envoi**
**5. Suites de l'entretien**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Procédure disciplinaire stricte
- Pas de précision des faits dans la convocation
- Respect droits de la défense
- Conservation copie au dossier`
    },
    {
      id: 'rh-8', catKey: 'rh', cat: 'Établissement / RH', icon: '🏥', color: '#06b6d4',
      title: 'Note de service organisation des congés',
      prompt: `**RÔLE**
Tu es directeur(rice) ou cadre supérieur de santé chargé(e) d'organiser les congés annuels.

**MON CONTEXTE**
- Période concernée : [été, fin d'année]
- Effectif : [n soignants, ratio nécessaire]
- Contrainte : [continuité service, taux d'encadrement minimum]
- Règles internes : [ancienneté, alternance, charge de famille]

**TA MISSION**
Rédige une note de service claire et équitable.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Objet et destinataires**
**2. Cadre réglementaire applicable**
**3. Règles d'arbitrage (tableau)**
**4. Calendrier (tableau)**
**5. Procédure en cas de désaccord**
**6. Rappel solidarité d'équipe**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Respect des droits à congé (5 semaines minimum)
- Affichage 1 mois avant départ
- Égalité de traitement
- Pas de discrimination`
    },
    {
      id: 'rh-9', catKey: 'rh', cat: 'Établissement / RH', icon: '🏥', color: '#06b6d4',
      title: "Procédure de signalement d'un dysfonctionnement",
      prompt: `**RÔLE**
Tu es responsable qualité ou DRH d'un établissement de santé.

**MON CONTEXTE**
- Type de dysfonctionnement : [organisationnel, managérial, qualité de soin, harcèlement]
- Existant : [FEI, gestion documentaire, référents]
- Outil utilisé : [logiciel qualité interne]

**TA MISSION**
Construis une procédure interne de signalement claire et accessible aux agents.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Objet et champ d'application**
**2. Acteurs impliqués (tableau)**
**3. Modalités du signalement**
**4. Étapes de traitement (tableau)**
**5. Protection de l'émetteur**
**6. Suivi et amélioration**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Loi Sapin II
- Loi Waserman 2022 (protection des lanceurs d'alerte)
- Confidentialité absolue
- Pas de sanction de l'émetteur`
    },
    {
      id: 'rh-10', catKey: 'rh', cat: 'Établissement / RH', icon: '🏥', color: '#06b6d4',
      title: 'Bilan social annuel',
      prompt: `**RÔLE**
Tu es DRH chargé(e) de la rédaction du bilan social annuel d'un établissement de santé.

**MON CONTEXTE**
- Type d'établissement : [public FPH > 300 agents, ESPIC, privé]
- Effectif total : [n ETP]
- Année du bilan : [N]
- Données disponibles : [SIRH, paie, formation, QVT]

**TA MISSION**
Construis le sommaire et la trame du bilan social annuel.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Cadre légal**
**2. Sommaire structuré (tableau)**
**3. Présentation des indicateurs**
**4. Plan d'action issu du bilan**
**5. Validation et diffusion**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Données chiffrées vérifiées
- Conformité décret/articulation BDESE selon statut
- Anonymisation des données individuelles
- Respect RGPD`
    },
    {
      id: 'rh-11', catKey: 'rh', cat: 'Établissement / RH', icon: '🏥', color: '#06b6d4',
      title: "Préparation d'une certification HAS",
      prompt: `**RÔLE**
Tu es responsable qualité d'un établissement de santé en préparation de sa certification HAS.

**MON CONTEXTE**
- Type d'établissement : [MCO, SSR, psychiatrie, EHPAD]
- Date prévisionnelle visite : [JJ/MM/AAAA]
- Référentiel : [HAS V2024 ou en cours]
- État des lieux : [EPP en cours, FEI, COMEDIMS, CDU]

**TA MISSION**
Construis une feuille de route de préparation sur 12 mois.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Cartographie des chapitres du référentiel**
**2. Plan d'action (tableau)**
**3. Outils mobilisés**
**4. Communication interne**
**5. Implication usagers**
**6. Suivi post-visite**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme manuel HAS en vigueur
- Implication CME, CSIRMT, CDU
- Traçabilité documentaire complète
- Validation CODIR`
    },
    {
      id: 'rh-12', catKey: 'rh', cat: 'Établissement / RH', icon: '🏥', color: '#06b6d4',
      title: "Politique d'accueil des étudiants en santé",
      prompt: `**RÔLE**
Tu es responsable de l'accueil des étudiants paramédicaux en établissement de santé.

**MON CONTEXTE**
- Filières accueillies : [IFSI, IFAS, IFAP, ergo, kiné, sage-femme]
- Capacité d'accueil annuelle : [n stagiaires]
- Tuteurs identifiés : [n IDE / médecins encadrants]
- Modalité de stage : [court, long, alternance]

**TA MISSION**
Construis la politique d'accueil des étudiants et la procédure d'encadrement.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Cadre réglementaire**
**2. Acteurs et rôles (tableau)**
**3. Parcours type stagiaire (tableau)**
**4. Documents remis**
**5. Évaluation des compétences**
**6. Bilan annuel et amélioration**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Respect des compétences à valider
- Pas de remplacement de poste par un stagiaire
- Convention de stage signée
- Confidentialité (RGPD)`
    },

    // ═════════════════════════════════════════════════════════
    //  12. CHIRURGIEN-DENTISTE — 10 prompts
    // ═════════════════════════════════════════════════════════
    {
      id: 'dent-1', catKey: 'dent', cat: 'Chirurgien-dentiste', icon: '🦷', color: '#f59e0b',
      title: 'Devis prothèse conventionnée 100% santé',
      prompt: `**RÔLE**
Tu es chirurgien-dentiste libéral en cabinet de ville.

**MON CONTEXTE**
- Patient : [âge, mutuelle, couverture]
- Type de prothèse : [couronne, bridge, prothèse adjointe partielle, complète]
- Localisation : [n° dent CCAM ou secteur]
- Matériau envisagé : [zircone, métal, céramo-céramique]
- Panier souhaité : [100% santé, modéré, libre]

**TA MISSION**
Rédige un devis conventionnel conforme à la convention dentaire et explique les 3 paniers de soins au patient.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Devis détaillé (tableau)**
**2. Présentation des 3 paniers (tableau)**
**3. Information patient (script oral)**
**4. Mentions obligatoires devis**
**5. Traçabilité**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme convention dentaire 2018 (avenant 100% Santé)
- Tarifs plafonnés respectés
- Information loyale et complète
- Pas d'incitation à choisir un panier précis`
    },
    {
      id: 'dent-2', catKey: 'dent', cat: 'Chirurgien-dentiste', icon: '🦷', color: '#f59e0b',
      title: 'Plan de traitement parodontal',
      prompt: `**RÔLE**
Tu es chirurgien-dentiste pratiquant la parodontie.

**MON CONTEXTE**
- Patient : [âge, sexe, antécédents, tabac, diabète]
- Sondage parodontal : [profondeur, saignement au sondage, mobilité]
- Bilan radio : [perte osseuse en %]
- Stade et grade EFP : [I, II, III, IV / A, B, C]

**TA MISSION**
Construis un plan de traitement parodontal structuré selon les recommandations EFP/SFPIO.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Diagnostic**
**2. Plan de traitement (tableau)**
**3. Conseils hygiène patient**
**4. Co-facteurs à traiter**
**5. Suivi à distance**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Recommandations EFP/SFPIO 2018-2020
- Information éclairée du patient
- Devis si actes hors nomenclature
- Traçabilité du sondage initial`
    },
    {
      id: 'dent-3', catKey: 'dent', cat: 'Chirurgien-dentiste', icon: '🦷', color: '#f59e0b',
      title: 'Information avant extraction de dent de sagesse',
      prompt: `**RÔLE**
Tu es chirurgien-dentiste expliquant à un patient une extraction de dent de sagesse.

**MON CONTEXTE**
- Dent concernée : [n° 18, 28, 38, 48]
- Indication : [péricoronarite, caries, problèmes orthodontiques, prophylaxie]
- Position : [incluse, semi-incluse, sur arcade]
- Difficulté chirurgicale : [simple, complexe, proximité nerf alvéolaire inférieur]

**TA MISSION**
Rédige le document d'information patient préopératoire.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Présentation de l'intervention**
**2. Bénéfices attendus**
**3. Risques (tableau)**
**4. Préparation préopératoire**
**5. Suites opératoires (script patient)**
**6. Consultation de contrôle**
**7. Consentement éclairé**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme recommandations ONCD
- Consentement éclairé écrit recommandé
- Pas de minimisation des risques
- Information loyale`
    },
    {
      id: 'dent-4', catKey: 'dent', cat: 'Chirurgien-dentiste', icon: '🦷', color: '#f59e0b',
      title: "Compte rendu opératoire d'avulsion",
      prompt: `**RÔLE**
Tu es chirurgien-dentiste rédigeant un compte rendu opératoire post-avulsion.

**MON CONTEXTE**
- Patient : [identité, âge]
- Acte : [extraction simple, complexe, alvéolectomie]
- Anesthésie : [locale, locorégionale]
- Difficultés rencontrées : [racine fracturée, communication bucco-sinusienne, hémorragie]

**TA MISSION**
Rédige le compte rendu opératoire complet.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Identification**
**2. Indication**
**3. Anesthésie**
**4. Description chirurgicale (tableau)**
**5. Difficultés et incidents**
**6. Hémostase**
**7. Prescription post-op**
**8. Conseils patient**
**9. Contrôle**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Vocabulaire chirurgical précis
- Conservation 30 ans
- Lisibilité confraternelle
- Conforme bonnes pratiques ONCD`
    },
    {
      id: 'dent-5', catKey: 'dent', cat: 'Chirurgien-dentiste', icon: '🦷', color: '#f59e0b',
      title: 'Adressage à un confrère spécialiste',
      prompt: `**RÔLE**
Tu es chirurgien-dentiste adressant un patient à un confrère spécialiste.

**MON CONTEXTE**
- Spécialité : [implantologie, ODF, parodontie, chirurgie maxillo-faciale]
- Motif : [bilan implant, alignement, parodontite avancée, kyste]
- Antécédents pertinents : []
- Examens disponibles : [radio panoramique, cone beam, photos]

**TA MISSION**
Rédige le courrier d'adressage confraternel.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. En-tête professionnel**
**2. Identification confrère destinataire**
**3. Identification patient**
**4. Motif d'adressage**
**5. Synthèse clinique (tableau)**
**6. Demande précise**
**7. Documents joints**
**8. Formule de politesse confraternelle**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Confraternité respectée
- Confidentialité (envoi sécurisé MSSanté)
- Information patient sur l'adressage
- Pas de jugement sur prise en charge antérieure`
    },
    {
      id: 'dent-6', catKey: 'dent', cat: 'Chirurgien-dentiste', icon: '🦷', color: '#f59e0b',
      title: "Protocole d'urgence dentaire au cabinet",
      prompt: `**RÔLE**
Tu es chirurgien-dentiste responsable du protocole d'urgence vitale au cabinet.

**MON CONTEXTE**
- Type de cabinet : [solo, groupe]
- Équipement disponible : [DSA, O2, mallette urgence, adrénaline auto-injecteur]
- Équipe formée AFGSU : [oui / non, dates]
- Pathologies les plus rencontrées : [malaise vagal, choc anaphylactique, AVC, ACR]

**TA MISSION**
Rédige le protocole d'urgence vitale du cabinet et les conduites à tenir.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Inventaire mallette urgence (tableau)**
**2. Conduite à tenir par situation (tableau)**
**3. Organisation appel 15**
**4. Formation équipe**
**5. Traçabilité événement**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- AFGSU 2 obligatoire pour soignants
- Référence ONCD et SFAR pour algorithmes
- Mallette à jour
- Affichage protocole en cabinet`
    },
    {
      id: 'dent-7', catKey: 'dent', cat: 'Chirurgien-dentiste', icon: '🦷', color: '#f59e0b',
      title: "Information sur l'orthodontie chez l'enfant",
      prompt: `**RÔLE**
Tu es chirurgien-dentiste omnipraticien expliquant à des parents l'opportunité d'un traitement orthodontique chez leur enfant.

**MON CONTEXTE**
- Âge enfant : [ans]
- Type de problème : [encombrement, dysmorphose, fonctionnel, esthétique]
- Stade dentaire : [denture lactéale, mixte, définitive]
- Couverture sociale : [Assurance Maladie, mutuelle]

**TA MISSION**
Rédige un document d'information parentale clair et neutre.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Présentation du problème observé**
**2. Pourquoi consulter un orthodontiste**
**3. Âges clés (tableau)**
**4. Modalités de traitement**
**5. Prise en charge financière**
**6. Consentement et choix**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Pas d'urgence à initier sans bilan
- Adresser à un orthodontiste qualifié
- Information honnête sur durée et contraintes
- Pas de promesse esthétique`
    },
    {
      id: 'dent-8', catKey: 'dent', cat: 'Chirurgien-dentiste', icon: '🦷', color: '#f59e0b',
      title: 'Politique de prévention bucco-dentaire au cabinet',
      prompt: `**RÔLE**
Tu es chirurgien-dentiste mettant en place une politique de prévention au cabinet.

**MON CONTEXTE**
- Patientèle : [enfants, adultes, seniors]
- Outils existants : [supports info, programme M'T Dents, ETP]
- Temps disponible / RDV : [n minutes]

**TA MISSION**
Construis le parcours de prévention bucco-dentaire personnalisé.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Programmes officiels mobilisables (tableau)**
**2. Conseils standardisés (tableau)**
**3. Outils de communication**
**4. Délégation à l'assistante dentaire**
**5. Indicateurs de suivi**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme recommandations UFSBD et HAS
- Pas de vente de produits non conformes
- Délégation assistante dans cadre légal strict`
    },
    {
      id: 'dent-9', catKey: 'dent', cat: 'Chirurgien-dentiste', icon: '🦷', color: '#f59e0b',
      title: "Gestion d'une réclamation patient",
      prompt: `**RÔLE**
Tu es chirurgien-dentiste recevant une réclamation orale ou écrite d'un patient.

**MON CONTEXTE**
- Nature de la réclamation : [esthétique, douleur, échec prothèse, facturation]
- Mode de réception : [oral cabinet, courrier, mail, avis en ligne]
- Délai depuis l'acte : [n jours / mois]
- Antécédents relationnels : [premier conflit, récurrent]

**TA MISSION**
Rédige la réponse écrite type et la procédure de gestion de la réclamation.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Étapes de gestion (tableau)**
**2. Modèle de courrier de réponse**
**3. Postures à éviter**
**4. Solutions possibles**
**5. Documentation**
**6. Prévention récidive**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Information assurance RCP en cas de litige
- Conformité Code de déontologie dentaire
- Confidentialité même si avis public en ligne
- Pas d'aveu écrit hors conseil avocat / RCP`
    },
    {
      id: 'dent-10', catKey: 'dent', cat: 'Chirurgien-dentiste', icon: '🦷', color: '#f59e0b',
      title: 'Suivi réglementaire du cabinet (DASRI, stérilisation)',
      prompt: `**RÔLE**
Tu es chirurgien-dentiste responsable du suivi réglementaire du cabinet.

**MON CONTEXTE**
- Type de cabinet : [solo, groupe]
- Stérilisation : [autoclave classe B, type N]
- Production DASRI : [< 5 kg/mois, > 5 kg/mois]
- Référent qualité : [praticien, assistante]

**TA MISSION**
Construis la check-list annuelle de conformité réglementaire et le tableau de suivi.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Stérilisation (tableau)**
**2. DASRI (tableau)**
**3. Radioprotection**
**4. Hygiène et lutte infections**
**5. Documents obligatoires affichés**
**6. Calendrier annuel (tableau récap)**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Code de la santé publique pour radioprotection
- Arrêté 7 septembre 1999 sur les DASRI
- Conservation traçabilité minimum 5 ans`
    },

    // ═════════════════════════════════════════════════════════
    //  13. ERGOTHÉRAPEUTE — 10 prompts
    // ═════════════════════════════════════════════════════════
    {
      id: 'ergo-1', catKey: 'ergo', cat: 'Ergothérapeute', icon: '🖐️', color: '#ec4899',
      title: "Bilan d'ergothérapie en gériatrie",
      prompt: `**RÔLE**
Tu es ergothérapeute DE en service de gériatrie ou en HAD.

**MON CONTEXTE**
- Patient : [âge, pathologie, antécédents, lieu de vie]
- Motif : [chute, AVC, démence, post-fracture]
- Objectif initial : [maintien à domicile, retour à domicile, EHPAD]
- Outils standardisés disponibles : [MIF, Tinetti, MOCA, NEADL]

**TA MISSION**
Construis un bilan d'ergothérapie initial structuré.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Anamnèse**
**2. Bilan des AVQ (tableau)**
**3. Bilans complémentaires**
**4. Synthèse et objectifs SMART**
**5. Plan d'intervention proposé**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Référentiel ergothérapie DE
- Outils standardisés validés uniquement
- Projet co-construit avec patient
- Pas de prescription d'aide technique sans bilan VAD`
    },
    {
      id: 'ergo-2', catKey: 'ergo', cat: 'Ergothérapeute', icon: '🖐️', color: '#ec4899',
      title: 'Visite à domicile pour adaptation',
      prompt: `**RÔLE**
Tu es ergothérapeute en HAD ou en libéral réalisant une visite à domicile (VAD) pour adaptation du logement.

**MON CONTEXTE**
- Patient : [pathologie, autonomie]
- Logement : [maison, appartement, étage, ascenseur]
- Aidants : [conjoint, enfants, auxiliaire de vie]
- Budget : [propre, MDPH, ANAH, mutuelle]

**TA MISSION**
Construis le compte rendu de VAD avec recommandations d'adaptation.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Description du logement (tableau pièce par pièce)**
**2. Aides techniques recommandées**
**3. Aides humaines à envisager**
**4. Devis et financement**
**5. Suivi**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Recommandations ergonomiques validées
- Respect choix patient
- Pas de devis prescrit (orientation prestataires uniquement)
- Compte rendu transmis prescripteur et patient`
    },
    {
      id: 'ergo-3', catKey: 'ergo', cat: 'Ergothérapeute', icon: '🖐️', color: '#ec4899',
      title: 'Rééducation de la main post-opératoire',
      prompt: `**RÔLE**
Tu es ergothérapeute spécialisé(e) en rééducation de la main.

**MON CONTEXTE**
- Pathologie / chirurgie : [tendon fléchisseur, syndrome canal carpien, fracture]
- Délai post-opératoire : [n jours / semaines]
- Prescription du chirurgien : [protocole, attelle, mobilité autorisée]
- Objectif : [récupérer mobilité, force, fonction quotidienne]

**TA MISSION**
Construis un plan de rééducation par phases.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Évaluation initiale**
**2. Plan par phases (tableau)**
**3. Auto-rééducation patient**
**4. Critères de progression**
**5. Coordination équipe**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Respect protocole chirurgical
- Pas de mobilisation hors prescription
- Réévaluation chirurgien si stagnation
- Référentiel kiné de la main et SFRM`
    },
    {
      id: 'ergo-4', catKey: 'ergo', cat: 'Ergothérapeute', icon: '🖐️', color: '#ec4899',
      title: "Plan d'intervention en pédiatrie (TDAH, dyspraxie)",
      prompt: `**RÔLE**
Tu es ergothérapeute libéral(e) ou en CAMSP/CMPP avec un enfant.

**MON CONTEXTE**
- Enfant : [âge, classe, diagnostic posé ou suspicion]
- Bilan disponibles : [WISC, BHK, M-ABC, profil sensoriel]
- Demandes parents et école : []
- Lieu d'intervention : [cabinet, école, domicile]

**TA MISSION**
Construis le plan d'intervention thérapeutique sur 3-6 mois.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Synthèse bilan**
**2. Objectifs thérapeutiques (tableau SMART)**
**3. Modalités de séances**
**4. Outils utilisés**
**5. Coordination**
**6. Réévaluation**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Respect cadre handicap (loi 11 février 2005)
- Outils standardisés uniquement
- Coordination équipe pluri obligatoire
- Pas de prescription médicamenteuse`
    },
    {
      id: 'ergo-5', catKey: 'ergo', cat: 'Ergothérapeute', icon: '🖐️', color: '#ec4899',
      title: "Atelier d'éducation thérapeutique en groupe",
      prompt: `**RÔLE**
Tu es ergothérapeute coordonnant un atelier d'ETP.

**MON CONTEXTE**
- Pathologie cible : [PR, AVC, lombalgie chronique, Parkinson]
- Public : [n patients, âge moyen]
- Objectif éducatif : [économie d'effort, gestes au quotidien, ergonomie]
- Lieu et matériel disponible : []

**TA MISSION**
Construis la fiche de séance d'ETP groupale.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Cadre ETP**
**2. Objectifs éducatifs (tableau)**
**3. Déroulement séance (1h30 type)**
**4. Supports utilisés**
**5. Évaluation de la séance**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme cadre ETP HAS
- Programme autorisé ARS
- Co-animation pluripro
- Évaluation systématique`
    },
    {
      id: 'ergo-6', catKey: 'ergo', cat: 'Ergothérapeute', icon: '🖐️', color: '#ec4899',
      title: 'Adaptation poste de travail (santé au travail)',
      prompt: `**RÔLE**
Tu es ergothérapeute intervenant en santé au travail (SIST, MDPH, RQTH).

**MON CONTEXTE**
- Salarié : [âge, métier, pathologie ou handicap]
- Contexte : [aménagement RQTH, retour après arrêt long]
- Poste : [administratif, manuel, mixte]
- Contraintes : [station debout, ports de charge, poste écran]

**TA MISSION**
Réalise une analyse de poste et propose des aménagements.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Analyse du poste actuel (tableau)**
**2. Préconisations d'aménagement (tableau)**
**3. Cadre réglementaire**
**4. Co-construction**
**5. Suivi**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Respect secret médical du travail
- Pas de communication diagnostique à l'employeur
- Co-décision médecin du travail
- Référentiel INRS et HAS`
    },
    {
      id: 'ergo-7', catKey: 'ergo', cat: 'Ergothérapeute', icon: '🖐️', color: '#ec4899',
      title: 'Préconisation aide technique avec dossier MDPH',
      prompt: `**RÔLE**
Tu es ergothérapeute aidant un patient à constituer un dossier MDPH (PCH élément 3 - aides techniques).

**MON CONTEXTE**
- Patient : [âge, handicap, autonomie]
- Aide technique demandée : [fauteuil roulant, lit médicalisé, lève-personne, domotique]
- Devis disponibles : [n devis]
- Reste à charge actuel : [€]

**TA MISSION**
Rédige le volet "préconisation ergothérapique" pour le dossier MDPH.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Identification patient**
**2. Description du handicap et besoins**
**3. Aide technique préconisée (tableau)**
**4. Comparatif des devis**
**5. Argumentaire fonctionnel**
**6. Reste à charge et financements complémentaires**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme guide barème MDPH
- Devis à jour (< 6 mois)
- Justification objective
- Validation prescripteur médical`
    },
    {
      id: 'ergo-8', catKey: 'ergo', cat: 'Ergothérapeute', icon: '🖐️', color: '#ec4899',
      title: 'Conduite automobile et handicap',
      prompt: `**RÔLE**
Tu es ergothérapeute spécialisé(e) en évaluation de la conduite automobile.

**MON CONTEXTE**
- Patient : [pathologie, séquelles motrices ou cognitives]
- Permis détenu : [B, BE, autre]
- Demande : [reprise après accident, hémiplégie, déclin cognitif]
- Centre référent : [centre habilité]

**TA MISSION**
Construis le bilan de conduite et la proposition d'orientation.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Évaluation préalable (tableau)**
**2. Test sur simulateur (si disponible)**
**3. Mise en situation route (sur véhicule adapté)**
**4. Conclusion (tableau)**
**5. Démarches administratives**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Décision médicale finale par médecin agréé préfecture
- Pas de validation autonome
- Confidentialité bilan
- Sécurité publique prioritaire`
    },
    {
      id: 'ergo-9', catKey: 'ergo', cat: 'Ergothérapeute', icon: '🖐️', color: '#ec4899',
      title: 'Compte rendu de fin de prise en charge',
      prompt: `**RÔLE**
Tu es ergothérapeute en fin de prise en charge.

**MON CONTEXTE**
- Patient : [pathologie, durée prise en charge]
- Objectifs initiaux : [résumé]
- Évolution : [progrès, plateau, dégradation]
- Continuité : [poursuite ailleurs, fin, autre rééducation]

**TA MISSION**
Rédige le compte rendu de fin de prise en charge.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Identification**
**2. Bilan initial (rappel synthétique)**
**3. Objectifs poursuivis et atteinte (tableau)**
**4. Évolution observée**
**5. Recommandations pour la suite**
**6. Coordination**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Vocabulaire professionnel
- Respect confidentialité
- Pas d'engagement sur évolution future incertaine
- Validation patient`
    },
    {
      id: 'ergo-10', catKey: 'ergo', cat: 'Ergothérapeute', icon: '🖐️', color: '#ec4899',
      title: 'Sensibilisation aux risques de chute des personnes âgées',
      prompt: `**RÔLE**
Tu es ergothérapeute animant une action de prévention des chutes en EHPAD ou résidence senior.

**MON CONTEXTE**
- Public : [n résidents, profil cognitif moyen]
- Lieu : [EHPAD, résidence autonomie, club seniors]
- Durée : [séance unique, programme]
- Matériel disponible : []

**TA MISSION**
Construis une fiche d'animation de prévention des chutes.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Cadre de la séance**
**2. Facteurs de risque de chute (tableau)**
**3. Évaluation du risque (Tinetti, get up and go)**
**4. Conseils pratiques (tableau)**
**5. Supports remis**
**6. Évaluation de la séance**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Référence HAS chute personne âgée
- Pas de prescription médicamenteuse
- Adaptation au niveau cognitif du public
- Validation médecin coordonnateur`
    },

    // ═════════════════════════════════════════════════════════
    //  14. PSYCHOLOGUE / PSYCHOMOTRICIEN — 10 prompts
    // ═════════════════════════════════════════════════════════
    {
      id: 'psy-1', catKey: 'psy', cat: 'Psychologue / Psychomotricien', icon: '🧠', color: '#a855f7',
      title: 'Compte rendu de premier entretien',
      prompt: `**RÔLE**
Tu es psychologue clinicien(ne) en cabinet libéral ou en institution.

**MON CONTEXTE**
- Patient : [âge, sexe, situation]
- Motif de consultation : [demande explicite]
- Source d'orientation : [médecin traitant, MDPH, école, conjoint]
- Antécédents psy : [suivi antérieur, traitements, hospitalisation]

**TA MISSION**
Rédige un compte rendu structuré de premier entretien.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Cadre de l'entretien**
**2. Motif et demande**
**3. Anamnèse synthétique**
**4. Tableau clinique (tableau)**
**5. Hypothèses cliniques préliminaires**
**6. Cadre proposé**
**7. Orientation complémentaire si besoin**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Code de déontologie des psychologues (1996)
- Confidentialité absolue
- Pas de diagnostic psychiatrique posé
- Consentement éclairé recueilli`
    },
    {
      id: 'psy-2', catKey: 'psy', cat: 'Psychologue / Psychomotricien', icon: '🧠', color: '#a855f7',
      title: 'Synthèse de bilan psychométrique',
      prompt: `**RÔLE**
Tu es psychologue ayant fait passer un bilan psychométrique complet.

**MON CONTEXTE**
- Patient : [âge, motif]
- Tests passés : [WAIS-IV, WISC-V, NEPSY, BEC96, MOCA]
- Notes brutes : [par sub-test]
- Contexte de passation : [coopération, fatigue, langue]

**TA MISSION**
Rédige la synthèse écrite du bilan en français accessible pour le patient et le prescripteur.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Identification et motif**
**2. Conditions de passation**
**3. Résultats par domaine (tableau)**
**4. Profil cognitif**
**5. Hypothèses et conclusion**
**6. Recommandations**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Code de déontologie psychologues
- Tests étalonnés sur population française
- Pas de diagnostic médical
- Restitution orale obligatoire au patient avant écrit`
    },
    {
      id: 'psy-3', catKey: 'psy', cat: 'Psychologue / Psychomotricien', icon: '🧠', color: '#a855f7',
      title: "Plan d'intervention en psychomotricité (TSA)",
      prompt: `**RÔLE**
Tu es psychomotricien(ne) DE en CAMSP / IME / libéral, prenant en charge un enfant avec TSA.

**MON CONTEXTE**
- Enfant : [âge, sévérité TSA, langage]
- Bilan psychomoteur : [tonus, schéma corporel, latéralité, intégration sensorielle]
- Comorbidités : [TDAH, déficience intellectuelle]
- Famille : [demande, contexte]

**TA MISSION**
Construis un plan d'intervention psychomoteur sur 6 mois.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Synthèse bilan**
**2. Objectifs (tableau SMART)**
**3. Modalités de séances**
**4. Médiations utilisées**
**5. Coordination équipe pluri**
**6. Réévaluation**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Recommandations HAS / ANESM 2012 sur le TSA
- Co-construction familiale
- Outils standardisés validés
- Pas d'isolement ou contention`
    },
    {
      id: 'psy-4', catKey: 'psy', cat: 'Psychologue / Psychomotricien', icon: '🧠', color: '#a855f7',
      title: 'Conduite face à un patient en crise suicidaire',
      prompt: `**RÔLE**
Tu es psychologue confronté(e) à un patient en crise suicidaire au cours d'une consultation.

**MON CONTEXTE**
- Patient : [âge, suivi en cours ou non]
- Verbalisation : [idées, plan, moyen, date]
- Antécédents : [TS antérieures, hospitalisations]
- Soutiens : [famille, conjoint, professionnels]

**TA MISSION**
Décris la conduite à tenir et la procédure de mise en sécurité.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Évaluation du risque (tableau)**
**2. Score RUD (Risque, Urgence, Dangerosité)**
**3. Conduite à tenir (tableau)**
**4. Plan de sécurité personnalisé**
**5. Traçabilité écrite**
**6. Suivi post-crise**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- 3114 numéro national prévention suicide
- Pas de promesse de confidentialité absolue si risque vital
- Information patient sur la levée du secret en cas de risque vital
- Coordination avec médecin traitant ou psychiatre`
    },
    {
      id: 'psy-5', catKey: 'psy', cat: 'Psychologue / Psychomotricien', icon: '🧠', color: '#a855f7',
      title: "Soutien d'un aidant familial",
      prompt: `**RÔLE**
Tu es psychologue accompagnant un proche aidant.

**MON CONTEXTE**
- Profil aidant : [âge, lien, ancienneté de l'aide]
- Personne aidée : [pathologie, autonomie]
- Symptômes aidant : [épuisement, anxiété, culpabilité, isolement]
- Soutien existant : [famille, professionnels]

**TA MISSION**
Construis un parcours d'accompagnement de l'aidant sur 3-6 mois.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Évaluation initiale (tableau)**
**2. Objectifs de l'accompagnement**
**3. Modalités**
**4. Ressources externes (tableau)**
**5. Suivi et réévaluation**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Confidentialité absolue
- Différencier le suivi aidant de la prise en charge de la personne aidée
- Co-construction du projet
- Sources : HAS, CNSA`
    },
    {
      id: 'psy-6', catKey: 'psy', cat: 'Psychologue / Psychomotricien', icon: '🧠', color: '#a855f7',
      title: "Préparation d'un atelier de relaxation",
      prompt: `**RÔLE**
Tu es psychomotricien(ne) ou psychologue préparant un atelier de relaxation en groupe.

**MON CONTEXTE**
- Public : [adultes lombalgie, adolescents anxieux, seniors, soignants]
- Méthode : [Schultz, Jacobson, pleine conscience, sophrologie]
- Lieu : [salle d'institution, cabinet]
- Durée : [45 min, 1h]

**TA MISSION**
Construis la fiche pédagogique de l'atelier.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Cadre de l'atelier**
**2. Déroulement (tableau)**
**3. Texte d'induction type**
**4. Adaptations possibles**
**5. Évaluation**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Pas de méthode hypnotique non maîtrisée
- Contre-indication psychose en phase aiguë
- Pas d'utilisation thérapeutique sans formation spécifique
- Respect choix de chaque participant`
    },
    {
      id: 'psy-7', catKey: 'psy', cat: 'Psychologue / Psychomotricien', icon: '🧠', color: '#a855f7',
      title: "Travail psychoéducatif sur l'anxiété",
      prompt: `**RÔLE**
Tu es psychologue d'orientation cognitive et comportementale.

**MON CONTEXTE**
- Patient : [âge, profil, demande]
- Trouble : [anxiété généralisée, anxiété sociale, trouble panique]
- Niveau de connaissance : [novice, déjà informé]
- Durée prévue : [séance unique, série]

**TA MISSION**
Rédige un module psychoéducatif sur l'anxiété accessible et structuré.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Définition de l'anxiété**
**2. Mécanismes physiologiques (tableau)**
**3. Cercle vicieux de l'anxiété**
**4. Stratégies efficaces (tableau)**
**5. Quand consulter le médecin**
**6. Outils d'auto-mesure**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Pas de prescription médicamenteuse
- Coordination médecin traitant ou psychiatre
- Sources : HAS recommandations TAG
- Approche scientifiquement validée`
    },
    {
      id: 'psy-8', catKey: 'psy', cat: 'Psychologue / Psychomotricien', icon: '🧠', color: '#a855f7',
      title: 'Note de coordination avec le psychiatre',
      prompt: `**RÔLE**
Tu es psychologue de soins primaires (Mon soutien Psy ou en CMP), en lien avec un psychiatre référent.

**MON CONTEXTE**
- Patient : [identité, suivi en cours]
- Motif de la note : [aggravation, demande de réévaluation, point sur prise en charge]
- Diagnostic posé : [par psychiatre]
- Traitements en cours : [molécules]

**TA MISSION**
Rédige la note de coordination interprofessionnelle.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. En-tête confraternelle**
**2. Identification patient**
**3. Synthèse de la prise en charge psychologique**
**4. Évaluation actuelle (tableau)**
**5. Demande au psychiatre**
**6. Information du patient**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Secret professionnel partagé encadré (article L1110-4 CSP)
- Consentement patient écrit à la transmission
- Confraternité respectée
- Conservation copie au dossier`
    },
    {
      id: 'psy-9', catKey: 'psy', cat: 'Psychologue / Psychomotricien', icon: '🧠', color: '#a855f7',
      title: "Programme d'éducation thérapeutique psychiatrie",
      prompt: `**RÔLE**
Tu es psychologue ou infirmier(ère) en psychiatrie animant un programme ETP autorisé ARS.

**MON CONTEXTE**
- Pathologie cible : [trouble bipolaire, schizophrénie, dépression chronique]
- Public : [n patients, ambulatoires]
- Durée : [n séances]
- Équipe pluri : [psychiatre, psy, IDE, ergo, pair-aidant]

**TA MISSION**
Construis le programme ETP complet.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Cadre**
**2. Objectifs éducatifs (tableau)**
**3. Programme par séance (tableau)**
**4. Outils d'évaluation**
**5. Suivi à distance**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Programme autorisé ARS obligatoire (article L1161-2 CSP)
- Équipe formée 40h ETP
- Évaluation quadriennale
- Confidentialité absolue`
    },
    {
      id: 'psy-10', catKey: 'psy', cat: 'Psychologue / Psychomotricien', icon: '🧠', color: '#a855f7',
      title: 'Soutien post-traumatique de soignants',
      prompt: `**RÔLE**
Tu es psychologue intervenant auprès de soignants après un événement potentiellement traumatique (ESPT, agression, suicide patient, accident).

**MON CONTEXTE**
- Type d'événement : []
- Nombre de personnes exposées : [n]
- Délai depuis l'événement : [h / jours]
- Cellule activée : [CUMP, EMPSI, intervention interne]

**TA MISSION**
Construis le dispositif de soutien immédiat et différé.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Premiers secours psychologiques (J0-J3)**
**2. Intervention groupale (J3-J7)**
**3. Suivi individuel (J7 et au-delà)**
**4. Symptômes à surveiller (tableau)**
**5. Critère ESPT (DSM-5)**
**6. Coordination établissement**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Référence CUMP nationale
- Pas de force pour parler
- Coordination avec médecin du travail
- Confidentialité absolue`
    },

    // ═════════════════════════════════════════════════════════
    //  15. TECHNICIEN DE LABORATOIRE — 10 prompts
    // ═════════════════════════════════════════════════════════
    {
      id: 'labo-1', catKey: 'labo', cat: 'Technicien de laboratoire', icon: '🧪', color: '#14b8a6',
      title: 'Procédure d\'identitovigilance au prélèvement',
      prompt: `**RÔLE**
Tu es technicien(ne) de laboratoire médical expérimenté(e), formé(e) à l'identitovigilance selon les recommandations COFRAC SH REF 02 et l'arrêté du 16 juillet 2007.

**MON CONTEXTE**
- Type de laboratoire : [LBM privé / public / spécialisé]
- Mode de prélèvement : [au laboratoire / domicile / hôpital]
- Effectif équipe : [nombre de préleveurs]
- Outil informatique : [SIL utilisé]

**TA MISSION**
Rédige une procédure d'identitovigilance au prélèvement applicable par toute l'équipe.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Objet et domaine d'application**
**2. Documents de référence**
**3. Étapes de vérification (tableau)**
**4. Cas particuliers**
**5. Gestion des non-conformités**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conformité COFRAC SH REF 02
- 3 identifiants minimum vérifiés
- Étiquetage en présence du patient obligatoire
- Pas de prélèvement si doute identité`
    },
    {
      id: 'labo-2', catKey: 'labo', cat: 'Technicien de laboratoire', icon: '🧪', color: '#14b8a6',
      title: "Validation analytique d'une série de résultats",
      prompt: `**RÔLE**
Tu es technicien(ne) de laboratoire en charge de la validation analytique en biochimie / hématologie / microbiologie.

**MON CONTEXTE**
- Paramètre analysé : [glycémie, NFS, ionogramme...]
- Automate : [nom, technique]
- CIQ du jour : [résultat / dérive observée]
- Nombre de patients : [taille série]

**TA MISSION**
Rédige une grille de validation analytique avec critères d'acceptation et de rejet.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Critères de validation préalables**
**2. Règles de Westgard appliquées (tableau)**
**3. Vérifications cohérence patient**
**4. Actions selon résultats**
**5. Traçabilité**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conformité COFRAC SH REF 02
- Règles Westgard appliquées
- Pas de validation si CIQ hors limites
- Alerte téléphonique pour valeurs critiques`
    },
    {
      id: 'labo-3', catKey: 'labo', cat: 'Technicien de laboratoire', icon: '🧪', color: '#14b8a6',
      title: 'Procédure post-AES au laboratoire',
      prompt: `**RÔLE**
Tu es technicien(ne) de laboratoire référent(e) hygiène et sécurité, formé(e) à la conduite à tenir en cas d'AES selon les recommandations GERES.

**MON CONTEXTE**
- Type d'établissement : [LBM, hôpital]
- Référent médecine du travail : [coordonnées]
- Service urgences accessible : [oui / non / délai]

**TA MISSION**
Rédige la procédure complète de conduite à tenir post-AES applicable au laboratoire.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Définition AES**
**2. Conduite à tenir immédiate (5 min)**
**3. Évaluation risque**
**4. TPE (traitement post-exposition VIH)**
**5. Sérologies recommandées**
**6. Déclaration et traçabilité**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Délai TPE 4h max
- Sérologie source avec consentement
- Confidentialité absolue
- Pas de prophylaxie sans avis médecin référent`
    },
    {
      id: 'labo-4', catKey: 'labo', cat: 'Technicien de laboratoire', icon: '🧪', color: '#14b8a6',
      title: "Communication d'un résultat critique au clinicien",
      prompt: `**RÔLE**
Tu es technicien(ne) de laboratoire en charge de la communication des valeurs critiques selon le seuil défini par le LBM.

**MON CONTEXTE**
- Paramètre concerné : [exemple : potassium, troponine, INR]
- Valeur obtenue : [chiffre]
- Patient : [hospitalisé / ambulatoire]
- Heure : [jour / nuit / WE]

**TA MISSION**
Structure le script d'appel téléphonique au clinicien et la traçabilité.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Vérifications préalables (avant appel)**
**2. Identification interlocuteur**
**3. Script d'appel structuré**
**4. Informations transmises**
**5. Traçabilité écrite**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Vérification analytique avant appel
- Identification précise interlocuteur
- Lecture inverse pour confirmation
- Traçabilité écrite obligatoire (COFRAC)`
    },
    {
      id: 'labo-5', catKey: 'labo', cat: 'Technicien de laboratoire', icon: '🧪', color: '#14b8a6',
      title: "Fiche technique d'un automate",
      prompt: `**RÔLE**
Tu es technicien(ne) référent(e) métrologie au laboratoire, formé(e) à la rédaction de fiches techniques selon le référentiel COFRAC.

**MON CONTEXTE**
- Automate : [marque, modèle]
- Discipline : [biochimie, hémato, immuno, microbio]
- Volume d'analyses : [nombre/jour]
- Profil utilisateurs : [techniciens, biologistes]

**TA MISSION**
Rédige une fiche technique complète pour cet automate.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Identification automate**
**2. Principe analytique**
**3. Maintenance (tableau)**
**4. Procédure CIQ**
**5. Dépannage premier niveau**
**6. Sécurité utilisateur**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conformité COFRAC SH REF 02
- Validation biologiste responsable
- Mise à jour annuelle minimum
- Accessible en libre-service technicien`
    },
    {
      id: 'labo-6', catKey: 'labo', cat: 'Technicien de laboratoire', icon: '🧪', color: '#14b8a6',
      title: 'Préparation visite COFRAC',
      prompt: `**RÔLE**
Tu es technicien(ne) référent(e) qualité au laboratoire, en charge de la préparation des visites COFRAC.

**MON CONTEXTE**
- Type visite : [initiale / surveillance / renouvellement]
- Date prévue : [J-X]
- Périmètre : [biochimie / hémato / microbio / total]
- Points faibles connus : [écarts précédents]

**TA MISSION**
Liste un plan de préparation des 4 semaines précédant la visite.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. J-30 : audit interne complet**
**2. J-21 : actions correctives prioritaires**
**3. J-14 : simulation visite**
**4. J-7 : briefing équipe**
**5. Jour J : organisation pratique**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conformité COFRAC SH REF 02
- Pas de modifications documentaires < J-7
- Personnels à jour habilitations
- Tous les CIQ / EEQ accessibles`
    },
    {
      id: 'labo-7', catKey: 'labo', cat: 'Technicien de laboratoire', icon: '🧪', color: '#14b8a6',
      title: 'Procédure de sécurité microbiologique L2',
      prompt: `**RÔLE**
Tu es technicien(ne) en bactériologie / mycologie, formé(e) à la sécurité microbiologique en laboratoire L2 (NSB2).

**MON CONTEXTE**
- Type d'agents manipulés : [groupe risque 2]
- Équipements : [PSM, étuves, centrifugeuses]
- Effectif laboratoire : [nombre]

**TA MISSION**
Rédige une procédure de sécurité microbiologique applicable.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Définition L2 / NSB2**
**2. EPI obligatoires**
**3. Bonnes pratiques manipulation**
**4. PSM (poste de sécurité microbiologique)**
**5. Gestion des déchets**
**6. Conduite à tenir bris ou projection**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conformité INRS ED 4422
- Formation initiale obligatoire
- Vaccinations à jour
- Surveillance médicale renforcée`
    },
    {
      id: 'labo-8', catKey: 'labo', cat: 'Technicien de laboratoire', icon: '🧪', color: '#14b8a6',
      title: "Compte rendu d'EEQ (évaluation externe qualité)",
      prompt: `**RÔLE**
Tu es technicien(ne) référent(e) qualité, en charge de l'analyse des bilans EEQ trimestriels.

**MON CONTEXTE**
- Programme EEQ : [ProBioQual, CTCB, AFSSAPS, autre]
- Période : [trimestre concerné]
- Paramètres concernés : [liste]
- Résultats reçus : [PDF prestataire]

**TA MISSION**
Rédige un compte rendu d'analyse EEQ avec actions correctives.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Synthèse globale**
**2. Tableau résultats par paramètre**
**3. Analyse non-conformités**
**4. Actions correctives détaillées**
**5. Suivi**
**6. Validation biologiste**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conformité COFRAC SH REF 02
- Analyse sous 1 mois maximum
- Toutes NC investiguées
- Validation biologiste obligatoire`
    },
    {
      id: 'labo-9', catKey: 'labo', cat: 'Technicien de laboratoire', icon: '🧪', color: '#14b8a6',
      title: 'Plan de formation continue technicien',
      prompt: `**RÔLE**
Tu es technicien(ne) de laboratoire en charge de son projet de formation continue, conscient(e) des obligations DPC et de l'évolution rapide du métier.

**MON CONTEXTE**
- Ancienneté : [nombre années]
- Spécialité actuelle : [biochimie, hémato, microbio...]
- Projet professionnel : [évolution, mobilité, spécialisation]
- Budget formation : [employeur / personnel]

**TA MISSION**
Construis un plan de formation continue sur 2 ans.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Bilan compétences actuelles**
**2. Objectifs SMART à 2 ans**
**3. Formations proposées (tableau)**
**4. Modalités de financement**
**5. Calendrier prévisionnel**
**6. Indicateurs de réussite**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Cohérence projet professionnel
- Réalisme financier
- Articulation activité laboratoire
- Validation responsable hiérarchique`
    },
    {
      id: 'labo-10', catKey: 'labo', cat: 'Technicien de laboratoire', icon: '🧪', color: '#14b8a6',
      title: "Procédure de gestion d'une rupture de réactif",
      prompt: `**RÔLE**
Tu es technicien(ne) référent(e) approvisionnement, formé(e) à la gestion de stock et aux procédures de continuité d'activité.

**MON CONTEXTE**
- Réactif manquant : [nom commercial, fournisseur]
- Paramètre impacté : [analyse concernée]
- Stock disponible : [nombre tests]
- Délai réapprovisionnement : [jours annoncés]

**TA MISSION**
Rédige la procédure à suivre en cas de rupture de réactif.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Évaluation impact**
**2. Actions immédiates**
**3. Solutions de continuité**
**4. Communication**
**5. Suivi et retour à la normale**
**6. Prévention récidive**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conformité COFRAC SH REF 02
- Pas de retour à l'activité sans validation CIQ
- Information patient transparente
- Déclaration ANSM si rupture critique`
    },

    // ═════════════════════════════════════════════════════════
    //  16. DIÉTÉTICIEN(NE) — 10 prompts
    // ═════════════════════════════════════════════════════════
    {
      id: 'diet-1', catKey: 'diet', cat: 'Diététicien(ne)', icon: '🥗', color: '#84cc16',
      title: 'Bilan diététique initial complet',
      prompt: `**RÔLE**
Tu es diététicien(ne) nutritionniste DE, formé(e) à la conduite d'un bilan nutritionnel structuré selon les recommandations PNNS et HAS.

**MON CONTEXTE**
- Patient : [âge, sexe, poids, taille, IMC]
- Motif consultation : [perte de poids, pathologie, sport...]
- Contexte de vie : [famille, travail, budget]
- Antécédents : [médicaux, régimes antérieurs]

**TA MISSION**
Rédige un compte rendu de bilan diététique initial structuré.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Anamnèse**
**2. Anthropométrie et données objectives**
**3. Évaluation des apports**
**4. Habitudes et comportement alimentaire**
**5. Activité physique et sédentarité**
**6. Diagnostic diététique**
**7. Plan d'action**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Approche bienveillante et non jugeante
- Pas de régime restrictif sans indication médicale
- Référence PNNS et HAS`
    },
    {
      id: 'diet-2', catKey: 'diet', cat: 'Diététicien(ne)', icon: '🥗', color: '#84cc16',
      title: 'Plan alimentaire diabète type 2',
      prompt: `**RÔLE**
Tu es diététicien(ne) spécialisé(e) en diabétologie, formé(e) aux recommandations SFD et HAS sur la prise en charge nutritionnelle du DT2.

**MON CONTEXTE**
- Patient : [âge, IMC, profession]
- HbA1c : [valeur]
- Traitement : [Metformine, autre]
- Activité physique : [niveau]
- Habitudes alimentaires : [résumé]

**TA MISSION**
Construis un plan alimentaire type pour 1 semaine, adapté au patient.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Objectifs nutritionnels**
**2. Principes clés**
**3. Répartition journalière type**
**4. Plan 7 jours**
**5. Aliments à privilégier / limiter / éviter**
**6. Conseils pratiques**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conformité recommandations SFD / HAS
- Adaptation culturelle et budgétaire
- Pas de régime restrictif extrême
- Coordination avec médecin diabétologue`
    },
    {
      id: 'diet-3', catKey: 'diet', cat: 'Diététicien(ne)', icon: '🥗', color: '#84cc16',
      title: 'Plan dénutrition personne âgée',
      prompt: `**RÔLE**
Tu es diététicien(ne) en gériatrie, formé(e) au dépistage et à la prise en charge de la dénutrition selon HAS 2021.

**MON CONTEXTE**
- Patient : [âge, lieu de vie : domicile / EHPAD / hôpital]
- IMC : [valeur]
- Variation pondérale : [perte X% en X mois]
- MNA : [score si disponible]
- Albumine : [valeur si dosée]
- Pathologies : [résumé]

**TA MISSION**
Rédige un plan de prise en charge nutritionnelle de la dénutrition.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Diagnostic dénutrition (critères HAS 2021)**
**2. Objectifs nutritionnels enrichis**
**3. Stratégie d'enrichissement**
**4. Fractionnement repas**
**5. CNO (compléments nutritionnels oraux)**
**6. Plan menu 1 jour type enrichi**
**7. Suivi**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conformité HAS 2021
- Coordination équipe pluridisciplinaire
- Respect goûts patient
- Pas de NEDC sans avis médical`
    },
    {
      id: 'diet-4', catKey: 'diet', cat: 'Diététicien(ne)', icon: '🥗', color: '#84cc16',
      title: 'Éducation thérapeutique allergie alimentaire',
      prompt: `**RÔLE**
Tu es diététicien(ne) impliqué(e) en ETP, formé(e) aux allergies alimentaires sévères et à l'éviction alimentaire selon recommandations SFA.

**MON CONTEXTE**
- Patient : [enfant / adulte, âge]
- Allergène : [arachide, lait, œuf, gluten...]
- Sévérité : [test cutané, IgE, antécédent anaphylaxie]
- Famille : [implication possible]

**TA MISSION**
Rédige une fiche d'ETP complète pour cette allergie.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Comprendre l'allergie**
**2. Reconnaître les symptômes**
**3. Liste exhaustive aliments à éviter**
**4. Lecture des étiquettes**
**5. Hors domicile**
**6. Trousse d'urgence**
**7. PAI (projet d'accueil individualisé) si enfant**
**8. Auto-injecteur d'adrénaline**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conformité recommandations SFA
- Pas de minimisation du risque
- Information famille obligatoire
- Coordination allergologue`
    },
    {
      id: 'diet-5', catKey: 'diet', cat: 'Diététicien(ne)', icon: '🥗', color: '#84cc16',
      title: 'Atelier collectif équilibre alimentaire',
      prompt: `**RÔLE**
Tu es diététicien(ne) animateur(trice) d'ateliers collectifs en maison de santé, centre social ou entreprise.

**MON CONTEXTE**
- Public : [salariés / personnes âgées / parents / patients DT2]
- Durée : [60 / 90 / 120 minutes]
- Effectif : [nombre participants]
- Lieu : [équipement disponible]
- Thème souhaité : [exemple : courses santé, équilibre repas]

**TA MISSION**
Conçois un déroulé pédagogique d'atelier complet.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Objectifs pédagogiques**
**2. Déroulé minute par minute**
**3. Supports pédagogiques**
**4. Activité interactive principale**
**5. Messages clés à retenir**
**6. Questionnaire d'évaluation**
**7. Ressources à distribuer**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Approche participative (pas magistrale)
- Vocabulaire grand public
- Adaptation culturelle
- Pas de promotion produit / marque`
    },
    {
      id: 'diet-6', catKey: 'diet', cat: 'Diététicien(ne)', icon: '🥗', color: '#84cc16',
      title: 'Plan alimentaire sportif amateur',
      prompt: `**RÔLE**
Tu es diététicien(ne) du sport, formé(e) en nutrition sportive (DU ou équivalent).

**MON CONTEXTE**
- Profil : [âge, sexe, poids, taille]
- Sport pratiqué : [type, fréquence, intensité, durée]
- Objectif : [performance / perte de poids / récupération]
- Compétitions : [oui/non, fréquence]
- Contraintes : [horaires entraînement, professionnels]

**TA MISSION**
Construis un plan alimentaire adapté à la pratique sportive.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Évaluation besoins énergétiques**
**2. Répartition macronutriments**
**3. Hydratation**
**4. Timing nutritionnel**
**5. Plan menu type 1 jour entraînement**
**6. Compléments alimentaires**
**7. Erreurs fréquentes à éviter**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Pas de promesse performance miracle
- Coordination avec médecin / coach
- Vigilance dopage (anti-dopage France)
- Adaptation budget`
    },
    {
      id: 'diet-7', catKey: 'diet', cat: 'Diététicien(ne)', icon: '🥗', color: '#84cc16',
      title: 'Bilan nutritionnel insuffisance rénale chronique',
      prompt: `**RÔLE**
Tu es diététicien(ne) en néphrologie, formé(e) à la prise en charge nutritionnelle de l'IRC selon recommandations HAS et SFNDT.

**MON CONTEXTE**
- Patient : [âge, sexe, poids]
- Stade IRC : [3 / 4 / 5 / dialyse]
- DFG : [valeur ml/min/1,73m²]
- Biologie : [K+, phosphore, albumine, urée]
- Dialyse : [oui : type / non]

**TA MISSION**
Rédige un plan diététique adapté au stade IRC.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Objectifs nutritionnels selon stade**
**2. Aliments à limiter selon paramètre**
**3. Techniques de cuisine pour réduire le potassium**
**4. Plan menu type adapté**
**5. Surveillance**
**6. Éducation patient**
**7. Coordination équipe**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conformité HAS / SFNDT
- Pas d'apport protéique extrême sans avis médecin
- Surveillance biologique régulière
- Adaptation à chaque évolution stade`
    },
    {
      id: 'diet-8', catKey: 'diet', cat: 'Diététicien(ne)', icon: '🥗', color: '#84cc16',
      title: 'Liste de courses santé budget contraint',
      prompt: `**RÔLE**
Tu es diététicien(ne) en santé publique, expérimenté(e) auprès de publics précaires (épiceries solidaires, CCAS).

**MON CONTEXTE**
- Foyer : [composition : adultes, enfants]
- Budget hebdomadaire : [montant]
- Contraintes : [allergies, religion, équipement cuisine]
- Lieu d'achat : [supermarché, marché, hard discount]

**TA MISSION**
Construis une liste de courses santé sur 1 semaine, dans le budget.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Principes de courses économiques**
**2. Liste de courses (tableau)**
**3. Plan repas 1 semaine**
**4. Recettes simples économiques**
**5. Astuces anti-gaspillage**
**6. Aides alimentaires**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Approche non culpabilisante
- Réalisme économique
- Adaptation équipement
- Conformité PNNS`
    },
    {
      id: 'diet-9', catKey: 'diet', cat: 'Diététicien(ne)', icon: '🥗', color: '#84cc16',
      title: 'Coordination chirurgie bariatrique',
      prompt: `**RÔLE**
Tu es diététicien(ne) référent(e) chirurgie bariatrique, formé(e) au parcours pré et post-opératoire selon recommandations HAS.

**MON CONTEXTE**
- Patient : [âge, IMC, comorbidités]
- Chirurgie envisagée : [sleeve / bypass / anneau]
- Phase : [pré-op / post-op : J / mois]

**TA MISSION**
Rédige un plan diététique adapté à la phase.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Phase pré-opératoire (3-6 mois)**
**2. Régime pré-opératoire (semaine -2 à -1)**
**3. Reprise alimentaire post-op (chronologie)**
**4. Règles post-op à respecter**
**5. Suppléments vitaminiques**
**6. Suivi diététique programmé**
**7. Complications nutritionnelles à dépister**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conformité HAS bariatrique
- Coordination chirurgien / nutritionniste
- Suivi à vie
- Pas d'introduction aliment hors phase`
    },
    {
      id: 'diet-10', catKey: 'diet', cat: 'Diététicien(ne)', icon: '🥗', color: '#84cc16',
      title: 'Communication TCA (trouble du comportement alimentaire)',
      prompt: `**RÔLE**
Tu es diététicien(ne) formé(e) à l'accompagnement des TCA (DU, formation ABC...), conscient(e) que la prise en charge nécessite une équipe pluridisciplinaire.

**MON CONTEXTE**
- Patient : [âge, sexe]
- Type TCA suspecté : [anorexie / boulimie / hyperphagie / TCA non spécifié]
- Stade : [début / chronique / récidive]
- Suivi en cours : [médecin / psychiatre / psychologue]

**TA MISSION**
Rédige une trame de premier entretien diététique adaptée TCA.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Posture professionnelle**
**2. Trame d'entretien (45-60 min)**
**3. Questions clés à poser**
**4. Signaux d'alarme nécessitant orientation urgente**
**5. Outils de travail diététique**
**6. Coordination équipe**
**7. Information famille**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Pas de prise en charge isolée diététicien
- Approche bienveillante systématique
- Référence FFAB / centres TCA
- Vigilance signaux d'alarme`
    },

    // ═════════════════════════════════════════════════════════
    //  17. PRÉPARATEUR EN PHARMACIE — 10 prompts
    // ═════════════════════════════════════════════════════════
    {
      id: 'prep-1', catKey: 'prep', cat: 'Préparateur en pharmacie', icon: '🧴', color: '#0ea5e9',
      title: 'Conseil associé sur ordonnance',
      prompt: `**RÔLE**
Tu es préparateur(trice) en pharmacie d'officine, formé(e) à la délivrance et au conseil associé sous la supervision du pharmacien.

**MON CONTEXTE**
- Médicament délivré : [DCI, classe thérapeutique]
- Indication probable : [pathologie ciblée]
- Profil patient : [âge, sexe, contexte]
- Posologie : [détaillée]

**TA MISSION**
Rédige le conseil associé à donner au patient lors de la délivrance.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Compréhension du traitement**
**2. Modalités de prise**
**3. Effets indésirables courants à surveiller**
**4. Interactions à anticiper**
**5. Conservation**
**6. Quand reconsulter**
**7. Validation pharmacien**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Vocabulaire patient
- Pas de diagnostic, pas de modification posologique
- Validation pharmacien si doute
- Conformité Ordre des pharmaciens`
    },
    {
      id: 'prep-2', catKey: 'prep', cat: 'Préparateur en pharmacie', icon: '🧴', color: '#0ea5e9',
      title: 'Préparation magistrale - fiche de fabrication',
      prompt: `**RÔLE**
Tu es préparateur(trice) en pharmacie habilité(e) à la préparation magistrale sous responsabilité pharmacien, conformément aux BPP (Bonnes Pratiques de Préparation).

**MON CONTEXTE**
- Préparation : [forme galénique, principe actif]
- Quantité demandée : [volume / poids]
- Prescripteur : [médecin]
- Référence à appliquer : [Pharmacopée / formulaire national]

**TA MISSION**
Rédige une fiche de fabrication conforme aux BPP.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Identification préparation**
**2. Formule et matières premières**
**3. Matériel utilisé**
**4. Mode opératoire détaillé**
**5. Contrôles**
**6. Étiquetage**
**7. Traçabilité**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conformité BPP / Pharmacopée européenne
- Validation pharmacien systématique
- Traçabilité complète
- Pas de modification formule sans avis pharmacien`
    },
    {
      id: 'prep-3', catKey: 'prep', cat: 'Préparateur en pharmacie', icon: '🧴', color: '#0ea5e9',
      title: 'Conseil hiver / saison automédication',
      prompt: `**RÔLE**
Tu es préparateur(trice) en pharmacie d'officine, expérimenté(e) en conseil patient sur les pathologies saisonnières fréquentes.

**MON CONTEXTE**
- Saison : [hiver / été / automne / printemps]
- Pathologies fréquentes ciblées : [rhume, grippe, gastro, allergies...]
- Profil patient type : [adulte / enfant / personne âgée / femme enceinte]

**TA MISSION**
Rédige une fiche conseil saisonnière pour la délivrance en automédication.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Pathologies ciblées et symptômes**
**2. Première intention selon symptôme**
**3. Posologies usuelles paracétamol / ibuprofène**
**4. Contre-indications absolues à connaître**
**5. Signes d'alerte nécessitant consultation rapide**
**6. Conseils non médicamenteux**
**7. Validation pharmacien**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conformité Pharmacopée
- Pas de diagnostic
- Orientation médecin systématique en cas de doute
- Vigilance interactions médicamenteuses`
    },
    {
      id: 'prep-4', catKey: 'prep', cat: 'Préparateur en pharmacie', icon: '🧴', color: '#0ea5e9',
      title: "Gestion d'une rupture de stock médicament",
      prompt: `**RÔLE**
Tu es préparateur(trice) en pharmacie en charge de la gestion des stocks et de la communication patient en cas de rupture.

**MON CONTEXTE**
- Médicament en rupture : [nom commercial, DCI]
- Cause connue : [rupture fabricant, transport, autre]
- Délai annoncé : [date reprise]
- Alternatives disponibles : [génériques, équivalents]

**TA MISSION**
Rédige la procédure complète de gestion de cette rupture.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Vérification rupture**
**2. Identification alternatives**
**3. Patient en cours de traitement**
**4. Communication patient**
**5. Coordination prescripteur**
**6. Traçabilité**
**7. Veille**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conformité Code de la santé publique (substitution générique)
- Pas de modification dosage sans accord prescripteur
- Information patient transparente
- Validation pharmacien systématique`
    },
    {
      id: 'prep-5', catKey: 'prep', cat: 'Préparateur en pharmacie', icon: '🧴', color: '#0ea5e9',
      title: "Vérification d'une ordonnance complexe",
      prompt: `**RÔLE**
Tu es préparateur(trice) en pharmacie expérimenté(e) en délivrance d'ordonnances polymédicamentées, formé(e) au repérage des erreurs et interactions sous supervision pharmacien.

**MON CONTEXTE**
- Patient : [âge, polypathologie]
- Nombre médicaments : [nombre lignes ordonnance]
- Pathologies : [liste]
- Antécédents allergie / intolérance : [oui/non]

**TA MISSION**
Construis une grille de vérification de l'ordonnance.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Vérifications administratives**
**2. Vérifications cliniques**
**3. Interactions médicamenteuses**
**4. Surveillance particulière**
**5. Doublons / redondances**
**6. Conduite à tenir en cas d'anomalie**
**7. Traçabilité**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Validation pharmacien systématique
- Pas de modification posologie sans médecin
- Vigilance interactions
- Conformité Code de la santé publique`
    },
    {
      id: 'prep-6', catKey: 'prep', cat: 'Préparateur en pharmacie', icon: '🧴', color: '#0ea5e9',
      title: 'Conseil orthopédie / matériel médical',
      prompt: `**RÔLE**
Tu es préparateur(trice) en pharmacie spécialisé(e) en orthopédie / matériel médical (DU ou formation interne).

**MON CONTEXTE**
- Demande : [bas contention, ceinture lombaire, attelle, orthèse...]
- Indication : [médicale / préventive]
- Prescription : [oui / non]
- Profil patient : [âge, taille, mensurations]

**TA MISSION**
Rédige une fiche conseil pour cette dispensation.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Indication et bénéfice attendu**
**2. Choix du modèle**
**3. Mise en place / pose**
**4. Conseils d'utilisation**
**5. Contre-indications à connaître**
**6. Surveillance**
**7. Remboursement**
**8. Quand revenir / consulter**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Vérification mensurations précises
- Délivrance sur prescription si LPP
- Pas de conseil hors champ formation
- Orientation médecin si situation complexe`
    },
    {
      id: 'prep-7', catKey: 'prep', cat: 'Préparateur en pharmacie', icon: '🧴', color: '#0ea5e9',
      title: 'Procédure de retour de médicaments',
      prompt: `**RÔLE**
Tu es préparateur(trice) en charge de la gestion des retours patients et des médicaments non utilisés (Cyclamed).

**MON CONTEXTE**
- Type de retour : [médicament périmé / non utilisé / patient décédé]
- Quantité : [volume]
- Présence de stupéfiants : [oui / non]

**TA MISSION**
Rédige la procédure de gestion du retour conforme.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Médicaments acceptés Cyclamed**
**2. Médicaments non acceptés Cyclamed**
**3. Procédure de réception**
**4. Cas particulier : stupéfiants**
**5. Médicaments thermosensibles**
**6. Communication patient**
**7. Traçabilité interne**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conformité Cyclamed
- Procédure stupéfiants stricte avec pharmacien
- Pas de réutilisation médicaments retournés
- Information patient bienveillante`
    },
    {
      id: 'prep-8', catKey: 'prep', cat: 'Préparateur en pharmacie', icon: '🧴', color: '#0ea5e9',
      title: "Réception et contrôle d'une commande",
      prompt: `**RÔLE**
Tu es préparateur(trice) en charge de la réception des commandes en pharmacie d'officine.

**MON CONTEXTE**
- Type de commande : [grossiste / direct laboratoire]
- Volume : [nombre de colis]
- Présence stupéfiants : [oui / non]
- Présence chaîne du froid : [oui / non]

**TA MISSION**
Rédige la procédure de réception et de contrôle.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Vérification à la livraison**
**2. Déballage et contrôle quantitatif**
**3. Contrôle qualitatif**
**4. Cas particuliers**
**5. Rangement**
**6. Mise à jour informatique**
**7. Anomalies**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conformité Bonnes Pratiques
- Pharmacien pour stupéfiants
- Chaîne du froid stricte
- Traçabilité lots obligatoire`
    },
    {
      id: 'prep-9', catKey: 'prep', cat: 'Préparateur en pharmacie', icon: '🧴', color: '#0ea5e9',
      title: 'Préparation des doses à administrer (PDA)',
      prompt: `**RÔLE**
Tu es préparateur(trice) habilité(e) à la PDA en officine ou en EHPAD, formé(e) aux Bonnes Pratiques.

**MON CONTEXTE**
- Patient : [identité, EHPAD ou domicile]
- Nombre de médicaments : [liste détaillée]
- Période préparée : [semaine / 28 jours]
- Système utilisé : [pilulier / blister sécurisé / sachet-doses]

**TA MISSION**
Rédige la procédure de PDA conforme aux BPP.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Vérifications préalables**
**2. Médicaments non éligibles à la PDA**
**3. Préparation**
**4. Étiquetage du pilulier**
**5. Contrôle final**
**6. Livraison / remise**
**7. Traçabilité**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conformité BPP PDA
- Validation pharmacien systématique
- Pas de PDA sans consentement patient
- Hygiène irréprochable`
    },
    {
      id: 'prep-10', catKey: 'prep', cat: 'Préparateur en pharmacie', icon: '🧴', color: '#0ea5e9',
      title: 'Plan de DPC préparateur',
      prompt: `**RÔLE**
Tu es préparateur(trice) en pharmacie en cours de réflexion sur ses obligations DPC triennales et son projet de formation continue.

**MON CONTEXTE**
- Ancienneté : [années]
- Spécialité officine ou hôpital : [précise]
- Triennat DPC en cours : [obligation 1 ou 2 actions]
- Pôles d'intérêt : [orthopédie, dermo, vétérinaire, gestion...]

**TA MISSION**
Construis un plan DPC sur 3 ans.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Rappel obligation DPC**
**2. Évaluation des compétences actuelles**
**3. Orientations prioritaires nationales DPC**
**4. Plan d'actions sur 3 ans**
**5. Modalités de financement**
**6. Indicateurs réussite**
**7. Traçabilité**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conformité obligation triennale ANDPC
- Articulation activité officine
- Cohérence projet professionnel
- Validation pharmacien titulaire`
    },

    // ═════════════════════════════════════════════════════════
    //  18. ORTHOPHONISTE — 10 prompts
    // ═════════════════════════════════════════════════════════
    {
      id: 'ortho-1', catKey: 'ortho', cat: 'Orthophoniste', icon: '🗣️', color: '#eab308',
      title: 'Bilan orthophonique initial - structuration',
      prompt: `**RÔLE**
Tu es orthophoniste en cabinet libéral ou en institution, formé(e) à la rédaction de bilans orthophoniques conformes à la nomenclature AMO et aux recommandations FNO.

**MON CONTEXTE**
- Patient : [âge, scolarité ou activité]
- Motif : [retard langage, dyslexie, dysphagie, neuro...]
- Domaine concerné : [oral, écrit, voix, déglutition, neuro]
- Source orientation : [médecin, école, MDPH, famille]

**TA MISSION**
Rédige une trame de bilan orthophonique complet conforme.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Identification**
**2. Motif et histoire**
**3. Anamnèse**
**4. Plaintes actuelles**
**5. Tests pratiqués**
**6. Synthèse diagnostique**
**7. Indication et nombre de séances**
**8. Objectifs thérapeutiques**
**9. Conclusion et orientation**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conformité nomenclature AMO
- Validation FNO recommandations
- Tests étalonnés validés
- Compte rendu transmis prescripteur`
    },
    {
      id: 'ortho-2', catKey: 'ortho', cat: 'Orthophoniste', icon: '🗣️', color: '#eab308',
      title: 'Plan de rééducation dyslexie/dysorthographie',
      prompt: `**RÔLE**
Tu es orthophoniste expérimenté(e) en troubles spécifiques des apprentissages (TSA), formé(e) aux méthodes validées scientifiquement.

**MON CONTEXTE**
- Enfant : [âge, classe]
- Diagnostic : [dyslexie, dysorthographie, mixte, sévérité]
- Bilan initial : [résultats clés]
- Suivi : [nouveau / continuation]
- PAP / PPS : [oui / non, dispositif scolaire]

**TA MISSION**
Construis un plan de rééducation sur 3 mois.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Objectifs SMART**
**2. Axes de travail prioritaires**
**3. Méthodes utilisées**
**4. Plan séance type (45 min)**
**5. Travail à domicile**
**6. Coordination équipe**
**7. Réévaluation**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Méthodes validées scientifiquement
- Pas de méthode hors champ orthophonique
- Coordination école obligatoire
- Information famille transparente`
    },
    {
      id: 'ortho-3', catKey: 'ortho', cat: 'Orthophoniste', icon: '🗣️', color: '#eab308',
      title: 'Rééducation dysphagie post-AVC',
      prompt: `**RÔLE**
Tu es orthophoniste neurologue, formé(e) à la rééducation des troubles de la déglutition selon les recommandations HAS et SFNV.

**MON CONTEXTE**
- Patient : [âge, sexe]
- Phase AVC : [aiguë / subaiguë / chronique]
- Type AVC : [ischémique / hémorragique, territoire]
- Bilan déglutition : [résultats vidéofluoroscopie, FEES si réalisée]
- Régime actuel : [IDDSI, modifications]

**TA MISSION**
Construis un plan de rééducation de la dysphagie.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Bilan initial spécifique**
**2. Adaptation alimentation IDDSI**
**3. Objectifs thérapeutiques**
**4. Techniques de rééducation**
**5. Plan séance type**
**6. Coordination équipe pluridisciplinaire**
**7. Information famille**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conformité HAS / SFNV
- Coordination pluridisciplinaire systématique
- Pas de progression texture sans validation équipe
- Vigilance pneumopathies inhalation`
    },
    {
      id: 'ortho-4', catKey: 'ortho', cat: 'Orthophoniste', icon: '🗣️', color: '#eab308',
      title: 'Rééducation aphasie post-AVC',
      prompt: `**RÔLE**
Tu es orthophoniste neurologue, formé(e) à la rééducation des aphasies selon les recommandations SFNP.

**MON CONTEXTE**
- Patient : [âge, latéralité, profession antérieure]
- Type aphasie : [Broca, Wernicke, globale, conduction, transcorticale]
- Sévérité : [légère, modérée, sévère]
- Délai post-AVC : [phase aiguë, subaiguë, chronique]
- Communication actuelle : [verbale, gestuelle, mixte]

**TA MISSION**
Construis un plan de rééducation aphasie.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Bilan aphasie initial**
**2. Objectifs hiérarchisés**
**3. Techniques de rééducation par domaine**
**4. Méthodes spécifiques validées**
**5. Implication famille / aidants**
**6. Plan séance type**
**7. Réévaluation**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conformité SFNP
- Pas de récupération promise (variabilité)
- Coordination neurologue / MPR
- Soutien psychologique en cas de dépression post-AVC`
    },
    {
      id: 'ortho-5', catKey: 'ortho', cat: 'Orthophoniste', icon: '🗣️', color: '#eab308',
      title: 'Rééducation vocale dysphonie',
      prompt: `**RÔLE**
Tu es orthophoniste spécialisé(e) en troubles de la voix, formé(e) en rééducation vocale (DU ou équivalent).

**MON CONTEXTE**
- Patient : [âge, profession, vocale-dépendant ?]
- Diagnostic ORL : [nodules, polype, kyste, dysphonie fonctionnelle]
- Vidéolaryngoscopie : [résultats]
- Plaintes : [fatigue, instabilité, douleur, perte aiguës]

**TA MISSION**
Construis un plan de rééducation vocale.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Bilan vocal initial**
**2. Objectifs**
**3. Techniques de rééducation**
**4. Hygiène vocale**
**5. Plan séance type**
**6. Coordination ORL**
**7. Travail à domicile**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Coordination ORL prescripteur
- Pas de rééducation sur lésion organique non traitée
- Adaptation profession patient
- Pas de promesse récupération chant professionnel`
    },
    {
      id: 'ortho-6', catKey: 'ortho', cat: 'Orthophoniste', icon: '🗣️', color: '#eab308',
      title: 'Rééducation bégaiement enfant',
      prompt: `**RÔLE**
Tu es orthophoniste formé(e) au bégaiement (méthodes Lidcombe, Palin, intégrative), conscient(e) que la précocité de la prise en charge influence le pronostic.

**MON CONTEXTE**
- Enfant : [âge, sexe]
- Apparition bégaiement : [délai depuis début, évolution]
- Sévérité : [SSI-4 si possible, légère/modérée/sévère]
- Réaction enfant : [conscient ? évitement ?]
- Réaction famille : [angoisse, banalisation]

**TA MISSION**
Construis un plan de prise en charge bégaiement.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Bilan initial**
**2. Choix méthodologique selon âge**
**3. Méthode Lidcombe (2-6 ans)**
**4. Méthode Palin PCI**
**5. Désensibilisation (enfant conscient)**
**6. Travail famille / école**
**7. Réévaluation**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Méthodes validées scientifiquement
- Pas de promesse guérison définitive
- Coordination école
- Soutien famille obligatoire`
    },
    {
      id: 'ortho-7', catKey: 'ortho', cat: 'Orthophoniste', icon: '🗣️', color: '#eab308',
      title: 'Compte rendu DPC orthophoniste',
      prompt: `**RÔLE**
Tu es orthophoniste libéral(e) ou salarié(e), en cours de validation DPC triennal.

**MON CONTEXTE**
- Triennat : [année en cours dans cycle]
- Actions réalisées : [formations, EPP, analyse pratiques]
- Domaine principal : [pédiatrie, neuro, voix, déglutition]
- Compte ANDPC : [actif]

**TA MISSION**
Rédige un bilan DPC triennal documenté.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Présentation parcours triennal**
**2. Action 1 - Formation cognitive**
**3. Action 2 - EPP**
**4. Action 3 - Analyse pratiques**
**5. Synthèse réflexive**
**6. Indicateurs**
**7. Perspectives triennat suivant**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conformité référentiel ANDPC orthophoniste
- 3 actions différentes
- Documentation complète preuves
- Démarche réflexive véritable`
    },
    {
      id: 'ortho-8', catKey: 'ortho', cat: 'Orthophoniste', icon: '🗣️', color: '#eab308',
      title: 'Coordination scolaire (PAP, PPS)',
      prompt: `**RÔLE**
Tu es orthophoniste impliqué(e) dans l'accompagnement scolaire des enfants TSA, formé(e) aux dispositifs PAP, PPS, PAI.

**MON CONTEXTE**
- Enfant : [âge, classe, école]
- Diagnostic : [TSA, sévérité]
- Aménagements actuels : [si déjà existants]
- Demande famille : [PAP, PPS, AVS]

**TA MISSION**
Rédige un compte rendu et des préconisations scolaires.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Rappel des dispositifs**
**2. Diagnostic et retentissement scolaire**
**3. Préconisations d'aménagements**
**4. Outils numériques recommandés**
**5. Coordination équipe pédagogique**
**6. Évaluation et suivi**
**7. Information famille**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conformité circulaire éducation nationale
- Pas de prescription pédagogique
- Préconisations argumentées
- Coordination respectueuse école`
    },
    {
      id: 'ortho-9', catKey: 'ortho', cat: 'Orthophoniste', icon: '🗣️', color: '#eab308',
      title: 'Rééducation déficience auditive enfant',
      prompt: `**RÔLE**
Tu es orthophoniste spécialisé(e) en surdité, formé(e) à la rééducation enfants implantés ou appareillés (DU surdité ou équivalent).

**MON CONTEXTE**
- Enfant : [âge, âge appareillage / implantation]
- Type surdité : [neurosensorielle, moyenne, sévère, profonde]
- Appareillage : [audioprothèses, IC, BAHA]
- Modalité communication : [oraliste, LSF, bilingue]
- Bilan : [audiogramme, langage]

**TA MISSION**
Construis un plan de rééducation orthophonique adapté.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Bilan initial**
**2. Objectifs selon profil**
**3. Domaines de travail**
**4. Outils spécifiques**
**5. Coordination équipe**
**6. Plan séance type**
**7. Travail à domicile**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Coordination ORL / audioprothésiste
- Respect choix communication famille
- Pas de promesse récupération audition
- Adaptation à chaque évolution appareillage`
    },
    {
      id: 'ortho-10', catKey: 'ortho', cat: 'Orthophoniste', icon: '🗣️', color: '#eab308',
      title: 'Synthèse pour MDPH',
      prompt: `**RÔLE**
Tu es orthophoniste rédigeant un compte rendu pour dossier MDPH (PPS, AEEH, RQTH selon âge), conscient(e) du rôle clé de ce document dans l'évaluation.

**MON CONTEXTE**
- Patient : [âge, scolarité ou activité]
- Demande MDPH : [nature]
- Diagnostic : [trouble, sévérité]
- Suivi orthophonique : [durée, fréquence]
- Évolution : [progrès, plateau, aggravation]

**TA MISSION**
Rédige une synthèse MDPH structurée.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Identification**
**2. Diagnostic et sévérité**
**3. Bilans réalisés**
**4. Retentissement fonctionnel**
**5. Suivi orthophonique**
**6. Préconisations argumentées**
**7. Conclusion**
**8. Annexes**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Vocabulaire accessible MDPH
- Argumentation factuelle, données chiffrées
- Pas de jugement scolaire / éducatif
- Validation famille avant transmission`
    },

    // ═════════════════════════════════════════════════════════
    //  19. GÉRIATRE / MÉDECIN COORDONNATEUR EHPAD — 10 prompts
    // ═════════════════════════════════════════════════════════
    {
      id: 'geria-1', catKey: 'geria', cat: 'Gériatre / EHPAD', icon: '👴', color: '#94a3b8',
      title: 'Évaluation gériatrique standardisée (EGS)',
      prompt: `**RÔLE**
Tu es médecin gériatre, spécialiste de l'évaluation gérontologique multidimensionnelle.

**MON CONTEXTE**
- Patient : [âge, sexe, lieu de vie, motif d'évaluation]
- Antécédents : [pathologies chroniques, chirurgies]
- Traitement habituel : [classes thérapeutiques]
- Plainte principale : [chute, perte d'autonomie, troubles cognitifs, dénutrition]
- Aidant principal : [conjoint, enfant, professionnel]
- Contexte social : [domicile, EHPAD, isolement]

**TA MISSION**
Structure une évaluation gériatrique standardisée (EGS) complète.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Évaluation cognitive**
**2. Évaluation autonomie**
**3. Évaluation thymique et nutritionnelle**
**4. Évaluation locomotrice et risque de chute**
**5. Évaluation sensorielle**
**6. Synthèse et plan**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Vocabulaire gériatrique précis
- Approche multidimensionnelle
- Articulation avec aidants
- Sources : HAS, SFGG`
    },
    {
      id: 'geria-2', catKey: 'geria', cat: 'Gériatre / EHPAD', icon: '👴', color: '#94a3b8',
      title: 'Projet de soin individualisé (PSI) en EHPAD',
      prompt: `**RÔLE**
Tu es médecin coordonnateur d'EHPAD, en charge du projet de soin individualisé.

**MON CONTEXTE**
- Résident : [prénom anonymisé, âge, GIR]
- Pathologies principales : [démence, parkinson, BPCO, etc.]
- Histoire de vie : [profession, centres d'intérêt, famille]
- État actuel : [autonomie, comportement, douleur, nutrition]
- Souhaits du résident et de la famille : [...]
- Référent soignant : [nom IDE/AS]

**TA MISSION**
Rédige le projet de soin individualisé du résident, articulé au projet de vie.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Synthèse de la situation**
**2. Objectifs de soin sur 6 mois**
**3. Plan thérapeutique**
**4. Plan de soins paramédicaux**
**5. Articulation avec le projet de vie**
**6. Évaluation et révision**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Centré sur le résident (sa parole, ses choix)
- Approche bientraitante
- Articulation avec l'équipe pluriprofessionnelle
- Loi du 2 janvier 2002 (droits des usagers)`
    },
    {
      id: 'geria-3', catKey: 'geria', cat: 'Gériatre / EHPAD', icon: '👴', color: '#94a3b8',
      title: 'Gestion des troubles du comportement (Alzheimer, démence)',
      prompt: `**RÔLE**
Tu es médecin gériatre, formé à l'approche non médicamenteuse des troubles du comportement.

**MON CONTEXTE**
- Résident : [âge, type de démence, MMSE]
- Trouble : [agitation, agressivité, déambulation, opposition aux soins, cris]
- Fréquence : [horaires, déclencheurs identifiés]
- Retentissement : [équipe, autres résidents, famille]
- Tentatives : [ce qui a été essayé]
- Traitement actuel : [neuroleptiques en cours ?]

**TA MISSION**
Propose une analyse étiologique et un plan d'intervention non médicamenteux prioritairement.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Analyse étiologique du trouble**
**2. Approche non médicamenteuse en première intention**
**3. Si médicamenteux nécessaire**
**4. Suivi et réévaluation**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Approche non médicamenteuse en première intention (HAS)
- Limiter neuroleptiques (surmortalité chez personnes âgées)
- Recherche systématique d'une cause somatique
- Formation équipe à la communication adaptée`
    },
    {
      id: 'geria-4', catKey: 'geria', cat: 'Gériatre / EHPAD', icon: '👴', color: '#94a3b8',
      title: 'Prescription médicamenteuse adaptée à la personne âgée',
      prompt: `**RÔLE**
Tu es médecin gériatre, expert en pharmacologie de la personne âgée et déprescription.

**MON CONTEXTE**
- Patient : [âge, poids, clairance créatinine]
- Pathologies : [liste]
- Ordonnance actuelle : [molécules, posologies]
- Polymédication : [nombre de molécules]
- Effets indésirables suspectés : [...]
- Observance : [bonne, partielle, difficile]

**TA MISSION**
Réalise une revue d'ordonnance gériatrique avec déprescription raisonnée.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Analyse de l'ordonnance**
**2. Critères STOPP/START appliqués**
**3. Liste de Beers / Laroche**
**4. Plan de déprescription**
**5. Communication**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Adaptation à la fonction rénale (Cockroft-Gault adapté à l'âge)
- Privilégier monothérapie quand possible
- Interactions médicamenteuses systématiquement vérifiées
- Sources : HAS, OMéDIT, Liste de Laroche, critères STOPP/START`
    },
    {
      id: 'geria-5', catKey: 'geria', cat: 'Gériatre / EHPAD', icon: '👴', color: '#94a3b8',
      title: 'Fin de vie et soins palliatifs en EHPAD',
      prompt: `**RÔLE**
Tu es médecin coordonnateur, formé aux soins palliatifs gériatriques.

**MON CONTEXTE**
- Résident : [âge, pathologie principale, espérance de vie estimée]
- Pronostic : [phase terminale, agonie, soins de confort]
- Symptômes actuels : [douleur, dyspnée, anxiété, encombrement]
- Directives anticipées : [rédigées ? contenu]
- Personne de confiance : [identifiée]
- Souhaits famille : [...]
- Équipe mobile soins palliatifs : [sollicitée ?]

**TA MISSION**
Structure un plan de soins palliatifs adapté et trace la procédure collégiale si décision de limitation/arrêt.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Évaluation symptomatique**
**2. Plan thérapeutique de confort**
**3. Procédure collégiale (loi Claeys-Leonetti)**
**4. Sédation profonde et continue**
**5. Accompagnement**
**6. Après le décès**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Respect des directives anticipées
- Loi Claeys-Leonetti du 2 février 2016
- Approche pluridisciplinaire
- Soutien de l'équipe (debriefing, formation)`
    },
    {
      id: 'geria-6', catKey: 'geria', cat: 'Gériatre / EHPAD', icon: '👴', color: '#94a3b8',
      title: 'Dossier de coordination des soins (DLU, DMP)',
      prompt: `**RÔLE**
Tu es médecin coordonnateur, en charge de la continuité des soins entre ville, hôpital et EHPAD.

**MON CONTEXTE**
- Résident : [identité anonymisée, âge, GIR]
- Motif de coordination : [hospitalisation, consultation spécialisée, retour]
- Pathologies actives : [...]
- Traitement actualisé : [...]
- Allergies : [...]
- Personne de confiance : [...]
- Directives anticipées : [oui / non]

**TA MISSION**
Rédige le DLU (Dossier de Liaison d'Urgence) et la fiche de coordination des soins.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Identification**
**2. Personne de confiance et directives**
**3. Pathologies actives et antécédents**
**4. Traitement médicamenteux à jour**
**5. Allergies et intolérances**
**6. Niveau d'autonomie et besoins**
**7. État cognitif et thymique**
**8. Synthèse pour transmission**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Modèle DLU validé HAS
- Mise à jour à chaque modification
- Articulation avec DMP (Dossier Médical Partagé)
- Confidentialité et accès soignant`
    },
    {
      id: 'geria-7', catKey: 'geria', cat: 'Gériatre / EHPAD', icon: '👴', color: '#94a3b8',
      title: 'RCP gériatrique (Réunion de concertation pluridisciplinaire)',
      prompt: `**RÔLE**
Tu es médecin coordonnateur, animateur de la RCP gériatrique mensuelle.

**MON CONTEXTE**
- Résident : [identifiant anonymisé, âge, GIR]
- Motif RCP : [troubles comportement, projet limitation thérapeutique, plaie complexe, douleur réfractaire]
- Participants prévus : [médecin co, IDE coordinatrice, psychologue, ergothérapeute, kiné, AS référent, famille si pertinent]
- Documents disponibles : [dossier médical, échelles, photos]

**TA MISSION**
Structure la RCP gériatrique : préparation, déroulé, traçabilité, plan d'action.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Préparation**
**2. Présentation du cas**
**3. Synthèse pluriprofessionnelle**
**4. Discussion et décisions**
**5. Plan d'action**
**6. Compte-rendu RCP**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Anonymisation lors présentation collective
- Décision collégiale tracée
- Respect droits du résident
- Rythme adapté (mensuel ou trimestriel)`
    },
    {
      id: 'geria-8', catKey: 'geria', cat: 'Gériatre / EHPAD', icon: '👴', color: '#94a3b8',
      title: "Rapport médical annuel d'activité de l'EHPAD",
      prompt: `**RÔLE**
Tu es médecin coordonnateur d'EHPAD, en charge du rapport annuel d'activité médicale présenté en CVS (Conseil de la Vie Sociale) et transmis à l'ARS.

**MON CONTEXTE**
- EHPAD : [nombre de places, GMP, PMP]
- Année concernée : [202X]
- Données disponibles : [PATHOS, AGGIR, indicateurs ARS]
- Équipe médicale : [médecin co ETP, médecins traitants, IDE, AS]
- Événements marquants : [épidémies, hospitalisations, décès, changement direction]

**TA MISSION**
Rédige le rapport médical annuel d'activité, conforme aux exigences du décret du 5 juillet 2019 et présentable au CVS.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Présentation de l'établissement**
**2. Activité médicale et soignante**
**3. Pathologies prévalentes et prises en charge**
**4. Politique de prescription et bon usage du médicament**
**5. Prévention et qualité des soins**
**6. Événements indésirables et CREX**
**7. Formation de l'équipe**
**8. Perspectives et axes d'amélioration**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Anonymisation des données individuelles
- Présentation accessible au CVS
- Données chiffrées sourcées
- Conforme cahier des charges ARS`
    },
    {
      id: 'geria-9', catKey: 'geria', cat: 'Gériatre / EHPAD', icon: '👴', color: '#94a3b8',
      title: 'Plan bleu canicule / épidémie',
      prompt: `**RÔLE**
Tu es médecin coordonnateur, en charge du plan bleu réglementaire de l'EHPAD.

**MON CONTEXTE**
- EHPAD : [capacité, climatisation existante, locaux rafraîchis]
- Période : [été, hiver, épidémie respiratoire]
- Risque identifié : [canicule, grippe, gastro-entérite, COVID]
- Équipe : [effectifs, plan de remplacement]
- Population : [GMP, résidents à risque accru]

**TA MISSION**
Structure le plan bleu opérationnel pour la période concernée, conforme à l'arrêté du 7 juillet 2005 modifié.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Activation et niveau de vigilance**
**2. Mesures sanitaires**
**3. Surveillance des résidents à risque**
**4. Organisation de l'équipe**
**5. Communication**
**6. Cas d'épidémie respiratoire / digestive**
**7. Bilan post-événement**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conforme arrêté du 7 juillet 2005 (plan bleu obligatoire)
- Articulation avec ARS et SAMU
- Plan testé annuellement
- Information du CVS`
    },
    {
      id: 'geria-10', catKey: 'geria', cat: 'Gériatre / EHPAD', icon: '👴', color: '#94a3b8',
      title: "Formation de l'équipe soignante (bientraitance, démence, soins palliatifs)",
      prompt: `**RÔLE**
Tu es médecin coordonnateur, responsable du plan de formation de l'équipe soignante de l'EHPAD.

**MON CONTEXTE**
- Effectif : [IDE, AS, ASH, animateurs]
- Besoins identifiés : [bientraitance, Alzheimer, soins palliatifs, AFGSU 2, manutention, PSI]
- Budget formation : [montant annuel]
- Formats possibles : [présentiel, e-learning, simulation]
- Calendrier : [annuel, semestriel]

**TA MISSION**
Structure un plan de formation annuel cohérent avec les besoins de l'équipe et les obligations réglementaires.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Diagnostic des besoins**
**2. Formations obligatoires et recommandées**
**3. Modalités pédagogiques**
**4. Évaluation des formations**
**5. Articulation avec passeport prévention et DPC**
**6. Plan annuel synthèse**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conformité au plan de formation prévu par le code du travail
- Articulation OPCO Santé
- Évaluation systématique
- Source : recommandations HAS EHPAD, ANCESU pour AFGSU`
    },

    // ═════════════════════════════════════════════════════════
    //  20. ADMINISTRATEUR / ACHETEUR SANTÉ — 10 prompts
    // ═════════════════════════════════════════════════════════
    {
      id: 'admin-1', catKey: 'admin', cat: 'Administrateur / Acheteur', icon: '📊', color: '#64748b',
      title: 'Appel d\'offres marché public santé',
      prompt: `**RÔLE**
Tu es acheteur dans un établissement de santé public, expert en marchés publics hospitaliers (Code de la commande publique).

**MON CONTEXTE**
- Établissement : [CH, CHU, EHPAD public, GHT]
- Objet du marché : [équipement, dispositif médical, prestation, médicament hors GCS]
- Montant estimé : [HT]
- Procédure envisagée : [MAPA, AOO, AOR, dialogue compétitif]
- Durée du marché : [an, reconductible]
- Allotissement : [oui / non, justification]

**TA MISSION**
Structure le dossier de consultation des entreprises (DCE) et le calendrier de la procédure.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Choix de la procédure**
**2. Documents constitutifs du DCE**
**3. Critères d'attribution**
**4. Calendrier prévisionnel**
**5. Analyse des offres**
**6. Notification et exécution**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conformité Code de la commande publique
- Allotissement par défaut, justification regroupement
- Critères RSE et clauses sociales si pertinent
- Mise en ligne sur profil acheteur`
    },
    {
      id: 'admin-2', catKey: 'admin', cat: 'Administrateur / Acheteur', icon: '📊', color: '#64748b',
      title: 'Cahier des charges équipement médical',
      prompt: `**RÔLE**
Tu es acheteur santé, en charge de la rédaction des cahiers des charges techniques pour les équipements médicaux.

**MON CONTEXTE**
- Équipement : [scanner, IRM, échographe, lit médicalisé, etc.]
- Service utilisateur : [radiologie, urgences, bloc, EHPAD]
- Besoin clinique : [examens type, volume annuel]
- Budget alloué : [HT]
- Contraintes locales : [surface, alimentation, blindage]

**TA MISSION**
Rédige un cahier des charges techniques fonctionnel (CCTP) précis et non discriminant.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Contexte et besoin**
**2. Spécifications techniques fonctionnelles**
**3. Caractéristiques techniques détaillées**
**4. Installation et environnement**
**5. Formation et accompagnement**
**6. Maintenance et SAV**
**7. Évolutivité**
**8. Critères de notation**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Critères mesurables et non discriminants
- Pas de référence à une marque sans "ou équivalent"
- Articulation avec biomédical et utilisateurs
- Conformité marquage CE et MDR`
    },
    {
      id: 'admin-3', catKey: 'admin', cat: 'Administrateur / Acheteur', icon: '📊', color: '#64748b',
      title: 'Négociation fournisseur dispositifs médicaux',
      prompt: `**RÔLE**
Tu es acheteur hospitalier, expert en négociation de marchés de dispositifs médicaux.

**MON CONTEXTE**
- Dispositif : [type, volume annuel, criticité]
- Marché actuel : [titulaire, prix, conditions]
- Objectif négociation : [baisse prix, amélioration SLA, formation]
- Concurrence : [nombre fournisseurs identifiés]
- Levier : [volume, durée, paiement, exclusivité]

**TA MISSION**
Prépare la stratégie et la conduite de la négociation (en MAPA ou marché négocié).

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Analyse du marché fournisseur**
**2. Définition des objectifs**
**3. BATNA (Best Alternative)**
**4. Argumentaire**
**5. Conduite de la négociation**
**6. Compte-rendu et formalisation**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Respect du principe de transparence et d'égalité de traitement
- Traçabilité complète (PV de négociation)
- Articulation avec utilisateurs
- Conformité Code de la commande publique`
    },
    {
      id: 'admin-4', catKey: 'admin', cat: 'Administrateur / Acheteur', icon: '📊', color: '#64748b',
      title: "Suivi budgétaire d'un service de santé",
      prompt: `**RÔLE**
Tu es contrôleur de gestion ou responsable administratif et financier d'un établissement de santé.

**MON CONTEXTE**
- Périmètre : [pôle, service, EHPAD, plateau technique]
- Budget annuel : [titre 1 personnel, titre 2 médical, titre 3 hôtelier, titre 4 amortissements]
- Outil : [Hexagone, Cpage, Magh2, autre]
- Fréquence reporting : [mensuel, trimestriel]
- Indicateurs cibles : [taux d'occupation, durée séjour, IP-DMS]

**TA MISSION**
Structure le tableau de bord de suivi budgétaire mensuel et l'analyse des écarts.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Synthèse budgétaire mensuelle**
**2. Analyse des écarts**
**3. Indicateurs d'activité**
**4. Recettes T2A et dotations**
**5. Projections fin d'exercice**
**6. Dialogue avec les pôles cliniques**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Distinguer dépenses récurrentes et exceptionnelles
- Articulation avec EPRD
- Information chefs de pôle / directeurs
- Référence : ATIH (T2A), DGOS`
    },
    {
      id: 'admin-5', catKey: 'admin', cat: 'Administrateur / Acheteur', icon: '📊', color: '#64748b',
      title: 'Indicateurs de performance achats',
      prompt: `**RÔLE**
Tu es directeur des achats hospitaliers, responsable de la performance achats au niveau du GHT.

**MON CONTEXTE**
- Périmètre : [établissement, GHT, mutualisation]
- Volume achats annuel : [montant]
- Catégories : [DM, médicaments, hôtellerie, services, biomédical]
- Programme : [PHARE, RESAH, UniHA]
- Objectif gain : [% économies cible année]

**TA MISSION**
Définis le tableau de bord des indicateurs de performance achats et la trajectoire d'amélioration.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Indicateurs économiques**
**2. Indicateurs de processus**
**3. Indicateurs RSE**
**4. Mutualisation et achats groupés**
**5. Articulation avec utilisateurs**
**6. Plan d'action et trajectoire**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Articulation avec programme PHARE national
- Reporting consolidé GHT
- Articulation avec utilisateurs
- Données fiabilisées et auditables`
    },
    {
      id: 'admin-6', catKey: 'admin', cat: 'Administrateur / Acheteur', icon: '📊', color: '#64748b',
      title: "Analyse coût-bénéfice d'un investissement médical",
      prompt: `**RÔLE**
Tu es contrôleur de gestion ou directeur adjoint, en charge de l'analyse des projets d'investissement.

**MON CONTEXTE**
- Projet : [nouvel équipement, extension service, plateau technique]
- Investissement : [montant HT, financement]
- Service porteur : [...]
- Bénéfices attendus : [activité, recettes, qualité]
- Durée d'amortissement : [5, 7, 10 ans]

**TA MISSION**
Conduis une analyse économique structurée du projet et formule un avis.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Description du projet**
**2. Investissement initial**
**3. Coûts d'exploitation annuels**
**4. Recettes prévisionnelles**
**5. Indicateurs de rentabilité**
**6. Analyse de sensibilité**
**7. Apports qualitatifs non chiffrés**
**8. Synthèse et recommandation**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Hypothèses explicitées et sourcées
- Articulation avec projet médical d'établissement
- Validation pluriprofessionnelle
- Cohérence avec EPRD et PGFP`
    },
    {
      id: 'admin-7', catKey: 'admin', cat: 'Administrateur / Acheteur', icon: '📊', color: '#64748b',
      title: "Rapport d'activité direction",
      prompt: `**RÔLE**
Tu es directeur ou directeur adjoint d'établissement de santé, en charge du rapport d'activité annuel.

**MON CONTEXTE**
- Établissement : [type, capacité, secteur]
- Année : [202X]
- Données disponibles : [activité PMSI, RH, finances, qualité, projets]
- Public visé : [conseil de surveillance, ARS, instances internes, public]

**TA MISSION**
Rédige le rapport d'activité annuel, structuré, factuel et accessible.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Édito du directeur**
**2. L'établissement en chiffres**
**3. Activité médicale et soignante**
**4. Ressources humaines**
**5. Qualité et sécurité des soins**
**6. Performance économique**
**7. Travaux et projets**
**8. Engagement RSE**
**9. Perspectives année N+1**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Anonymisation des données individuelles
- Vocabulaire accessible pour public non spécialiste
- Données chiffrées sourcées
- Articulation avec contrat d'objectifs (CPOM)`
    },
    {
      id: 'admin-8', catKey: 'admin', cat: 'Administrateur / Acheteur', icon: '📊', color: '#64748b',
      title: "Gestion d'un contentieux fournisseur",
      prompt: `**RÔLE**
Tu es responsable juridique ou directeur des affaires juridiques d'un établissement de santé.

**MON CONTEXTE**
- Marché concerné : [objet, montant, durée]
- Titulaire : [fournisseur]
- Nature du litige : [non-conformité, retard, défaillance, prestation hors marché]
- Préjudice : [financier, opérationnel, qualité]
- Documents : [marché, courriers, PV, factures]

**TA MISSION**
Structure la gestion du contentieux, du constat à la résolution amiable ou contentieuse.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Constat du manquement**
**2. Mise en demeure préalable**
**3. Mesures coercitives prévues au marché**
**4. Recherche solution amiable**
**5. Recours contentieux si nécessaire**
**6. Traçabilité complète**
**7. Impact sur la suite**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Respect du contradictoire
- Décisions motivées
- Validation hiérarchique systématique
- Conformité Code de la commande publique`
    },
    {
      id: 'admin-9', catKey: 'admin', cat: 'Administrateur / Acheteur', icon: '📊', color: '#64748b',
      title: "Plan de continuité d'activité (PCA)",
      prompt: `**RÔLE**
Tu es responsable de la sécurité ou directeur adjoint, en charge du Plan de Continuité d'Activité de l'établissement.

**MON CONTEXTE**
- Établissement : [type, criticité]
- Risque envisagé : [cyberattaque, panne SI, crise sanitaire, catastrophe naturelle, grève, pénurie]
- Activités critiques : [urgences, réanimation, bloc, EHPAD, hémodialyse]
- Ressources : [équipes, locaux, équipements, partenaires]
- Cadre : [Plan blanc, plan ORSEC, plan de gestion de crise interne]

**TA MISSION**
Structure le PCA pour le risque concerné, conformément aux exigences ARS et HAS.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Cartographie des activités critiques**
**2. Analyse de risque par scénario**
**3. Mesures de continuité par risque**
**4. Organisation de crise**
**5. Tests et exercices**
**6. Communication interne et externe**
**7. Mise à jour et gouvernance**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Articulation avec plan blanc (arrêté du 1er février 2007)
- Conformité ARS et préfecture
- Réévaluation annuelle
- Articulation cyber (ANSSI, recommandations CNIL)`
    },
    {
      id: 'admin-10', catKey: 'admin', cat: 'Administrateur / Acheteur', icon: '📊', color: '#64748b',
      title: 'Audit interne procédures administratives',
      prompt: `**RÔLE**
Tu es auditeur interne ou contrôleur de gestion, en charge des audits de procédure dans l'établissement.

**MON CONTEXTE**
- Procédure auditée : [achats, RH, gestion résident, facturation, qualité]
- Périmètre : [service, pôle, établissement]
- Référentiel : [ISO 9001, certification HAS, charte interne]
- Risques identifiés : [...]
- Calendrier : [audit annuel, ponctuel]

**TA MISSION**
Structure la conduite de l'audit interne, du diagnostic à la mise en place du plan d'action.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Cadre de l'audit**
**2. Cartographie de la procédure**
**3. Constats d'audit**
**4. Analyse des causes**
**5. Recommandations**
**6. Plan d'action et suivi**
**7. Communication des résultats**
**8. Boucle d'amélioration continue**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Approche bienveillante et constructive
- Indépendance de l'auditeur
- Traçabilité (rapports, comptes-rendus, plan d'action)
- Confidentialité des entretiens`
    },

    // ═════════════════════════════════════════════════════════
    //  21. CADRE DE SANTÉ — 10 prompts
    // ═════════════════════════════════════════════════════════
    {
      id: 'cadre-1', catKey: 'cadre', cat: 'Cadre de santé', icon: '👔', color: '#dc2626',
      title: 'Planning équipe soignante (3x8, 12h)',
      prompt: `**RÔLE**
Tu es cadre de santé, responsable de la gestion des plannings d'une équipe soignante.

**MON CONTEXTE**
- Service : [type, capacité]
- Effectif : [IDE jour, IDE nuit, AS jour, AS nuit]
- Organisation : [3x8, 12h, mixte]
- Période à planifier : [mois, cycle]
- Contraintes : [absences prévues, formations, congés]
- Outil : [Octime, Chronos, AGIRH, Excel]

**TA MISSION**
Élabore un planning équilibré, conforme au droit du travail et respectant le cadre conventionnel hospitalier.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Cadre réglementaire applicable**
**2. Effectifs cibles par poste**
**3. Construction du planning**
**4. Anticipation des absences**
**5. Indicateurs de qualité du planning**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conformité Code du travail / FPH
- Respect des repos quotidien et hebdomadaire
- Équité week-ends et fériés
- Traçabilité des modifications`
    },
    {
      id: 'cadre-2', catKey: 'cadre', cat: 'Cadre de santé', icon: '👔', color: '#dc2626',
      title: "Gestion d'absence imprévue",
      prompt: `**RÔLE**
Tu es cadre de santé, en charge de la gestion d'une absence imprévue dans l'équipe.

**MON CONTEXTE**
- Absence : [maladie, accident, raison familiale]
- Agent absent : [poste, plage horaire]
- Délai : [jour même, lendemain, semaine]
- Effectif présent : [reste équipe sur le poste]
- Liste de remplaçants : [pool, intérim, agents en repos]
- Activité : [charge en cours]

**TA MISSION**
Définis une procédure de gestion immédiate et structure la réponse organisationnelle.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Évaluation immédiate**
**2. Hiérarchie des solutions de remplacement**
**3. Procédure de rappel d'agent**
**4. Réorganisation si pas de remplacement**
**5. Information de la direction**
**6. Suivi de l'agent absent**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Sécurité des soins prioritaire
- Volontariat lors des rappels
- Traçabilité des décisions
- Conformité statutaire`
    },
    {
      id: 'cadre-3', catKey: 'cadre', cat: 'Cadre de santé', icon: '👔', color: '#dc2626',
      title: 'Entretien professionnel annuel',
      prompt: `**RÔLE**
Tu es cadre de santé, en charge de l'entretien professionnel annuel des agents de l'équipe.

**MON CONTEXTE**
- Agent : [grade, ancienneté dans le service]
- Période : [période évaluée]
- Données : [bilans année N-1, objectifs fixés, éléments factuels]
- Souhaits agent : [recueillis en amont]
- Cadre : [FPH ou privé selon établissement]

**TA MISSION**
Prépare la conduite de l'entretien professionnel annuel et la rédaction du compte-rendu.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Préparation**
**2. Trame de l'entretien**
**3. Évaluation des compétences**
**4. Définition des objectifs SMART**
**5. Souhaits de formation et de mobilité**
**6. Compte-rendu et signature**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Entretien obligatoire annuel (FPH)
- Bienveillance et factualité
- Confidentialité de l'échange
- Référence : décret du 29 avril 2010`
    },
    {
      id: 'cadre-4', catKey: 'cadre', cat: 'Cadre de santé', icon: '👔', color: '#dc2626',
      title: "Gestion d'un conflit d'équipe",
      prompt: `**RÔLE**
Tu es cadre de santé, confronté à un conflit interpersonnel ou collectif dans l'équipe.

**MON CONTEXTE**
- Type de conflit : [interpersonnel, intergroupes, hiérarchique]
- Acteurs : [nombre, postes]
- Origine : [organisation, communication, charge, valeur, RPS]
- Durée : [récent, ancien]
- Impact : [équipe, soins, patients]
- Tentatives antérieures : [...]

**TA MISSION**
Structure une démarche de résolution du conflit en respectant chaque partie.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Diagnostic du conflit**
**2. Entretiens individuels**
**3. Recherche de solution**
**4. Réunion de régulation**
**5. Plan d'action**
**6. Suivi et prévention**
**7. Si dégradation persistante**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Neutralité et bienveillance
- Confidentialité des entretiens
- Traçabilité raisonnable
- Articulation médecine du travail si souffrance`
    },
    {
      id: 'cadre-5', catKey: 'cadre', cat: 'Cadre de santé', icon: '👔', color: '#dc2626',
      title: "Intégration d'un nouvel arrivant",
      prompt: `**RÔLE**
Tu es cadre de santé, en charge de l'intégration d'un nouvel agent dans l'équipe.

**MON CONTEXTE**
- Agent : [grade, expérience antérieure, profil]
- Type d'arrivée : [premier poste, mobilité, intérim, CDD]
- Service : [type, spécificités, équipement]
- Tuteur prévu : [oui / non, identité]
- Durée période d'intégration : [2-4 semaines]

**TA MISSION**
Construis un parcours d'intégration structuré sur 4 semaines, du jour 1 à l'évaluation.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Avant l'arrivée (J-15 à J-1)**
**2. Jour 1 - Accueil**
**3. Semaine 1 - Découverte**
**4. Semaine 2 - Pratique encadrée**
**5. Semaine 3 - Autonomisation progressive**
**6. Semaine 4 - Évaluation**
**7. Bilan d'intégration**
**8. Suivi à 3 et 6 mois**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Désignation d'un tuteur formé
- Outils d'intégration (livret, parcours type)
- Traçabilité dans dossier RH
- Articulation avec direction des soins`
    },
    {
      id: 'cadre-6', catKey: 'cadre', cat: 'Cadre de santé', icon: '👔', color: '#dc2626',
      title: 'Projet de service',
      prompt: `**RÔLE**
Tu es cadre de santé, en charge de l'élaboration ou de la révision du projet de service.

**MON CONTEXTE**
- Service : [identité, capacité, activité]
- Équipe : [effectif, composition]
- Période : [3-5 ans]
- Articulation : [projet d'établissement, projet de pôle, projet médical]
- Bilan projet précédent : [si existant]

**TA MISSION**
Structure un projet de service mobilisateur et opérationnel sur 3 à 5 ans.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. État des lieux**
**2. Analyse SWOT**
**3. Vision et axes stratégiques**
**4. Axes opérationnels**
**5. Plan d'action détaillé**
**6. Communication et adhésion**
**7. Évaluation et révision**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Co-construction avec l'équipe
- Articulation avec projet de pôle et d'établissement
- Indicateurs mesurables
- Évaluation périodique`
    },
    {
      id: 'cadre-7', catKey: 'cadre', cat: 'Cadre de santé', icon: '👔', color: '#dc2626',
      title: 'Indicateurs qualité des soins (HAS)',
      prompt: `**RÔLE**
Tu es cadre de santé, référent qualité du service, en charge du suivi des indicateurs HAS et du tableau de bord qualité.

**MON CONTEXTE**
- Service : [type]
- Indicateurs concernés : [IQSS, IFAQ, indicateurs internes]
- Outils : [HOSPIDIAG, e-Satis, audits internes]
- Périodicité : [recueil annuel, mensuel, semestriel]
- Certification HAS : [niveau, échéance]

**TA MISSION**
Structure le tableau de bord qualité du service et le pilotage des actions d'amélioration.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Indicateurs HAS obligatoires (IQSS)**
**2. Indicateurs internes du service**
**3. Tableau de bord mensuel**
**4. Audit interne**
**5. Analyse des événements indésirables**
**6. Articulation avec certification HAS**
**7. Communication et culture qualité**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conformité référentiel HAS en vigueur
- Recueil fiable et tracé
- Articulation avec gestion des risques
- Restitution équipe systématique`
    },
    {
      id: 'cadre-8', catKey: 'cadre', cat: 'Cadre de santé', icon: '👔', color: '#dc2626',
      title: 'CREX et revue de morbi-mortalité (RMM)',
      prompt: `**RÔLE**
Tu es cadre de santé, en charge de l'organisation des CREX (Comité de Retour d'Expérience) et de la participation aux RMM.

**MON CONTEXTE**
- Service : [type]
- Événement à analyser : [chute grave, erreur médicamenteuse, infection, retard de prise en charge]
- Participants : [médecin, IDE, AS, pharmacien, autres]
- Méthode : [ALARM, arbre des causes, méthode des tempêtes]

**TA MISSION**
Structure la conduite d'un CREX, depuis la sélection de l'événement jusqu'au plan d'action et sa traçabilité.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Sélection des événements**
**2. Préparation du CREX**
**3. Animation du CREX**
**4. Méthode ALARM (analyse des causes)**
**5. Plan d'action**
**6. Traçabilité et diffusion**
**7. Suivi et boucle d'amélioration**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Confidentialité, non-jugement, non-punitif
- Anonymisation systématique
- Articulation avec qualité-gestion des risques
- Compte rendu structuré et archivé`
    },
    {
      id: 'cadre-9', catKey: 'cadre', cat: 'Cadre de santé', icon: '👔', color: '#dc2626',
      title: "Plan de formation de l'équipe",
      prompt: `**RÔLE**
Tu es cadre de santé, responsable de l'élaboration du plan de formation annuel de l'équipe soignante.

**MON CONTEXTE**
- Effectif : [IDE, AS, autres]
- Activité service : [spécificités, évolutions]
- Diagnostic besoins : [entretiens annuels, événements, nouveaux protocoles]
- Budget : [enveloppe annuelle]
- Obligations réglementaires : [AFGSU 2 recyclage, hygiène, manutention]

**TA MISSION**
Construis un plan de formation annuel cohérent, articulé avec les obligations et les besoins identifiés.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Diagnostic des besoins**
**2. Formations obligatoires et recommandées**
**3. Formations métier ciblées**
**4. Modalités pédagogiques**
**5. Évaluation des formations**
**6. Articulation avec passeport prévention et DPC**
**7. Plan annuel**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Conformité au plan de formation FPH
- Articulation OPCO Santé / ANFH
- Traçabilité dossier formation
- Évaluation systématique`
    },
    {
      id: 'cadre-10', catKey: 'cadre', cat: 'Cadre de santé', icon: '👔', color: '#dc2626',
      title: 'Communication direction-équipe',
      prompt: `**RÔLE**
Tu es cadre de santé, relais de communication entre la direction de l'établissement et l'équipe soignante.

**MON CONTEXTE**
- Sujet à transmettre : [réorganisation, certification, projet, tension budgétaire, nouvelle procédure]
- Public : [équipe complète, IDE, AS, mixte]
- Outil : [réunion, mail, affichage, intranet]
- Niveau d'enjeu : [information, concertation, décision]
- Contraintes : [délai, climat équipe]

**TA MISSION**
Structure la communication descendante et ascendante, en adaptant le format au message et au climat.

**LE DOCUMENT À PRODUIRE - SUIS EXACTEMENT CE MODÈLE**

**1. Analyse du message**
**2. Choix du canal de communication**
**3. Structuration du message**
**4. Réunion d'équipe (modèle)**
**5. Communication ascendante**
**6. Gestion des résistances**
**7. Suivi et évaluation**

**RÈGLES DE RÉDACTION**
- Tout en prose, paragraphes complets.
- Document directement copiable dans Word.
- Loyauté envers direction et équipe
- Transparence sur ce qui est connu / inconnu
- Respect de la confidentialité
- Délais adaptés au sujet`
    },
  ];

  // ═══════════════════════════════════════════════════════════
  //  PROVIDER DETECTION — maps hostname to input strategy
  // ═══════════════════════════════════════════════════════════
  const PROVIDERS = {
    'chatgpt.com':       { name:'ChatGPT',    sel:'#prompt-textarea, div[contenteditable="true"][id="prompt-textarea"]', type:'contenteditable' },
    'chat.openai.com':   { name:'ChatGPT',    sel:'#prompt-textarea, div[contenteditable="true"][id="prompt-textarea"]', type:'contenteditable' },
    'claude.ai':         { name:'Claude',      sel:'div.ProseMirror[contenteditable="true"]', type:'prosemirror' },
    'gemini.google.com': { name:'Gemini',      sel:'div.ql-editor[contenteditable="true"], rich-textarea .ql-editor', type:'contenteditable' },
    'labs.google':       { name:'Google Labs', sel:'textarea[placeholder], textarea, div[contenteditable="true"]', type:'textarea' },
    'chat.deepseek.com': { name:'DeepSeek',    sel:'textarea#chat-input, textarea', type:'textarea' },
    'deepseek.com':      { name:'DeepSeek',    sel:'textarea#chat-input, textarea', type:'textarea' },
    'www.perplexity.ai': { name:'Perplexity',  sel:'textarea', type:'textarea' },
    'labs.perplexity.ai':{ name:'Perplexity',  sel:'textarea', type:'textarea' },
    'chat.mistral.ai':   { name:'Mistral',     sel:'textarea', type:'textarea' },
    'grok.com':          { name:'Grok',        sel:'textarea', type:'textarea' },
    'x.com':             { name:'Grok',        sel:'textarea', type:'textarea' },
    'copilot.microsoft.com':{ name:'Copilot',  sel:'textarea, #searchbox', type:'textarea' },
    'you.com':           { name:'You.com',     sel:'textarea', type:'textarea' },
    'poe.com':           { name:'Poe',         sel:'textarea', type:'textarea' },
  };

  const host = location.hostname;
  const provider = PROVIDERS[host]
    || PROVIDERS[Object.keys(PROVIDERS).find(h => host.includes(h))]
    || { name:'Inconnu', sel:'textarea, [contenteditable="true"]', type:'auto' };

  // ═══════════════════════════════════════════════════════════
  //  STYLES
  // ═══════════════════════════════════════════════════════════
  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Outfit:wght@300;400;500;600;700&display=swap');

    :root {
      --pg-bg: #111113;
      --pg-bg2: #1a1a1f;
      --pg-bg3: #222228;
      --pg-border: #2a2a32;
      --pg-text: #f0f0f2;
      --pg-text2: #b0b0ba;
      --pg-text3: #707078;
      --pg-accent: #c8ff00;
      --pg-radius: 12px;
      --pg-font: 'Outfit', system-ui, -apple-system, sans-serif;
      --pg-mono: 'JetBrains Mono', monospace;
      --pg-shadow: 0 20px 60px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.06);
    }

    #pg-trigger {
      position: fixed; bottom: 20px; right: 20px; z-index: 2147483640;
      width: 44px; height: 44px; border-radius: 12px; background: var(--pg-bg);
      border: 1px solid var(--pg-border); color: var(--pg-accent); cursor: pointer;
      display: grid; place-items: center; font-size: 17px; font-family: var(--pg-font);
      font-weight: 700; box-shadow: var(--pg-shadow); transition: all 150ms ease; user-select: none;
    }
    #pg-trigger:hover { transform: scale(1.08); border-color: var(--pg-accent); box-shadow: 0 0 20px rgba(200,255,0,.15), var(--pg-shadow); }
    #pg-trigger .pg-kbd {
      position: absolute; top: -8px; right: -8px; background: var(--pg-bg3); border: 1px solid var(--pg-border);
      border-radius: 5px; padding: 1px 5px; font-size: 9px; font-family: var(--pg-mono); color: var(--pg-text3); pointer-events: none;
    }

    #pg-overlay {
      position: fixed; inset: 0; z-index: 2147483641; background: rgba(0,0,0,.55);
      backdrop-filter: blur(6px); display: none; align-items: flex-start; justify-content: center;
      padding: min(10vh, 90px) 16px; font-family: var(--pg-font);
    }
    #pg-overlay.pg-open { display: flex; }

    #pg-palette {
      background: var(--pg-bg); border: 1px solid var(--pg-border); border-radius: var(--pg-radius);
      width: 100%; max-width: 640px; box-shadow: var(--pg-shadow); overflow: hidden; animation: pgSlideIn 150ms ease;
      display: flex; flex-direction: column; max-height: 85vh;
    }
    @keyframes pgSlideIn { from { opacity: 0; transform: translateY(10px) scale(.98); } to { opacity: 1; transform: none; } }

    .pg-input-row { display: flex; align-items: center; gap: 8px; padding: 12px 14px; border-bottom: 1px solid var(--pg-border); flex: 0 0 auto; }
    .pg-input-row svg { width: 18px; height: 18px; color: var(--pg-text3); flex-shrink: 0; }
    #pg-search { flex: 1; background: none; border: none; outline: none; font-size: 15px; font-family: var(--pg-font); color: var(--pg-text); caret-color: var(--pg-accent); }
    #pg-search::placeholder { color: var(--pg-text3); }
    .pg-provider-badge { font-size: 10px; font-family: var(--pg-mono); font-weight: 500; padding: 2px 8px; border-radius: 6px; background: var(--pg-bg3); color: var(--pg-text3); white-space: nowrap; }
    #pg-manage-btn { background: none; border: none; color: var(--pg-text3); cursor: pointer; padding: 4px 8px; border-radius: 6px; font-size: 16px; line-height: 1; transition: all 120ms; margin-left: 4px; }
    #pg-manage-btn:hover { background: var(--pg-bg3); color: var(--pg-text); }

    #pg-cats { display: flex; gap: 5px; padding: 8px 12px; border-bottom: 1px solid var(--pg-border); flex: 0 0 auto; flex-wrap: wrap; max-height: 120px; overflow-y: auto; }
    .pg-cat-pill {
      display: flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 999px; border: 1px solid var(--pg-border);
      background: var(--pg-bg2); color: var(--pg-text3); font-size: 11px; cursor: pointer; user-select: none; white-space: nowrap;
    }
    .pg-cat-pill.pg-cat-active { background: var(--pg-accent); color: #000; border-color: var(--pg-accent); font-weight: 600; }
    .pg-cat-hint { margin-left: auto; font-size: 10px; font-family: var(--pg-mono); color: var(--pg-text3); align-self: center; }

    #pg-banner {
      margin: 8px 12px 0; padding: 7px 10px; border-radius: 8px; background: #1a1608; border: 1px solid #3a2f0d;
      color: #e0c76a; font-size: 11px; line-height: 1.4; flex: 0 0 auto;
    }

    #pg-results { max-height: 380px; overflow-y: auto; padding: 4px; flex: 1 1 auto; }
    #pg-results::-webkit-scrollbar { width: 5px; }
    #pg-results::-webkit-scrollbar-thumb { background: var(--pg-border); border-radius: 3px; }
    .pg-item { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: 8px; cursor: pointer; transition: background 120ms ease; }
    .pg-item:hover, .pg-item.pg-sel { background: var(--pg-bg3); }
    .pg-item-icon { width: 28px; height: 28px; border-radius: 7px; display: grid; place-items: center; font-size: 13px; flex-shrink: 0; }
    .pg-item-body { flex: 1; min-width: 0; }
    .pg-item-title { font-size: 13.5px; font-weight: 500; color: var(--pg-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .pg-item-cat { font-size: 10.5px; font-family: var(--pg-mono); color: var(--pg-text3); }
    .pg-item-action { font-size: 10px; font-family: var(--pg-mono); color: var(--pg-text3); opacity: 0; transition: opacity 120ms; }
    .pg-item:hover .pg-item-action, .pg-item.pg-sel .pg-item-action { opacity: 1; }
    .pg-empty { padding: 24px; text-align: center; color: var(--pg-text3); font-size: 13px; }

    .pg-hints { padding: 8px 14px; border-top: 1px solid var(--pg-border); display: flex; gap: 14px; font-size: 10.5px; font-family: var(--pg-mono); color: var(--pg-text3); flex: 0 0 auto; flex-wrap: wrap; }
    .pg-hints kbd { display: inline-block; background: var(--pg-bg3); border: 1px solid var(--pg-border); border-radius: 4px; padding: 0 4px; margin-right: 3px; font-size: 10px; }

    #pg-fill { padding: 10px 14px 14px; }
    #pg-fill-back { display: inline-flex; align-items: center; gap: 5px; color: var(--pg-text3); cursor: pointer; font-size: 11.5px; font-family: var(--pg-mono); margin-bottom: 8px; background: none; border: none; padding: 0; }
    #pg-fill-back:hover { color: var(--pg-accent); }
    #pg-fill-title { font-size: 14px; font-weight: 600; color: var(--pg-text); margin-bottom: 10px; }
    .pg-field { margin-bottom: 9px; }
    .pg-field label { display: block; font-size: 10.5px; color: var(--pg-text3); margin-bottom: 3px; font-family: var(--pg-mono); }
    .pg-field input[type=text], .pg-field select, .pg-field textarea {
      width: 100%; box-sizing: border-box; padding: 7px 9px; border-radius: 7px; border: 1px solid var(--pg-border);
      background: var(--pg-bg2); color: var(--pg-text); font-size: 12.5px; outline: none; font-family: var(--pg-font);
    }
    .pg-field textarea { resize: vertical; min-height: 44px; font-family: var(--pg-font); }
    .pg-field input:focus, .pg-field select:focus, .pg-field textarea:focus { border-color: var(--pg-accent); }
    #pg-fill-preview {
      width: 100%; box-sizing: border-box; min-height: 190px; border-radius: 9px; border: 1px solid var(--pg-border);
      background: #0d0d10; color: var(--pg-text2); padding: 10px; font-size: 11.5px; line-height: 1.5;
      font-family: var(--pg-mono); white-space: pre-wrap; margin-top: 6px;
    }
    #pg-fill-actions { display: flex; gap: 8px; margin-top: 10px; }
    .pg-btn2 {
      flex: 1; padding: 8px 10px; border-radius: 8px; border: 1px solid var(--pg-border); background: var(--pg-bg2);
      color: var(--pg-text); font-size: 12.5px; font-weight: 600; cursor: pointer; text-align: center; font-family: var(--pg-font);
    }
    .pg-btn2:hover { border-color: var(--pg-accent); color: var(--pg-accent); }
    .pg-btn2.pg-primary { background: var(--pg-accent); color: #000; border-color: var(--pg-accent); }
    .pg-btn2.pg-primary:hover { filter: brightness(1.05); color:#000; }

    #pg-toast {
      position: fixed; bottom: 80px; right: 20px; z-index: 2147483642; background: var(--pg-bg2); border: 1px solid var(--pg-border);
      border-radius: 8px; padding: 8px 14px; font-family: var(--pg-font); font-size: 13px; color: var(--pg-text);
      display: flex; align-items: center; gap: 6px; box-shadow: 0 6px 20px rgba(0,0,0,.4);
      transform: translateX(200%); transition: transform 250ms cubic-bezier(.34,1.56,.64,1);
    }
    #pg-toast.pg-show { transform: translateX(0); }
    #pg-toast svg { width: 14px; height: 14px; color: var(--pg-accent); }

    .pg-modal { position: fixed; inset: 0; z-index: 2147483643; background: rgba(0,0,0,.7); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 16px; font-family: var(--pg-font); }
    .pg-modal-card { background: var(--pg-bg); border: 1px solid var(--pg-border); border-radius: var(--pg-radius); width: 100%; max-width: 600px; max-height: 80vh; overflow: hidden; display: flex; flex-direction: column; box-shadow: var(--pg-shadow); }
    .pg-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid var(--pg-border); }
    .pg-modal-header h3 { margin: 0; font-weight: 600; font-size: 16px; color: var(--pg-text); }
    .pg-modal-close { background: none; border: none; color: var(--pg-text3); font-size: 24px; cursor: pointer; padding: 0 4px; line-height: 1; }
    .pg-modal-close:hover { color: var(--pg-text); }
    .pg-modal-body { padding: 16px 18px; overflow-y: auto; flex: 1; }
    .pg-section-title { font-size: 13px; font-weight: 600; margin: 0 0 10px 0; color: var(--pg-text2); text-transform: uppercase; letter-spacing: 0.5px; }
    .pg-custom-list { max-height: 200px; overflow-y: auto; border: 1px solid var(--pg-border); border-radius: 8px; margin-bottom: 18px; }
    .pg-custom-item { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-bottom: 1px solid var(--pg-border); }
    .pg-custom-item:last-child { border-bottom: none; }
    .pg-custom-info { display: flex; align-items: center; gap: 8px; }
    .pg-custom-actions button { background: none; border: none; color: var(--pg-text3); cursor: pointer; font-size: 14px; padding: 2px 6px; border-radius: 4px; }
    .pg-custom-actions button:hover { background: var(--pg-bg3); color: var(--pg-text); }
    .pg-form-group { margin-bottom: 16px; }
    .pg-form-group label { display: block; font-size: 12px; font-weight: 500; color: var(--pg-text2); margin-bottom: 4px; }
    .pg-form-group input, .pg-form-group textarea, .pg-form-group select { width: 100%; background: var(--pg-bg2); border: 1px solid var(--pg-border); border-radius: 6px; padding: 8px 10px; font-family: var(--pg-font); font-size: 13px; color: var(--pg-text); outline: none; resize: vertical; }
    .pg-form-group input:focus, .pg-form-group textarea:focus { border-color: var(--pg-accent); }
    .pg-btn { background: var(--pg-bg3); border: 1px solid var(--pg-border); border-radius: 6px; padding: 6px 12px; font-family: var(--pg-font); font-size: 13px; color: var(--pg-text); cursor: pointer; transition: all 120ms; }
    .pg-btn:hover { background: var(--pg-bg2); border-color: var(--pg-accent); }
    .pg-btn-primary { background: var(--pg-accent); border-color: var(--pg-accent); color: #000; font-weight: 500; }
    .pg-btn-primary:hover { opacity: 0.9; }
    .pg-divider { margin: 20px 0; border-top: 1px solid var(--pg-border); }
  `;

  GM_addStyle(CSS);

  // ═══════════════════════════════════════════════════════════
  //  UTILS
  // ═══════════════════════════════════════════════════════════
  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function splitContext(body) {
    const marker = '**MON CONTEXTE**';
    const si = body.indexOf(marker);
    if (si === -1) return null;
    const afterStart = si + marker.length;
    const ei = body.indexOf('\n\n**', afterStart);
    const end = ei === -1 ? body.length : ei;
    return { pre: body.slice(0, afterStart), ctx: body.slice(afterStart, end), post: body.slice(end) };
  }

  function extractPlaceholders(ctx) {
    const seen = [];
    const re = /\[([^\]\n]+)\]/g;
    let m;
    while ((m = re.exec(ctx))) if (!seen.includes(m[1])) seen.push(m[1]);
    return seen;
  }

  function fieldKind(ph) {
    const parts = ph.split(/\s*\/\s*/).filter(Boolean);
    if (parts.length >= 2 && parts.length <= 10 && parts.every(p => p.length <= 32)) return { type: 'select', options: parts };
    if (ph.length > 42 || ph.includes(',')) return { type: 'textarea' };
    return { type: 'text' };
  }

  function fillContext(ctx, values) {
    let out = ctx;
    for (const ph of Object.keys(values)) {
      const val = values[ph];
      if (!val) continue;
      out = out.split('[' + ph + ']').join(val);
    }
    return out;
  }

  // ═══════════════════════════════════════════════════════════
  //  CUSTOM PROMPTS
  // ═══════════════════════════════════════════════════════════
  function getCustomPrompts() {
    try { return JSON.parse(GM_getValue('pg_med_custom_prompts', '[]')); } catch { return []; }
  }
  function saveCustomPrompts(prompts) { GM_setValue('pg_med_custom_prompts', JSON.stringify(prompts)); }
  function getAllPrompts() { return [...BUILTIN_PROMPTS, ...getCustomPrompts()]; }

  // ═══════════════════════════════════════════════════════════
  //  DOM CONSTRUCTION
  // ═══════════════════════════════════════════════════════════
  const trigger = document.createElement('button');
  trigger.id = 'pg-trigger';
  trigger.innerHTML = `💊<span class="pg-kbd">⌘⇧P</span>`;
  trigger.title = `Prompt Genius — Médical (⌘⇧P) — ${BUILTIN_PROMPTS.length} prompts`;
  document.body.appendChild(trigger);

  const overlay = document.createElement('div');
  overlay.id = 'pg-overlay';
  overlay.innerHTML = `
    <div id="pg-palette">
      <div class="pg-input-row">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input id="pg-search" type="text" placeholder="Rechercher parmi ${BUILTIN_PROMPTS.length} prompts…" autocomplete="off" spellcheck="false">
        <span class="pg-provider-badge">${escapeHtml(provider.name)}</span>
        <button id="pg-manage-btn" title="Gérer les prompts personnalisés">⚙️</button>
      </div>
      <div id="pg-cats"></div>
      <div id="pg-banner">⚠️ Ne collez jamais de données patient identifiantes (nom, prénom, date de naissance, n° de sécurité sociale). Les textes générés sont des aides à la rédaction, à relire et valider avant usage.</div>
      <div id="pg-results"></div>
      <div class="pg-hints" id="pg-hints-list">
        <span><kbd>↑↓</kbd>naviguer</span>
        <span><kbd>↵</kbd>ouvrir/insérer</span>
        <span><kbd>⇥</kbd>catégorie</span>
        <span><kbd>⌥1-9</kbd>insertion rapide</span>
        <span><kbd>⌘C</kbd>copier</span>
        <span><kbd>Esc</kbd>fermer</span>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const toast = document.createElement('div');
  toast.id = 'pg-toast';
  toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg><span></span>`;
  document.body.appendChild(toast);

  const searchInput = document.getElementById('pg-search');
  const resultsDiv  = document.getElementById('pg-results');
  const catsDiv     = document.getElementById('pg-cats');
  const hintsList   = document.getElementById('pg-hints-list');
  const manageBtn   = document.getElementById('pg-manage-btn');

  const state = { mode: 'list', selIndex: 0, catIndex: 0, results: [], fillPrompt: null, fillCtx: null, fillValues: {} };

  // ═══════════════════════════════════════════════════════════
  //  RENDER — LIST MODE
  // ═══════════════════════════════════════════════════════════
  function highlight(text, q) {
    if (!q) return escapeHtml(text);
    const idx = text.toLowerCase().indexOf(q);
    if (idx === -1) return escapeHtml(text);
    return escapeHtml(text.slice(0, idx))
      + `<mark style="background:var(--pg-accent);color:#000;border-radius:2px;padding:0 1px">${escapeHtml(text.slice(idx, idx + q.length))}</mark>`
      + escapeHtml(text.slice(idx + q.length));
  }

  function renderCats() {
    catsDiv.innerHTML = CATS.map((c, i) => `
      <div class="pg-cat-pill${i === state.catIndex ? ' pg-cat-active' : ''}" data-i="${i}">${c.icon} ${escapeHtml(c.label)}</div>
    `).join('') + `<span class="pg-cat-hint">⇥ pour changer</span>`;
    catsDiv.querySelectorAll('.pg-cat-pill').forEach(el => {
      el.addEventListener('click', () => { state.catIndex = parseInt(el.dataset.i); state.selIndex = 0; renderList(); });
    });
  }

  function renderList() {
    renderCats();
    const q = searchInput.value.toLowerCase().trim();
    const catKey = CATS[state.catIndex].key;
    const all = getAllPrompts();
    state.results = all.filter(p => {
      const matchesCat = catKey === 'all' || p.catKey === catKey;
      const matchesQuery = !q || p.title.toLowerCase().includes(q) || (p.cat || '').toLowerCase().includes(q) || p.prompt.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
    state.selIndex = Math.min(state.selIndex, Math.max(0, state.results.length - 1));

    if (!state.results.length) {
      resultsDiv.innerHTML = `<div class="pg-empty">Aucun prompt ne correspond${q ? ` à « ${escapeHtml(searchInput.value)} »` : ''}.</div>`;
      return;
    }

    resultsDiv.innerHTML = state.results.slice(0, 200).map((p, i) => `
      <div class="pg-item${i === state.selIndex ? ' pg-sel' : ''}" data-i="${i}">
        <div class="pg-item-icon" style="background:${escapeHtml(p.color || '#c8ff00')}1a;color:${escapeHtml(p.color || '#c8ff00')}">${escapeHtml(p.icon || '📄')}</div>
        <div class="pg-item-body">
          <div class="pg-item-title">${highlight(p.title, q)}</div>
          <div class="pg-item-cat">${escapeHtml(p.cat || '')}${i < 9 ? ` · ⌥${i + 1}` : ''}</div>
        </div>
        <span class="pg-item-action">↵</span>
      </div>
    `).join('');

    resultsDiv.querySelectorAll('.pg-item').forEach(el => {
      el.addEventListener('click', () => selectPrompt(parseInt(el.dataset.i)));
      el.addEventListener('mouseenter', () => { state.selIndex = parseInt(el.dataset.i); updateSel(); });
    });
  }

  function updateSel() {
    resultsDiv.querySelectorAll('.pg-item').forEach((el, i) => {
      el.classList.toggle('pg-sel', i === state.selIndex);
      if (i === state.selIndex) el.scrollIntoView({ block: 'nearest' });
    });
  }

  // ═══════════════════════════════════════════════════════════
  //  RENDER — FILL MODE
  // ═══════════════════════════════════════════════════════════
  function selectPrompt(index) {
    const p = state.results[index];
    if (!p) return;
    const split = splitContext(p.prompt);
    const placeholders = split ? extractPlaceholders(split.ctx) : [];
    if (!placeholders.length) {
      finalizeInsert(p.prompt, p.title);
      return;
    }
    enterFillMode(p, split, placeholders);
  }

  function enterFillMode(prompt, split, placeholders) {
    state.mode = 'fill';
    state.fillPrompt = prompt;
    state.fillCtx = split;
    state.fillValues = {};

    hintsList.innerHTML = `
      <span><kbd>⇥</kbd>champ suivant</span>
      <span><kbd>↵</kbd>insérer</span>
      <span><kbd>⌘C</kbd>copier l'aperçu</span>
      <span><kbd>Esc</kbd>retour</span>
    `;

    const fieldsHtml = placeholders.map((ph, i) => {
      const kind = fieldKind(ph);
      const id = 'pg-f-' + i;
      if (kind.type === 'select') {
        return `<div class="pg-field"><label for="${id}">${escapeHtml(ph)}</label>
          <select id="${id}" data-ph="${escapeHtml(ph)}">
            <option value="">— choisir —</option>
            ${kind.options.map(o => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`).join('')}
          </select></div>`;
      }
      if (kind.type === 'textarea') {
        return `<div class="pg-field"><label for="${id}">${escapeHtml(ph)}</label>
          <textarea id="${id}" data-ph="${escapeHtml(ph)}" rows="2"></textarea></div>`;
      }
      return `<div class="pg-field"><label for="${id}">${escapeHtml(ph)}</label>
        <input id="${id}" type="text" data-ph="${escapeHtml(ph)}" /></div>`;
    }).join('');

    resultsDiv.innerHTML = `
      <div id="pg-fill">
        <button id="pg-fill-back" type="button">← retour (Esc)</button>
        <div id="pg-fill-title">${escapeHtml(prompt.title)}</div>
        <form id="pg-fill-form">
          ${fieldsHtml}
          <textarea id="pg-fill-preview" class="pg-mono" readonly></textarea>
          <div id="pg-fill-actions">
            <button type="button" id="pg-fill-copy" class="pg-btn2">📋 Copier</button>
            <button type="submit" class="pg-btn2 pg-primary">💬 Insérer ↵</button>
          </div>
        </form>
      </div>
    `;

    const form = resultsDiv.querySelector('#pg-fill-form');
    const previewEl = resultsDiv.querySelector('#pg-fill-preview');

    function regenerate() {
      const filledCtx = fillContext(split.ctx, state.fillValues);
      previewEl.value = split.pre + filledCtx + split.post;
    }
    regenerate();

    const fieldEls = Array.from(form.querySelectorAll('[data-ph]'));
    fieldEls.forEach(el => el.addEventListener('input', () => { state.fillValues[el.dataset.ph] = el.value; regenerate(); }));

    resultsDiv.querySelector('#pg-fill-back').addEventListener('click', exitFillMode);
    resultsDiv.querySelector('#pg-fill-copy').addEventListener('click', () => copyText(previewEl.value, prompt.title));
    form.addEventListener('submit', (e) => { e.preventDefault(); finalizeInsert(previewEl.value, prompt.title); });

    if (fieldEls[0]) fieldEls[0].focus();
  }

  function exitFillMode() {
    state.mode = 'list';
    state.fillPrompt = null; state.fillCtx = null; state.fillValues = {};
    hintsList.innerHTML = `
      <span><kbd>↑↓</kbd>naviguer</span>
      <span><kbd>↵</kbd>ouvrir/insérer</span>
      <span><kbd>⇥</kbd>catégorie</span>
      <span><kbd>⌥1-9</kbd>insertion rapide</span>
      <span><kbd>⌘C</kbd>copier</span>
      <span><kbd>Esc</kbd>fermer</span>
    `;
    renderList();
    searchInput.focus();
  }

  // ═══════════════════════════════════════════════════════════
  //  TEXT INJECTION
  // ═══════════════════════════════════════════════════════════
  function isUsableInput(el) {
    if (!el || el.disabled || el.readOnly) return false;
    if (el.getAttribute('aria-hidden') === 'true') return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function findInput() {
    const selectors = provider.sel.split(',').map(s => s.trim()).filter(Boolean)
      .concat(['textarea', 'div[contenteditable="true"]', '[role="textbox"]']);
    let fallback = null;
    for (const sel of selectors) {
      for (const el of document.querySelectorAll(sel)) {
        if (isUsableInput(el)) return el;
        if (!fallback) fallback = el;
      }
    }
    return fallback;
  }

  function injectText(text) {
    const el = findInput();
    if (!el) { showToast('⚠ Champ de saisie introuvable'); return false; }

    el.focus();

    if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set
                        || Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
      if (nativeSetter) nativeSetter.call(el, text); else el.value = text;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      el.focus();
      const dt = new DataTransfer();
      dt.setData('text/plain', text);
      const pasteEvent = new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true });
      const handled = !el.dispatchEvent(pasteEvent);
      if (!handled) {
        el.textContent = text;
        el.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }));
      }
    }

    try {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(el);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (e) {}

    return true;
  }

  // ═══════════════════════════════════════════════════════════
  //  ACTIONS
  // ═══════════════════════════════════════════════════════════
  function finalizeInsert(text, title) {
    closePalette();
    setTimeout(() => { if (injectText(text)) showToast(`✓ « ${title} » inséré`); }, 80);
  }

  function copyText(text, title) {
    navigator.clipboard.writeText(text).then(() => showToast(`✓ « ${title} » copié`));
  }

  function showToast(msg) {
    toast.querySelector('span').textContent = msg;
    toast.classList.add('pg-show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('pg-show'), 2200);
  }

  // ═══════════════════════════════════════════════════════════
  //  OPEN / CLOSE
  // ═══════════════════════════════════════════════════════════
  function openPalette() {
    state.mode = 'list'; state.selIndex = 0;
    searchInput.value = '';
    renderList();
    overlay.classList.add('pg-open');
    setTimeout(() => searchInput.focus(), 50);
  }
  function closePalette() { overlay.classList.remove('pg-open'); state.mode = 'list'; }
  function togglePalette() { overlay.classList.contains('pg-open') ? closePalette() : openPalette(); }

  // ═══════════════════════════════════════════════════════════
  //  CUSTOM PROMPT MANAGER
  // ═══════════════════════════════════════════════════════════
  let managerModal = null;

  function openManager() {
    if (managerModal) managerModal.remove();
    const modal = document.createElement('div');
    modal.className = 'pg-modal';
    modal.innerHTML = `
      <div class="pg-modal-card">
        <div class="pg-modal-header">
          <h3>⚙️ Prompts personnalisés</h3>
          <button class="pg-modal-close">&times;</button>
        </div>
        <div class="pg-modal-body">
          <div class="pg-section-title">Vos prompts</div>
          <div class="pg-custom-list" id="pg-custom-list"></div>

          <div class="pg-section-title">Ajouter un prompt</div>
          <div class="pg-form-group"><label>Titre</label><input type="text" id="pg-new-title" maxlength="80"></div>
          <div class="pg-form-group"><label>Catégorie (texte libre)</label><input type="text" id="pg-new-cat" value="Custom"></div>
          <div class="pg-form-group"><label>Icône (emoji)</label><input type="text" id="pg-new-icon" maxlength="2" value="📌"></div>
          <div class="pg-form-group"><label>Couleur (hex)</label><input type="text" id="pg-new-color" value="#c8ff00"></div>
          <div class="pg-form-group"><label>Texte du prompt (une section « **MON CONTEXTE** » avec des [crochets] active le remplissage clavier)</label><textarea id="pg-new-prompt" rows="6"></textarea></div>
          <button class="pg-btn pg-btn-primary" id="pg-add-prompt">Ajouter</button>

          <div class="pg-divider"></div>

          <div class="pg-section-title">Import / Export</div>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <button class="pg-btn" id="pg-export-json">Exporter en JSON</button>
            <label class="pg-btn" style="cursor:pointer;">
              Importer un fichier
              <input type="file" id="pg-import-file" accept=".txt,.md,.json,.csv,text/plain,application/json,text/csv" style="display:none;">
            </label>
          </div>
          <p style="font-size:11px; color:var(--pg-text3); margin-top:10px;">
            Formats : .txt, .md, .json, .csv (colonnes title,category,icon,color,prompt).<br>
            Un fichier texte/markdown devient un seul prompt, titré d'après le nom de fichier.
          </p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    managerModal = modal;

    const closeBtn = modal.querySelector('.pg-modal-close');
    const listDiv = modal.querySelector('#pg-custom-list');
    const addBtn = modal.querySelector('#pg-add-prompt');
    const exportBtn = modal.querySelector('#pg-export-json');
    const fileInput = modal.querySelector('#pg-import-file');

    function renderCustomList() {
      const prompts = getCustomPrompts();
      if (!prompts.length) { listDiv.innerHTML = `<div class="pg-empty" style="padding:16px;">Aucun prompt personnalisé.</div>`; return; }
      listDiv.innerHTML = prompts.map((p, idx) => `
        <div class="pg-custom-item">
          <div class="pg-custom-info">
            <span style="font-size:18px;">${escapeHtml(p.icon || '📄')}</span>
            <span style="font-weight:500;">${escapeHtml(p.title)}</span>
            <span style="font-size:11px;color:var(--pg-text3);">${escapeHtml(p.cat || '')}</span>
          </div>
          <div class="pg-custom-actions"><button class="pg-delete-btn" data-idx="${idx}" title="Supprimer">🗑️</button></div>
        </div>
      `).join('');
      listDiv.querySelectorAll('.pg-delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.dataset.idx);
          const prompts = getCustomPrompts();
          prompts.splice(idx, 1);
          saveCustomPrompts(prompts);
          renderCustomList();
          renderList();
          showToast('Prompt supprimé');
        });
      });
    }
    renderCustomList();

    addBtn.addEventListener('click', () => {
      const title = modal.querySelector('#pg-new-title').value.trim();
      const cat = modal.querySelector('#pg-new-cat').value.trim() || 'Custom';
      const icon = modal.querySelector('#pg-new-icon').value.trim() || '📌';
      const color = modal.querySelector('#pg-new-color').value.trim() || '#c8ff00';
      const promptText = modal.querySelector('#pg-new-prompt').value.trim();
      if (!title || !promptText) { alert('Titre et texte du prompt sont requis.'); return; }
      const newPrompt = { id: 'custom-' + Date.now(), title, cat, catKey: 'custom', icon, color, prompt: promptText };
      const prompts = getCustomPrompts();
      prompts.push(newPrompt);
      saveCustomPrompts(prompts);
      renderCustomList();
      renderList();
      showToast(`✓ « ${title} » ajouté`);
      modal.querySelector('#pg-new-title').value = '';
      modal.querySelector('#pg-new-prompt').value = '';
      modal.querySelector('#pg-new-cat').value = 'Custom';
      modal.querySelector('#pg-new-icon').value = '📌';
      modal.querySelector('#pg-new-color').value = '#c8ff00';
    });

    exportBtn.addEventListener('click', () => {
      const json = JSON.stringify(getCustomPrompts(), null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'prompt-genius-medical-custom.json'; a.click();
      URL.revokeObjectURL(url);
      showToast('Export effectué');
    });

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target.result;
        const ext = file.name.split('.').pop().toLowerCase();
        let imported = [];
        try {
          if (ext === 'json') {
            imported = JSON.parse(content);
          } else if (ext === 'csv') {
            const lines = content.split(/\r?\n/).filter(l => l.trim());
            const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
            for (let i = 1; i < lines.length; i++) {
              const values = lines[i].split(',').map(v => v.trim());
              const obj = {};
              headers.forEach((h, idx) => { obj[h] = values[idx] || ''; });
              if (obj.title && obj.prompt) {
                imported.push({ id: 'custom-csv-' + Date.now() + i, title: obj.title, cat: obj.category || obj.cat || 'Custom', catKey: 'custom', icon: obj.icon || '📄', color: obj.color || '#c8ff00', prompt: obj.prompt });
              }
            }
          } else {
            const title = file.name.replace(/\.[^/.]+$/, '');
            imported.push({ id: 'custom-file-' + Date.now(), title: title || 'Prompt importé', cat: 'Importé', catKey: 'custom', icon: '📄', color: '#c8ff00', prompt: content });
          }
          if (Array.isArray(imported) && imported.length) {
            const merged = getCustomPrompts().concat(imported.map(p => ({ catKey: 'custom', ...p })));
            saveCustomPrompts(merged);
            renderCustomList();
            renderList();
            showToast(`${imported.length} prompt(s) importé(s)`);
          } else { alert('Aucun prompt valide trouvé dans ce fichier.'); }
        } catch (err) { alert('Échec de lecture du fichier : ' + err.message); }
        fileInput.value = '';
      };
      reader.readAsText(file);
    });

    modal.addEventListener('click', (e) => { if (e.target === modal) closeManager(); });
    closeBtn.addEventListener('click', closeManager);
    document.addEventListener('keydown', handleManagerKey);
  }

  function closeManager() {
    if (managerModal) { managerModal.remove(); managerModal = null; document.removeEventListener('keydown', handleManagerKey); }
  }
  function handleManagerKey(e) { if (e.key === 'Escape' && managerModal) { e.preventDefault(); closeManager(); } }

  // ═══════════════════════════════════════════════════════════
  //  EVENT LISTENERS
  // ═══════════════════════════════════════════════════════════
  trigger.addEventListener('click', togglePalette);
  overlay.addEventListener('click', e => { if (e.target === overlay) closePalette(); });
  manageBtn.addEventListener('click', (e) => { e.stopPropagation(); closePalette(); openManager(); });
  searchInput.addEventListener('input', () => { if (state.mode === 'list') { state.selIndex = 0; renderList(); } });

  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
      e.preventDefault(); e.stopPropagation(); togglePalette(); return;
    }
    if (!overlay.classList.contains('pg-open')) return;

    if (state.mode === 'fill') {
      if (e.key === 'Escape') { e.preventDefault(); exitFillMode(); return; }
      if ((e.metaKey || e.ctrlKey) && e.key === 'c' && !window.getSelection().toString()) {
        const previewEl = document.getElementById('pg-fill-preview');
        if (previewEl) { e.preventDefault(); copyText(previewEl.value, state.fillPrompt.title); }
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        const previewEl = document.getElementById('pg-fill-preview');
        if (previewEl) finalizeInsert(previewEl.value, state.fillPrompt.title);
        return;
      }
      return;
    }

    if (e.key === 'Escape') { e.preventDefault(); closePalette(); return; }

    if (e.key === 'Tab') {
      e.preventDefault();
      const dir = e.shiftKey ? -1 : 1;
      state.catIndex = (state.catIndex + dir + CATS.length) % CATS.length;
      state.selIndex = 0;
      renderList();
      return;
    }

    if (e.key === 'ArrowDown') { e.preventDefault(); state.selIndex = Math.min(state.selIndex + 1, state.results.length - 1); updateSel(); return; }
    if (e.key === 'ArrowUp')   { e.preventDefault(); state.selIndex = Math.max(state.selIndex - 1, 0); updateSel(); return; }
    if (e.key === 'Enter')     { e.preventDefault(); selectPrompt(state.selIndex); return; }

    if (e.altKey && /^[1-9]$/.test(e.key)) {
      e.preventDefault();
      const idx = parseInt(e.key, 10) - 1;
      if (state.results[idx]) selectPrompt(idx);
      return;
    }

    if ((e.metaKey || e.ctrlKey) && e.key === 'c' && !window.getSelection().toString()) {
      e.preventDefault();
      const p = state.results[state.selIndex];
      if (p) copyText(p.prompt, p.title);
    }
  }, true);

  console.log(`[Prompt Genius Médical v3.0.0] Chargé pour ${provider.name} — ⌘⇧P pour ouvrir (${BUILTIN_PROMPTS.length} prompts intégrés sur ${CATS.length - 1} catégories)`);

})();
