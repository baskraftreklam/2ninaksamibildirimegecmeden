// Eşleştirme algoritması için yardımcı fonksiyonlar

/**
 * İki konum arasındaki mesafeyi hesaplar (Haversine formülü)
 * @param {Object} pos1 - İlk konum {latitude, longitude}
 * @param {Object} pos2 - İkinci konum {latitude, longitude}
 * @returns {number} Mesafe (km)
 */
export const calculateDistance = (pos1, pos2) => {
  if (!pos1 || !pos2 || !pos1.latitude || !pos2.latitude) {
    return Infinity;
  }

  const R = 6371; // Dünya'nın yarıçapı (km)
  const dLat = (pos2.latitude - pos1.latitude) * Math.PI / 180;
  const dLon = (pos2.longitude - pos1.longitude) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(pos1.latitude * Math.PI / 180) * Math.cos(pos2.latitude * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * İki fiyat arasındaki uyumluluğu hesaplar
 * @param {number} price1 - İlk fiyat
 * @param {number} price2 - İkinci fiyat
 * @param {number} tolerance - Tolerans yüzdesi (varsayılan: 20)
 * @returns {number} Uyumluluk skoru (0-100)
 */
export const calculatePriceCompatibility = (price1, price2, tolerance = 20) => {
  if (!price1 || !price2) return 0;
  
  const difference = Math.abs(price1 - price2);
  const averagePrice = (price1 + price2) / 2;
  const percentageDiff = (difference / averagePrice) * 100;
  
  if (percentageDiff <= tolerance) {
    return 100 - percentageDiff;
  }
  
  return Math.max(0, 100 - (percentageDiff - tolerance) * 2);
};

/**
 * İki özellik listesi arasındaki uyumluluğu hesaplar
 * @param {Array} features1 - İlk özellik listesi
 * @param {Array} features2 - İkinci özellik listesi
 * @returns {number} Uyumluluk skoru (0-100)
 */
export const calculateFeaturesCompatibility = (features1 = [], features2 = []) => {
  if (!features1.length || !features2.length) return 50;
  
  const commonFeatures = features1.filter(f => features2.includes(f));
  const totalFeatures = new Set([...features1, ...features2]).size;
  
  return (commonFeatures.length / totalFeatures) * 100;
};

/**
 * İki portföy arasındaki genel uyumluluk skorunu hesaplar
 * @param {Object} portfolio1 - İlk portföy
 * @param {Object} portfolio2 - İkinci portföy
 * @param {Object} weights - Ağırlık ayarları
 * @returns {Object} Uyumluluk detayları
 */
export const calculateCompatibility = (portfolio1, portfolio2, weights = {}) => {
  const defaultWeights = {
    location: 0.3,
    price: 0.25,
    features: 0.2,
    propertyType: 0.15,
    timing: 0.1
  };

  const finalWeights = { ...defaultWeights, ...weights };
  
  // Konum uyumluluğu
  const locationScore = portfolio1.location && portfolio2.location 
    ? Math.max(0, 100 - (calculateDistance(portfolio1.location, portfolio2.location) * 10))
    : 50;
  
  // Fiyat uyumluluğu
  const priceScore = calculatePriceCompatibility(portfolio1.price, portfolio2.price);
  
  // Özellik uyumluluğu
  const featuresScore = calculateFeaturesCompatibility(portfolio1.features, portfolio2.features);
  
  // Mülk tipi uyumluluğu
  const propertyTypeScore = portfolio1.propertyType === portfolio2.propertyType ? 100 : 0;
  
  // Zaman uyumluluğu (eğer belirtilmişse)
  let timingScore = 50;
  if (portfolio1.availabilityDate && portfolio2.availabilityDate) {
    const date1 = new Date(portfolio1.availabilityDate);
    const date2 = new Date(portfolio2.availabilityDate);
    const daysDiff = Math.abs(date1 - date2) / (1000 * 60 * 60 * 24);
    timingScore = Math.max(0, 100 - daysDiff);
  }
  
  // Genel skor hesaplama
  const overallScore = 
    locationScore * finalWeights.location +
    priceScore * finalWeights.price +
    featuresScore * finalWeights.features +
    propertyTypeScore * finalWeights.propertyType +
    timingScore * finalWeights.timing;
  
  return {
    overallScore: Math.round(overallScore),
    details: {
      location: Math.round(locationScore),
      price: Math.round(priceScore),
      features: Math.round(featuresScore),
      propertyType: Math.round(propertyTypeScore),
      timing: Math.round(timingScore)
    },
    weights: finalWeights
  };
};

/**
 * Portföy listesini uyumluluk skoruna göre sıralar
 * @param {Object} targetPortfolio - Hedef portföy
 * @param {Array} portfolios - Portföy listesi
 * @param {Object} weights - Ağırlık ayarları
 * @returns {Array} Sıralanmış portföy listesi
 */
export const sortByCompatibility = (targetPortfolio, portfolios, weights = {}) => {
  if (!targetPortfolio || !portfolios || !portfolios.length) {
    return [];
  }
  
  return portfolios
    .map(portfolio => ({
      ...portfolio,
      compatibility: calculateCompatibility(targetPortfolio, portfolio, weights)
    }))
    .sort((a, b) => b.compatibility.overallScore - a.compatibility.overallScore);
};

/**
 * Belirli bir uyumluluk skorunun üzerindeki portföyleri filtreler
 * @param {Array} portfolios - Portföy listesi
 * @param {number} minScore - Minimum uyumluluk skoru
 * @returns {Array} Filtrelenmiş portföy listesi
 */
export const filterByMinCompatibility = (portfolios, minScore = 70) => {
  return portfolios.filter(portfolio => 
    portfolio.compatibility && portfolio.compatibility.overallScore >= minScore
  );
};

/**
 * Portföy eşleştirme önerilerini oluşturur
 * @param {Object} userPortfolio - Kullanıcının portföyü
 * @param {Array} availablePortfolios - Mevcut portföyler
 * @param {Object} preferences - Kullanıcı tercihleri
 * @returns {Array} Eşleştirme önerileri
 */
export const generateMatchingSuggestions = (userPortfolio, availablePortfolios, preferences = {}) => {
  if (!userPortfolio || !availablePortfolios || !availablePortfolios.length) {
    return [];
  }
  
  const weights = {
    location: preferences.locationWeight || 0.3,
    price: preferences.priceWeight || 0.25,
    features: preferences.featuresWeight || 0.2,
    propertyType: preferences.propertyTypeWeight || 0.15,
    timing: preferences.timingWeight || 0.1
  };
  
  let suggestions = sortByCompatibility(userPortfolio, availablePortfolios, weights);
  
  // Minimum uyumluluk skoruna göre filtreleme
  if (preferences.minCompatibilityScore) {
    suggestions = filterByMinCompatibility(suggestions, preferences.minCompatibilityScore);
  }
  
  // Maksimum mesafe filtresi
  if (preferences.maxDistance) {
    suggestions = suggestions.filter(suggestion => {
      if (!userPortfolio.location || !suggestion.location) return true;
      const distance = calculateDistance(userPortfolio.location, suggestion.location);
      return distance <= preferences.maxDistance;
    });
  }
  
  // Fiyat aralığı filtresi
  if (preferences.minPrice || preferences.maxPrice) {
    suggestions = suggestions.filter(suggestion => {
      if (!suggestion.price) return true;
      if (preferences.minPrice && suggestion.price < preferences.minPrice) return false;
      if (preferences.maxPrice && suggestion.price > preferences.maxPrice) return false;
      return true;
    });
  }
  
  return suggestions.slice(0, preferences.maxResults || 20);
};

/**
 * Eşleştirme kalitesini değerlendirir
 * @param {number} score - Uyumluluk skoru
 * @returns {string} Kalite değerlendirmesi
 */
export const getMatchQuality = (score) => {
  if (score >= 90) return 'Mükemmel Eşleşme';
  if (score >= 80) return 'Çok İyi Eşleşme';
  if (score >= 70) return 'İyi Eşleşme';
  if (score >= 60) return 'Orta Eşleşme';
  if (score >= 50) return 'Düşük Eşleşme';
  return 'Zayıf Eşleşme';
};

/**
 * Eşleştirme istatistiklerini hesaplar
 * @param {Array} portfolios - Portföy listesi
 * @returns {Object} İstatistikler
 */
export const calculateMatchingStats = (portfolios) => {
  if (!portfolios || !portfolios.length) {
    return {
      totalPortfolios: 0,
      averageScore: 0,
      scoreDistribution: {},
      topMatches: []
    };
  }
  
  const scores = portfolios.map(p => p.compatibility?.overallScore || 0);
  const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  
  const scoreDistribution = scores.reduce((acc, score) => {
    const range = Math.floor(score / 10) * 10;
    const key = `${range}-${range + 9}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  
  const topMatches = portfolios
    .filter(p => p.compatibility?.overallScore >= 80)
    .slice(0, 5);
  
  return {
    totalPortfolios: portfolios.length,
    averageScore: Math.round(averageScore),
    scoreDistribution,
    topMatches
  };
};
