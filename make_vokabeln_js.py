"""Macht aus vokabeln.json die Datei vokabeln.js.

Warum? Browser erlauben beim Doppelklick auf index.html kein Nachladen von
JSON-Dateien. Eine .js-Datei per <script> geht dagegen immer.

Aufruf (im Ordner):  python make_vokabeln_js.py
Immer ausführen, wenn sich vokabeln.json geändert hat.
"""
import json, pathlib

ordner = pathlib.Path(__file__).parent
daten = json.loads((ordner / "vokabeln.json").read_text(encoding="utf-8"))
js = "// Automatisch erzeugt aus vokabeln.json – nicht von Hand ändern.\n"
js += "const VOKABELN = " + json.dumps(daten, ensure_ascii=False) + ";\n"
(ordner / "vokabeln.js").write_text(js, encoding="utf-8")
print(len(daten), "Wörter nach vokabeln.js geschrieben")
