# Static Assets Directory (Public)

Place any static files (such as images, logos, or icons) that you want to be served directly by the web server in this directory.

## How to use your own Homepage Photo:

1. Save your custom homepage photo as **`homepage-photo.jpg`** (or any name you prefer) and place it directly inside this `public` folder.
2. Open `src/components/Hero.tsx` and find the `<img>` tag on line 108:
   ```tsx
   <img 
     src="https://images.unsplash.com/photo-1560250097-0b93528c311a..." 
     alt="Business Professional" 
     ...
   />
   ```
3. Update the `src` attribute of the `<img>` tag to point to your local image in the public folder:
   ```tsx
   <img 
     src="/homepage-photo.jpg" 
     alt="Business Professional" 
     className="w-full h-full object-cover relative z-10 shadow-2xl"
     loading="eager"
   />
   ```
4. Start your development server or build your app—the local image will now load correctly on both your localhost and your live deployed domain!
