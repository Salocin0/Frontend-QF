function fileToBase64(file, callback) {
  const reader = new FileReader();

  reader.onload = function (event) {
    callback(event.target.result);
  };

  reader.readAsDataURL(file);
}

function base64ToFile(base64String, filename, mimeType) {
  const byteCharacters = atob(base64String.split(",")[1]);
  const byteArrays = [];

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays.push(byteCharacters.charCodeAt(i));
  }

  const byteArray = new Uint8Array(byteArrays);

  const blob = new Blob([byteArray], { type: mimeType });

  return new File([blob], filename, { type: mimeType });
}

export { fileToBase64, base64ToFile };
