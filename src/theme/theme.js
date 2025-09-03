export const theme = {
  colors: {
    // Ana renkler - Home.js'de kullanılan gerçek renkler
    primary: '#130139',           // Koyu mor - ana renk
    secondary: '#4f46e5',         // Mavi-mor
    success: '#10b981',           // Yeşil
    warning: '#f59e0b',           // Turuncu
    error: '#FF3B30',             // Kırmızı - notification badge
    info: '#3b82f6',              // Mavi
    
    // Arka plan renkleri - Home.js'de kullanılan
    background: '#000000',        // Siyah arka plan
    cardBg: '#FFFFFF',            // Beyaz kart arka planı
    surface: '#130139',           // Koyu mor yüzey
    darkSurface: '#130139',       // Alt kart için koyu mor
    
    // Metin renkleri - Home.js'de kullanılan
    text: '#130139',              // Koyu mor metin
    textSecondary: '#374151',     // Gri metin
    textMuted: '#64748b',         // Soluk metin
    textWhite: '#FFFFFF',         // Beyaz metin
    
    // Kenarlık renkleri - Home.js'de kullanılan
    border: 'rgba(19, 1, 57, 0.1)',  // Şeffaf mor border
    borderLight: 'rgba(19, 1, 57, 0.15)', // Daha açık border
    borderDark: '#130139',        // Koyu mor border
    
    // Input renkleri
    inputBg: '#FFFFFF',           // Beyaz input arka planı
    inputBorder: 'rgba(19, 1, 57, 0.15)', // Mor input border
    inputText: '#130139',         // Koyu mor input metni
    
    // Özel renkler - Home.js'de kullanılan
    white: '#FFFFFF',             // Beyaz
    black: '#000000',             // Siyah
    transparent: 'transparent',   // Şeffaf
    primaryLight: 'rgba(19, 1, 57, 0.1)', // Açık mor
    primaryGradient: '#130139',   // Koyu mor gradient
    
    // Overlay renkleri
    overlay: 'rgba(0,0,0,0.5)',  // Siyah overlay
    backdrop: 'rgba(0,0,0,0.3)', // Siyah backdrop
    
    // Progress ve UI renkleri - Home.js'de kullanılan
    progressBg: '#E5E7EB',       // Progress bar arka planı
    progressFill: '#130139',      // Progress bar doldurma rengi
    shadow: '#000000',            // Gölge rengi
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xl2: 25,                     // Progress arc için
    xl3: 35,                     // Alt kart için
  },
  fontSizes: {
    xs: 10,
    sm: 11,                       // Alt kart etiketleri için
    md: 12,
    lg: 13,                       // Navigasyon butonları için
    xl: 14,
    xxl: 16,                      // Ana başlıklar için
    xxxl: 18,                     // Progress text için
  },
  fontWeights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  shadows: {
    small: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    medium: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
    },
    large: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.1,
      shadowRadius: 15,
      elevation: 8,
    },
  },
};
