const express = require('express');
const Deal = require('../models/Deal');
const Category = require('../models/Category');

const router = express.Router();

router.get('/', async (req, res) => {
  res.header('Content-Type', 'application/xml');

  // Base domain for dynamic sitemap URLs (can be overridden via environment variables)
  const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

  const staticPages = [
    `${BASE_URL}/`,
    `${BASE_URL}/deals`,
    `${BASE_URL}/about`,
    `${BASE_URL}/faq`,
    `${BASE_URL}/contact`
  ];

  try {
    const [deals, categories] = await Promise.all([
      Deal.find({ isActive: true }).select('_id updatedAt'),
      Category.find().select('name updatedAt')
    ]);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // 1. Add static pages to sitemap
    staticPages.forEach(url => {
      xml += `  <url>\n    <loc>${url}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    // 2. Add dynamic active categories to sitemap
    categories.forEach(cat => {
      const lastModDate = cat.updatedAt 
        ? cat.updatedAt.toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0];
      xml += `  <url>\n    <loc>${BASE_URL}/deals?category=${encodeURIComponent(cat.name)}</loc>\n    <lastmod>${lastModDate}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    });

    // 3. Add dynamic active deal pages to sitemap
    deals.forEach(deal => {
      const lastModDate = deal.updatedAt 
        ? deal.updatedAt.toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0];
      xml += `  <url>\n    <loc>${BASE_URL}/deals/${deal._id}</loc>\n    <lastmod>${lastModDate}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;
    res.send(xml);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send("Error generating sitemap");
  }
});

module.exports = router;
