import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "./config"

export async function uploadPropertyImages(images: File[]): Promise<string[]> {
  const uploadPromises = images.map(async (image, index) => {
    // Create unique filename with timestamp
    const timestamp = Date.now()
    const filename = `properties/${timestamp}_${index}_${image.name}`
    const storageRef = ref(storage, filename)

    try {
      const snapshot = await uploadBytes(storageRef, image)
      const downloadURL = await getDownloadURL(snapshot.ref)
      return downloadURL
    } catch (error) {
      console.error(`Error uploading image ${index}:`, error)
      throw error
    }
  })

  return Promise.all(uploadPromises)
}

export async function uploadProfileImage(userId: string, image: File): Promise<string> {
  const filename = `profiles/${userId}_${Date.now()}_${image.name}`
  const storageRef = ref(storage, filename)

  try {
    const snapshot = await uploadBytes(storageRef, image)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error("Error uploading profile image:", error)
    throw error
  }
}
