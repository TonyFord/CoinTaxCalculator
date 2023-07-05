# CoinTaxCalculator
Käufe und Verkäufe von Token / Digitalwährungen können in einem in *kauf* und *verkauf* separierten csv-File aufgelistet werden und mittels dieses Kalkulators wird daraus eine Gewinn-/Verlust sowie Steuerberechnung erstellt. 

## Installation

Lade dieses Repository als ZIP-Datei herunter ( oder nutze git clone ) und lege es in einen Ordner deiner Wahl. ( Du kannst die index.html auch umbenennen )

## Anwendung 

Öffne die index.html in deinem Browser, wähle die Datenfiles für *kauf* und *verkauf* und drücke anschließend den **Load** Button.  

## Datenfiles

Ein Beispiel findest du im Ordner *data*.

Die Bezeichnung des Files sollte folgendes Format erfüllen: 

    {symbol}_{tokenbezeichnung}_{kauf|verkauf}.csv

Das csv-File selbst muss wiefolgt strukturiert sein:

    {dd.mm.yyyy},{betrag},{stückpreis},{kommentar}

**Nachkommastellen bei Stückpreis und Betrag stets mit Punkt trennen!**

Statt Excel oder LibreOffice Calc empfehle ich einen Texteditor zu verwenden, welcher csv - Formate erkennt, z.B. Kate ( https://kate-editor.org/de/ )
