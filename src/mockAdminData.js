// Mock database with persistence layer using localStorage

const INITIAL_VENDORS = [
  {
    id: 'v1',
    name: 'Sasha Chen',
    handle: '@sashachen',
    specialty: 'Animation Guru',
    avatar: 'https://i.pravatar.cc/150?u=sasha',
    verified: true,
    email: 'sasha@inkpenex.com',
    phone: '+91 98765 43210',
    joinDate: '2026-01-15',
    pendingVerification: false,
    docsUploaded: []
  },
  {
    id: 'v2',
    name: 'Alex Rivera',
    handle: '@alexrivera',
    specialty: 'Modern UI Expert',
    avatar: 'https://i.pravatar.cc/150?u=alex',
    verified: true,
    email: 'alex.ui@inkpenex.com',
    phone: '+91 99887 76655',
    joinDate: '2026-02-10',
    pendingVerification: false,
    docsUploaded: []
  },
  {
    id: 'v3',
    name: 'Liam Foster',
    handle: '@liamfoster',
    specialty: 'Back-end Pro',
    avatar: 'https://i.pravatar.cc/150?u=liam',
    verified: false,
    email: 'liam.dev@inkpenex.com',
    phone: '+91 88776 65544',
    joinDate: '2026-05-12',
    pendingVerification: true,
    docsUploaded: ['Govt ID.pdf', 'Developer Cert.pdf']
  },
  {
    id: 'v4',
    name: 'CreativeWave',
    handle: '@creativewave',
    specialty: 'Mobile App Builder',
    avatar: 'https://i.pravatar.cc/150?u=creativewave',
    verified: false,
    email: 'hello@creativewave.dev',
    phone: '+91 77665 54433',
    joinDate: '2026-05-14',
    pendingVerification: true,
    docsUploaded: ['Business Registration.pdf']
  },
  {
    id: 'v5',
    name: 'David Design',
    handle: '@david_design',
    specialty: 'Illustration & Graphics',
    avatar: 'https://i.pravatar.cc/150?u=david',
    verified: true,
    email: 'david@brandhub.com',
    phone: '+91 66554 43322',
    joinDate: '2026-03-01',
    pendingVerification: false,
    docsUploaded: []
  }
];

const INITIAL_PRODUCTS = [
  {
    id: 'prod_1',
    name: 'Restaurant App Bundle',
    shortDesc: 'Complete ordering system with dashboard',
    description: 'A professional restaurant mobile application ecosystem with full administrative management, custom themes, real-time push notifications, and online payment gateways. Perfect for food tech startups and chains.',
    categoryId: 'cat_1',
    price: 24999,
    originalPrice: 34999,
    discount: 29,
    rating: 4.8,
    reviewCount: 234,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop',
    platform: 'Android + iOS',
    sellerName: 'TechStack Studios',
    tag: 'BESTSELLER (₹)',
    trending: true,
    featured: true,
    status: 'Approved',
    dateAdded: '2026-02-15'
  },
  {
    id: 'prod_2',
    name: 'E-commerce Website Template',
    shortDesc: 'Modern shopping site like Amazon',
    description: 'Fully responsive e-commerce web platform built with React, Node, and MongoDB. Includes a powerful checkout wizard, clean user profiles, custom order invoices, and multi-currency support.',
    categoryId: 'cat_2',
    price: 18999,
    originalPrice: 24999,
    discount: 24,
    rating: 4.9,
    reviewCount: 156,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
    platform: 'React + Node',
    sellerName: 'WebPro Labs',
    tag: 'TOP RATED (₹)',
    trending: true,
    featured: true,
    status: 'Approved',
    dateAdded: '2026-03-10'
  },
  {
    id: 'prod_3',
    name: 'Premium Logo Collection',
    shortDesc: '500+ Vector logos for startups',
    description: 'Massive library of high-quality branding assets. Fully editable SVG and Figma vector files spanning 15 major business categories. Perfect for branding agencies and solo creators.',
    categoryId: 'cat_3',
    price: 4999,
    originalPrice: 8999,
    discount: 44,
    rating: 4.5,
    reviewCount: 412,
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=600&auto=format&fit=crop',
    platform: 'Figma / AI',
    sellerName: 'Design Hub',
    tag: 'SAVE ₹4K',
    trending: true,
    featured: false,
    status: 'Approved',
    dateAdded: '2026-04-05'
  },
  {
    id: 'prod_4',
    name: 'AI Customer Bot',
    shortDesc: 'Automated support for your business',
    description: 'Intelligent AI chatbot using GPT-4 API to resolve customer inquiries, handle order tracking, and schedule custom meetings. Setup takes under 5 minutes and works on any custom webpage.',
    categoryId: 'cat_4',
    price: 12000,
    originalPrice: 15000,
    discount: 20,
    rating: 4.7,
    reviewCount: 98,
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?q=80&w=600&auto=format&fit=crop',
    platform: 'Cloud API',
    sellerName: 'BotLogic',
    tag: 'AI POWERED',
    trending: false,
    featured: true,
    status: 'Approved',
    dateAdded: '2026-05-01'
  },
  {
    id: 'prod_5',
    name: 'Fitness Tracking App UI Kit',
    shortDesc: 'Gorgeous UI layouts for gym and fitness',
    description: 'Submitted by a rising creator. Contains 45+ unique screen templates in dark and light modes, covering tracking, training dashboard, analytics, and messaging interfaces.',
    categoryId: 'cat_3',
    price: 3499,
    originalPrice: 5999,
    discount: 41,
    rating: 0,
    reviewCount: 0,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400&auto=format&fit=crop',
    platform: 'Figma',
    sellerName: 'Liam Foster',
    tag: 'PENDING REVIEW',
    trending: false,
    featured: false,
    status: 'Pending',
    dateAdded: '2026-05-16'
  },
  {
    id: 'prod_6',
    name: 'Cryptocurrency Exchange Portal',
    shortDesc: 'Real-time crypto dashboard app',
    description: 'Complete web application template mapping real-time tickers, order books, historical charting with TradingView, and secure dummy wallet balances.',
    categoryId: 'cat_2',
    price: 32000,
    originalPrice: 45000,
    discount: 28,
    rating: 0,
    reviewCount: 0,
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=400&auto=format&fit=crop',
    platform: 'Vite + React',
    sellerName: 'CreativeWave',
    tag: 'PENDING REVIEW',
    trending: false,
    featured: false,
    status: 'Pending',
    dateAdded: '2026-05-17'
  }
];

const INITIAL_ORDERS = [
  {
    id: 'ORD-84920',
    customerName: 'Jacob Miller',
    customerEmail: 'jacob@example.com',
    productName: 'Restaurant App Bundle',
    productPrice: 24999,
    productImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop',
    date: '2026-05-16',
    status: 'Delivered',
    paymentMethod: 'UPI / PhonePe',
    downloadLink: 'https://inkpenex-downloads.com/file/restaurant-app-v1'
  },
  {
    id: 'ORD-72304',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@outlook.com',
    productName: 'Premium Logo Collection',
    productPrice: 4999,
    productImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=600&auto=format&fit=crop',
    date: '2026-05-17',
    status: 'Paid',
    paymentMethod: 'Credit Card',
    downloadLink: 'https://inkpenex-downloads.com/file/logo-pack-figma'
  },
  {
    id: 'ORD-60912',
    customerName: 'Hariprasath G',
    customerEmail: 'hari@projects.io',
    productName: 'AI Customer Bot',
    productPrice: 12000,
    productImage: 'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?q=80&w=600&auto=format&fit=crop',
    date: '2026-05-17',
    status: 'Processing',
    paymentMethod: 'Net Banking',
    downloadLink: 'https://inkpenex-downloads.com/file/ai-bot-script'
  }
];

const INITIAL_BOOKINGS = [
  {
    id: 'BKG-78401',
    brandName: 'FitExpress Gyms',
    clientName: 'Jacob Miller',
    clientEmail: 'jacob@example.com',
    clientPhone: '+91 90038 78401',
    productName: 'Fitness Tracking App UI Kit',
    price: 3499,
    status: 'In Development',
    needPlaystore: true,
    needAppstore: true,
    needPaymentGateway: true,
    primaryColor: '#4CAF50',
    secondaryColor: '#000000',
    paymentType: 'initial', // 50% advance
    paymentStatus: 'Advance Paid (₹1,749)',
    logoUri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=100&auto=format&fit=crop',
    referenceUrl: 'https://dribbble.com/shots/fitness-expert',
    referenceImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400&auto=format&fit=crop',
    additionalDocs: ['LayoutRequirements.docx'],
    date: '2026-05-15'
  },
  {
    id: 'BKG-60592',
    brandName: 'Siam Food Express',
    clientName: 'Aria Thompson',
    clientEmail: 'aria.thom@gmail.com',
    clientPhone: '+91 80561 60592',
    productName: 'Restaurant App Bundle',
    price: 24999,
    status: 'Received',
    needPlaystore: true,
    needAppstore: false,
    needPaymentGateway: true,
    primaryColor: '#F44336',
    secondaryColor: '#FFFFFF',
    paymentType: 'full',
    paymentStatus: 'Fully Paid (₹24,999)',
    logoUri: null,
    referenceUrl: '',
    referenceImage: null,
    additionalDocs: [],
    date: '2026-05-17'
  }
];

const INITIAL_CHATS = [
  {
    id: 'chat_1',
    userName: 'Jacob Miller',
    userAvatar: 'https://i.pravatar.cc/100?u=jacob',
    userRole: 'Customer',
    unread: true,
    messages: [
      { sender: 'user', text: 'Hi, I recently configured my custom booking BKG-78401. How long will the initial review take?', timestamp: '5:30 PM' },
      { sender: 'admin', text: 'Hello Jacob! Our engineers are reviewing your brand assets and requirements. We will update your development stage within 24 hours!', timestamp: '5:35 PM' },
      { sender: 'user', text: 'Great, thanks! I have also uploaded an additional layout document to the booking panel.', timestamp: '6:12 PM' }
    ]
  },
  {
    id: 'chat_2',
    userName: 'Liam Foster',
    userAvatar: 'https://i.pravatar.cc/100?u=liam',
    userRole: 'Creator/Vendor',
    unread: false,
    messages: [
      { sender: 'user', text: 'Hey support team, I uploaded my new Fitness Tracking App UI Kit. Could you take a look?', timestamp: 'Yesterday' },
      { sender: 'admin', text: 'Hi Liam! We see your submission in our Product Queue. It looks fantastic. We are completing the visual and file validation today.', timestamp: 'Yesterday' }
    ]
  }
];

const INITIAL_BANNERS = [
  {
    id: 'banner_1',
    title: 'Ready-Made Apps',
    subtitle: 'Build your dream business today',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1200&auto=format&fit=crop',
    tag: 'OFFER'
  },
  {
    id: 'banner_2',
    title: 'Professional Websites',
    subtitle: 'Premium templates for agencies',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
    tag: 'NEW'
  },
  {
    id: 'banner_3',
    title: 'Custom Logic & Design',
    subtitle: 'Hire developers for your backend',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop',
    tag: 'SERVICE'
  }
];

const INITIAL_USERS = [
  {
    id: 'usr_1',
    name: 'Jacob Miller',
    email: 'jacob@example.com',
    phone: '+91 90038 78401',
    city: 'Chennai',
    status: 'Active',
    joinDate: '2026-03-04'
  },
  {
    id: 'usr_2',
    name: 'Sarah Jenkins',
    email: 'sarah.j@outlook.com',
    phone: '+91 91122 33445',
    city: 'Bangalore',
    status: 'Active',
    joinDate: '2026-04-12'
  },
  {
    id: 'usr_3',
    name: 'Robert Downey',
    email: 'robert@fitexpress.com',
    phone: '+91 81223 44556',
    city: 'Mumbai',
    status: 'Active',
    joinDate: '2026-05-15'
  },
  {
    id: 'usr_4',
    name: 'John Malicious',
    email: 'john.mal@spambot.org',
    phone: '+91 70001 00010',
    city: 'Kolkata',
    status: 'Suspended',
    joinDate: '2026-05-10'
  }
];

export const getStoredData = (key, initialData) => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  } catch (e) {
    return initialData;
  }
};

export const saveStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to persist state:', e);
  }
};

export const getVendors = () => getStoredData('inkpen_vendors', INITIAL_VENDORS);
export const getProducts = () => getStoredData('inkpen_products', INITIAL_PRODUCTS);
export const getOrders = () => getStoredData('inkpen_orders', INITIAL_ORDERS);
export const getBookings = () => getStoredData('inkpen_bookings', INITIAL_BOOKINGS);
export const getChats = () => getStoredData('inkpen_chats', INITIAL_CHATS);
export const getBanners = () => getStoredData('inkpen_banners', INITIAL_BANNERS);
export const getUsers = () => getStoredData('inkpen_users', INITIAL_USERS);
