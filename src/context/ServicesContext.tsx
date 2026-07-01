import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { HelpCircle } from 'lucide-react';
import {
  SubService,
  CategoryGroup,
  ServiceCategory,
  ICON_MAP,
  getIconComponent,
  DEFAULT_SERVICES_DATA
} from '../utils/serviceHelpers';

// Re-export types so we don't break existing imports throughout the app
export type { SubService, CategoryGroup, ServiceCategory };
export { getIconComponent, ICON_MAP };

interface ServicesContextProps {
  services: ServiceCategory[];
  loading: boolean;
  saveCategory: (category: ServiceCategory) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  seedDefaultData: () => Promise<void>;
}

const ServicesContext = createContext<ServicesContextProps | undefined>(undefined);

export const ServicesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<ServiceCategory[]>(() =>
    DEFAULT_SERVICES_DATA.map(cat => ({
      ...cat,
      icon: ICON_MAP[cat.iconName || 'Rocket'] || HelpCircle
    }))
  );
  const [loading, setLoading] = useState(false);

  // Firestore Sync & Auto-Seeding
  useEffect(() => {
    const path = 'services';
    const unsub = onSnapshot(collection(db, path), async (snapshot) => {
      try {
        if (snapshot.empty) {
          console.log('[DEBUG] ServicesContext: Collection is empty. Fallback to static catalog.');
          const isOwner = localStorage.getItem('bizlaunch_is_owner') === 'true';
          if (isOwner) {
            console.log('[DEBUG] Admin logged in, starting background auto-seed...');
            await seedDefaultData();
          }
          setLoading(false);
        } else {
          const list: ServiceCategory[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data() as ServiceCategory;
            list.push({
              ...data,
              icon: ICON_MAP[data.iconName || 'Rocket'] || HelpCircle
            });
          });
          // Sort by order field
          list.sort((a, b) => (a.order || 0) - (b.order || 0));
          setServices(list);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error listing/syncing services: ', err);
        setLoading(false);
      }
    }, (error) => {
      console.warn('Firestore subscription restricted or offline. Keeping standard static catalog: ', error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const seedDefaultData = async () => {
    const path = 'services';
    try {
      console.log('[DEBUG] Seeding services...');
      const batch = writeBatch(db);
      for (const item of DEFAULT_SERVICES_DATA) {
        const docRef = doc(db, path, item.id);
        batch.set(docRef, item);
      }
      await batch.commit();
      console.log('[DEBUG] Services seeded successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const saveCategory = async (category: ServiceCategory) => {
    const path = `services/${category.id}`;
    try {
      // Remove non-serializable React component 'icon' before persisting to Firestore
      const { icon, ...serializableCategory } = category;
      await setDoc(doc(db, 'services', category.id), serializableCategory);
      console.log(`[DEBUG] Saved category successfully: ${category.id}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    const path = `services/${categoryId}`;
    try {
      await deleteDoc(doc(db, 'services', categoryId));
      console.log(`[DEBUG] Deleted category: ${categoryId}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return (
    <ServicesContext.Provider value={{ services, loading, saveCategory, deleteCategory, seedDefaultData }}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
};
