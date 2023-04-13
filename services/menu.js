export const getMenuData = [
  {
      category: true,
      title: 'Navigasyon',
      key: 'ecommerceManagement',
    },
    {
      title: 'Gösterge Paneli',
      key: 'dashboards',
      icon: 'la la-activity',
      url: '/',
    },
    {
      title: 'Rezervasyonlar',
      key: 'orders',
      icon: 'la la-shopping-cart',
      url: '/booking/orders',
      children: [
        {
          title: 'Tüm Rezervasyonlar',
          key: 'orders',
          icon: 'la la-chevrons-right',
          url: '/booking/orders',
        },
     /*   {
          title: 'İade / İptal İşlemleri',
          key: 'order-cancel',
          icon: 'la la-chevrons-right',
          url: '/booking/orders/cancel',
        },*/
        {
          title: 'Ödeme Kayıtları',
          key: 'order-transaction',
          icon: 'la la-chevrons-right',
          url: '/booking/orders/transaction',
        },
      ],
    },
    {
      title: 'Üyelik / Abonelik',
      key: 'customers',
      icon: 'la la-user',
      // url: '/member',
      children: [
        {
          title: 'Tüm Üyeler',
          key: 'customers-list',
          icon: 'la la-user',
          url: '/members/members',
        },
        {
          title: 'Newsletter Abonelikleri',
          key: 'customers-fields',
          icon: 'la la-chevrons-right',
          url: '/members/subscribers',
        },
      ],
    },
  
    {
      title: 'Marketing',
      key: 'marketing',
      icon: 'la la-tag',
      count: 6,
      children: [
        {
          title: 'Promosyon Kodları',
          key: 'gift',
          icon: 'la la-chevrons-right',
          url: '/marketing/coupon',
        },
        {
          title: 'Affilate Link Oluşturma',
          key: 'ecommerce-feed',
          icon: 'la la-chevrons-right',
          url: '/marketing/affilate',
        }
      ],
    },
    {
      category: true,
      title: 'Api / Booking System',
      key: 'contentManagement',
    },
    {
      title: 'Tatil / Paket Tur',
      key: 'travel',
      icon: 'la la-briefcase',
      count: 6,
      children: [
        {
          title: 'Arama Motoru',
          key: 'travel-search-engine',
          icon: 'la la-chevrons-right',
          url: '/booking/engine/search',
        },
        {
          title: 'Bölgeler',
          key: 'travel-region',
          icon: 'la la-chevrons-right',
          url: '/booking/engine/region',
        },
      /*  {
          title: 'Oteller',
          key: 'travel-otel',
          icon: 'la la-chevrons-right',
          url: '/booking/engine/hotel',
        },*/
        {
          title: 'Havalimanları',
          key: 'travel-airport',
          icon: 'la la-chevrons-right',
          url: '/booking/engine/airport',
        },
        {
          title: 'Operatörler',
          key: 'travel-operator',
          icon: 'la la-chevrons-right',
          url: '/booking/engine/operator',
        }
      ],
    },
    {
      title: 'Helal Booking',
      key: 'halal',
      icon: 'la la-moon',
      count: 6,
      children: [
        {
          title: 'Oteller',
          key: 'halal-otel',
          icon: 'la la-chevrons-right',
          url: '/booking/halal/hotel',
        },
      ],
    },
    {
      title: 'Tur Sistemi',
      key: 'tour',
      icon: 'la la-compass',
      count: 6,
      children: [
        {
          title: 'Turları Yönet',
          key: 'all-tour',
          icon: 'la la-chevrons-right',
          url: '/booking/tour',
        },
        {
          title: 'Tur Periyodları',
          key: 'tour-report',
          icon: 'la la-chevrons-right',
          url: '/booking/tour/report',
        },
        {
          title: 'Tur Kategorileri',
          key: 'tour-type',
          icon: 'la la-chevrons-right',
          url: '/booking/tour/type',
        },
        {
          title: 'Tur Sayfası Sekmeleri',
          key: 'tour-tab',
          icon: 'la la-chevrons-right',
          url: '/booking/tour/tab',
        }
      ],
    },
    {
      category: true,
      title: 'İçerik Yönetimi',
      key: 'contentManagement',
    },
    {
      title: 'Yazılar / Blog',
      key: 'contents',
      icon: 'la la-edit',
      url: '/content/contents',
    },
    {
      title: 'İçerik Sayfaları',
      key: 'pages',
      icon: 'la la-book-open',
      url: '/content/pages',
    },
    {
      title: 'Müşteri Hizmetleri',
      key: 'customer_services',
      icon: 'la la-life-buoy',
      url: '/content/support',
    },
     {
      title: 'Şubeler',
      key: 'branch',
      icon: 'la la-tablet',
      url: '/module/branch',
    },
    {
      title: 'Menüler',
      key: 'modules',
      icon: 'la la-list',
      url: '/design/menu',
    },
    {
      title: 'Landing Sayfaları',
      key: 'landing',
      icon: 'la la-wind',
      children: [
        {
          title: 'Temel Sayfalar',
          key: 'landing-base',
          icon: 'la la-chevrons-right',
          url: '/landing/base',
        },
        {
          title: 'Bölge Sayfaları',
          key: 'landing-region',
          icon: 'la la-chevrons-right',
          url: '/landing/zone',
        },
        {
          title: 'Otel Detay Sayfaları',
          key: 'landing-otel',
          icon: 'la la-chevrons-right',
          url: '/landing/otel/',
        },
        {
          title: 'Seo Alt Linkler',
          key: 'landing-link',
          icon: 'la la-chevrons-right',
          url: '/landing/footer/',
        },
        
      ],
    },
   
  
    {
      title: 'Anasayfa',
      key: 'design-home',
      icon: 'la la-compass',
      count: 6,
      children: [
        {
          title: 'Seo Metinleri',
          key: 'design-home-seo-text',
          icon: 'la la-chevrons-right',
          url: '/homepage/seo/text',
        },
        {
          title: 'Seo Linkleri',
          key: 'design-home-seo-link',
          icon: 'la la-chevrons-right',
          url: '/homepage/seo/link',
        },
        {
          title: 'Tab Yönetimi',
          key: 'design-home-tab',
          icon: 'la la-chevrons-right',
          url: '/homepage/tab',
        },
        {
          title: 'Sevilen Oteller',
          key: 'design-home-favourite',
          icon: 'la la-chevrons-right',
          url: '/homepage/favourite',
        },
        
      ],
    },
    {
      category: true,
      title: 'Sistem Yönetimi',
      key: 'systemManagement',
    },
   
    {
      title: 'Yerelleştirme',
      key: 'generalLocalization',
      icon: 'la la-compass',
      count: 6,
      children: [
        {
          title: 'Diller',
          key: 'localization.languages',
          icon: 'la la-chevrons-right',
          url: '/localization/languages',
        },
        {
          title: 'Para Birimi',
          key: 'localization.currencies',
          icon: 'la la-chevrons-right',
          url: '/localization/currencies',
        },
        
      ],
    },
    
    {
      title: 'Kullanıcılar',
      key: 'users',
      icon: 'la la-users',
      children: [
        {
          title: 'Kullanıcılar',
          key: 'user-list',
          icon: 'la la-user',
          url: '/users',
        },
        {
          title: 'Kullanıcı Grupları',
          key: 'users-groups',
          icon: 'la la-chevrons-right',
          url: '/users/groups',
        },
      ],
    },

    {
      title: 'Ayarlar',
      key: 'settings',
      icon: 'la la-settings',
      url: '/sys/settings',
      children: [
        {
          title: 'ödeme yöntemleri ',
          key: 'settings.payment',
          icon: 'la la-chevrons-right',
          url: '/payment-methods',
        },
        {
          title: 'Genel Ayarlar',
          key: 'settings.sys',
          icon: 'la la-chevrons-right',
          url: '/sys/settings/2',
        },
        
        {
          title: 'Sosyal Medya',
          key: 'sys.settings.3',
          icon: 'la la-chevrons-right',
          url: '/sys/settings/8',
        },
      
        {
          title: 'Bildirimler(Mail/Sms)',
          key: 'sys.settings.6',
          icon: 'la la-chevrons-right',
          url: '/sys/notification',
        },
        {
          title: 'Link Yönetimi',
          key: 'sys.settings.7',
          icon: 'la la-chevrons-right',
          url: '/sys/settings/link',
        }
    
      ]
    }
    
]
