import { 
    collection, 
    doc,
    query, 
    where, 
    orderBy, 
    limit, 
    startAfter,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp
  } from 'firebase/firestore';
  import { db } from '../../config/firebase';
  import type { HistoryEntry, HistoryQueryOptions, PaginatedHistory } from '../../types/history';
  import type { VideoConfig } from '../../types/video';
  
  const HISTORY_COLLECTION = 'generationHistory';
  const DEFAULT_PAGE_SIZE = 10;
  
  export async function addGenerationToHistory(
    userId: string,
    imageUrl: string,
    videoUrl: string,
    config: VideoConfig
  ): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, HISTORY_COLLECTION), {
        userId,
        imageUrl,
        videoUrl,
        config,
        createdAt: serverTimestamp(),
        status: 'completed'
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Failed to add generation to history:', error);
      throw new Error('Failed to save generation history');
    }
  }
  
  export async function getUserGenerationHistory(
    userId: string,
    options: HistoryQueryOptions = {}
  ): Promise<PaginatedHistory> {
    try {
      const pageSize = options.limit || DEFAULT_PAGE_SIZE;
      
      let historyQuery = query(
        collection(db, HISTORY_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(pageSize + 1) // Get one extra to check if there are more
      );
  
      if (options.startAfter) {
        historyQuery = query(historyQuery, startAfter(options.startAfter));
      }
  
      const snapshot = await getDocs(historyQuery);
      const entries: HistoryEntry[] = [];
      
      snapshot.docs.slice(0, pageSize).forEach(doc => {
        entries.push({
          id: doc.id,
          ...doc.data()
        } as HistoryEntry);
      });
  
      return {
        entries,
        lastVisible: snapshot.docs[pageSize - 1] || null,
        hasMore: snapshot.docs.length > pageSize
      };
    } catch (error) {
      console.error('Failed to fetch generation history:', error);
      throw new Error('Failed to load generation history');
    }
  }
  
  export async function deleteHistoryEntry(
    userId: string,
    entryId: string
  ): Promise<void> {
    try {
      const docRef = doc(db, HISTORY_COLLECTION, entryId);
      const snapshot = await getDocs(query(
        collection(db, HISTORY_COLLECTION),
        where('userId', '==', userId),
        where('__name__', '==', entryId)
      ));
  
      if (snapshot.empty) {
        throw new Error('Entry not found or unauthorized');
      }
  
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Failed to delete history entry:', error);
      throw new Error('Failed to delete history entry');
    }
  }
  
  export async function updateHistoryEntry(
    userId: string,
    entryId: string,
    newData: Partial<Omit<HistoryEntry, 'id' | 'userId' | 'createdAt'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, HISTORY_COLLECTION, entryId);
      const snapshot = await getDocs(query(
        collection(db, HISTORY_COLLECTION),
        where('userId', '==', userId),
        where('__name__', '==', entryId)
      ));
  
      if (snapshot.empty) {
        throw new Error('Entry not found or unauthorized');
      }
  
      await updateDoc(docRef, newData);
    } catch (error) {
      console.error('Failed to update history entry:', error);
      throw new Error('Failed to update history entry');
    }
  }