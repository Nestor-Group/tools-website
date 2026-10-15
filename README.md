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
<script src="https://nestor-group.github.io/tools-website/flexi-job.js" defer></script>
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

Deze repo staat via **GitHub Pages** online op `https://nestor-group.github.io/tools-website/<bestand>`.
Push (of merge) je naar `main`, dan staat de nieuwe versie binnen ongeveer een minuut online.
Browsers bewaren de bestanden maximaal 10 minuten. Je hoeft niets in het CMS aan te passen.

**Deze repo is publiek.** Zet er dus nooit coëfficiënten, prijzen, wachtwoorden of API-sleutels in,
ook niet tijdelijk: wat ooit gecommit is, blijft in de geschiedenis staan.

## Lokaal testen

Open een `test-*.html`-bestand in je browser (of via een lokale server). Dat bestand
gebruikt het lokale tool-bestand; op je site wordt dat de jsDelivr-URL.
