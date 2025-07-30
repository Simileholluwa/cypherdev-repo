import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll 
} from "firebase/storage";
import { storage } from "./firebase";

export const storageService = {
  // Upload image and return download URL
  async uploadImage(file: File, path: string): Promise<string> {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  },

  // Upload series thumbnail
  async uploadSeriesThumbnail(file: File, seriesId: string): Promise<string> {
    const path = `series/${seriesId}/thumbnail_${Date.now()}.${file.name.split('.').pop()}`;
    return await this.uploadImage(file, path);
  },

  // Upload video banner
  async uploadVideoBanner(file: File, videoId: string): Promise<string> {
    const path = `videos/${videoId}/banner_${Date.now()}.${file.name.split('.').pop()}`;
    return await this.uploadImage(file, path);
  },

  // Delete image by URL
  async deleteImage(url: string): Promise<void> {
    try {
      const imageRef = ref(storage, url);
      await deleteObject(imageRef);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  },

  // Get all images in a folder
  async getImagesInFolder(folderPath: string): Promise<string[]> {
    const folderRef = ref(storage, folderPath);
    const result = await listAll(folderRef);
    const urls = await Promise.all(
      result.items.map(itemRef => getDownloadURL(itemRef))
    );
    return urls;
  }
};