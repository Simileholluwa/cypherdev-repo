import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from "firebase/firestore";
import { db } from "./firebase";
import { type Series, type Video, type Feedback } from "@shared/schema";

// Collections
const SERIES_COLLECTION = "series";
const VIDEOS_COLLECTION = "videos";
const FEEDBACK_COLLECTION = "feedback";

// Series operations
export const seriesService = {
  async getAll(): Promise<Series[]> {
    const querySnapshot = await getDocs(collection(db, SERIES_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Series[];
  },

  async getById(id: string): Promise<Series | null> {
    const docRef = doc(db, SERIES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Series;
    }
    return null;
  },

  async create(seriesData: Omit<Series, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, SERIES_COLLECTION), {
      ...seriesData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<Series>): Promise<void> {
    const docRef = doc(db, SERIES_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, SERIES_COLLECTION, id);
    await deleteDoc(docRef);
  }
};

// Videos operations
export const videosService = {
  async getAll(): Promise<Video[]> {
    const querySnapshot = await getDocs(collection(db, VIDEOS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Video[];
  },

  async getById(id: string): Promise<Video | null> {
    const docRef = doc(db, VIDEOS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Video;
    }
    return null;
  },

  async getBySeriesId(seriesId: string): Promise<Video[]> {
    const q = query(
      collection(db, VIDEOS_COLLECTION),
      where("seriesId", "==", seriesId),
      orderBy("createdAt", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Video[];
  },

  async create(videoData: Omit<Video, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, VIDEOS_COLLECTION), {
      ...videoData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<Video>): Promise<void> {
    const docRef = doc(db, VIDEOS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, VIDEOS_COLLECTION, id);
    await deleteDoc(docRef);
  }
};

// Feedback operations
export const feedbackService = {
  async getByVideoId(videoId: string): Promise<Feedback[]> {
    const q = query(
      collection(db, FEEDBACK_COLLECTION),
      where("videoId", "==", videoId),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate()
    })) as Feedback[];
  },

  async create(feedbackData: Omit<Feedback, 'id' | 'timestamp'>): Promise<string> {
    const docRef = await addDoc(collection(db, FEEDBACK_COLLECTION), {
      ...feedbackData,
      timestamp: Timestamp.now()
    });
    return docRef.id;
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, FEEDBACK_COLLECTION, id);
    await deleteDoc(docRef);
  }
};