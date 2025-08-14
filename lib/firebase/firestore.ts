import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore"
import { db } from "./config"
import type { Property, PropertyAlert, Message } from "../types"

// Properties
export async function addProperty(propertyData: Omit<Property, "id">): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "properties"), {
      ...propertyData,
      datePosted: Timestamp.now(),
      lastUpdated: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding property:", error)
    throw error
  }
}

export async function getProperties(): Promise<Property[]> {
  try {
    const querySnapshot = await getDocs(query(collection(db, "properties"), orderBy("datePosted", "desc")))

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      datePosted: doc.data().datePosted?.toDate?.()?.toISOString() || new Date().toISOString(),
      lastUpdated: doc.data().lastUpdated?.toDate?.()?.toISOString() || new Date().toISOString(),
    })) as Property[]
  } catch (error) {
    console.error("Error getting properties:", error)
    return []
  }
}

export async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const docSnap = await getDoc(doc(db, "properties", id))

    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        ...data,
        datePosted: data.datePosted?.toDate?.()?.toISOString() || new Date().toISOString(),
        lastUpdated: data.lastUpdated?.toDate?.()?.toISOString() || new Date().toISOString(),
      } as Property
    }

    return null
  } catch (error) {
    console.error("Error getting property:", error)
    return null
  }
}

export async function updateProperty(id: string, updates: Partial<Property>): Promise<void> {
  try {
    await updateDoc(doc(db, "properties", id), {
      ...updates,
      lastUpdated: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error updating property:", error)
    throw error
  }
}

export async function deleteProperty(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "properties", id))
  } catch (error) {
    console.error("Error deleting property:", error)
    throw error
  }
}

// Saved Properties
export async function addSavedProperty(userId: string, propertyId: string): Promise<void> {
  try {
    await addDoc(collection(db, "savedProperties"), {
      userId,
      propertyId,
      createdAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error saving property:", error)
    throw error
  }
}

export async function removeSavedProperty(userId: string, propertyId: string): Promise<void> {
  try {
    const q = query(
      collection(db, "savedProperties"),
      where("userId", "==", userId),
      where("propertyId", "==", propertyId),
    )

    const querySnapshot = await getDocs(q)
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref)
    })
  } catch (error) {
    console.error("Error removing saved property:", error)
    throw error
  }
}

export async function getSavedProperties(userId: string): Promise<string[]> {
  try {
    const q = query(collection(db, "savedProperties"), where("userId", "==", userId))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => doc.data().propertyId)
  } catch (error) {
    console.error("Error getting saved properties:", error)
    return []
  }
}

// Property Alerts
export async function addPropertyAlert(userId: string, alert: Omit<PropertyAlert, "id" | "userId">): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "propertyAlerts"), {
      ...alert,
      userId,
      createdAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding property alert:", error)
    throw error
  }
}

export async function getPropertyAlerts(userId: string): Promise<PropertyAlert[]> {
  try {
    const q = query(collection(db, "propertyAlerts"), where("userId", "==", userId), orderBy("createdAt", "desc"))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    })) as PropertyAlert[]
  } catch (error) {
    console.error("Error getting property alerts:", error)
    return []
  }
}

// Messages
export async function sendMessage(messageData: Omit<Message, "id" | "timestamp">): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "messages"), {
      ...messageData,
      timestamp: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error sending message:", error)
    throw error
  }
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  try {
    const q = query(
      collection(db, "messages"),
      where("conversationId", "==", conversationId),
      orderBy("timestamp", "asc"),
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || new Date().toISOString(),
    })) as Message[]
  } catch (error) {
    console.error("Error getting messages:", error)
    return []
  }
}
