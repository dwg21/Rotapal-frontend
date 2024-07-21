import html2canvas from "html2canvas";

const exportToPNg = () => {
  const input = document.getElementById("rota-content");

  // Save original dimensions and styles
  const originalWidth = input.scrollWidth;
  const originalHeight = input.scrollHeight;
  const originalStyle = input.style.cssText;

  // Set the content element to the full size
  input.style.width = `${originalWidth}px`;
  input.style.height = `${originalHeight}px`;
  input.style.overflow = "visible";

  // Capture the content
  html2canvas(input, {
    width: originalWidth,
    height: originalHeight,
    scale: 2,
  }).then((canvas) => {
    // Restore the original dimensions and styles
    input.style.cssText = originalStyle;

    const imgData = canvas.toDataURL("image/png");

    // Create a link element and trigger a download
    const link = document.createElement("a");
    link.href = imgData;
    link.download = "rota.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};

export default exportToPNg;
