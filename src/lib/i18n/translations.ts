export type LanguageCode = 'en' | 'es' | 'fr' | 'de';

export const TRANSLATIONS: Record<
  LanguageCode,
  {
    nav: {
      home: string;
      services: string;
      tracking: string;
      pricing: string;
      about: string;
      contact: string;
      faq: string;
      portal: string;
    };
    hero: {
      headline: string;
      subtitle: string;
      startShipping: string;
      howItWorks: string;
      onTime: string;
      activeShipments: string;
      liveSupport: string;
    };
    trackingCard: {
      title: string;
      placeholder: string;
      trackBtn: string;
      updated: string;
      inTransit: string;
    };
    cta: {
      title: string;
      subtitle: string;
      getQuote: string;
      talkExpert: string;
    };
  }
> = {
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      tracking: 'Tracking',
      pricing: 'Pricing',
      about: 'About',
      contact: 'Contact',
      faq: 'FAQ',
      portal: 'Dashboard',
    },
    hero: {
      headline: 'Move effortlessly with real-time clarity',
      subtitle: 'End-to-end multi-modal freight, automated routing, and millimeter-precision shipment visibility tailored for modern enterprise commerce.',
      startShipping: 'Start shipping →',
      howItWorks: 'How it works',
      onTime: 'On-time delivery',
      activeShipments: 'Active shipments',
      liveSupport: 'Live support',
    },
    trackingCard: {
      title: 'Track your shipment',
      placeholder: 'Enter tracking number (e.g. FLW-2026-89421)',
      trackBtn: 'Search',
      updated: 'Updated 4 min ago',
      inTransit: 'In transit',
    },
    cta: {
      title: 'Want to make your supply chain simpler?',
      subtitle: 'Get a quick, no-obligation quote in under 2 minutes',
      getQuote: 'Get a quote',
      talkExpert: 'Talk to an expert',
    },
  },
  es: {
    nav: {
      home: 'Inicio',
      services: 'Servicios',
      tracking: 'Rastreo',
      pricing: 'Precios',
      about: 'Nosotros',
      contact: 'Contacto',
      faq: 'Preguntas',
      portal: 'Panel',
    },
    hero: {
      headline: 'Muévase sin esfuerzo con claridad en tiempo real',
      subtitle: 'Transporte multimodal de extremo a extremo, enrutamiento automatizado y visibilidad milimétrica para el comercio empresarial moderno.',
      startShipping: 'Comenzar envío →',
      howItWorks: 'Cómo funciona',
      onTime: 'Entregas a tiempo',
      activeShipments: 'Envíos activos',
      liveSupport: 'Soporte 24/7',
    },
    trackingCard: {
      title: 'Rastree su envío',
      placeholder: 'Número de seguimiento',
      trackBtn: 'Buscar',
      updated: 'Actualizado hace 4 min',
      inTransit: 'En tránsito',
    },
    cta: {
      title: '¿Desea simplificar su cadena de suministro?',
      subtitle: 'Obtenga una cotización rápida y sin compromiso en menos de 2 minutos',
      getQuote: 'Cotizar ahora',
      talkExpert: 'Hablar con un experto',
    },
  },
  fr: {
    nav: {
      home: 'Accueil',
      services: 'Services',
      tracking: 'Suivi',
      pricing: 'Tarifs',
      about: 'À propos',
      contact: 'Contact',
      faq: 'FAQ',
      portal: 'Espace client',
    },
    hero: {
      headline: 'Avancez sans effort avec une clarté en temps réel',
      subtitle: 'Fret multimodal de bout en bout, routage automatisé et visibilité précise pour le commerce moderne des entreprises.',
      startShipping: 'Expédier maintenant →',
      howItWorks: 'Comment ça marche',
      onTime: 'Livraisons ponctuelles',
      activeShipments: 'Colis en cours',
      liveSupport: 'Support continu',
    },
    trackingCard: {
      title: 'Suivre votre envoi',
      placeholder: 'Numéro de suivi',
      trackBtn: 'Rechercher',
      updated: 'Mis à jour il y a 4 min',
      inTransit: 'En transit',
    },
    cta: {
      title: 'Vous souhaitez simplifier votre logistique ?',
      subtitle: 'Obtenez un devis rapide et sans engagement en moins de 2 minutes',
      getQuote: 'Obtenir un devis',
      talkExpert: 'Parler à un expert',
    },
  },
  de: {
    nav: {
      home: 'Startseite',
      services: 'Leistungen',
      tracking: 'Sendungsverfolgung',
      pricing: 'Preise',
      about: 'Über uns',
      contact: 'Kontakt',
      faq: 'FAQ',
      portal: 'Dashboard',
    },
    hero: {
      headline: 'Mühelos bewegen mit Echtzeit-Klarheit',
      subtitle: 'End-to-End Multimodal-Fracht, automatisiertes Routing und millimetergenaue Transparenz für anspruchsvolle Unternehmen.',
      startShipping: 'Jetzt versenden →',
      howItWorks: 'So funktioniert es',
      onTime: 'Pünktliche Zustellung',
      activeShipments: 'Aktive Sendungen',
      liveSupport: '24/7 Support',
    },
    trackingCard: {
      title: 'Sendung verfolgen',
      placeholder: 'Sendungsnummer eingeben',
      trackBtn: 'Suchen',
      updated: 'Vor 4 Min. aktualisiert',
      inTransit: 'In Zustellung',
    },
    cta: {
      title: 'Möchten Sie Ihre Lieferkette vereinfachen?',
      subtitle: 'Erhalten Sie ein unverbindliches Angebot in unter 2 Minuten',
      getQuote: 'Angebot einholen',
      talkExpert: 'Experten kontaktieren',
    },
  },
};
