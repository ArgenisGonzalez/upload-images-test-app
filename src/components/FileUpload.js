import axios from "axios";
import { useState } from "react";

function FileUpload() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadUrls, setUploadUrls] = useState([]);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const getSignedUrls = async (files) => {
    const payload = {
      userId: 1, // Usa un ID de prueba válido o reemplaza dinámicamente
      files: Array.from(files).map((file) => ({
        fileName: file.name,
        type: "test-frontend-video", // o 'video', según necesites
      })),
    };

    console.log("payload  ", files[0]);
    try {
      const response = await axios.post(
        "http://localhost:8888/api/v1/files/batch-signed-urls", // usa la ruta correcta
        payload
      );
      return response.data.map((item) => item.uploadUrl);
    } catch (error) {
      console.error("Error generating signed URLs:", error);
      throw new Error("Failed to get signed URLs from backend");
    }
  };

  const uploadFiles = async () => {
    try {
      setUploading(true);

      const signedUrls = await getSignedUrls(files);
      setUploadUrls(signedUrls);

      const uploadPromises = Array.from(files).map((file, index) => {
        console.log("Uploading:", {
          name: file.name,
          type: file.type,
          signedUrl: signedUrls[index],
        });
        return axios.put(signedUrls[index], file, {
          headers: { "Content-Type": file.type },
        });
      });

      await Promise.all(uploadPromises);
      alert("Files uploaded successfully!");
    } catch (error) {
      console.error("Error uploading files:", error.message);
      alert("Error uploading files");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1>Upload Multiple Files</h1>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={uploadFiles} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Files"}
      </button>

      {uploadUrls.length > 0 && (
        <div>
          <h3>Uploaded Files URLs:</h3>
          <ul>
            {uploadUrls.map((url, index) => (
              <li key={index}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
