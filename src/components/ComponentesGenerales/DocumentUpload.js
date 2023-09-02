import React, { useState } from 'react';

function DocumentUpload() {
  const [base64String, setBase64String] = useState(null);
  const [fileTypeMime, setFileTypeMime] = useState('');
  const [fileToDownload, setFileToDownload] = useState(null);

  const getFileExtension = (filename) => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        // Obtener la cadena codificada en Base64
        const encodedString = reader.result.split(',')[1];
        setBase64String(encodedString);

        // Detectar el tipo MIME del archivo por extensión
        const fileExtension = getFileExtension(file.name);
        let detectedType = '';

        switch (fileExtension.toLowerCase()) {
          case 'pdf':
            detectedType = 'application/pdf';
            break;
          case 'doc':
          case 'docx':
            detectedType = 'application/msword';
            break;
          case 'jpg':
          case 'jpeg':
            detectedType = 'image/jpeg';
            break;
          case 'png':
            detectedType = 'image/png';
            break;
          default:
            break;
        }

        setFileTypeMime(detectedType);
      };

      reader.onerror = (error) => {
        console.error('Error al leer el archivo:', error);
      };
    }
  };

  const handleUploadFile = () => {
    if (base64String) {
      // Crear un Blob a partir de la cadena codificada en Base64
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: fileTypeMime });

      // Crear un objeto URL para el Blob
      const url = URL.createObjectURL(blob);

      // Asignar el objeto URL al estado
      setFileToDownload(url);
    }
  };

  return (
    <div>
      <h1>Cargar y Descargar Documento</h1>
      <input type="file" accept=".pdf, .doc, .docx, .jpg, .jpeg, .png" onChange={handleFileChange} />
      {base64String && (
        <div>
          <h2>Documento Codificado en Base64:</h2>
          <textarea rows="10" value={base64String} readOnly />
          <button onClick={handleUploadFile}>Cargar Documento</button>
        </div>
      )}
      {fileToDownload && (
        <div>
          <h2>Descargar Documento</h2>
          <a href={fileToDownload} download={`documento.${getFileExtension(fileTypeMime)}`}>
            Descargar Documento
          </a>
        </div>
      )}
    </div>
  );
}

export default DocumentUpload;
