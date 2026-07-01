import { doc, getDoc, setDoc, getDocs, collection } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from './firebase';

export interface PricingPackage {
  name: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

export interface PricingOverride {
  id: string; // The service ID (e.g. 'pvt-ltd')
  packages: PricingPackage[];
  updatedAt: string;
}

/**
 * Fetches pricing override for a specific service ID
 */
export async function getPricingOverride(serviceId: string): Promise<PricingPackage[] | null> {
  const docPath = `pricing_overrides/${serviceId}`;
  try {
    const docRef = doc(db, 'pricing_overrides', serviceId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return (data.packages as PricingPackage[]) || null;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, docPath);
    return null;
  }
}

/**
 * Saves pricing override for a specific service ID
 */
export async function savePricingOverride(serviceId: string, packages: PricingPackage[]): Promise<void> {
  const docPath = `pricing_overrides/${serviceId}`;
  try {
    const docRef = doc(db, 'pricing_overrides', serviceId);
    await setDoc(docRef, {
      id: serviceId,
      packages,
      updatedAt: new Date().toISOString()
    });
    console.log(`[DEBUG] pricingService: Saved pricing override for service ${serviceId}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

/**
 * Fetches ALL pricing overrides in one call (for management dashboard)
 */
export async function getAllPricingOverrides(): Promise<Record<string, PricingPackage[]>> {
  const collectionPath = 'pricing_overrides';
  try {
    const querySnapshot = await getDocs(collection(db, 'pricing_overrides'));
    const overrides: Record<string, PricingPackage[]> = {};
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.packages) {
        overrides[doc.id] = data.packages as PricingPackage[];
      }
    });
    return overrides;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, collectionPath);
    return {};
  }
}
