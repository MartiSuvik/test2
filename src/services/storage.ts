import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  UploadTask,
} from 'firebase/storage';
import { storage } from '../config/firebase';

interface UploadResult {
  url: string;
  metadata: {
    name: string;
    timeCreated: string;
    size: number;
  };
}

export function uploadImage(
  file: File,
  userId: string,
  onProgress: (progress: number) => void
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `uploads/${userId}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            url,
            metadata: {
              name: file.name,
              timeCreated: new Date().toISOString(),
              size: file.size,
            },
          });
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}