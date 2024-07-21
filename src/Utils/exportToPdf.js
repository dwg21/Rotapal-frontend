import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const exportToPDF = () => {
  const input = document.getElementById("rota-content");

  // Get the full width and height of the content
  const originalWidth = input.scrollWidth;
  const originalHeight = input.scrollHeight;

  html2canvas(input, {
    width: originalWidth,
    height: originalHeight,
    windowWidth: originalWidth,
    windowHeight: originalHeight,
    scrollX: 0,
    scrollY: 0,
  }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgWidth = 210; // PDF width in mm
    const pageHeight = 295; // PDF height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("rota.pdf");
  });
};

export default exportToPDF;
