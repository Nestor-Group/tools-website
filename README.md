# Nestor Tools

Herbruikbare interactieve tools (vraag-en-antwoord). Eén bronbestand per tool,
overal ingesloten met een klein snippet. Eén keer aanpassen = overal bijgewerkt.

## Tools

| Bestand | Tool | Mount-div |
|---|---|---|
| `flexi-job.js` | Flexi-Job check | `<div id="flexi-job-tool">` |
| `inkomsten-limiet.js` | Hoeveel mag je bijverdienen? | `<div id="inkomsten-limiet-tool">` |
| `flexi-pc-checker.js` | PC-checker + lead-formulier | `<div id="flexi-checker-container-leadgen">` |
| `werkgeverskost.js` | Wat kost een flexi-jobber jou? (aanvraag prijs) | `<div id="werkgeverskost-tool">` |
| `vacature-doorsturen.js` | Waarom Nestor + stuur je vacature door | `<div id="vacature-doorsturen-tool">` |
| `nudge-data-*.json` | Namenlijsten voor nudges (geen tool, worden door een ander script opgehaald) | – |

> - `flexi-pc-checker.js` stuurt e-mailleads naar een Google Apps Script (`scriptUrl` in CONFIG).
> - `werkgeverskost.js` en `vacature-doorsturen.js` sturen leads naar een HubSpot-formulier (`hubspot` in CONFIG).
>
> Dat zijn publieke endpoints: geen geheim, maar wel zichtbaar in de repo.

## Insluiten op een pagina (HubSpot of elke andere site)

Plak de mount-div en het script waar de tool moet verschijnen, bijvoorbeeld:

```html
<div id="flexi-job-tool"></div>
<script src="https://nestor-group.github.io/tools/flexi-job.js" defer></script>
```

Voor de andere tools vervang je de mount-div en de bestandsnaam volgens de tabel.

- Staat de mount-div niet op de pagina, dan doet het script niets.
- De CSS zit in het script en is afgeschermd met een eigen prefix, dus het botst niet
  met de rest van je site.

## Inhoud aanpassen

Open het tool-bestand en pas alleen het **`CONFIG`-blok** bovenaan aan
(vragen, keuzes, resultaatteksten, de "zoek"-link en kleuren). De logica eronder
hoef je niet aan te raken.

## Een aanpassing live zetten

Deze repo is **privé**. Bij elke push (of merge) naar `main` zet de Action **Publiceer tools**
enkel de bestanden uit [`publish-list.txt`](publish-list.txt) in de publieke repo
[`Nestor-Group/tools`](https://github.com/Nestor-Group/tools), die via GitHub Pages online staat op
`https://nestor-group.github.io/tools/<bestand>`.

- Binnen ongeveer een minuut staat de nieuwe versie online; browsers bewaren ze maximaal 10 minuten.
- De publieke repo krijgt telkens één nieuwe commit, zonder geschiedenis.
- **Wat in een tool-bestand staat, is publiek** (bezoekers downloaden het in hun browser).
  Zet er dus nooit coëfficiënten, wachtwoorden of API-sleutels in.
- Een nieuw bestand publiek maken? Voeg het toe aan `publish-list.txt`.

De Action gebruikt de secret `TOOLS_PUBLISH_TOKEN`: een fine-grained token dat enkel `Contents: read & write` heeft op `Nestor-Group/tools`.
Het token vervalt na een jaar; maak dan een nieuw aan en vervang de secret.

## Lokaal testen

Open een `test-*.html`-bestand in je browser (of via een lokale server). Dat bestand
gebruikt het lokale tool-bestand; op je site wordt dat de jsDelivr-URL.
