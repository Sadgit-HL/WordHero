/* ==========================================================
   WordHero – Schritt 12: kompakterer Start
   Ablauf: Start -> Runde (Karteikarten, Eintippen oder Multiple Choice) -> Auswertung.
   Jedes Wort liegt in einem von 5 Fächern (Leitner). Der Stand wird im
   Browser gespeichert. Die Wörter stehen in der Liste VOKABELN (vokabeln.js).
   ========================================================== */

// ---------- Einstellungen (hier kann man spielen) ----------

// Diese Einträge eignen sich nicht zum Abfragen (Regeln, Kürzel).
// Später ersetzen wir das durch ein Feld in der Tabelle.
const NICHT_UEBEN = ["Txt msgs", "3.5 = three point five", "1,500 = one thousand five hundred"];

// So heißen die Teile in der Auswahl, und in dieser Reihenfolge stehen sie.
const TEIL_REIHENFOLGE = ["Intro", "A", "B", "C", "D", "Text"];
const TEIL_NAMEN = { Intro: "Einstieg" };   // alle anderen heißen wie ihr Buchstabe

// Nach wie vielen Tagen kommt ein Wort wieder dran? Je höher das Fach, desto später.
const INTERVALLE_TAGE = { 1: 1, 2: 2, 3: 4, 4: 8, 5: 16 };
const NEUE_PRO_RUNDE = 10;                  // so viele ganz neue Wörter höchstens pro Runde

// Multiple Choice: so viele Antworten stehen zur Wahl (eine richtige, der Rest falsch)
const ANZAHL_ANTWORTEN = 4;

// Multiple Choice wird mit dem Können schwerer (nach dem Fach des Wortes; neue Wörter zählen als Fach 1):
//   Fach 1:  leichte falsche Antworten (zufällig, aber gleiche Wortart und Unit)
//   ab MC_AEHNLICH_AB_FACH:  ähnliche falsche Antworten (ähnlich geschrieben oder passend zum Thema)
//   ab MC_TIPPEN_AB_FACH:    die Karte wird zum Eintippen, denn so geht es in die hohen Fächer
// Durch Multiple Choice kommt ein Wort höchstens bis MC_MAX_FACH. Raten soll den Rang nicht aufblasen.
const MC_AEHNLICH_AB_FACH = 2;
const MC_TIPPEN_AB_FACH = 3;
const MC_MAX_FACH = 3;

// Beim Eintippen: Zählt ein kleiner Tippfehler ("Kathedrälle") als richtig?
// true = ja, die App zeigt aber die richtige Schreibung. false = nein.
const TIPPFEHLER_ZAEHLEN_ALS_RICHTIG = true;

// Beherrschung: Jedes Wort bringt Punkte nach seinem Fach (neu = 0, Fach 1 = 20 %, ... Fach 5 = 100 %).
// Der Durchschnitt über alle Wörter ist deine Beherrschung in Prozent.
// Ränge: "ab" = ab so viel Prozent Beherrschung. Hier kannst du Namen und Zahlen ändern!
// Ein erreichter Rang geht nie wieder verloren, auch wenn ein Wort mal zurückfällt.
const RAENGE = [
  { name: "Rookie",      ab: 0 },
  { name: "Scout",       ab: 3 },
  { name: "Ranger",      ab: 8 },
  { name: "Knight",      ab: 15 },
  { name: "Captain",     ab: 23 },
  { name: "Champion",    ab: 32 },
  { name: "Master",      ab: 42 },
  { name: "Legend",      ab: 53 },
  { name: "Grandmaster", ab: 64 },
  { name: "WordHero",    ab: 75 }
];

// Medaillen pro Unit: ab wie viel Prozent Beherrschung in dieser Unit. Auch sie bleiben.
const MEDAILLEN = [
  { name: "Bronze", ab: 20 },
  { name: "Silber", ab: 45 },
  { name: "Gold",   ab: 70 }
];

// ---------- 1) Die Stellen auf der Seite suchen ----------
const infoFeld        = document.getElementById("info");
const rangFeld        = document.getElementById("rang");
const dlgRaenge       = document.getElementById("dlgRaenge");
const raengeKopf      = document.getElementById("raengeKopf");
const raengeListe     = document.getElementById("raengeListe");
const rangTextFeld    = document.getElementById("rangText");
const rangZusatzFeld  = document.getElementById("rangZusatz");
const medaillenBox    = document.getElementById("medaillen");
const rangBalken      = document.getElementById("rangBalken");
const auswahlOeffnen  = document.getElementById("auswahlOeffnen");
const auswahlTextFeld = document.getElementById("auswahlText");
const kachelnBox      = document.getElementById("kacheln");
const einstellungenOeffnen = document.getElementById("einstellungenOeffnen");
const sicherungOeffnen = document.getElementById("sicherungOeffnen");
const alleUnitsKnopf  = document.getElementById("alleUnits");
const dlgAuswahl      = document.getElementById("dlgAuswahl");
const dlgEinstellungen = document.getElementById("dlgEinstellungen");
const dlgSicherung    = document.getElementById("dlgSicherung");
const dlgFrage        = document.getElementById("dlgFrage");
const frageTitel      = document.getElementById("frageTitel");
const frageText       = document.getElementById("frageText");
const frageJa         = document.getElementById("frageJa");
const frageNein       = document.getElementById("frageNein");
const endeTitel       = document.getElementById("endeTitel");
const ringFeld        = document.getElementById("ring");
const ringText        = document.getElementById("ringText");
const rangMeldung     = document.getElementById("rangMeldung");
const konfettiBox     = document.getElementById("konfetti");
const startBereich    = document.getElementById("start");
const auswahlBox      = document.getElementById("auswahl");
const standBox        = document.getElementById("stand");
const zusammenFeld    = document.getElementById("zusammenfassung");
const uebersichtBox   = document.getElementById("uebersicht");
const uebungSelect    = document.getElementById("uebung");
const richtungSelect  = document.getElementById("richtung");
const modusSelect     = document.getElementById("modus");
const anzahlSelect    = document.getElementById("anzahl");
const losKnopf        = document.getElementById("los");
const speicherHinweis = document.getElementById("speicherHinweis");
const zuruecksetzenKnopf = document.getElementById("zuruecksetzen");
const sichernKnopf = document.getElementById("sichern");
const ladenKnopf = document.getElementById("laden");
const ladeDatei = document.getElementById("ladeDatei");
const sicherungMeldung = document.getElementById("sicherungMeldung");
const lernenBereich   = document.getElementById("lernen");
const abbrechenKnopf  = document.getElementById("abbrechen");
const balken          = document.getElementById("balken");
const karte           = document.getElementById("karte");
const herkunftFeld    = document.getElementById("herkunft");
const englischFeld    = document.getElementById("englisch");
const lautschriftFeld = document.getElementById("lautschrift");
const rueckseite      = document.getElementById("rueckseite");
const deutschFeld     = document.getElementById("deutsch");
const beispieleListe  = document.getElementById("beispiele");
const hinweisFeld     = document.getElementById("hinweis");
const umdrehenKnopf   = document.getElementById("umdrehen");
const antwortenBox    = document.getElementById("antworten");
const jaKnopf         = document.getElementById("ja");
const neinKnopf       = document.getElementById("nein");
const optionenBox     = document.getElementById("optionen");
const tippenForm      = document.getElementById("tippen");
const eingabeFeld     = document.getElementById("eingabe");
const weissNichtKnopf = document.getElementById("weissNicht");
const rueckmeldungBox = document.getElementById("rueckmeldung");
const urteilFeld      = document.getElementById("urteil");
const weiterKnopf     = document.getElementById("weiter");
const dochKnopf       = document.getElementById("doch");
const endeBereich     = document.getElementById("ende");
const ergebnisFeld    = document.getElementById("ergebnis");
const wiederholungFeld = document.getElementById("wiederholung");
const fehlerListe     = document.getElementById("fehlerliste");
const fehlerNochmal   = document.getElementById("fehlerNochmal");
const nochmalKnopf    = document.getElementById("nochmal");
const zurAuswahlKnopf = document.getElementById("zurAuswahl");

// ---------- 2) Speichern im Browser ----------
// localStorage ist ein kleiner Speicher im Browser. Er bleibt nach dem Schließen erhalten,
// gilt aber nur für diesen Browser auf diesem Gerät (Handy und Laptop wissen nichts voneinander).
const FORTSCHRITT_SCHLUESSEL   = "vokabeltrainer-fortschritt-v1";
const EINSTELLUNGEN_SCHLUESSEL = "vokabeltrainer-einstellungen-v1";
const REKORD_SCHLUESSEL        = "vokabeltrainer-rekord-v1";
let speicherGeht = true;      // wird false, wenn der Browser das Speichern verbietet

function ladeJson(schluessel, standard) {
  try {
    const text = localStorage.getItem(schluessel);
    return text ? JSON.parse(text) : standard;
  } catch (fehler) {
    speicherGeht = false;
    return standard;
  }
}

function speichereJson(schluessel, wert) {
  try {
    localStorage.setItem(schluessel, JSON.stringify(wert));
  } catch (fehler) {
    speicherGeht = false;
  }
  speicherHinweis.hidden = speicherGeht;
}

// Der Lernstand: für jedes Wort (nach seiner id) Fach, Fälligkeit und Zähler.
// Beispiel: { "17": { box: 2, faellig: "2026-11-03", richtig: 1, falsch: 0, zuletzt: "2026-11-01" } }
// Wörter ohne Eintrag sind "neu".
let fortschritt = ladeJson(FORTSCHRITT_SCHLUESSEL, {});

// Die Bestwerte: höchster Rang und beste Prozentzahl pro Unit. Sie sinken nie.
// Beispiel: { rang: 2, prozent: 14.2, units: { "1": 51.3, "2": 12 } }
function neuerRekord() { return { rang: 0, prozent: 0, units: {} }; }
let rekord = ladeJson(REKORD_SCHLUESSEL, null);
if (!rekord || typeof rekord !== "object" || typeof rekord.units !== "object" || rekord.units === null) rekord = neuerRekord();

// ---------- 3) Daten und Datum ----------
const UEBBAR = VOKABELN.filter(function (w) { return !NICHT_UEBEN.includes(w.en); });

function zweistellig(zahl) { return (zahl < 10 ? "0" : "") + zahl; }

// Ein Datum als Text "2026-11-01". So lassen sich Daten einfach vergleichen.
function datumText(d) {
  return d.getFullYear() + "-" + zweistellig(d.getMonth() + 1) + "-" + zweistellig(d.getDate());
}
function heute() { return datumText(new Date()); }
function datumPlus(tage) {
  const d = new Date();
  d.setDate(d.getDate() + tage);
  return datumText(d);
}

// In welchem Fach liegt ein Wort? 1 bis 5. Neue Wörter zählen wie Fach 1.
function fachVon(wort) {
  return fortschritt[wort.id] ? fortschritt[wort.id].box : 1;
}
function istNeu(wort)    { return !fortschritt[wort.id]; }
function istFaellig(wort) {
  const stand = fortschritt[wort.id];
  return !!stand && stand.faellig <= heute();    // Datumstexte kann man mit <= vergleichen
}

// Nach jeder Antwort das Fach und die nächste Fälligkeit neu festlegen und speichern
// hoechstesFach: so weit darf diese Antwort das Wort höchstens nach oben bringen (Standard: 5)
function merkeAntwort(wort, warGewusst, hoechstesFach) {
  const alt = fortschritt[wort.id] || { box: 1, richtig: 0, falsch: 0 };
  const grenze = hoechstesFach || 5;
  const box = warGewusst ? (alt.box >= grenze ? alt.box : alt.box + 1) : 1;   // ein Fach weiter (bis zur Grenze) oder zurück zu 1
  fortschritt[wort.id] = {
    box: box,
    faellig: datumPlus(INTERVALLE_TAGE[box]),
    richtig: alt.richtig + (warGewusst ? 1 : 0),
    falsch:  alt.falsch  + (warGewusst ? 0 : 1),
    zuletzt: heute()
  };
  speichereJson(FORTSCHRITT_SCHLUESSEL, fortschritt);
}

// ---------- 4) Hilfsfunktionen ----------

// Liste zufällig mischen (Fisher-Yates)
function mischen(liste) {
  const kopie = liste.slice();
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const merker = kopie[i];
    kopie[i] = kopie[j];
    kopie[j] = merker;
  }
  return kopie;
}

// Das englische Wort so schreiben, wie man es lernt ("to" bei Verben)
function englischText(wort) {
  return wort.pos === "Verb" ? "to " + wort.en : wort.en;
}

// Was steht vorn auf der Karte und was hinten? Das hängt von der Richtung ab.
function vorderText(wort) {
  return richtung === "en-de" ? englischText(wort) : wort.deList.join(" · ");
}
function rueckText(wort) {
  return richtung === "en-de" ? wort.deList.join(" · ") : englischText(wort);
}

// Genau einen der drei Bereiche zeigen: "start", "lernen" oder "ende"
function zeigeBereich(name) {
  document.body.classList.toggle("start-aktiv", name === "start");   // der Start darf auf breiten Bildschirmen breiter sein
  startBereich.hidden  = name !== "start";
  lernenBereich.hidden = name !== "lernen";
  endeBereich.hidden   = name !== "ende";
  if (name !== "ende") konfettiBox.innerHTML = "";      // Konfetti gehört nur zum Ende
  window.scrollTo(0, 0);
}

// ---------- 5) Antworten prüfen (für "Eintippen") ----------
// Die App soll großzügig sein: Groß-/Kleinschreibung, Umlaute (ae = ä), Klammern,
// "etwas"/"sich"/"jn." und Artikel spielen keine Rolle, und eine Bedeutung reicht.

// Text vergleichbar machen: kleinschreiben, Umlaute und ß umschreiben, Satzzeichen weg
function normalisiere(text) {
  return text.toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/-/g, "")                    // "Lösungs-Hinweis" = "Lösungshinweis"
    .replace(/[^a-z0-9 ]/g, " ")          // alles außer Buchstaben, Ziffern, Leerzeichen
    .replace(/\s+/g, " ")
    .trim();
}

// Artikel am Anfang, die man weglassen darf
const ARTIKEL = {
  de: ["der", "die", "das", "ein", "eine", "einen", "einem", "einer"],
  en: ["the", "a", "an", "to"]
};
// Wörter, die man mitten im Ausdruck weglassen darf
const WEGLASSBAR = {
  de: ["etwas", "jn", "jm", "jemanden", "jemandem", "sich"],
  en: ["sth", "sb"]
};

// Kleine Wörter vorn, die wegfallen dürfen, wenn "etwas"/"jn." davor schon wegfällt:
// "an etwas denken" gilt auch als "denken", "(jn.) auf etwas hinweisen" als "hinweisen".
const PRAEPOSITIONEN = ["an", "auf", "in", "zu", "von", "vor", "mit", "bei", "nach", "ueber", "um", "fuer", "aus"];

// Alle Schreibweisen, die als richtig durchgehen. Ergebnis: eine Menge normalisierter Texte.
function varianten(text, sprache) {
  // Klammern: einmal ohne ihren Inhalt, einmal mit ("(Lösungs-)Hinweis" -> "Hinweis" und "Lösungshinweis")
  const ohneKlammer = text.replace(/\([^)]*\)/g, " ");
  const mitKlammer  = text.replace(/[()]/g, "");        // Klammern weg, Inhalt bleibt, ohne Lücke
  const basen = [];
  [ohneKlammer, mitKlammer].forEach(function (t) {
    t = t.replace(/…|\.\.\./g, " ");
    basen.push(t);
    // "Schiedsrichter/in" gilt auch als "Schiedsrichter" und "Schiedsrichterin"
    if (/\/in(nen)?\b/i.test(t)) {
      basen.push(t.replace(/\/in(nen)?\b/gi, ""));
      basen.push(t.replace(/\/in(nen)?\b/gi, "in"));
    }
  });

  const ergebnis = new Set();
  basen.forEach(function (b) {
    const n = normalisiere(b);
    if (!n) return;
    ergebnis.add(n);

    // ohne Artikel am Anfang
    const woerter = n.split(" ");
    if (woerter.length > 1 && ARTIKEL[sprache].includes(woerter[0])) {
      ergebnis.add(woerter.slice(1).join(" "));
    }
    // ohne "etwas", "sich", "jn." usw.
    const gekuerzt = woerter.filter(function (w) { return !WEGLASSBAR[sprache].includes(w); });
    if (gekuerzt.length > 0) {
      ergebnis.add(gekuerzt.join(" "));
      if (gekuerzt.length > 1 && ARTIKEL[sprache].includes(gekuerzt[0])) {
        ergebnis.add(gekuerzt.slice(1).join(" "));
      }
      // Wurde etwas weggelassen und steht danach eine Präposition vorn? Dann auch ohne sie.
      if (sprache === "de" && gekuerzt.length < woerter.length && gekuerzt.length > 1 &&
          PRAEPOSITIONEN.includes(gekuerzt[0])) {
        ergebnis.add(gekuerzt.slice(1).join(" "));
      }
    }
  });
  return ergebnis;
}

// Wie viele Buchstaben muss man ändern, um aus a den Text b zu machen? (Levenshtein-Abstand)
function abstand(a, b) {
  const zeile = [];
  for (let j = 0; j <= b.length; j++) zeile.push(j);
  for (let i = 1; i <= a.length; i++) {
    let links = i;
    let diagonal = i - 1;
    for (let j = 1; j <= b.length; j++) {
      const oben = zeile[j];
      zeile[j] = Math.min(
        zeile[j] + 1,                                  // Buchstabe zu viel
        links + 1,                                     // Buchstabe fehlt
        diagonal + (a[i - 1] === b[j - 1] ? 0 : 1)     // Buchstabe falsch
      );
      links = zeile[j];
      diagonal = oben;
    }
  }
  return zeile[b.length];
}

// Wörter mit gleicher deutscher Bedeutung: "while" und "during" heißen beide "während".
// Beim Übersetzen Deutsch -> Englisch lassen wir daher beide gelten.
function bedeutungsSchluessel(bedeutung) {
  return normalisiere(bedeutung.replace(/\([^)]*\)/g, " "));
}
const WOERTER_NACH_BEDEUTUNG = {};
UEBBAR.forEach(function (w) {
  w.deList.forEach(function (bedeutung) {
    const schluessel = bedeutungsSchluessel(bedeutung);
    if (schluessel.length < 4) return;
    if (!WOERTER_NACH_BEDEUTUNG[schluessel]) WOERTER_NACH_BEDEUTUNG[schluessel] = [];
    WOERTER_NACH_BEDEUTUNG[schluessel].push(w);
  });
});

// Was wäre alles richtig? Liste von Texten.
function richtigeAntworten(wort, richtungName) {
  if (richtungName === "en-de") return wort.deList.slice();

  const antworten = [wort.en];                                 // Deutsch -> Englisch: das Wort selbst ...
  wort.deList.forEach(function (bedeutung) {                   // ... und Wörter mit gleicher Bedeutung
    const andere = WOERTER_NACH_BEDEUTUNG[bedeutungsSchluessel(bedeutung)] || [];
    andere.forEach(function (w2) { if (!antworten.includes(w2.en)) antworten.push(w2.en); });
  });
  return antworten;
}

// Das Herzstück: eingabe prüfen. Ergebnis: "richtig", "fast" (Tippfehler) oder "falsch".
function pruefeAntwort(eingabe, wort, richtungName) {
  const sprache = richtungName === "en-de" ? "de" : "en";      // in welcher Sprache tippt man?
  const eingabeVarianten = varianten(eingabe, sprache);
  if (eingabeVarianten.size === 0) return "falsch";

  let fast = false;
  const erwartet = richtigeAntworten(wort, richtungName);
  for (let i = 0; i < erwartet.length; i++) {
    const richtigVarianten = varianten(erwartet[i], sprache);
    for (const eingabeText of eingabeVarianten) {
      if (richtigVarianten.has(eingabeText)) return "richtig";
      richtigVarianten.forEach(function (richtigText) {
        // Erlaubte Tippfehler: ab 5 Buchstaben einer, ab 10 Buchstaben zwei
        const erlaubt = richtigText.length >= 10 ? 2 : (richtigText.length >= 5 ? 1 : 0);
        if (erlaubt > 0 && abstand(eingabeText, richtigText) <= erlaubt) fast = true;
      });
    }
  }
  return fast ? "fast" : "falsch";
}

// ---------- 5b) Multiple Choice: die Antworten zusammenstellen ----------

// So steht ein Wort als Antwort auf einem Knopf: bei Englisch -> Deutsch die ersten zwei Bedeutungen,
// bei Deutsch -> Englisch das englische Wort.
function optionsText(wort) {
  return richtung === "en-de" ? wort.deList.slice(0, 2).join(" · ") : englischText(wort);
}

// Haben zwei Wörter eine gemeinsame deutsche Bedeutung? Dann wären beide richtig, das wäre unfair.
function teilenBedeutung(a, b) {
  const schluesselA = a.deList.map(bedeutungsSchluessel);
  return b.deList.some(function (bedeutung) {
    const k = bedeutungsSchluessel(bedeutung);
    return k !== "" && schluesselA.includes(k);
  });
}

// Wie ähnlich ist ein anderes Wort dem richtigen? Zahl von 0 (gar nicht) bis etwa 1,4.
// Bei Deutsch -> Englisch zählt vor allem die Schreibung ("quite" und "quiet"),
// bei Englisch -> Deutsch Wortart, Textabschnitt, Länge und Anfang des deutschen Textes.
function aehnlichkeit(wort, w2) {
  let a, b, punkte = 0;
  if (richtung === "de-en") {
    a = normalisiere(wort.en);
    b = normalisiere(w2.en);
  } else {
    a = normalisiere(optionsText(wort));
    b = normalisiere(optionsText(w2));
  }
  const laenge = Math.max(a.length, b.length, 1);
  punkte += (1 - abstand(a, b) / laenge) * (richtung === "de-en" ? 0.8 : 0.3);
  punkte += (1 - Math.abs(a.length - b.length) / laenge) * 0.2;
  if (a[0] === b[0]) punkte += 0.1;
  if (a.slice(-2) === b.slice(-2)) punkte += 0.08;
  if (w2.pos === wort.pos) punkte += 0.3;
  if (w2.key === wort.key) punkte += 0.15; else if (w2.unit === wort.unit) punkte += 0.07;
  return punkte;
}

// Die ähnlichsten Wörter nehmen. Ein bisschen Zufall (jitter) sorgt für Abwechslung.
function waehleAehnliche(wort, kandidaten, anzahl) {
  const bewertet = kandidaten.map(function (w2) {
    return { wort: w2, punkte: aehnlichkeit(wort, w2) + Math.random() * 0.12 };
  });
  bewertet.sort(function (x, y) { return y.punkte - x.punkte; });

  const gewaehlt = [];
  const benutzteTexte = [optionsText(wort)];
  bewertet.forEach(function (eintrag) {
    if (gewaehlt.length >= anzahl) return;
    const text = optionsText(eintrag.wort);
    if (benutzteTexte.includes(text)) return;
    benutzteTexte.push(text);
    gewaehlt.push(eintrag.wort);
  });
  return gewaehlt;
}

// Drei falsche Antworten suchen. Sie sollen glaubwürdig sein: am liebsten aus derselben Unit
// und mit gleicher Wortart (Verb zu Verb), danach nach und nach beliebiger.
function waehleFalsche(wort, anzahl, aehnlich) {
  const richtigerText = optionsText(wort);
  const kandidaten = UEBBAR.filter(function (w2) {
    return w2.id !== wort.id && w2.en !== wort.en && !teilenBedeutung(wort, w2);
  });

  if (aehnlich) return waehleAehnliche(wort, kandidaten, anzahl);

  const stufen = [
    function (w2) { return w2.pos === wort.pos && w2.unit === wort.unit; },
    function (w2) { return w2.pos === wort.pos; },
    function (w2) { return w2.unit === wort.unit; },
    function () { return true; }
  ];

  const gewaehlt = [];
  const benutzteTexte = [richtigerText];                       // jeder Text darf nur einmal vorkommen
  stufen.forEach(function (passt) {
    mischen(kandidaten.filter(passt)).forEach(function (w2) {
      if (gewaehlt.length >= anzahl) return;
      const text = optionsText(w2);
      if (benutzteTexte.includes(text)) return;
      benutzteTexte.push(text);
      gewaehlt.push(w2);
    });
  });
  return gewaehlt;
}

// Die Antwortknöpfe zeichnen: die richtige und drei falsche, gemischt
function baueOptionen(wort) {
  const aehnlich = fachVon(wort) >= MC_AEHNLICH_AB_FACH;
  mcOptionen = mischen([wort].concat(waehleFalsche(wort, ANZAHL_ANTWORTEN - 1, aehnlich)));
  optionenBox.innerHTML = "";
  mcOptionen.forEach(function (w, nummer) {
    const knopf = document.createElement("button");
    knopf.type = "button";
    knopf.className = "option";
    const nr = document.createElement("span");
    nr.className = "nr";
    nr.textContent = nummer + 1;
    const text = document.createElement("span");
    text.textContent = optionsText(w);
    knopf.appendChild(nr);
    knopf.appendChild(text);
    knopf.addEventListener("click", function () { waehleOption(nummer); });
    optionenBox.appendChild(knopf);
  });
}

// ---------- 6) Auswahl-Bildschirm aufbauen ----------

// Aus der Wörterliste Gruppen bilden: Unit -> Teile -> Wörter.
function bildeGruppen() {
  const gruppen = {};
  UEBBAR.forEach(function (w) {
    if (!gruppen[w.unit]) gruppen[w.unit] = { titel: w.unitTitle, teile: {} };
    if (!gruppen[w.unit].teile[w.part]) gruppen[w.unit].teile[w.part] = [];
    gruppen[w.unit].teile[w.part].push(w);
  });
  return gruppen;
}

function baueAuswahl() {
  const gruppen = bildeGruppen();
  auswahlBox.innerHTML = "";

  Object.keys(gruppen).forEach(function (unitNr) {
    const gruppe = gruppen[unitNr];

    const block = document.createElement("div");
    block.className = "unit";
    block.dataset.unit = unitNr;

    const kopf = document.createElement("div");
    kopf.className = "unit-kopf";
    const titel = document.createElement("span");
    titel.className = "unit-titel";
    titel.textContent = "Unit " + unitNr + " ";
    const klein = document.createElement("small");
    klein.textContent = gruppe.titel;
    titel.appendChild(klein);
    const alleKnopf = document.createElement("button");
    alleKnopf.type = "button";
    alleKnopf.className = "text-knopf";
    alleKnopf.textContent = "alle";
    const schild = document.createElement("span");
    schild.className = "med-pill s0";
    kopf.appendChild(titel);
    kopf.appendChild(schild);
    kopf.appendChild(alleKnopf);
    block.appendChild(kopf);

    const chips = document.createElement("div");
    chips.className = "chips";
    TEIL_REIHENFOLGE.forEach(function (teil) {
      const woerter = gruppe.teile[teil];
      if (!woerter) return;

      const label = document.createElement("label");
      label.className = "chip";
      const haken = document.createElement("input");
      haken.type = "checkbox";
      haken.value = unitNr + "-" + teil;          // z. B. "3-C", genau wie der Schlüssel in der Tabelle
      const text = document.createElement("span");
      text.textContent = (TEIL_NAMEN[teil] || teil) + " · " + woerter.length;
      if (teil === "Text" && woerter[0].textTitle) label.title = woerter[0].textTitle;

      label.appendChild(haken);
      label.appendChild(text);
      chips.appendChild(label);
    });
    block.appendChild(chips);

    alleKnopf.addEventListener("click", function () {
      const haken = chips.querySelectorAll("input");
      const alleAn = Array.from(haken).every(function (h) { return h.checked; });
      haken.forEach(function (h) { h.checked = !alleAn; });
      auswahlGeaendert();
    });

    auswahlBox.appendChild(block);
  });
}

// Welche Schlüssel (z. B. "3-C") sind gerade angehakt?
function gewaehlteSchluessel() {
  const haken = auswahlBox.querySelectorAll("input:checked");
  return Array.from(haken).map(function (h) { return h.value; });
}

// Alle Wörter, die zur Auswahl passen
function gewaehlteWoerter() {
  const schluessel = gewaehlteSchluessel();
  return UEBBAR.filter(function (w) { return schluessel.includes(w.key); });
}

// ---------- 7) Welche Karten kommen dran? ----------

// Zählen: wie viele Wörter sind neu, fällig oder noch nicht fällig, und wie viele liegen in jedem Fach?
function bewerte(pool) {
  const ergebnis = { neu: 0, faellig: 0, spaeter: 0, faecher: [0, 0, 0, 0, 0, 0] };   // faecher[0] = neu
  pool.forEach(function (w) {
    if (istNeu(w)) {
      ergebnis.neu++;
      ergebnis.faecher[0]++;
    } else {
      ergebnis.faecher[fachVon(w)]++;
      if (istFaellig(w)) ergebnis.faellig++; else ergebnis.spaeter++;
    }
  });
  return ergebnis;
}

// Leitner: erst die fälligen Wörter (niedrige Fächer zuerst), dazu ein paar neue.
function zieheLeitner(pool, anzahl) {
  const faellig = mischen(pool.filter(istFaellig));
  faellig.sort(function (a, b) { return fachVon(a) - fachVon(b); });    // Fach 1 vor Fach 2 vor ...
  const neu = mischen(pool.filter(istNeu)).slice(0, NEUE_PRO_RUNDE);

  const kandidaten = faellig.concat(neu);
  const grenze = anzahl === "alle" ? kandidaten.length : Number(anzahl);
  return mischen(kandidaten.slice(0, grenze));     // am Ende mischen, damit die Reihenfolge nicht auffällt
}

// Alles aus der Auswahl, egal ob fällig
function zieheAlles(pool, anzahl) {
  const gemischt = mischen(pool);
  return anzahl === "alle" ? gemischt : gemischt.slice(0, Number(anzahl));
}

function zieheKarten(pool, anzahl, modus) {
  return modus === "alles" ? zieheAlles(pool, anzahl) : zieheLeitner(pool, anzahl);
}

// ---------- 8) Start-Bildschirm aktuell halten ----------

// Die sechs Kästchen "Neu, Fach 1 bis 5" zeichnen
function zeichneUebersicht(faecher) {
  uebersichtBox.innerHTML = "";
  faecher.forEach(function (anzahl, nummer) {
    const kasten = document.createElement("div");
    kasten.className = "fach" + (nummer === 0 ? " neu" : "");
    const zahl = document.createElement("span");
    zahl.className = "zahl";
    zahl.textContent = anzahl;
    const name = document.createElement("span");
    name.className = "name";
    name.textContent = nummer === 0 ? "neu" : "Fach " + nummer;
    kasten.appendChild(zahl);
    kasten.appendChild(name);
    uebersichtBox.appendChild(kasten);
  });
}

// ---------- Beherrschung, Rang und Medaillen ----------
const UNITS = Array.from(new Set(UEBBAR.map(function (w) { return w.unit; }))).sort(function (x, y) { return x - y; });

// Punkte eines Wortes: 0 (neu) bis 100 (Fach 5)
function punkteVon(wort) { return istNeu(wort) ? 0 : fachVon(wort) * 20; }

// Durchschnitt der Punkte einer Wörterliste, 0 bis 100
function beherrschung(woerter) {
  if (woerter.length === 0) return 0;
  let summe = 0;
  woerter.forEach(function (w) { summe += punkteVon(w); });
  return summe / woerter.length;
}
function unitProzent(nr) {
  return beherrschung(UEBBAR.filter(function (w) { return String(w.unit) === String(nr); }));
}

function rangAusProzent(p) {
  let index = 0;
  RAENGE.forEach(function (r, i) { if (p >= r.ab) index = i; });
  return index;
}
function medailleAusProzent(p) {         // 0 = keine, 1 = Bronze, 2 = Silber, 3 = Gold
  let stufe = 0;
  MEDAILLEN.forEach(function (m, i) { if (p >= m.ab) stufe = i + 1; });
  return stufe;
}

// Bestwerte nachziehen und speichern, wenn etwas höher ist als je zuvor
function aktualisiereRekord() {
  let geaendert = false;
  const p = beherrschung(UEBBAR);
  if (p > rekord.prozent) { rekord.prozent = p; geaendert = true; }
  // Der Rang folgt immer dem besten Prozentwert. So bleibt er richtig, auch wenn man die Schwellen ändert.
  if (rangAusProzent(rekord.prozent) !== rekord.rang) { rekord.rang = rangAusProzent(rekord.prozent); geaendert = true; }
  UNITS.forEach(function (nr) {
    const up = unitProzent(nr);
    if (up > (rekord.units[nr] || 0)) { rekord.units[nr] = up; geaendert = true; }
  });
  if (geaendert) speichereJson(REKORD_SCHLUESSEL, rekord);
}
function rangIndex() { aktualisiereRekord(); return rekord.rang; }
function unitMedaille(nr) { aktualisiereRekord(); return medailleAusProzent(rekord.units[nr] || 0); }
function medaillenStand() {
  const stand = {};
  UNITS.forEach(function (nr) { stand[nr] = unitMedaille(nr); });
  return stand;
}

function prozentText(p) {
  return p.toLocaleString("de-DE", { maximumFractionDigits: 1 }) + " %";
}

function zeigeRang() {
  const p = beherrschung(UEBBAR);
  const i = rangIndex();
  const jetzt = RAENGE[i], naechster = RAENGE[i + 1];
  rangFeld.textContent = "★ " + jetzt.name;
  rangTextFeld.textContent = "Beherrschung " + prozentText(p);
  if (naechster) {
    rangZusatzFeld.textContent = "Noch " + prozentText(Math.max(0, naechster.ab - p)) + " bis " + naechster.name +
                                 (p < jetzt.ab ? " (dein Rang bleibt)" : "");
    const anteil = (p - jetzt.ab) / (naechster.ab - jetzt.ab);
    rangBalken.style.width = Math.round(Math.min(1, Math.max(0, anteil)) * 100) + "%";
  } else {
    rangZusatzFeld.textContent = "Höchster Rang erreicht. Du bist ein WordHero!";
    rangBalken.style.width = "100%";
  }
}

// Die Übersicht aller Ränge mit ihren Voraussetzungen (öffnet mit einem Tipp auf das Rang-Abzeichen)
function zeigeRaengeListe() {
  const p = beherrschung(UEBBAR);
  const jetzt = rangIndex();
  raengeKopf.textContent = ("Deine Beherrschung: " + prozentText(p) + " · bester Stand: " + prozentText(rekord.prozent)).replace(/ %/g, "\u00a0%");
  raengeListe.innerHTML = "";
  RAENGE.forEach(function (rang, i) {
    const zeile = document.createElement("li");
    zeile.className = "rang-zeile" + (i < jetzt ? " erreicht" : i === jetzt ? " aktuell" : " offen");

    const nummer = document.createElement("span");
    nummer.className = "rang-nr";
    nummer.textContent = i <= jetzt ? "★" : String(i + 1);

    const text = document.createElement("span");
    text.className = "rang-text";
    const name = document.createElement("b");
    name.textContent = rang.name;
    const bedingung = document.createElement("small");
    bedingung.textContent = rang.ab === 0 ? "Start" : "ab " + prozentText(rang.ab) + " Beherrschung";
    text.appendChild(name);
    text.appendChild(bedingung);

    const status = document.createElement("span");
    status.className = "rang-status";
    if (i < jetzt) status.textContent = "erreicht";
    else if (i === jetzt) status.textContent = "dein Rang";
    else status.textContent = "noch " + prozentText(Math.max(0, rang.ab - p));

    zeile.appendChild(nummer);
    zeile.appendChild(text);
    zeile.appendChild(status);
    raengeListe.appendChild(zeile);
  });
}

// Medaillen: eine Kachel pro Unit auf dem Start und ein Schild im Kopf jeder Unit in der Auswahl
function zeigeMedaillen() {
  aktualisiereRekord();
  medaillenBox.innerHTML = "";
  UNITS.forEach(function (nr) {
    const stufe = medailleAusProzent(rekord.units[nr] || 0);
    const kachel = document.createElement("div");
    kachel.className = "med s" + stufe;
    kachel.title = "Unit " + nr + (stufe ? ": " + MEDAILLEN[stufe - 1].name : ": noch keine Medaille") +
                   " (Bestwert " + prozentText(rekord.units[nr] || 0) + ")";
    const name = document.createElement("small");
    name.textContent = "Unit " + nr;
    const wert = document.createElement("b");
    wert.textContent = prozentText(unitProzent(nr));
    kachel.appendChild(name);
    kachel.appendChild(wert);
    medaillenBox.appendChild(kachel);
  });
  auswahlBox.querySelectorAll(".unit").forEach(function (block) {
    const nr = block.dataset.unit;
    const stufe = medailleAusProzent(rekord.units[nr] || 0);
    const schild = block.querySelector(".med-pill");
    if (!schild) return;
    schild.className = "med-pill s" + stufe;
    schild.textContent = (stufe ? MEDAILLEN[stufe - 1].name + " · " : "") + prozentText(unitProzent(nr));
  });
}

// Kurzer Text für die Zeile "Was üben?": "Unit 1, Unit 3 (A, B)" oder "Alle Units"
function beschreibeAuswahl() {
  const bloecke = Array.from(auswahlBox.querySelectorAll(".unit"));
  const teile = [];
  let alleVoll = true;
  bloecke.forEach(function (block) {
    const haken = Array.from(block.querySelectorAll("input"));
    const an = haken.filter(function (h) { return h.checked; });
    if (an.length !== haken.length) alleVoll = false;
    if (an.length === haken.length) {
      teile.push("Unit " + block.dataset.unit);
    } else if (an.length > 0) {
      const namen = an.map(function (h) { const t = h.value.split("-")[1]; return TEIL_NAMEN[t] || t; });
      teile.push("Unit " + block.dataset.unit + " (" + namen.join(", ") + ")");
    }
  });
  if (teile.length === 0) return "Noch nichts gewählt";
  return alleVoll ? "Alle Units" : teile.join(" · ");
}

// Wird bei jeder Änderung an Häkchen oder Einstellungen aufgerufen
function auswahlGeaendert() {
  const pool = gewaehlteWoerter();
  const stand = bewerte(pool);
  standBox.hidden = pool.length === 0;

  let kartenAnzahl;
  if (modusSelect.value === "alles") {
    kartenAnzahl = pool.length;
  } else {
    kartenAnzahl = stand.faellig + Math.min(stand.neu, NEUE_PRO_RUNDE);
  }
  if (anzahlSelect.value !== "alle") kartenAnzahl = Math.min(kartenAnzahl, Number(anzahlSelect.value));

  zusammenFeld.textContent = pool.length + " Wörter ausgewählt: " + stand.faellig + " fällig, " +
                             stand.neu + " neu, " + stand.spaeter + " noch nicht fällig";
  zeichneUebersicht(stand.faecher);

  if (pool.length === 0) {
    losKnopf.disabled = true;
    losKnopf.textContent = "Wähle zuerst Wörter aus";
  } else if (kartenAnzahl === 0) {
    losKnopf.disabled = true;
    losKnopf.textContent = "Heute ist hier nichts fällig";
  } else {
    losKnopf.disabled = false;
    losKnopf.textContent = "Los geht's – " + kartenAnzahl + " Karten";
  }

  auswahlTextFeld.textContent = beschreibeAuswahl();
  kachelnBox.querySelectorAll(".kachel").forEach(function (k) {
    k.setAttribute("aria-pressed", k.dataset.uebung === uebungSelect.value ? "true" : "false");
  });
  zeigeRang();
  zeigeMedaillen();

  speichereJson(EINSTELLUNGEN_SCHLUESSEL, {
    schluessel: gewaehlteSchluessel(),
    uebung: uebungSelect.value,
    richtung: richtungSelect.value,
    modus: modusSelect.value,
    anzahl: anzahlSelect.value
  });
}

// Beim Start die zuletzt gewählte Auswahl wiederherstellen
function stelleEinstellungenWiederHer() {
  const gespeichert = ladeJson(EINSTELLUNGEN_SCHLUESSEL, null);
  if (!gespeichert) return;
  auswahlBox.querySelectorAll("input").forEach(function (h) {
    h.checked = gespeichert.schluessel.includes(h.value);
  });
  if (gespeichert.uebung)   uebungSelect.value   = gespeichert.uebung;
  if (gespeichert.richtung) richtungSelect.value = gespeichert.richtung;
  if (gespeichert.modus)    modusSelect.value    = gespeichert.modus;
  if (gespeichert.anzahl)   anzahlSelect.value   = gespeichert.anzahl;
}

function zeigeAuswahl() {
  zeigeBereich("start");
  infoFeld.textContent = "";
  auswahlGeaendert();
}

// ---------- 9) Eine Runde starten ----------

let karten = [];          // die Wörter dieser Runde
let position = 0;         // bei welcher Karte sind wir (0 = erste)
let umgedreht = false;    // ist die Lösung gerade sichtbar?
let gewusst = [];         // Wörter, die gewusst wurden
let nichtGewusst = [];    // Wörter, die nicht gewusst wurden
let zaehltFuerFaecher = true;   // false bei reiner Wiederholung der Fehler
let uebung = "karten";    // "karten", "tippen" oder "mc" (Multiple Choice)
let richtung = "en-de";   // "en-de" oder "de-en"
let urteilZaehltAlsRichtig = false;   // Ergebnis der letzten Eingabe (Eintippen)
let medaillenVorher = {};   // Medaillen beim Start der Runde
let rangVorher = 0;         // Rang beim Start der Runde (um einen Aufstieg zu bemerken)
let mcOptionen = [];        // die vier Wörter, die gerade als Antwort zur Wahl stehen (Multiple Choice)

let letzterPool = [];     // aus diesen Wörtern wurde die Runde gezogen (für "Neue Runde")
let letzteAnzahl = "10";  // so viele Karten wollte man (Zahl als Text oder "alle")
let letzterModus = "leitner";
let letzteUebung = "karten";
let letzteRichtung = "en-de";

// kartenListe = diese Karten kommen dran. zaehlt = ändern die Antworten die Fächer?
function starteRunde(kartenListe, zaehlt) {
  karten = kartenListe;
  position = 0;
  gewusst = [];
  nichtGewusst = [];
  zaehltFuerFaecher = zaehlt;
  uebung = letzteUebung;
  richtung = letzteRichtung;
  rangVorher = rangIndex();
  medaillenVorher = medaillenStand();

  zeigeBereich("lernen");
  zeigeKarte();
}

// Neue Runde aus einem Pool von Wörtern
function starteAusPool(pool, anzahl, modus, uebungName, richtungName) {
  letzterPool = pool;
  letzteAnzahl = anzahl;
  letzterModus = modus;
  letzteUebung = uebungName;
  letzteRichtung = richtungName;
  const gezogen = zieheKarten(pool, anzahl, modus);
  if (gezogen.length === 0) { zeigeAuswahl(); return; }     // zur Sicherheit
  starteRunde(gezogen, true);
}

// ---------- 10) Die aktuelle Karte zeigen (Vorderseite) ----------
function zeigeKarte() {
  const wort = karten[position];
  umgedreht = false;

  // Bei Multiple Choice wird die Karte zum Eintippen, sobald das Wort schon gut sitzt
  const umgestellt = letzteUebung === "mc" && fachVon(wort) >= MC_TIPPEN_AB_FACH;
  uebung = umgestellt ? "tippen" : letzteUebung;

  const vorn = vorderText(wort);
  englischFeld.textContent = vorn;
  englischFeld.classList.toggle("lang", vorn.length > 24);      // lange Texte etwas kleiner
  // Die Lautschrift verrät nichts, wenn Englisch vorn steht. Bei Deutsch -> Englisch erst hinten.
  lautschriftFeld.textContent = (richtung === "en-de" && wort.ipa) ? "[" + wort.ipa + "]" : "";
  herkunftFeld.textContent = "Unit " + wort.unit + " · " + wort.key + " · Seite " + wort.page +
                             (istNeu(wort) ? " · neu" : " · Fach " + fachVon(wort)) +
                             (umgestellt ? " · diesmal eintippen" : "");

  rueckseite.hidden       = true;
  rueckmeldungBox.hidden  = true;
  antwortenBox.hidden     = true;
  umdrehenKnopf.hidden    = uebung !== "karten";
  tippenForm.hidden       = uebung !== "tippen";
  optionenBox.hidden      = uebung !== "mc";
  if (uebung === "tippen") {
    eingabeFeld.value = "";
    eingabeFeld.placeholder = richtung === "en-de" ? "Deutsch eintippen …" : "Englisch eintippen …";
    eingabeFeld.focus();
  } else if (uebung === "mc") {
    baueOptionen(wort);
  }

  infoFeld.textContent = "Karte " + (position + 1) + " von " + karten.length +
                         (zaehltFuerFaecher ? "" : " · Wiederholung");
  balken.style.width = (position / karten.length * 100) + "%";
}

// Die Lösung zeigen: Rückseite, Lautschrift, Beispiele, Hinweis
function zeigeLoesung(wort) {
  deutschFeld.textContent = rueckText(wort);
  lautschriftFeld.textContent = wort.ipa ? "[" + wort.ipa + "]" : "";

  beispieleListe.innerHTML = "";
  wort.examples.forEach(function (satz) {
    const punkt = document.createElement("li");
    punkt.textContent = satz;
    beispieleListe.appendChild(punkt);
  });
  hinweisFeld.textContent = wort.note;
  rueckseite.hidden = false;
}

// ---------- 11) Karteikarten: umdrehen und antworten ----------
function umdrehen() {
  if (umgedreht || uebung !== "karten") return;
  umgedreht = true;
  zeigeLoesung(karten[position]);
  antwortenBox.hidden  = false;
  umdrehenKnopf.hidden = true;
}

function antworten(warGewusst) {
  if (!umgedreht) return;
  const wort = karten[position];
  (warGewusst ? gewusst : nichtGewusst).push(wort);
  if (zaehltFuerFaecher) merkeAntwort(wort, warGewusst, uebung === "mc" ? MC_MAX_FACH : 5);   // Fach ändern und speichern

  position = position + 1;
  if (position < karten.length) {
    zeigeKarte();
  } else {
    zeigeEnde();
  }
}

// ---------- 12) Eintippen: prüfen und Rückmeldung ----------
// eingabe = was getippt wurde (leer = "Weiß ich nicht")
function bewerteEingabe(eingabe) {
  if (umgedreht || uebung !== "tippen") return;
  umgedreht = true;
  const wort = karten[position];
  const leer = eingabe.trim() === "";
  const urteil = leer ? "falsch" : pruefeAntwort(eingabe, wort, richtung);

  zeigeLoesung(wort);
  tippenForm.hidden = true;
  rueckmeldungBox.hidden = false;

  urteilZaehltAlsRichtig = urteil === "richtig" || (urteil === "fast" && TIPPFEHLER_ZAEHLEN_ALS_RICHTIG);
  if (urteil === "richtig") {
    urteilFeld.textContent = "Richtig!";
  } else if (urteil === "fast") {
    urteilFeld.textContent = "Fast richtig! So schreibt man es: " + rueckText(wort);
  } else {
    urteilFeld.textContent = (leer ? "Kein Problem. " : "Leider falsch. ") + "Richtig wäre: " + rueckText(wort);
  }
  urteilFeld.className = urteilZaehltAlsRichtig ? "gut" : "schlecht";

  // "Ich hatte es richtig" gibt es nur, wenn die App "falsch" gesagt hat und wirklich etwas getippt wurde
  dochKnopf.hidden = urteilZaehltAlsRichtig || leer;
  weiterKnopf.focus();                  // dann reicht Enter für "Weiter"
}

// ---------- 12b) Multiple Choice: eine Antwort wählen ----------
function waehleOption(nummer) {
  if (umgedreht || uebung !== "mc" || !mcOptionen[nummer]) return;
  umgedreht = true;
  const wort = karten[position];
  const richtig = mcOptionen[nummer].id === wort.id;

  // Knöpfe einfärben: die richtige grün, eine falsch gewählte rot, dann sperren
  Array.from(optionenBox.children).forEach(function (knopf, k) {
    knopf.disabled = true;
    if (mcOptionen[k].id === wort.id) knopf.classList.add("richtig");
    else if (k === nummer) knopf.classList.add("falsch");
  });

  zeigeLoesung(wort);
  rueckmeldungBox.hidden = false;
  urteilZaehltAlsRichtig = richtig;
  urteilFeld.textContent = richtig ? "Richtig!" : "Leider falsch. Richtig wäre: " + rueckText(wort);
  urteilFeld.className = richtig ? "gut" : "schlecht";
  dochKnopf.hidden = true;               // bei Multiple Choice gibt es kein "Ich hatte es richtig"
  weiterKnopf.focus();                   // dann reicht Enter für "Weiter"
}

// ---------- 13) Auswertung am Ende ----------
function zeigeEnde() {
  zeigeBereich("ende");
  balken.style.width = "100%";
  infoFeld.textContent = "Runde beendet";

  ergebnisFeld.textContent = gewusst.length + " von " + karten.length + " gewusst";

  const prozent = Math.round(gewusst.length / karten.length * 100);
  ringFeld.style.setProperty("--pct", prozent);
  ringText.textContent = prozent + "%";
  endeTitel.textContent = prozent >= 90 ? "Stark, Hero!" : prozent >= 70 ? "Gut gemacht!" :
                          prozent >= 40 ? "Weiter so!" : "Übung macht den Helden!";

  // Neuer Rang oder neue Medaille? Dann gibt es eine Meldung.
  const meldungen = [];
  if (zaehltFuerFaecher) {
    const rangNachher = rangIndex();
    if (rangNachher > rangVorher) meldungen.push("Neuer Rang: ★ " + RAENGE[rangNachher].name + "!");
    UNITS.forEach(function (nr) {
      const nachher = unitMedaille(nr);
      if (nachher > (medaillenVorher[nr] || 0)) meldungen.push("Neue Medaille: Unit " + nr + " " + MEDAILLEN[nachher - 1].name + "!");
    });
  }
  rangMeldung.hidden = meldungen.length === 0;
  rangMeldung.textContent = meldungen.join("\n");
  if (meldungen.length > 0 || prozent >= 70) konfetti();
  wiederholungFeld.hidden = zaehltFuerFaecher;

  fehlerListe.innerHTML = "";
  nichtGewusst.forEach(function (wort) {
    const punkt = document.createElement("li");
    punkt.textContent = englischText(wort) + " – " + wort.deList.join(" · ");
    fehlerListe.appendChild(punkt);
  });

  fehlerNochmal.hidden = nichtGewusst.length === 0;
  // "Neue Runde" nur anbieten, wenn es danach noch etwas gibt
  nochmalKnopf.hidden = zieheKarten(letzterPool, letzteAnzahl, letzterModus).length === 0;
}

// ---------- Konfetti ----------
function konfetti() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const farben = ["#ffb703", "#5b4bdb", "#1f9d57", "#e85d9b", "#2ec4f1"];
  konfettiBox.innerHTML = "";
  for (let i = 0; i < 40; i++) {
    const stueck = document.createElement("i");
    stueck.style.left = Math.random() * 100 + "%";
    stueck.style.background = farben[i % farben.length];
    stueck.style.animationDuration = (1.6 + Math.random() * 1.4) + "s";
    stueck.style.animationDelay = (Math.random() * 0.5) + "s";
    konfettiBox.appendChild(stueck);
  }
  setTimeout(function () { konfettiBox.innerHTML = ""; }, 3800);
}

// ---------- Modals ----------
// Alle Modals sind <dialog>-Elemente. Schließen geht mit dem Knopf, mit Esc und mit einem Tipp daneben.
[dlgAuswahl, dlgEinstellungen, dlgSicherung, dlgRaenge, dlgFrage].forEach(function (dlg) {
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
});
document.querySelectorAll("[data-schliessen]").forEach(function (knopf) {
  knopf.addEventListener("click", function () { knopf.closest("dialog").close(); });
});
auswahlOeffnen.addEventListener("click", function () { dlgAuswahl.showModal(); });
rangFeld.addEventListener("click", function () {
  zeigeRaengeListe();
  dlgRaenge.showModal();
  const aktuell = raengeListe.querySelector(".aktuell");
  if (aktuell) aktuell.scrollIntoView({ block: "nearest" });
});
einstellungenOeffnen.addEventListener("click", function () { dlgEinstellungen.showModal(); });
sicherungOeffnen.addEventListener("click", function () {
  sicherungMeldung.textContent = "";
  dlgSicherung.showModal();
});
alleUnitsKnopf.addEventListener("click", function () {
  const haken = Array.from(auswahlBox.querySelectorAll("input"));
  const alleAn = haken.every(function (h) { return h.checked; });
  haken.forEach(function (h) { h.checked = !alleAn; });
  auswahlGeaendert();
});

// Eine Rückfrage als Modal. Ergebnis: true (OK) oder false (Abbrechen, Esc, daneben tippen).
function frage(titel, text, okText) {
  return new Promise(function (aufloesen) {
    frageTitel.textContent = titel;
    frageText.textContent = text;
    frageJa.textContent = okText || "OK";
    dlgFrage.returnValue = "";
    dlgFrage.addEventListener("close", function () {
      aufloesen(dlgFrage.returnValue === "ja");
    }, { once: true });
    dlgFrage.showModal();
  });
}
frageJa.addEventListener("click", function () { dlgFrage.close("ja"); });
frageNein.addEventListener("click", function () { dlgFrage.close("nein"); });

// Übungsart per Kachel wählen
kachelnBox.addEventListener("click", function (e) {
  const kachel = e.target.closest(".kachel");
  if (!kachel) return;
  uebungSelect.value = kachel.dataset.uebung;
  auswahlGeaendert();
});

// ---------- 14) Knöpfe und Tasten verbinden ----------
function neueRundeMitGleicherAuswahl() {
  starteAusPool(letzterPool, letzteAnzahl, letzterModus, letzteUebung, letzteRichtung);
}

losKnopf.addEventListener("click", function () {
  starteAusPool(gewaehlteWoerter(), anzahlSelect.value, modusSelect.value,
                uebungSelect.value, richtungSelect.value);
});
auswahlBox.addEventListener("change", auswahlGeaendert);       // bei jedem Anhaken neu zählen
[uebungSelect, richtungSelect, modusSelect, anzahlSelect].forEach(function (s) {
  s.addEventListener("change", auswahlGeaendert);
});

zuruecksetzenKnopf.addEventListener("click", function () {
  frage("Alles löschen?", "Der ganze Lernstand wird gelöscht, auch dein Rang und alle Medaillen. Alle Wörter sind danach wieder neu.", "Ja, löschen")
    .then(function (ok) {
      if (!ok) return;
      fortschritt = {};
      rekord = neuerRekord();
      speichereJson(FORTSCHRITT_SCHLUESSEL, fortschritt);
      speichereJson(REKORD_SCHLUESSEL, rekord);
      auswahlGeaendert();
      dlgSicherung.close();
    });
});

// ---------- Sichern und Laden des Fortschritts ----------
// Die Sicherung ist eine kleine Textdatei (JSON). Beim Laden wird mit dem
// vorhandenen Stand zusammengeführt: pro Wort gewinnt der Eintrag mit dem
// neueren "zuletzt". So kann man beide Geräte abgleichen, ohne etwas zu verlieren.
function sicherungsText() {
  return JSON.stringify({
    app: "vokabeltrainer", version: 2, gesichert: heute(), fortschritt: fortschritt, rekord: rekord
  }, null, 1);
}

function eintragOk(e) {
  return e && typeof e === "object" && Number.isInteger(e.box) && e.box >= 1 && e.box <= 5 &&
         typeof e.faellig === "string" && /^\d{4}-\d{2}-\d{2}$/.test(e.faellig);
}

function fuehreZusammen(neu) {
  let uebernommen = 0, uebersprungen = 0;
  Object.keys(neu).forEach(function (id) {
    const e = neu[id];
    if (!eintragOk(e) || !VOKABELN.some(function (w) { return String(w.id) === id; })) {
      uebersprungen++;
      return;
    }
    const alt = fortschritt[id];
    if (!alt || (e.zuletzt || "") > (alt.zuletzt || "")) {
      fortschritt[id] = {
        box: e.box, faellig: e.faellig,
        richtig: Number(e.richtig) || 0, falsch: Number(e.falsch) || 0,
        zuletzt: e.zuletzt || ""
      };
      uebernommen++;
    }
  });
  return { uebernommen: uebernommen, uebersprungen: uebersprungen };
}

// Bestwerte aus einer Sicherung dazunehmen: pro Wert gilt der höhere
function fuehreRekordZusammen(neu) {
  if (!neu || typeof neu !== "object") return;
  if (typeof neu.prozent === "number" && neu.prozent >= 0 && neu.prozent <= 100) rekord.prozent = Math.max(rekord.prozent, neu.prozent);
  if (neu.units && typeof neu.units === "object") {
    UNITS.forEach(function (nr) {
      const wert = neu.units[nr];
      if (typeof wert === "number" && wert >= 0 && wert <= 100) rekord.units[nr] = Math.max(rekord.units[nr] || 0, wert);
    });
  }
}

sichernKnopf.addEventListener("click", function () {
  try {
    const blob = new Blob([sicherungsText()], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "wordhero-sicherung-" + heute() + ".json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(link.href); }, 1000);
    sicherungMeldung.textContent = "Sicherung gespeichert (" + Object.keys(fortschritt).length + " Wörter). Schau im Ordner Downloads.";
  } catch (fehler) {
    sicherungMeldung.textContent = "Das Sichern hat nicht geklappt.";
  }
});

ladenKnopf.addEventListener("click", function () { ladeDatei.click(); });

ladeDatei.addEventListener("change", function () {
  const datei = ladeDatei.files && ladeDatei.files[0];
  if (!datei) return;
  const leser = new FileReader();
  leser.onload = function () {
    try {
      const daten = JSON.parse(String(leser.result));
      if (!daten || daten.app !== "vokabeltrainer" || typeof daten.fortschritt !== "object" || daten.fortschritt === null) {
        throw new Error("falsches Format");
      }
      const r = fuehreZusammen(daten.fortschritt);
      fuehreRekordZusammen(daten.rekord);
      speichereJson(FORTSCHRITT_SCHLUESSEL, fortschritt);
      aktualisiereRekord();
      auswahlGeaendert();
      sicherungMeldung.textContent = r.uebernommen + " Wörter übernommen" +
        (r.uebersprungen ? ", " + r.uebersprungen + " übersprungen" : "") + ".";
    } catch (fehler) {
      sicherungMeldung.textContent = "Diese Datei ist keine gültige Sicherung. Es wurde nichts verändert.";
    }
    ladeDatei.value = "";
  };
  leser.onerror = function () { sicherungMeldung.textContent = "Die Datei konnte nicht gelesen werden."; };
  leser.readAsText(datei);
});

// ---------- GitHub-Sync (Gist) ----------
// Der Fortschritt wird in einem privaten Gist des eigenen GitHub-Kontos abgelegt.
// So gleichen sich Handy und Laptop automatisch ab, ohne Datei hin- und herzuschicken.
const GITHUB_TOKEN_SCHLUESSEL = "vokabeltrainer-github-token-v1";
const GITHUB_GIST_SCHLUESSEL  = "vokabeltrainer-github-gist-v1";
const GITHUB_GIST_DATEINAME   = "wordhero-fortschritt.json";
const GITHUB_GIST_BESCHREIBUNG = "WordHero Fortschritt (automatisch, nicht von Hand bearbeiten)";

const githubTokenFeld = document.getElementById("githubToken");
const githubSyncKnopf = document.getElementById("githubSync");
const githubMeldung   = document.getElementById("githubMeldung");

githubTokenFeld.value = localStorage.getItem(GITHUB_TOKEN_SCHLUESSEL) || "";

async function githubApi(pfad, token, optionen) {
  const antwort = await fetch("https://api.github.com" + pfad, Object.assign({
    headers: {
      Authorization: "token " + token,
      Accept: "application/vnd.github+json"
    }
  }, optionen));
  if (!antwort.ok) {
    const text = await antwort.text().catch(function () { return ""; });
    throw new Error("GitHub-Fehler " + antwort.status + (text ? ": " + text : ""));
  }
  return antwort.json();
}

async function githubGistFinden(token) {
  const gespeicherteId = localStorage.getItem(GITHUB_GIST_SCHLUESSEL);
  if (gespeicherteId) {
    try { return await githubApi("/gists/" + gespeicherteId, token); } catch (fehler) { /* evtl. gelöscht: neu suchen */ }
  }
  const gists = await githubApi("/gists", token);
  const treffer = gists.find(function (g) { return g.description === GITHUB_GIST_BESCHREIBUNG; });
  if (treffer) return githubApi("/gists/" + treffer.id, token);
  return null;
}

async function githubGistAnlegen(token, inhalt) {
  const dateien = {};
  dateien[GITHUB_GIST_DATEINAME] = { content: inhalt };
  return githubApi("/gists", token, {
    method: "POST",
    body: JSON.stringify({ description: GITHUB_GIST_BESCHREIBUNG, public: false, files: dateien })
  });
}

async function githubGistSpeichern(token, gistId, inhalt) {
  const dateien = {};
  dateien[GITHUB_GIST_DATEINAME] = { content: inhalt };
  return githubApi("/gists/" + gistId, token, {
    method: "PATCH",
    body: JSON.stringify({ files: dateien })
  });
}

async function githubAbgleichen() {
  const token = githubTokenFeld.value.trim();
  if (!token) { githubMeldung.textContent = "Bitte zuerst einen GitHub-Token eintragen."; return; }
  localStorage.setItem(GITHUB_TOKEN_SCHLUESSEL, token);
  githubSyncKnopf.disabled = true;
  githubMeldung.textContent = "Gleiche ab …";
  try {
    let gist = await githubGistFinden(token);
    if (!gist) gist = await githubGistAnlegen(token, sicherungsText());
    localStorage.setItem(GITHUB_GIST_SCHLUESSEL, gist.id);

    const datei = gist.files && gist.files[GITHUB_GIST_DATEINAME];
    let uebernommen = 0;
    if (datei && datei.content) {
      const daten = JSON.parse(datei.content);
      if (daten && typeof daten.fortschritt === "object" && daten.fortschritt !== null) {
        const r = fuehreZusammen(daten.fortschritt);
        fuehreRekordZusammen(daten.rekord);
        uebernommen = r.uebernommen;
        speichereJson(FORTSCHRITT_SCHLUESSEL, fortschritt);
        speichereJson(REKORD_SCHLUESSEL, rekord);
        aktualisiereRekord();
        auswahlGeaendert();
      }
    }

    await githubGistSpeichern(token, gist.id, sicherungsText());
    githubMeldung.textContent = "Abgeglichen" + (uebernommen ? " (" + uebernommen + " Wörter vom anderen Gerät übernommen)" : "") + ".";
  } catch (fehler) {
    githubMeldung.textContent = "Abgleich fehlgeschlagen: " + fehler.message;
  } finally {
    githubSyncKnopf.disabled = false;
  }
}

githubSyncKnopf.addEventListener("click", githubAbgleichen);

abbrechenKnopf.addEventListener("click", function () {
  if (position === 0 && !umgedreht) { zeigeAuswahl(); return; }       // noch nichts gemacht: ohne Rückfrage
  frage("Runde beenden?", "Deine bisherigen Antworten sind gespeichert. Die aktuelle Karte zählt nicht.", "Beenden")
    .then(function (ok) { if (ok) zeigeAuswahl(); });
});
zurAuswahlKnopf.addEventListener("click", zeigeAuswahl);
fehlerNochmal.addEventListener("click", function () { starteRunde(mischen(nichtGewusst), false); });
nochmalKnopf.addEventListener("click", neueRundeMitGleicherAuswahl);

// Karteikarten
umdrehenKnopf.addEventListener("click", umdrehen);
karte.addEventListener("click", umdrehen);
jaKnopf.addEventListener("click",   function () { antworten(true); });
neinKnopf.addEventListener("click", function () { antworten(false); });

// Eintippen: Enter im Eingabefeld schickt das Formular ab
tippenForm.addEventListener("submit", function (e) {
  e.preventDefault();                                          // sonst lädt der Browser die Seite neu
  if (eingabeFeld.value.trim() === "") { eingabeFeld.focus(); return; }
  bewerteEingabe(eingabeFeld.value);
});
weissNichtKnopf.addEventListener("click", function () { bewerteEingabe(""); });
weiterKnopf.addEventListener("click", function () { antworten(urteilZaehltAlsRichtig); });
dochKnopf.addEventListener("click", function () {
  urteilZaehltAlsRichtig = true;
  urteilFeld.textContent = "Okay, als richtig gezählt.";
  urteilFeld.className = "gut";
  dochKnopf.hidden = true;
  weiterKnopf.focus();
});

// Tastatur für den Laptop. Bei Karteikarten: Leertaste/Enter = umdrehen,
// Pfeil rechts = gewusst, links = nicht gewusst. Beim Eintippen übernimmt das Formular.
document.addEventListener("keydown", function (e) {
  if (document.querySelector("dialog[open]")) return;      // ein Modal ist offen: das Modal bedient sich selbst
  if (!startBereich.hidden) return;     // in der Auswahl soll die Leertaste nur Häkchen setzen

  // Ist gerade ein sichtbarer Knopf aktiv, erledigt der Browser Leertaste/Enter schon selbst.
  // (War der Knopf gerade versteckt worden, kümmern wir uns selbst darum.
  //  offsetParent ist null, wenn ein Element oder sein Umfeld unsichtbar ist.)
  if (e.target.tagName === "BUTTON" && e.target.offsetParent !== null && (e.key === " " || e.key === "Enter")) return;

  if (!endeBereich.hidden) {
    if (e.key === "Enter" && !nochmalKnopf.hidden) neueRundeMitGleicherAuswahl();
    return;
  }
  if (uebung === "tippen") return;      // beim Eintippen sind Leertaste und Pfeile fürs Schreiben da

  if (uebung === "mc") {                // Multiple Choice: Tasten 1 bis 4 wählen, danach Enter/Leertaste = weiter
    if (!umgedreht && /^[1-9]$/.test(e.key)) {
      waehleOption(Number(e.key) - 1);
    } else if (umgedreht && (e.key === " " || e.key === "Enter")) {
      e.preventDefault();
      weiterKnopf.click();
    }
    return;
  }

  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    umdrehen();
  } else if (e.key === "ArrowRight") {
    antworten(true);
  } else if (e.key === "ArrowLeft") {
    antworten(false);
  }
});

// ---------- 15) Los geht's ----------
baueAuswahl();
const ersterStart = !ladeJson(EINSTELLUNGEN_SCHLUESSEL, null);
stelleEinstellungenWiederHer();
speicherHinweis.hidden = speicherGeht;
zeigeAuswahl();
if (ersterStart) dlgAuswahl.showModal();      // beim allerersten Mal gleich fragen, was geübt werden soll
