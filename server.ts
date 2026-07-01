import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { SERVICES_DATA } from './src/servicesData';
import { POOL_OF_BLOG_POSTS } from './src/blogData';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const isProd = process.env.NODE_ENV === 'production';

  let vite: any;
  if (!isProd) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom', // Use 'custom' so we can handle page requests and inject dynamic SEO tags
    });
    app.use(vite.middlewares);
  } else {
    // Serve static assets
    app.use(express.static(path.join(process.cwd(), 'dist'), {
      index: false, // Don't serve index.html directly, we will intercept it
    }));
  }

  // Helper to retrieve SEO metadata based on path
  function getMetadataForPath(urlPath: string) {
    // Clean up query params / trailing slashes
    const cleanPath = urlPath.split('?')[0].replace(/\/$/, '') || '/';

    // Default metadata
    let title = 'Infovisory: Corporate & Legal Services | CA & Legal Advisors in Jaipur';
    let description = 'Infovisory provides premium company registration, GST filing, trademark registration, tax compliance, and corporate legal advisory services in Jaipur and across India.';
    let url = 'https://infovisory.com' + cleanPath;
    let image = 'https://infovisory.com/homepage-photo.jpg';

    // 1. Homepage
    if (cleanPath === '/' || cleanPath === '') {
      return { title, description, url, image };
    }

    // 2. Service Pages: /service/:serviceId
    if (cleanPath.startsWith('/service/')) {
      const serviceId = cleanPath.split('/')[2];
      const service = SERVICES_DATA.flatMap(c => c.subServices).find(s => s.id === serviceId);
      if (service) {
        title = `${service.name} Registration & Advisory`;
        description = `${service.description} Get professional CA-guided company formation, state filing, and end-to-end compliance advisory with Infovisory.`;
      } else {
        title = 'Expert Corporate Service | Infovisory';
        description = 'Explore expert financial, legal, and corporate compliance services with Infovisory.';
      }
    }
    // 3. Blog Post Pages: /blog/:slug
    else if (cleanPath.startsWith('/blog/')) {
      const slug = cleanPath.split('/')[2];
      if (slug) {
        const post = POOL_OF_BLOG_POSTS.find(p => p.slug === slug);
        if (post) {
          title = post.title;
          description = post.excerpt;
          if (post.image) {
            image = post.image;
          }
        } else {
          title = 'Business Insight Guide | Infovisory';
          description = 'Read detailed compliance guides, corporate filings, and regulatory updates from Infovisory.';
        }
      } else {
        // Blog Main Page: /blog
        title = 'Business Insights & Corporate Blog | Infovisory';
        description = 'Read expert corporate tax guides, company registration checklists, GST updates, and legal compliance insights.';
      }
    }
    // 4. Category Pages: /category/:categoryId
    else if (cleanPath.startsWith('/category/')) {
      const categoryId = cleanPath.split('/')[2];
      const category = SERVICES_DATA.find(c => c.id === categoryId);
      if (category) {
        title = `${category.name} Services | Infovisory`;
        description = `Explore our comprehensive suite of ${category.name} services. Infovisory offers expert CA, registration, and tax compliance solutions.`;
      } else {
        title = 'Corporate Services | Infovisory';
        description = 'Infovisory corporate and legal compliance categories.';
      }
    }
    // 5. Contact Page: /contact
    else if (cleanPath === '/contact') {
      title = 'Contact & Free Consultation | Jaipur CAs & Legal Advisors';
      description = 'Get in touch with Infovisory. Schedule a free advisory consultation with senior CAs and lawyers.';
    }
    // 6. Policy Pages
    else if (cleanPath === '/privacy-policy') {
      title = 'Privacy Policy | Infovisory';
      description = 'Privacy Policy details for Infovisory India Private Limited. Learn more about our statutory commitments and client data safety.';
    } else if (cleanPath === '/terms-of-service') {
      title = 'Terms of Service | Infovisory';
      description = 'Terms of Service details for Infovisory India Private Limited. Learn more about our statutory commitments and client data safety.';
    } else if (cleanPath === '/refund-policy') {
      title = 'Refund Policy | Infovisory';
      description = 'Refund Policy details for Infovisory India Private Limited. Learn more about our statutory commitments and client data safety.';
    } else if (cleanPath === '/disclaimer') {
      title = 'Disclaimer | Infovisory';
      description = 'Disclaimer details for Infovisory India Private Limited. Learn more about our statutory commitments and client data safety.';
    }

    return { title, description, url, image };
  }

  // Intercept all page requests and inject SEO meta tags before serving HTML
  app.get('*', async (req, res, next) => {
    // Skip static assets or API routes
    if (req.path.includes('.') || req.path.startsWith('/api/') || req.path.startsWith('/@')) {
      return next();
    }

    try {
      const { title, description, url, image } = getMetadataForPath(req.path);

      const htmlPath = isProd 
        ? path.join(process.cwd(), 'dist', 'index.html')
        : path.join(process.cwd(), 'index.html');

      if (!fs.existsSync(htmlPath)) {
        return res.status(404).send('index.html template not found');
      }

      let html = fs.readFileSync(htmlPath, 'utf-8');

      // Do replacements
      html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
      
      html = html.replace(
        /<meta name="description" content="[\s\S]*?"\s*\/?>/i,
        `<meta name="description" content="${description}" />`
      );

      html = html.replace(
        /<meta property="og:title" content="[\s\S]*?"\s*\/?>/i,
        `<meta property="og:title" content="${title}" />`
      );

      html = html.replace(
        /<meta property="og:description" content="[\s\S]*?"\s*\/?>/i,
        `<meta property="og:description" content="${description}" />`
      );

      html = html.replace(
        /<meta property="og:url" content="[\s\S]*?"\s*\/?>/i,
        `<meta property="og:url" content="${url}" />`
      );

      html = html.replace(
        /<meta property="og:image" content="[\s\S]*?"\s*\/?>/i,
        `<meta property="og:image" content="${image}" />`
      );

      html = html.replace(
        /<meta property="twitter:title" content="[\s\S]*?"\s*\/?>/i,
        `<meta property="twitter:title" content="${title}" />`
      );

      html = html.replace(
        /<meta property="twitter:description" content="[\s\S]*?"\s*\/?>/i,
        `<meta property="twitter:description" content="${description}" />`
      );

      html = html.replace(
        /<meta property="twitter:url" content="[\s\S]*?"\s*\/?>/i,
        ` <meta property="twitter:url" content="${url}" />`
      );

      html = html.replace(
        /<meta property="twitter:image" content="[\s\S]*?"\s*\/?>/i,
        `<meta property="twitter:image" content="${image}" />`
      );

      html = html.replace(
        /<link rel="canonical" href="[\s\S]*?"/i,
        `<link rel="canonical" href="${url}"`
      );

      // In development, apply Vite's HTML transforms (e.g. inject dev scripts)
      if (!isProd && vite) {
        html = await vite.transformIndexHtml(req.originalUrl, html);
      }

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e: any) {
      if (!isProd && vite) {
        vite.ssrFixStacktrace(e);
      }
      console.error('[ERROR] SSR Server failed:', e);
      res.status(500).end(e.stack || 'Internal Server Error');
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${isProd ? 'production' : 'development'} on port ${PORT}`);
  });
}

startServer();
