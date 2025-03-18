import * as dotenv from "dotenv";
import { createError } from "../error.js";
import axios from "axios";

dotenv.config();

const { HUGGINGFACE_API_KEY } = process.env;

if (!HUGGINGFACE_API_KEY) {
  console.error("HUGGINGFACE_API_KEY is not defined. Please check your .env file.");
  process.exit(1);
}

export const generateImage = async (req, res, next) => {
  try {
    const { inputs } = req.body;

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
      { inputs },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        // Ensure the response type is arraybuffer or blob depending on API output
        responseType: "arraybuffer",
      }
    );

    // Convert the response to a Buffer and then to a Base64 string
    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    const mimeType = response.headers["content-type"]; // Get the MIME type from the headers

    // Send the base64 image back in a JSON response
    res.status(200).json({ photo: `data:${mimeType};base64,${base64Image}`,message:"Image Generated Successfull" });
  } catch (error) {
    console.error("Hugging Face Error:", error.response?.data || error.message);
    next(
      createError(
        error.response?.status || 500,
        error?.response?.data?.error || error.message
      )
    );
  }
};
