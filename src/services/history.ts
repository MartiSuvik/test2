import { db, storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import type { VideoHistoryItem } from '../types/history';

export async function saveVideoToHistory(
  userId: string,
  videoUrl: string,
  config: VideoHistoryItem['config']
): Promise<void> {
  try {
    // Download and store video in Firebase Storage
    const response = await fetch(videoUrl);
    const blob = await response.blob();
    
    const videoRef = ref(storage, `users/${userId}/videos/${Date.now()}.mp4`);
    await uploadBytes(videoRef, blob);
    const permanentUrl = await getDownloadURL(videoRef);

    // Save metadata to Firestore
    await addDoc(collection(db, 'videoHistory'), {
      userId,
      videoUrl: permanentUrl,
      thumbnailUrl: '', // TODO: Generate thumbnail
      createdAt: new Date().toISOString(),
      config
    });
  } catch (error) {
    console.error('Failed to save video:', error);
    throw error;
  }
}

export async function getUserHistory(userId: string): Promise<VideoHistoryItem[]> {
  const q = query(
    collection(db, 'videoHistory'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as VideoHistoryItem[];
}
