# JsPdfGen

PdfDocGen ist eine in Typescript geschriebene, template-basierte high level Library zur Generierung von PDF-Dokumenten im Front- oder Backend.
Die Generierung erfolgt dabei durch eine Definition von Templates, in denen die Struktur der Dokumente beschrieben wird (Papierformat, Ausrichtung der Seiten, Seitenränder, bedruckbare Bereiche, Grafiken, Rahmen, Logos, Kopf- und Fußzeilen, etc.).

Die Templates können dabei mehrere Sektionen beinhalten, welche verschiedene Seitenformate für einzelne Seiten des PDFs definieren. So kann z.B. bei Briefen jeweils die erste Seite des Briefs anders formatiert werden, als alle folgenden Seiten.

Für die Generierung des Dokuments muss das Template mit Inhalten befüllt werden. Diese werden abstrakt in Form von Absätzen, Sätzen, einzelnen Satzteilen und Grafiken definiert.
Die Positionierung und Ausrichtung der Texte und Grafiken innerhalb des PDF-Dokuments, so wie Zeilen- und Seitenumbrüche werden durch die Bibliothek selbst ermittelt. Als Nutzer der Bibliothek muss man also Zeilenabstände und Größen einzelner Zeilen oder Texte nicht selbst berechnen.

Für weitere Infos besuchen sie die [Projekt-Homepage](https://github.com/chrlembeck/jspdfgen).  