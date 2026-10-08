const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const products = [
  { id: 1, name: 'Nova X1 Smartphone', category: 'Electronics', price: 34999, rating: 4.6, description: 'Fast AMOLED smartphone with a high-refresh display and all-day battery.', icon: '📱' },
  { id: 2, name: 'Pulse ANC Headphones', category: 'Electronics', price: 7999, rating: 4.4, description: 'Wireless over-ear headphones with active noise cancellation.', icon: '🎧' },
  { id: 3, name: 'Orbit Mechanical Keyboard', category: 'Electronics', price: 4599, rating: 4.5, description: 'Compact mechanical keyboard with hot-swappable switches.', icon: '⌨️' },
  { id: 4, name: 'Aero Smartwatch', category: 'Electronics', price: 5999, rating: 4.2, description: 'Fitness tracking, notifications, sleep insights, and a bright display.', icon: '⌚' },
  { id: 5, name: 'Volt Power Bank 20000', category: 'Electronics', price: 1799, rating: 4.3, description: 'High-capacity USB-C power bank with fast charging support.', icon: '🔋' },
  { id: 6, name: 'PixelView 27 Monitor', category: 'Electronics', price: 22999, rating: 4.7, description: '27-inch QHD monitor with accurate colors for work and creation.', icon: '🖥️' },
  { id: 7, name: 'Clean Code Companion', category: 'Books', price: 699, rating: 4.8, description: 'Practical guide to writing readable, maintainable software.', icon: '📘' },
  { id: 8, name: 'Deep Work Journal', category: 'Books', price: 499, rating: 4.5, description: 'Structured journal for focused work sessions and weekly reflection.', icon: '📓' },
  { id: 9, name: 'The Data Mindset', category: 'Books', price: 799, rating: 4.6, description: 'A beginner-friendly approach to statistics, data, and decisions.', icon: '📗' },
  { id: 10, name: 'Python Projects Handbook', category: 'Books', price: 899, rating: 4.7, description: 'Hands-on Python projects covering APIs, automation, and data.', icon: '📕' },
  { id: 11, name: 'Startup Playbook', category: 'Books', price: 599, rating: 4.3, description: 'A practical roadmap for validating ideas and building products.', icon: '📙' },
  { id: 12, name: 'Design Systems 101', category: 'Books', price: 749, rating: 4.4, description: 'Learn the fundamentals of reusable UI systems and components.', icon: '📚' },
  { id: 13, name: 'Flex Runner Pro', category: 'Fitness', price: 6499, rating: 4.5, description: 'Cushioned running shoes built for daily road workouts.', icon: '👟' },
  { id: 14, name: 'CoreFit Resistance Set', category: 'Fitness', price: 2199, rating: 4.4, description: 'Five resistance bands for home strength and mobility sessions.', icon: '🏋️' },
  { id: 15, name: 'Hydra Steel Bottle', category: 'Fitness', price: 1299, rating: 4.6, description: 'Insulated stainless-steel bottle with leak-resistant lid.', icon: '🧴' },
  { id: 16, name: 'Move Yoga Mat', category: 'Fitness', price: 1699, rating: 4.5, description: 'Non-slip, lightweight mat designed for daily yoga practice.', icon: '🧘' },
  { id: 17, name: 'Sprint Smart Scale', category: 'Fitness', price: 2399, rating: 4.2, description: 'Bluetooth smart scale with app-based body composition trends.', icon: '⚖️' },
  { id: 18, name: 'Peak Adjustable Dumbbells', category: 'Fitness', price: 8999, rating: 4.7, description: 'Space-saving adjustable dumbbells for progressive home workouts.', icon: '🏃' },
  { id: 19, name: 'Urban Everyday Jacket', category: 'Fashion', price: 2499, rating: 4.3, description: 'Versatile lightweight jacket for casual everyday wear.', icon: '🧥' },
  { id: 20, name: 'Classic Canvas Sneakers', category: 'Fashion', price: 1899, rating: 4.4, description: 'Minimal low-top sneakers designed for all-day comfort.', icon: '👞' },
  { id: 21, name: 'Luna Crossbody Bag', category: 'Fashion', price: 1599, rating: 4.5, description: 'Compact crossbody bag with organized everyday storage.', icon: '👜' },
  { id: 22, name: 'Everyday Cotton Tee', category: 'Fashion', price: 699, rating: 4.2, description: 'Soft cotton t-shirt with a clean regular fit.', icon: '👕' },
  { id: 23, name: 'Terra Overshirt', category: 'Fashion', price: 2199, rating: 4.6, description: 'Layering overshirt with a relaxed fit and durable fabric.', icon: '🧢' },
  { id: 24, name: 'Minimal Leather Wallet', category: 'Fashion', price: 999, rating: 4.5, description: 'Slim everyday wallet with dedicated card and cash slots.', icon: '👛' },
  { id: 25, name: 'Cold Brew Maker', category: 'Home', price: 1499, rating: 4.6, description: 'Simple glass cold-brew maker for smooth coffee at home.', icon: '☕' },
  { id: 26, name: 'Breeze Table Lamp', category: 'Home', price: 1299, rating: 4.3, description: 'Warm ambient desk lamp with adjustable brightness.', icon: '💡' },
  { id: 27, name: 'Oak Storage Box', category: 'Home', price: 899, rating: 4.4, description: 'Stackable storage box for keeping shelves and desks tidy.', icon: '📦' },
  { id: 28, name: 'Pure Air Mini', category: 'Home', price: 5499, rating: 4.2, description: 'Compact air purifier for bedrooms and small workspaces.', icon: '🌿' },
  { id: 29, name: 'SoftNest Cushion Set', category: 'Home', price: 1099, rating: 4.5, description: 'Set of decorative cushions with soft textured covers.', icon: '🛋️' },
  { id: 30, name: 'HeatSafe Lunch Box', category: 'Home', price: 799, rating: 4.4, description: 'Leak-resistant lunch box with separate compartments.', icon: '🍱' },
  { id: 31, name: 'City Explorer Backpack', category: 'Travel', price: 2899, rating: 4.7, description: 'Organized commuter backpack with laptop protection.', icon: '🎒' },
  { id: 32, name: 'TrailLite Travel Duffel', category: 'Travel', price: 2399, rating: 4.5, description: 'Lightweight duffel with a spacious main compartment.', icon: '🧳' },
  { id: 33, name: 'Route Ready Travel Organizer', category: 'Travel', price: 799, rating: 4.4, description: 'Keeps passports, cables, cards, and documents organized.', icon: '🗺️' },
  { id: 34, name: 'CloudRest Neck Pillow', category: 'Travel', price: 999, rating: 4.3, description: 'Memory-foam neck pillow for comfortable long journeys.', icon: '✈️' },
  { id: 35, name: 'Nomad Packing Cubes', category: 'Travel', price: 1399, rating: 4.6, description: 'Packing cube set for efficient suitcase organization.', icon: '🧳' },
  { id: 36, name: 'Compact Travel Adapter', category: 'Travel', price: 1599, rating: 4.5, description: 'Universal adapter with USB-C and USB-A charging ports.', icon: '🔌' },
  { id: 37, name: 'Focus Timer Cube', category: 'Electronics', price: 1499, rating: 4.3, description: 'Physical focus timer designed for distraction-free study blocks.', icon: '⏱️' },
  { id: 38, name: 'AI Starter Guide', category: 'Books', price: 899, rating: 4.7, description: 'Plain-English introduction to modern machine learning concepts.', icon: '🤖' },
  { id: 39, name: 'Balance Foam Roller', category: 'Fitness', price: 1199, rating: 4.5, description: 'Textured foam roller for warm-up and post-workout mobility.', icon: '🌀' },
  { id: 40, name: 'Essential Cap', category: 'Fashion', price: 599, rating: 4.1, description: 'Classic adjustable cap for everyday casual outfits.', icon: '🧢' },
  { id: 41, name: 'Desk Cable Organizer', category: 'Home', price: 399, rating: 4.4, description: 'Adhesive cable clips to keep a desk setup neat.', icon: '🔗' },
  { id: 42, name: 'Foldable Travel Bottle', category: 'Travel', price: 499, rating: 4.2, description: 'Reusable collapsible bottle made for packing light.', icon: '💧' },
  { id: 43, name: 'Ergo Wireless Mouse', category: 'Electronics', price: 1299, rating: 4.5, description: 'Comfortable wireless mouse for study, work, and everyday use.', icon: '🖱️' },
  { id: 44, name: 'Study Skills Blueprint', category: 'Books', price: 549, rating: 4.6, description: 'Practical systems for learning, revision, and exam preparation.', icon: '📝' },
  { id: 45, name: 'Recovery Massage Ball', category: 'Fitness', price: 499, rating: 4.3, description: 'Compact massage ball for targeted mobility and recovery.', icon: '⚽' },
  { id: 46, name: 'Linen Lounge Pants', category: 'Fashion', price: 1399, rating: 4.4, description: 'Relaxed-fit breathable pants for comfortable everyday wear.', icon: '👖' },
  { id: 47, name: 'Kitchen Prep Board', category: 'Home', price: 699, rating: 4.5, description: 'Durable food-prep board with a juice groove and easy cleanup.', icon: '🥣' },
  { id: 48, name: 'SunTrail Daypack', category: 'Travel', price: 1799, rating: 4.4, description: 'Light daypack for short hikes, city trips, and daily carry.', icon: '🥾' }
];

const categories = [...new Set(products.map((item) => item.category))].sort();

function parseCategories(categoryParam) {
  if (!categoryParam) return [];
  return categoryParam
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => categories.includes(item));
}

app.get('/api/categories', (_req, res) => {
  res.json({ categories });
});

app.post('/api/purchase', (req, res) => {
  const items = Array.isArray(req.body?.items) ? req.body.items : [];

  if (!items.length) {
    return res.status(400).json({ error: 'Cart is empty.' });
  }

  const lines = items.map((entry) => {
    const product = products.find((item) => item.id === Number(entry.id));
    const quantity = Math.max(Number(entry.quantity) || 0, 0);
    return product && quantity > 0 ? { product, quantity } : null;
  }).filter(Boolean);

  if (!lines.length) {
    return res.status(400).json({ error: 'No valid products found.' });
  }

  const total = lines.reduce((sum, line) => sum + (line.product.price * line.quantity), 0);
  const orderId = `LQ-${Date.now().toString().slice(-8)}`;

  return res.json({
    success: true,
    orderId,
    total,
    message: 'Purchase confirmed.'
  });
});

app.get('/api/products', (req, res) => {
  const search = String(req.query.search || '').trim().toLowerCase();
  const selectedCategories = parseCategories(String(req.query.category || ''));

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 8, 1), 24);

  const filtered = products.filter((product) => {
    const matchesSearch = !search || `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(search);
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    return matchesSearch && matchesCategory;
  });

  const total = filtered.length;
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;

  res.json({
    data: filtered.slice(start, start + limit),
    pagination: {
      page: safePage,
      limit,
      total,
      totalPages
    },
    query: {
      search,
      category: selectedCategories
    }
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Live Query Filter System running on port ${PORT}`);
});
