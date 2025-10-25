import {jsPDF} from 'jspdf';
import * as fontkit from 'fontkit';
import {FontSpec} from 'pdfdocgen';

export class JsPdfTest {

  main() {
    console.log("This is a placeholder for JsPdfTest.");
    var doc = new jsPDF({
      orientation: 'portrait',
      format: 'A4',
      compress: false,
      unit: 'mm',
      putOnlyUsedFonts: true
    });

    const font = fontkit.openSync('../pdfdocgen/fonts/libre-baskerville/LibreBaskerville-Regular.ttf');

    this.checkText(doc, 'ÂyÜ| Hello World!', 20, 20, 12, FontSpec.LIBRE_BASKERVILLE);

    doc.setFont("courier", "normal");
    doc.text("This is courier normal.", 20, 30);

    doc.setFont("times", "italic");
    doc.text("This is times italic.", 20, 40);

    doc.setFont("helvetica", "bold");
    doc.text("This is helvetica bold.", 20, 50);

    doc.setFont("courier", "bolditalic");
    doc.text("This is courier bolditalic.", 20, 60);

    doc.setFont("times", "normal");
    doc.text("This is centred text.", 105, 80, {
      align: "center",
    }, null);
    doc.text("And a little bit more underneath it.", 105, 90, {
      align: "center",
    }, null);
    doc.text("This is right aligned text", 190, 100, {
      align: "right",
    }, null);
    doc.text("And some more", 190, 110, {
      align: "right"
    }, null);
    doc.text("Back to left", 20, 120);


    doc.text("10 degrees rotated", 20, 140, {
      angle: 10
    });
    doc.text("10 degrees rotated", 20, 140, {
      angle: 0
    });
    doc.text("-10 degrees rotated", 20, 160, {
      angle: -10
    });
    doc.text("-10 degrees rotated", 20, 160, {
      angle: 0
    });

    doc.text("lorem ipsum bla izfodfi iosi elwuh fhjiof liusdf szwa Dsuufwglorem ipsum bla izfodfi iosi elwuh fhjiof liusdf szwa Dsuufwglorem ipsum bla izfodfi iosi elwuh fhjiof liusdf szwa Dsuufwg", 20, 180, {
      align: "justify",
      maxWidth: 170
    })

    doc.addPage('A4', 'landscape');


    this.checkText(doc, 'LibreBaskerville ÂyÜ| Hello World!', 20, 20, 12, FontSpec.LIBRE_BASKERVILLE);
    this.checkText(doc, 'LibreBaskerville ÂyÜ| Hello World!', 20, 30, 12, FontSpec.LIBRE_BASKERVILLE_ITALIC);
    this.checkText(doc, 'LibreBaskerville ÂyÜ| Hello World!', 20, 40, 12, FontSpec.LIBRE_BASKERVILLE_BOLD);
    this.checkText(doc, 'LibreBaskerville ÂyÜ| Hello World!', 20, 50, 12, FontSpec.LIBRE_BASKERVILLE_BOLD_ITALIC);
    this.checkText(doc, 'Roboto ÂyÜ| Hello World!', 20, 60, 12, FontSpec.ROBOTO);
    this.checkText(doc, 'Roboto ÂyÜ| Hello World!', 20, 70, 12, FontSpec.ROBOTO_ITALIC);
    this.checkText(doc, 'Roboto ÂyÜ| Hello World!', 20, 80, 12, FontSpec.ROBOTO_BOLD);
    this.checkText(doc, 'Roboto ÂyÜ| Hello World!', 20, 90, 12, FontSpec.ROBOTO_BOLD_ITALIC);
    this.checkText(doc, 'JetBrainsMono ÂyÜ| Hello World!', 20, 100, 12, FontSpec.JETBRAINS_MONO);
    this.checkText(doc, 'JetBrainsMono ÂyÜ| Hello World!', 20, 110, 12, FontSpec.JETBRAINS_MONO_ITALIC);
    this.checkText(doc, 'JetBrainsMono ÂyÜ| Hello World!', 20, 120, 12, FontSpec.JETBRAINS_MONO_BOLD);
    this.checkText(doc, 'JetBrainsMono ÂyÜ| Hello World!', 20, 130, 12, FontSpec.JETBRAINS_MONO_BOLD_ITALIC);


    doc.context2d.save(); // Zustand Speichern
    doc.context2d.fillStyle = '#f00000';
    doc.context2d.strokeStyle = '#000000';
    doc.context2d.lineWidth = 1;
    doc.context2d.rect(80, 10, 50, 50);
    doc.context2d.fill();
    doc.context2d.stroke();
    doc.context2d.clip(); // Clip-Rect festlegen (letzte gemalte Figur)
    doc.context2d.arc(100, 60, 35, 0, 2*Math.PI, false);
    doc.context2d.fill();
    doc.context2d.stroke();
    doc.context2d.restore(); // Zustand zurücksetzen
    doc.context2d.beginPath();

    doc.context2d.fillStyle = '#ff00ff80';
    doc.context2d.arc(130, 60, 35, 0, 2*Math.PI, false);
    doc.context2d.fill();
    doc.context2d.stroke();



    doc.save("jspdf.pdf");

    console.log(doc.internal.scaleFactor);


  }

  checkText(pdf: jsPDF, text: string, x: number, y: number, fontSize: number, font: FontSpec) {
    const unitsPerEm = font.getFontkitFont().unitsPerEm;
    const ascent = font.getFontkitFont().ascent * fontSize / unitsPerEm / pdf.internal.scaleFactor;
    const descent = font.getFontkitFont().descent * fontSize / unitsPerEm / pdf.internal.scaleFactor;
    const xHeight = font.getFontkitFont().xHeight * fontSize / unitsPerEm / pdf.internal.scaleFactor;
    const capHeight = font.getFontkitFont().capHeight * fontSize / unitsPerEm / pdf.internal.scaleFactor;
    font.setFont(pdf, fontSize);

    const width = pdf.getTextWidth(text)
    pdf.setLineWidth(0.1);
    pdf.setDrawColor('#808080');
    pdf.line(x, y, x + width, y);
    pdf.line(x, y - descent, x, y - ascent);
    pdf.line(x + width, y - descent, x + width, y - ascent);


    pdf.setDrawColor('#90c090');
    pdf.line(x, y - descent, x + width, y - descent);

    pdf.setDrawColor('#d040a0');
    pdf.line(x, y - ascent, x + width, y - ascent);

    pdf.setDrawColor('#5040c0');
    pdf.line(x, y - capHeight, x + width, y - capHeight);

    pdf.setDrawColor('#9090d0');
    pdf.line(x, y - xHeight, x + width, y - xHeight);

    pdf.text(text, x, y);
  }


}

new JsPdfTest().main();
