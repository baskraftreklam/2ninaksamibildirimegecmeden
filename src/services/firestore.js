// Mock firestore service for now
export const fetchPortfolios = async (filters = {}, showOnlyPublished = true) => {
  // Simulate API delay - reduced for better UX
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return mock data with proper structure
  const allPortfolios = [
    {
      id: '1',
      title: 'Atakum Denizevleri Satılık Daire',
      city: 'Samsun',
      district: 'Atakum',
      neighborhood: 'Denizevleri',
      price: 2500000,
      listingStatus: 'Satılık',
      propertyType: 'Daire',
      squareMeters: 120,
      roomCount: '3+1',
      buildingAge: 5,
      floor: 3,
      parking: true,
      images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop'],
      cover: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop',
      isPublished: true,
      userId: 'user-1',
      createdAt: '2024-01-15T00:00:00.000Z',
      updatedAt: '2024-01-15T00:00:00.000Z'
    },
    {
      id: '2',
      title: 'İlkadım Merkez Kiralık Daire',
      city: 'Samsun',
      district: 'İlkadım',
      neighborhood: 'Merkez',
      price: 8500,
      listingStatus: 'Kiralık',
      propertyType: 'Daire',
      squareMeters: 85,
      roomCount: '2+1',
      buildingAge: 8,
      floor: 2,
      parking: false,
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop'],
      cover: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop',
      isPublished: true,
      userId: 'user-2',
      createdAt: '2024-01-14T00:00:00.000Z',
      updatedAt: '2024-01-14T00:00:00.000Z'
    },
    {
      id: '3',
      title: 'Canik Villa Satılık',
      city: 'Samsun',
      district: 'Canik',
      neighborhood: 'Villa Mahallesi',
      price: 4500000,
      listingStatus: 'Satılık',
      propertyType: 'Villa',
      squareMeters: 200,
      roomCount: '4+2',
      buildingAge: 3,
      floor: 2,
      parking: true,
      images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop'],
      cover: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop',
      isPublished: false,
      userId: 'user-3',
      createdAt: '2024-01-13T00:00:00.000Z',
      updatedAt: '2024-01-13T00:00:00.000Z'
    },
    {
      id: '4',
      title: 'Tekkeköy İş Yeri Kiralık',
      city: 'Samsun',
      district: 'Tekkeköy',
      neighborhood: 'Ticaret Merkezi',
      price: 12000,
      listingStatus: 'Kiralık',
      propertyType: 'İş Yeri',
      squareMeters: 150,
      roomCount: null,
      buildingAge: 10,
      floor: 1,
      parking: true,
      images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop'],
      cover: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop',
      isPublished: true,
      userId: 'user-4',
      createdAt: '2024-01-12T00:00:00.000Z',
      updatedAt: '2024-01-12T00:00:00.000Z'
    },
    {
      id: '5',
      title: 'Bafra Sahil Daire Satılık',
      city: 'Samsun',
      district: 'Bafra',
      neighborhood: 'Sahil Mahallesi',
      price: 1800000,
      listingStatus: 'Satılık',
      propertyType: 'Daire',
      squareMeters: 95,
      roomCount: '2+1',
      buildingAge: 2,
      floor: 5,
      parking: true,
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1600&auto=format&fit=crop'],
      cover: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1600&auto=format&fit=crop',
      isPublished: true,
      userId: 'user-5',
      createdAt: '2024-01-11T00:00:00.000Z',
      updatedAt: '2024-01-11T00:00:00.000Z'
    }
  ];

  // Filter portfolios based on showOnlyPublished parameter
  let filteredPortfolios = showOnlyPublished 
    ? allPortfolios.filter(p => p.isPublished)
    : allPortfolios;

  // Apply additional filters
  if (filters.city) {
    filteredPortfolios = filteredPortfolios.filter(p => p.city === filters.city);
  }
  if (filters.district) {
    filteredPortfolios = filteredPortfolios.filter(p => p.district === filters.district);
  }
  if (filters.propertyType) {
    filteredPortfolios = filteredPortfolios.filter(p => p.propertyType === filters.propertyType);
  }
  if (filters.listingStatus) {
    filteredPortfolios = filteredPortfolios.filter(p => p.listingStatus === filters.listingStatus);
  }
  if (filters.minPrice) {
    filteredPortfolios = filteredPortfolios.filter(p => p.price >= filters.minPrice);
  }
  if (filters.maxPrice) {
    filteredPortfolios = filteredPortfolios.filter(p => p.price <= filters.maxPrice);
  }

  return filteredPortfolios;
};

// Fetch user's own portfolios
export const fetchUserPortfolios = async (userId) => {
  // Simulate API delay - reduced for better UX
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return mock data for user's portfolios
  return [
    {
      id: '1',
      title: 'Atakum Denizevleri Satılık Daire',
      city: 'Samsun',
      district: 'Atakum',
      neighborhood: 'Denizevleri',
      price: 2500000,
      listingStatus: 'Satılık',
      propertyType: 'Daire',
      squareMeters: 120,
      roomCount: '3+1',
      buildingAge: 5,
      floor: 3,
      parking: true,
      images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop'],
      cover: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop',
      isPublished: true,
      userId: userId,
      createdAt: '2024-01-15T00:00:00.000Z',
      updatedAt: '2024-01-15T00:00:00.000Z'
    },
    {
      id: '2',
      title: 'İlkadım Merkez Kiralık Daire',
      city: 'Samsun',
      district: 'İlkadım',
      neighborhood: 'Merkez',
      price: 8500,
      listingStatus: 'Kiralık',
      propertyType: 'Daire',
      squareMeters: 85,
      roomCount: '2+1',
      buildingAge: 8,
      floor: 2,
      parking: false,
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop'],
      cover: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop',
      isPublished: false,
      userId: userId,
      createdAt: '2024-01-14T00:00:00.000Z',
      updatedAt: '2024-01-14T00:00:00.000Z'
    }
  ];
};

// Fetch all requests (published ones for public view)
export const fetchRequests = async (filters = {}, showOnlyPublished = true) => {
  // Simulate API delay - reduced for better UX
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const allRequests = [
    {
      id: '1',
      title: 'Atakum Denizevleri Satılık Daire Arıyorum',
      description: '3+1, 120m², deniz manzaralı daire arıyorum',
      city: 'Samsun',
      district: 'Atakum',
      neighborhood: 'Denizevleri',
      propertyType: 'Daire',
      roomCount: '3+1',
      minPrice: 2000000,
      maxPrice: 3000000,
      minSquareMeters: 100,
      maxSquareMeters: 150,
      status: 'active',
      isPublished: true,
      userId: 'user-1',
      createdAt: '2024-01-15T00:00:00.000Z',
      contactInfo: {
        name: 'Ahmet Yılmaz',
        phone: '+90 555 123 4567',
        email: 'ahmet@example.com'
      }
    },
    {
      id: '2',
      title: 'İlkadım Merkez Kiralık Daire',
      description: '2+1, merkezi konumda, ulaşımı kolay',
      city: 'Samsun',
      district: 'İlkadım',
      neighborhood: 'Merkez',
      propertyType: 'Daire',
      roomCount: '2+1',
      minPrice: 5000,
      maxPrice: 8000,
      minSquareMeters: 70,
      maxSquareMeters: 100,
      status: 'active',
      isPublished: false,
      userId: 'user-2',
      createdAt: '2024-01-14T00:00:00.000Z',
      contactInfo: {
        name: 'Ayşe Demir',
        phone: '+90 555 987 6543',
        email: 'ayse@example.com'
      }
    },
    {
      id: '3',
      title: 'Canik Villa Satılık',
      description: '4+2, bahçeli, otoparklı villa',
      city: 'Samsun',
      district: 'Canik',
      neighborhood: 'Villa Mahallesi',
      propertyType: 'Villa',
      roomCount: '4+2',
      minPrice: 4000000,
      maxPrice: 6000000,
      minSquareMeters: 200,
      maxSquareMeters: 300,
      status: 'active',
      isPublished: true,
      userId: 'user-3',
      createdAt: '2024-01-13T00:00:00.000Z',
      contactInfo: {
        name: 'Mehmet Kaya',
        phone: '+90 555 456 7890',
        email: 'mehmet@example.com'
      }
    }
  ];

  // Filter requests based on showOnlyPublished parameter
  let filteredRequests = showOnlyPublished 
    ? allRequests.filter(r => r.isPublished)
    : allRequests;

  // Apply additional filters
  if (filters.city) {
    filteredRequests = filteredRequests.filter(r => r.city === filters.city);
  }
  if (filters.district) {
    filteredRequests = filteredRequests.filter(r => r.district === filters.district);
  }
  if (filters.propertyType) {
    filteredRequests = filteredRequests.filter(r => r.propertyType === filters.propertyType);
  }
  if (filters.minPrice) {
    filteredRequests = filteredRequests.filter(r => r.maxPrice >= filters.minPrice);
  }
  if (filters.maxPrice) {
    filteredRequests = filteredRequests.filter(r => r.minPrice <= filters.maxPrice);
  }

  return filteredRequests;
};

// Fetch user's own requests
export const fetchUserRequests = async (userId) => {
  // Simulate API delay - reduced for better UX
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: '1',
      title: 'Atakum Denizevleri Satılık Daire Arıyorum',
      description: '3+1, 120m², deniz manzaralı daire arıyorum',
      city: 'Samsun',
      district: 'Atakum',
      neighborhood: 'Denizevleri',
      propertyType: 'Daire',
      roomCount: '3+1',
      minPrice: 2000000,
      maxPrice: 3000000,
      minSquareMeters: 100,
      maxSquareMeters: 150,
      status: 'active',
      isPublished: true,
      userId: userId,
      createdAt: '2024-01-15T00:00:00.000Z',
      locations: ['Denizevleri', 'Çamlıyazı', 'Atakent'],
      contactInfo: {
        name: 'Ahmet Yılmaz',
        phone: '+90 555 123 4567',
        email: 'ahmet@example.com'
      }
    },
    {
      id: '2',
      title: 'İlkadım Merkez Kiralık Daire',
      description: '2+1, merkezi konumda, ulaşımı kolay',
      city: 'Samsun',
      district: 'İlkadım',
      neighborhood: 'Merkez',
      propertyType: 'Daire',
      roomCount: '2+1',
      minPrice: 5000,
      maxPrice: 8000,
      minSquareMeters: 70,
      maxSquareMeters: 100,
      status: 'active',
      isPublished: false,
      userId: userId,
      createdAt: '2024-01-14T00:00:00.000Z',
      locations: ['Merkez', 'Cumhuriyet', 'İstiklal'],
      contactInfo: {
        name: 'Ayşe Demir',
        phone: '+90 555 987 6543',
        email: 'ayse@example.com'
      }
    }
  ];
};

// Toggle portfolio publish status
export const togglePortfolioPublishStatus = async (portfolioId, isPublished) => {
  // Simulate API delay - reduced for better UX
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return { success: true, isPublished };
};

// Toggle request publish status
export const toggleRequestPublishStatus = async (requestId, isPublished) => {
  // Simulate API delay - reduced for better UX
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return { success: true, isPublished };
};

// Add new portfolio
export const addPortfolio = async (portfolioData, userId) => {
  // Simulate API delay - reduced for better UX
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const newPortfolio = {
    id: `portfolio-${Date.now()}`,
    ...portfolioData,
    userId,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return { success: true, portfolio: newPortfolio };
};

// Add new request
export const addRequest = async (requestData, userId) => {
  // Simulate API delay - reduced for better UX
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const newRequest = {
    id: `request-${Date.now()}`,
    ...requestData,
    userId,
    isPublished: requestData.publishToPool || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return { success: true, request: newRequest };
};
