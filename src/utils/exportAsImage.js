import html2canvas from "html2canvas";

export const exportAsImage = async (el, imageName, type) => {
  const canvas = await html2canvas(el);
  const image = canvas.toDataURL("image/png", 1.0);
  if (type === "download") {
    downloadImage(image, imageName);
  } else {
    shareToWhatsApp(image)
  }
}

const shareToWhatsApp = (image) => {
  let newURL = `https://api.whatsapp.com/send?text=${image}`;
  window.open(newURL, "_blank");
}

const downloadImage = (blob, fileName) => {
  const fakeLink = window.document.createElement("a");
  fakeLink.style = "display:none;";
  fakeLink.download = fileName;
  fakeLink.href = blob;
  document.body.appendChild(fakeLink);
  fakeLink.click();
  document.body.removeChild(fakeLink);

  fakeLink.remove();
}