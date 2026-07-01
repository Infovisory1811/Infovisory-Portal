import { doc, getDoc, setDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from './firebase';
import { POOL_OF_BLOG_POSTS, BlogPost } from '../blogData';

/**
 * Fetches all blog posts from Firestore. 
 * If no blogs exist in the database, it automatically seeds the database with POOL_OF_BLOG_POSTS.
 */
export async function getBlogs(): Promise<BlogPost[]> {
  const collectionPath = 'blogs';
  try {
    const querySnapshot = await getDocs(collection(db, 'blogs'));
    
    if (querySnapshot.empty) {
      console.log('[DEBUG] blogService: Blogs collection is empty. Auto-seeding default blog posts...');
      const seedPromises = POOL_OF_BLOG_POSTS.map(async (post) => {
        const docRef = doc(db, 'blogs', post.slug);
        const postWithTimestamp = {
          ...post,
          createdAt: new Date().toISOString()
        };
        await setDoc(docRef, postWithTimestamp);
        return postWithTimestamp;
      });
      const seeded = await Promise.all(seedPromises);
      return seeded;
    }

    const posts: BlogPost[] = [];
    querySnapshot.forEach((doc) => {
      posts.push(doc.data() as BlogPost);
    });

    // Sort by date or slug to keep consistent
    return posts.sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime; // Newest first
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, collectionPath);
    // Return hardcoded pool as fallback to avoid crashing UI
    return POOL_OF_BLOG_POSTS;
  }
}

/**
 * Fetches a single blog post by its slug document ID dynamically.
 */
export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const docPath = `blogs/${slug}`;
  try {
    const docRef = doc(db, 'blogs', slug);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as BlogPost;
    }
    // Fallback search in hardcoded pool
    return POOL_OF_BLOG_POSTS.find(p => p.slug === slug) || null;
  } catch (error) {
    console.warn(`[DEBUG] blogService: error or document misses, checking fallback in local memory: ${error}`);
    return POOL_OF_BLOG_POSTS.find(p => p.slug === slug) || null;
  }
}

/**
 * Saves a blog post (create or update). Uses slug as the document ID.
 */
export async function saveBlog(post: BlogPost): Promise<void> {
  const docPath = `blogs/${post.slug}`;
  try {
    const docRef = doc(db, 'blogs', post.slug);
    const postToSave = {
      ...post,
      createdAt: post.createdAt || new Date().toISOString()
    };
    await setDoc(docRef, postToSave);
    console.log(`[DEBUG] blogService: Saved blog post successfully at ${post.slug}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
    throw error;
  }
}

/**
 * Deletes a blog post by slug.
 */
export async function deleteBlog(slug: string): Promise<void> {
  const docPath = `blogs/${slug}`;
  try {
    const docRef = doc(db, 'blogs', slug);
    await deleteDoc(docRef);
    console.log(`[DEBUG] blogService: Deleted blog post ${slug}`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
    throw error;
  }
}
