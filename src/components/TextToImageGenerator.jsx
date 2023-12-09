import React, { useState } from 'react';
import axios from 'axios';
import { SaveAlt as SaveAltIcon, Share as ShareIcon } from '@mui/icons-material';
import './TextToImageGenerator.css';

const TextToImageGenerator = () => {
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  const query = async (data) => {
    try {
      setLoading(true);

      const response = await axios.post(
        'https://api-inference.huggingface.co/models/playgroundai/playground-v2-1024px-aesthetic',
        data,
        {
          headers: {
            Authorization: 'Bearer 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',
          },
          responseType: 'blob',
        }
      );

      if (response.status !== 200) {
        throw new Error('Failed to generate image');
      }

      setLoading(false);
      setGeneratedImage(URL.createObjectURL(response.data));
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleTextChange = (event) => {
    setTextInput(event.target.value);
  };

  const handleGenerateImage = async () => {
    try {
      if (textInput) {
        await query({ inputs: textInput });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'generated_image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = () => {
    if (navigator.share && generatedImage) {
      navigator.share({
        title: 'Generated Image',
        text: 'Check out this image generated from text!',
        url: generatedImage,
      })
        .then(() => console.log('Successfully shared'))
        .catch((error) => console.error('Error sharing:', error));
    }
  };

  return (
    <div className="container">
      <label className="label">
        Enter text:
        <input
          type="text"
          value={textInput}
          onChange={handleTextChange}
          className="input"
        />
      </label>
      <button onClick={handleGenerateImage} className="button">
        Generate Image
      </button>

      {loading && (
        <p className="loading">
          <span>Loading...</span>
          <span className="spinner"></span>
        </p>
      )}

      {generatedImage && (
        <div className="generatedImageContainer">
          <p>Generated Image:</p>
          <img
            src={generatedImage}
            alt="Generated"
            className="generatedImage"
          />
          <div className="actions">
            <button onClick={handleDownload} className="action-button">
              <SaveAltIcon />
              Download
            </button>
            <button onClick={handleShare} className="action-button">
              <ShareIcon />
              Share
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextToImageGenerator;
