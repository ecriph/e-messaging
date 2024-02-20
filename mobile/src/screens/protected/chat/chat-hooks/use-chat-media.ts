import React, { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';

const PRESET = 'rtntxdjf';
const CLOUDNAME = 'ecriph';
const API_KEY = '966764459966664';
const FOLDER = 'chat';

type MediaProps = {
  onSucess: (value: string) => void;
  onLoading: (value: boolean) => void;
};

export const useChatMedia = ({ onSucess, onLoading }: MediaProps) => {
  const handleMedia = async (media: string) => {
    let result = await DocumentPicker.getDocumentAsync({
      type: `${media}/*`,
      copyToCacheDirectory: false,
    });

    if (!result.canceled) {
      const url = result.assets[0]?.uri;
      const mediaType = result.assets[0]?.mimeType;
      console.log(mediaType);
      console.log(url);
      uploadToCloudinary(url, mediaType);
    }
  };

  const uploadToCloudinary = async (
    uri: string | undefined,
    media: string | undefined
  ) => {
    try {
      onLoading(true);
      const formData = new FormData();
      formData.append('file', {
        uri,
        name: 'file',
        type: `${media}`,
      });
      formData.append('api_key', API_KEY);
      formData.append('upload_preset', PRESET);
      formData.append('folder', FOLDER);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDNAME}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      onSucess(data.secure_url);
      console.log('Upload result:', data);
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      onLoading(false);
    }
  };

  return { handleMedia };
};
