import axios from "axios";
import { useEffect, useState } from "react";

function ImageAsBase64() {
  const [base64Image, setBase64Image] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndConvertImage = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8888/api/v1/files/33"
        );
        const imageUrl = response.data.url;

        // Usamos fetch en lugar de axios para poder usar response.blob()
        const imageResponse = await fetch(imageUrl, { mode: "cors" });

        if (!imageResponse.ok) throw new Error("Imagen no descargada");

        const blob = await imageResponse.blob();

        const reader = new FileReader();
        reader.onloadend = () => {
          setBase64Image(reader.result);
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error("Error cargando o convirtiendo la imagen:", err);
        setError("No se pudo convertir la imagen a base64.");
      }
    };

    fetchAndConvertImage();
  }, []);

  return (
    <div>
      <h2>Imagen como base64</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {base64Image ? (
        <img
          src={base64Image}
          alt="Imagen convertida"
          style={{ maxWidth: "100%", height: "auto", border: "1px solid #ccc" }}
        />
      ) : (
        <p>Cargando imagen y convirtiendo a base64...</p>
      )}
    </div>
  );
}

export default ImageAsBase64;
