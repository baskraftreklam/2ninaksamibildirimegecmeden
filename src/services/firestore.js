// Mock firestore service for now
export const fetchPortfolios = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
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
      images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop']
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
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop']
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
      images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop']
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
      images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop']
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
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1600&auto=format&fit=crop']
    }
  ];
};
