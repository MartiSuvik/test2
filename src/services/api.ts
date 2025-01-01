import axios from 'axios';
import { ConversionStatus, UploadResponse } from '../types';

const RUNWAY_API_KEY = import.meta.env.VITE_RUNWAY_API_KEY;
const RUNWAY_API_URL = 'https://api.runwayml.com/v1';

const api = axios.create({
  baseURL: RUNWAY_API_URL,
  headers: {
    'Authorization': `Bearer ${RUNWAY_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const uploadImage = async (imageFile: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await api.post('/image-to-video', formData);
  return response.data;
};

export const checkStatus = async (id: string): Promise<ConversionStatus> => {
  const response = await api.get(`/image-to-video/${id}`);
  return response.data;
};