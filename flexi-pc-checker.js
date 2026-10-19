/* =====================================================================
 * Nestor – Flexi-Job PC-checker (met lead-formulier)
 * Eén zelfstandig bestand. Sluit overal in met:
 *
 *   <div id="flexi-checker-container-leadgen"></div>
 *   <script src="https://nestor-group.github.io/tools-website/flexi-pc-checker.js" defer></script>
 *
 * Inhoud aanpassen? Pas alleen het CONFIG-blok hieronder aan.
 * De logica eronder hoef je normaal niet aan te raken.
 * ===================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ *
   *  CONFIG — hier pas je teksten, sectoren en de Script-URL aan
   * ------------------------------------------------------------------ */
  var CONFIG = {
    mountId: "flexi-checker-container-leadgen",

    // Google Apps Script endpoint dat de e-mailleads opvangt.
    // LET OP: dit is een publiek endpoint (zit ook in de front-end code).
    scriptUrl: "https://script.google.com/macros/s/AKfycbw6iYbawhdjDnP10fz17tTYjLLdVihiIcwBRbbPnKGEzg6BTyBSMDCdy8w7PXH8vmI/exec",

    colors: { primary: "#F73109", primaryHover: "#D92B07", primaryDisabled: "#fabbb0" },

    header: {
      title: "Komt jouw sector in aanmerking voor Flexi-Jobs?",
      intro: "Voer hieronder het nummer van je paritair comité (PC) in en ontdek het meteen."
    },
    placeholder: "Bv: 302, 118.03, ...",
    checkLabel: "Controleer",

    cta: { url: "https://interim.nestor.be/database-tool", label: "Neem een kijkje in onze database →" },

    disclaimer: "<strong>Disclaimer:</strong> Deze tool is louter informatief. Er kunnen geen rechten aan worden ontleend. Raadpleeg altijd de officiële bronnen voor de meest actuele en correcte informatie.",

    // Bron: Securex, "Flexi-jobs in de verschillende sectoren", situatie op 18 september 2026,
    // en Lex4You "Flexi-jobs: mag ik ermee aan de slag in mijn sector?" (24/09/2026).
    // Principe: sinds 1 juli 2026 zijn flexi-jobs mogelijk in elke sector, behalve waar een opt-out geldt.
    //
    // PC-nummers in deze lijsten schrijf je ZONDER nullen op het einde (322.010 -> "322.01", 143.000 -> "143").
    // Een sub-PC zonder eigen regel valt automatisch onder zijn hoofd-PC (bv. 144.200 -> 144).

    // VOLLEDIGE opt-out: de RSZ aanvaardt er geen flexi-jobs.
    optOut: ["144"],
    optOutText: "Nee, jouw sector (PC {pc}) heeft een geldige opt-out en komt niet in aanmerking voor flexi-jobs.",

    // GEDEELTELIJKE opt-out via wet of koninklijk besluit (de RSZ blokkeert dit). Key = PC.
    beperkteOptOutHeading: "Gedeeltelijk: in jouw sector gelden beperkingen.",
    beperkteOptOut: {
      "121": "Sinds <strong>1 oktober 2026</strong> zijn flexi-jobs in de schoonmaaksector (PC 121) enkel nog mogelijk voor <strong>(vervroegd) gepensioneerden</strong>, en voor maximaal <strong>10%</strong> van het totale arbeidsvolume bij de werkgever.",
      "143": "In de zeevisserij (PC 143) zijn flexi-jobs uitgesloten voor het <strong>varend personeel</strong>. Walpersoneel en personeel van de pakhuizen mag wel, in de pakhuizen binnen een maximale verhouding tot het vaste personeel.",
      "145": "In de tuinbouw (PC 145) zijn flexi-jobs uitgesloten, <strong>met uitzondering van de aanleg en het onderhoud van parken en tuinen</strong> (PC 145.040).",
      "320": "Bij begrafenisondernemingen (PC 320) mogen enkel de taken van een <strong>gelegenheidsarbeider</strong> door een flexi-jobber worden uitgevoerd.",
      "323": "In het beheer van gebouwen (PC 323) geldt de uitsluiting enkel voor <strong>dienstboden</strong>. Voor andere functies kan het wel.",
      "331": "In de Vlaamse welzijns- en gezondheidssector (PC 331) kan het, maar in de <strong>kinderopvang</strong> (NACE 88.91) mag maximaal <strong>20%</strong> van het totale arbeidsvolume met flexi-jobs gepresteerd worden.",
      "322.01": "Voor dienstencheque-activiteiten (PC 322.010) is een flexi-job toegelaten tot <strong>drie maanden na de eerste Dimona</strong> bij de werkgever. Daarna is een contract van onbepaalde duur verplicht, waardoor een flexi-job in de praktijk niet langer kan."
    },

    // Beperkingen via een SECTORALE CAO. De RSZ blokkeert deze niet: de werkgever is zelf verantwoordelijk.
    // Key = PC. Waarde = tekst, of { heading, text } voor een eigen titel.
    sectoraleBeperkingHeading: "Ja, maar je sector legt beperkingen op.",
    sectoraleBeperkingNote: "Deze regels komen uit een sectorale cao. De RSZ blokkeert ze niet, maar de werkgever moet ze wel naleven. (Onder voorbehoud)",
    sectoraleBeperking: {
      "106.02": "In de betonindustrie (PC 106.020) mag een flexi-jobber niet ingezet worden in functies waarvoor <strong>tijdelijke werkloosheid</strong> geldt, of als hij al <strong>tijdskrediet</strong> geniet bij een andere werkgever in de sector.",
      "112": "In het garagebedrijf (PC 112) moet een flexi-jobber die technisch werkt aan <strong>hybride, elektrische of waterstofvoertuigen</strong> het sectorale certificaat 'veiligheid' hebben.",
      "149.02": "In het koetswerk (PC 149.020) moet een flexi-jobber die technisch werkt aan <strong>hybride, elektrische of waterstofvoertuigen</strong> het sectorale certificaat 'veiligheid' hebben.",
      "115": { heading: "In principe niet: je sector sluit flexi-jobs uit.", text: "In het glasbedrijf (PC 115.020, 115.030 en 115.090) sluit de sectorale cao flexi-jobs <strong>uit</strong> zolang de cao loopt." },
      "116": { heading: "In principe niet, tenzij er een akkoord is.", text: "In de chemie (PC 116) zijn flexi-jobs uitgesloten, <strong>behalve</strong> in ondernemingen met een akkoord met de syndicale delegatie (of de vakorganisaties). Geldig van 1 juli 2026 tot en met 31 december 2027." },
      "207": { heading: "In principe niet, tenzij er een akkoord is.", text: "In de chemie (PC 207) zijn flexi-jobs uitgesloten, <strong>behalve</strong> in ondernemingen met een akkoord met de syndicale delegatie (of de vakorganisaties). Geldig van 1 juli 2026 tot en met 31 december 2027." },
      "124": "In de bouw (PC 124) kan een flexi-job <strong>niet</strong> voor werk op een tijdelijke of mobiele bouwplaats waarvoor een basisveiligheidsopleiding vereist is. Voor alle andere activiteiten wel. <strong>(Vervroegd) gepensioneerden</strong> mogen wel op de werf, als ze de voorbije 10 jaar minstens 5 jaar ervaring op bouwplaatsen hebben. Geldig tot en met 30 juni 2027.",
      "127": "In de brandstoffenhandel (PC 127) mogen flexi-jobs <strong>niet</strong> tijdens periodes van economische werkloosheid voor gelijkaardige functies, en <strong>niet</strong> ter vervanging van vaste werknemers.",
      "128": { heading: "Enkel met een akkoord in je onderneming.", text: "In het huid- en lederbedrijf (PC 128) zijn flexi-jobs enkel mogelijk via een akkoord met de vakbondsafvaardiging (of de regionale vakbondssecretaris)." },
      "136": "In de papier- en kartonbewerking (PC 136) mogen flexi-jobs enkel in <strong>5 welomschreven gevallen</strong>, met een maximum van <strong>52 dagen per jaar</strong> per werknemer en <strong>10%</strong> van de tewerkstelling (VTE). Geldig sinds 1 oktober 2026.",
      "222": "In de papier- en kartonbewerking (PC 222) mogen flexi-jobs enkel in <strong>5 welomschreven gevallen</strong>, met een maximum van <strong>52 dagen per jaar</strong> per werknemer en <strong>10%</strong> van de tewerkstelling (VTE). Geldig sinds 1 oktober 2026.",
      "211": { heading: "In principe niet, tenzij er een akkoord is.", text: "In de petroleumnijverheid en -handel (PC 211) zijn flexi-jobs uitgesloten, tenzij er een <strong>jaarlijks schriftelijk akkoord</strong> is met de voltallige syndicale delegatie." },
      "226": "In de internationale handel, transport en logistiek (PC 226) moet een flexi-jobber in een <strong>veiligheidsfunctie</strong> voldoen aan alle voorwaarden van die functie (kennis, ervaring, opleiding).",
      "307": "Bij verzekeringsmakelaars (PC 307) mogen flexi-jobs enkel in de <strong>omstandigheden en functies</strong> die de sectorale cao opsomt. Geldig tot en met 31 januari 2028."
    },

    // Positieve uitzonderingen en extra uitleg (key = PC of trefwoord).
    specialCases: {
      "132": "De opt-out voor technische landbouwwerken (PC 132) liep tot 30 juni 2026 en werd <strong>niet verlengd</strong>. Sinds 1 juli 2026 zijn flexi-jobs er dus toegelaten.",
      "145.04": "Voor de aanleg en het onderhoud van <strong>parken en tuinen</strong> (PC 145.040) zijn flexi-jobs toegelaten. De rest van de tuinbouw (PC 145) is uitgesloten.",
      "onderwijs": "De onderwijssector komt in aanmerking, zowel het officiële als het gesubsidieerde vrije onderwijs. Dit is niet gebonden aan een specifiek PC-nummer.",
      "events": "De eventsector komt in aanmerking. Dit is niet gebonden aan één specifiek PC."
    },

    // Catch-all: elke andere geldige sector komt sinds 1 juli 2026 in aanmerking.
    nieuwJuliHeading: "Ja! Sinds 1 juli 2026 komt jouw sector in aanmerking.",
    nieuwJuliText: "Sinds <strong>1 juli 2026</strong> is flexi-jobben mogelijk in alle sectoren, behalve die met een geldige opt-out. Jouw sector (PC {pc}) hoort daarbij. (Onder voorbehoud)",

    // Wettelijke beperkingen die in ELKE sector gelden. Wordt getoond bij elk positief antwoord.
    wettelijkeBeperkingenNote: "ℹ️ In elke sector wettelijk uitgesloten: artistieke, artistiek-technische en artistiek-ondersteunende functies, en sekswerk.",

    leadForm: {
      defaultTitle: "Blijf op de hoogte of ontvang hulp",
      defaultDesc: "Laat je e-mailadres achter en wij contacteren je met specifieke info voor jouw sector.",
      nietTitle: "Klaar om te starten?",
      nietDesc: "Laat je e-mailadres achter, dan helpen we je op weg met een flexi-job in jouw sector.",
      emailPlaceholder: "jouw@email.be",
      sendLabel: "Verstuur"
    }
  };

  /* ------------------------------------------------------------------ *
   *  Vanaf hier: logica + styling. Normaal niet aanpassen.
   * ------------------------------------------------------------------ */

  var ROOT = "fpc"; // class-prefix, voorkomt botsing met de rest van de site

  function injectStyles() {
    if (document.getElementById(ROOT + "-styles")) return;
    var P = "#" + CONFIG.mountId;
    var css = `
${P}{--fpc-primary:${CONFIG.colors.primary};--fpc-primary-hover:${CONFIG.colors.primaryHover};--fpc-primary-dis:${CONFIG.colors.primaryDisabled}}
${P} .${ROOT}-wrapper{max-width:650px;margin:20px auto;background:#fff;padding:24px 32px;border-radius:12px;box-shadow:0 4px 15px rgba(0,0,0,.08);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#1a202c;box-sizing:border-box}
${P} .${ROOT}-wrapper *{box-sizing:border-box}
${P} .${ROOT}-header{text-align:center;margin-bottom:24px}
${P} .${ROOT}-header h2{margin:0 0 8px;font-size:1.4rem}
${P} .${ROOT}-header p{margin:0;color:#4a5568}
${P} .${ROOT}-form{display:flex;gap:12px;margin-bottom:24px}
${P} .${ROOT}-form input{flex-grow:1;padding:10px 15px;border:1px solid #ccc;border-radius:8px;font-size:16px}
${P} .${ROOT}-btn{flex-shrink:0;border-radius:8px;background:var(--fpc-primary);color:#fff;padding:10px 20px;border:none;cursor:pointer;font-size:16px;transition:background-color .3s ease}
${P} .${ROOT}-btn:hover{background:var(--fpc-primary-hover)}
${P} .${ROOT}-btn:disabled{background:var(--fpc-primary-dis);cursor:not-allowed}
${P} .${ROOT}-result{min-height:0}
${P} .${ROOT}-lead{animation:fpcFadeIn .5s ease-in}
@keyframes fpcFadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
${P} .${ROOT}-lead h3{margin:0 0 4px}
${P} .${ROOT}-lead .${ROOT}-lead-desc{font-size:.9em;margin-bottom:15px}
${P} .${ROOT}-disclaimer{margin-top:24px;padding-top:16px;border-top:1px solid #e1e1e1;font-size:.8em;text-align:center;color:#4a5568}
${P} .${ROOT}-note{border-left-width:4px;border-left-style:solid;padding:16px;border-radius:4px;margin-bottom:16px}
${P} .${ROOT}-note.success{background:#F0FFF4;border-color:#48BB78}
${P} .${ROOT}-note.error{background:#FFF5F5;border-color:#F56565}
${P} .${ROOT}-note.info{background:#FFF7ED;border-color:var(--fpc-primary)}
${P} .${ROOT}-note p{margin:0 0 8px}
${P} .${ROOT}-note p:last-child{margin-bottom:0}
${P} .${ROOT}-msg-error{color:var(--fpc-primary);margin-top:8px}
@media (max-width:600px){${P} .${ROOT}-form{flex-direction:column}${P} .${ROOT}-wrapper{padding:24px}}`;
    var style = document.createElement("style");
    style.id = ROOT + "-styles";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function build(mount) {
    var w = el("div", ROOT + "-wrapper");

    var header = el("div", ROOT + "-header");
    header.appendChild(el("h2", null, esc(CONFIG.header.title)));
    header.appendChild(el("p", null, esc(CONFIG.header.intro)));
    w.appendChild(header);

    // PC-check formulier
    var form = el("div", ROOT + "-form");
    var pcInput = el("input");
    pcInput.type = "text";
    pcInput.placeholder = CONFIG.placeholder;
    var pcBtn = el("button", ROOT + "-btn", esc(CONFIG.checkLabel));
    pcBtn.type = "button";
    form.appendChild(pcInput);
    form.appendChild(pcBtn);
    w.appendChild(form);

    var pcResult = el("div", ROOT + "-result");
    w.appendChild(pcResult);

    // Lead-formulier (verborgen tot na check)
    var lead = el("div", ROOT + "-lead");
    lead.style.display = "none";
    lead.appendChild(el("hr", null, "")).setAttribute("style", "margin:20px 0;border:0;border-top:1px solid #eee;");
    var leadTitle = el("h3", null, esc(CONFIG.leadForm.defaultTitle));
    var leadDesc = el("p", ROOT + "-lead-desc", esc(CONFIG.leadForm.defaultDesc));
    lead.appendChild(leadTitle);
    lead.appendChild(leadDesc);
    var emailForm = el("div", ROOT + "-form");
    var emailInput = el("input");
    emailInput.type = "email";
    emailInput.placeholder = CONFIG.leadForm.emailPlaceholder;
    var emailBtn = el("button", ROOT + "-btn", esc(CONFIG.leadForm.sendLabel));
    emailBtn.type = "button";
    emailForm.appendChild(emailInput);
    emailForm.appendChild(emailBtn);
    lead.appendChild(emailForm);
    var emailResult = el("div");
    lead.appendChild(emailResult);
    w.appendChild(lead);

    var disclaimer = el("div", ROOT + "-disclaimer");
    disclaimer.appendChild(el("p", null, CONFIG.disclaimer));
    w.appendChild(disclaimer);

    mount.innerHTML = "";
    mount.appendChild(w);

    return { pcInput: pcInput, pcBtn: pcBtn, pcResult: pcResult, lead: lead,
             leadTitle: leadTitle, leadDesc: leadDesc, emailInput: emailInput,
             emailBtn: emailBtn, emailResult: emailResult };
  }

  function run(mount) {
    var r = build(mount);
    var optOut = new Set(CONFIG.optOut);
    var has = function (o, k) { return Object.prototype.hasOwnProperty.call(o, k); };

    // "143.000" -> "143", "322.010" -> "322.01". Daarna: eerst het exacte (sub-)PC, dan het hoofd-PC.
    function kandidaten(v) {
      var n = v.indexOf(".") === -1 ? v : v.replace(/0+$/, "").replace(/\.$/, "");
      var hoofd = n.split(".")[0];
      return n === hoofd ? [n] : [n, hoofd];
    }

    // Zoekt de meest specifieke regel voor een PC. Geeft { uitkomst, key } terug.
    function zoekRegel(v) {
      var k = kandidaten(v);
      for (var i = 0; i < k.length; i++) {
        var c = k[i];
        if (has(CONFIG.specialCases, c)) return { uitkomst: "speciale voorwaarden", key: c };
        if (optOut.has(c)) return { uitkomst: "opt-out", key: c };
        if (has(CONFIG.beperkteOptOut, c)) return { uitkomst: "gedeeltelijke opt-out", key: c };
        if (has(CONFIG.sectoraleBeperking, c)) return { uitkomst: "sectorale beperking", key: c };
      }
      return { uitkomst: "vanaf juli", key: null };
    }
    var lastTrackedPCValue = null;

    var ctaLink = '<p style="margin-top:16px;"><a href="' + CONFIG.cta.url +
      '" target="_blank" rel="noopener noreferrer"><u><strong>' + esc(CONFIG.cta.label) +
      "</strong></u></a></p>";

    function track(pcValue, uitkomst) {
      if (typeof window.dataLayer !== "undefined") {
        window.dataLayer.push({ event: "flexijob_pc_check", opzoeking_pc: pcValue, pc_uitkomst: uitkomst });
      }
    }

    function checkPC() {
      var pcValue = r.pcInput.value.trim().toLowerCase();
      var html = "";
      var uitkomst = "";

      if (!pcValue) {
        uitkomst = "geen invoer";
      } else if (!/^\d+(\.\d+)?$/.test(pcValue) && !CONFIG.specialCases.hasOwnProperty(pcValue)) {
        uitkomst = "ongeldige invoer";
      } else {
        var regel = zoekRegel(pcValue);
        uitkomst = regel.uitkomst;
        var key = regel.key;
      }

      var pc = esc(pcValue);
      var wettelijk = '<p style="font-size:.9em;">' + CONFIG.wettelijkeBeperkingenNote + "</p>";

      if (uitkomst === "speciale voorwaarden") {
        html = '<div class="' + ROOT + '-note success"><p><strong>Ja, je komt in aanmerking!</strong></p>' +
          "<p>" + CONFIG.specialCases[key] + "</p>" + wettelijk + ctaLink + "</div>";
      } else if (uitkomst === "vanaf juli") {
        html = '<div class="' + ROOT + '-note success">' +
          "<p><strong>" + esc(CONFIG.nieuwJuliHeading) + "</strong></p>" +
          "<p>" + CONFIG.nieuwJuliText.replace("{pc}", pc) + "</p>" +
          wettelijk + ctaLink + "</div>";
        r.leadTitle.innerText = CONFIG.leadForm.nietTitle;
        r.leadDesc.innerHTML = esc(CONFIG.leadForm.nietDesc);
      } else if (uitkomst === "gedeeltelijke opt-out") {
        html = '<div class="' + ROOT + '-note info">' +
          "<p><strong>" + esc(CONFIG.beperkteOptOutHeading) + "</strong></p>" +
          "<p>" + CONFIG.beperkteOptOut[key] + "</p>" +
          wettelijk + ctaLink + "</div>";
        r.leadTitle.innerText = CONFIG.leadForm.defaultTitle;
        r.leadDesc.innerHTML = esc(CONFIG.leadForm.defaultDesc);
      } else if (uitkomst === "sectorale beperking") {
        var sb = CONFIG.sectoraleBeperking[key];
        if (typeof sb === "string") sb = { text: sb };
        html = '<div class="' + ROOT + '-note info">' +
          "<p><strong>" + esc(sb.heading || CONFIG.sectoraleBeperkingHeading) + "</strong></p>" +
          "<p>" + sb.text + "</p>" +
          '<p style="font-size:.9em;">' + CONFIG.sectoraleBeperkingNote + "</p>" +
          wettelijk + ctaLink + "</div>";
        r.leadTitle.innerText = CONFIG.leadForm.defaultTitle;
        r.leadDesc.innerHTML = esc(CONFIG.leadForm.defaultDesc);
      } else if (uitkomst === "opt-out") {
        html = '<div class="' + ROOT + '-note error"><p><strong>' +
          CONFIG.optOutText.replace("{pc}", pc) + "</strong></p></div>";
      } else if (uitkomst === "ongeldige invoer") {
        html = '<div class="' + ROOT + '-note error"><p><strong>Ongeldige invoer</strong></p><p>Voer een geldig paritair comité nummer in (bv: 302, 118.03).</p></div>';
      } else if (uitkomst === "geen invoer") {
        html = '<div class="' + ROOT + '-note error"><p><strong>Geen invoer</strong></p><p>Voer een paritair comité nummer in om te controleren.</p></div>';
      }

      r.pcResult.innerHTML = html;
      r.lead.style.display = (uitkomst === "vanaf juli" || uitkomst === "gedeeltelijke opt-out" || uitkomst === "sectorale beperking") ? "block" : "none";

      if (pcValue !== lastTrackedPCValue) {
        track(pcValue, uitkomst);
        lastTrackedPCValue = pcValue;
      }
    }

    function sendToSheet() {
      var email = r.emailInput.value.trim();
      var pc = lastTrackedPCValue || r.pcInput.value.trim();

      if (!email || email.indexOf("@") === -1) {
        r.emailResult.innerHTML = '<p class="' + ROOT + '-msg-error">Gelieve een geldig e-mailadres in te vullen.</p>';
        return;
      }
      if (!CONFIG.scriptUrl || CONFIG.scriptUrl.indexOf("PLAK_HIER") !== -1) {
        r.emailResult.innerHTML = '<p style="color:red;">Configuratiefout: Script URL ontbreekt.</p>';
        return;
      }

      r.emailBtn.disabled = true;
      r.emailBtn.textContent = "Verzenden...";

      fetch(CONFIG.scriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ email: email, pc: pc })
      })
        .then(function () {
          r.emailResult.innerHTML = '<div class="' + ROOT + '-note success" style="margin-top:10px;"><strong>Bedankt!</strong> We hebben je gegevens ontvangen en houden je op de hoogte.</div>';
          r.emailInput.value = "";
          r.emailBtn.textContent = "Verzonden";
        })
        .catch(function (error) {
          if (window.console) console.error("Error:", error);
          r.emailResult.innerHTML = '<p class="' + ROOT + '-msg-error" style="color:red;">Er ging iets mis. Probeer het later opnieuw.</p>';
          r.emailBtn.disabled = false;
          r.emailBtn.textContent = CONFIG.leadForm.sendLabel;
        });
    }

    r.pcBtn.addEventListener("click", checkPC);
    r.pcInput.addEventListener("keypress", function (e) { if (e.key === "Enter") { e.preventDefault(); checkPC(); } });
    r.emailBtn.addEventListener("click", sendToSheet);
    r.emailInput.addEventListener("keypress", function (e) { if (e.key === "Enter") { e.preventDefault(); sendToSheet(); } });
  }

  function init() {
    var mount = document.getElementById(CONFIG.mountId);
    if (!mount) return;
    injectStyles();
    run(mount);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
