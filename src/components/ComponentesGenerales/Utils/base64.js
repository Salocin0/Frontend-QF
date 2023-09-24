function fileToBase64(file, callback) {
  const reader = new FileReader();

  reader.onload = function (event) {
    callback(event.target.result);
  };

  reader.readAsDataURL(file);
}

function base64ToFile(base64String, filename, mimeType) {
  if (!base64String || typeof base64String !== 'string' || !base64String.startsWith('data:image/')) {
    throw new Error('Invalid base64String');
  }

  const dataParts = base64String.split(',');
  const byteCharacters = atob(dataParts[1]);
  const byteArrays = [];

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays.push(byteCharacters.charCodeAt(i));
  }

  const byteArray = new Uint8Array(byteArrays);

  if (!mimeType) {
    mimeType = dataParts[0].split(':')[1].split(';')[0];
  }

  return new File([byteArray], filename, { type: mimeType });
}

export { base64ToFile, fileToBase64 };

