import html2canvas from "html2canvas";
import axios from "axios";

export const exportAsImage = async (el, imageName, type) => {
  const canvas = await html2canvas(el);
  const image = canvas.toDataURL("image/png", 1.0);
  console.log(image)
  if (type === "download") {
    downloadImage(image, imageName);
  } else {
    shareToWhatsApp(image)
    // sendImage(image)
  }
}

// const sendImage = (image) => {
//   const form = new FormData();
//   form.append("image", image);
//   // console.log(image);
//   axios.post("https://api.imgbb.com/1/upload", form, {
//     params: {
//       "expiration": "600",
//       "key": "4873a0c3820bc15fada0019a48acc336"
//     },
//   }).then((res) => console.log(res))
// }

const shareToWhatsApp = (blob, fileName) => {
  const fakeLink = window.document.createElement("a");
  fakeLink.style = "display:none;";
  fakeLink.download = fileName;
  fakeLink.href = blob;

  let newURL = `https://api.whatsapp.com/send?text=${fakeLink}`;
  window.open(newURL, "_blank");
}

const downloadImage = (blob, fileName) => {
  const fakeLink = window.document.createElement("a");
  fakeLink.style = "display:none;";
  fakeLink.download = fileName;
  fakeLink.href = blob;
  console.log(fakeLink);
  document.body.appendChild(fakeLink);
  fakeLink.click();
  document.body.removeChild(fakeLink);

  fakeLink.remove();
}