// Fake user data including profile and initial memories
export const jamals_data = {
  profile: {
    age: 30,
    username: 'wanderlust_joe',
    hometown: 'Auckland'
  },
  memories: [
    {
      title: "Birthday at Grandma's",
      journal: "",               // no journal text for this photo memory
      files: ['IMG_1827.jpg'],              // ← use default image
      voiceMemo: 'grandma-voice.webm',
      country: 'USA',
      tag: 'family',
      coordinate: { lat: 40.7128, lng: -74.0060 }
    },
    {
      title: 'First Soccer Match',
      journal: "",               // change boolean → empty string
      files: ['IMG_1827.jpg'],
      voiceMemo: null,
      country: 'New Zealand',
      tag: 'sports',
      coordinate: { lat: -36.8485, lng: 174.7633 }
    },
    {
      title: 'Trip to London Journal',
      journal: "Strolled along the Thames and saw Big Ben…",
      files: ['IMG_1827.jpg'],
      voiceMemo: 'london-journey.webm',
      country: 'UK',
      tag: 'travel',
      coordinate: { lat: 51.5074, lng: -0.1278 }
    }
  ]
};

export const daves_data = {
  profile: {
    age: 25,
    username: 'dave_explorer',
    hometown: 'London'
  },
  memories: [
    {
      title: 'Wembley Concert',
      journal: "",               // change boolean → empty string
      files: ['wembley1.jpg', 'wembley2.jpg'],
      voiceMemo: 'wembley-crowd.webm',
      country: 'UK',
      tag: 'music',
      coordinate: { lat: 51.556, lng: -0.279 }
    },
    {
      title: 'Thames River Cruise',
      journal: "",               // no journal text for this photo memory
      files: ['thames-boat.png'],
      voiceMemo: null,
      country: 'UK',
      tag: 'travel',
      coordinate: { lat: 51.5079, lng: -0.0877 }
    },
    {
      title: 'Cambridge Weekend',
      journal: "",               // change boolean → empty string
      files: ['cambridge1.jpg', 'cambridge2.jpg'],
      voiceMemo: 'market-bells.webm',
      country: 'UK',
      tag: 'adventure',
      coordinate: { lat: 52.2043, lng: 0.1218 }
    }
  ]
};

export const diddyani_data = {
  profile: {
    age: 28,
    username: 'diddyani_artsy',
    hometown: 'Paris'
  },
  memories: [
    {
      title: 'Eiffel Tower Visit',
      journal: "",               // change boolean → empty string
      files: ['eiffel-day.jpg'],
      voiceMemo: 'tower-ambience.webm',
      country: 'France',
      tag: 'landmark',
      coordinate: { lat: 48.8584, lng: 2.2945 }
    },
    {
      title: 'Louvre Sketching',
      journal: "",               // no journal text for this photo memory
      files: ['louvre-sketch.png'],
      voiceMemo: null,
      country: 'France',
      tag: 'art',
      coordinate: { lat: 48.8606, lng: 2.3376 }
    },
    {
      title: 'Bordeaux Wine Tasting',
      journal: "",               // change boolean → empty string
      files: ['bordeaux-wine.jpg'],
      voiceMemo: 'vineyard-sounds.webm',
      country: 'France',
      tag: 'food & drink',
      coordinate: { lat: 44.8413, lng: -0.5805 }
    }
  ]
};