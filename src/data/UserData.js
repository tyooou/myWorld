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
        isJournal: false,
        files: ['grandma2022.jpg', 'family_group.png'],
        voiceMemo: 'grandma-voice.webm',
        country: 'USA',
        tag: 'family',
        coordinate: { lat: 40.7128, lng: -74.0060 }
      },
      {
        title: 'First Soccer Match',
        isJournal: false,
        files: ['match1.jpg'],
        voiceMemo: null,
        country: 'New Zealand',
        tag: 'sports',
        coordinate: { lat: -36.8485, lng: 174.7633 }
      },
      {
        title: 'Trip to London Journal',
        isJournal: true,
        files: ['london1.png', 'london2.png'],
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
        isJournal: false,
        files: ['wembley1.jpg', 'wembley2.jpg'],
        voiceMemo: 'wembley-crowd.webm',
        country: 'UK',
        tag: 'music',
        coordinate: { lat: 51.556, lng: -0.279 }
      },
      {
        title: 'Thames River Cruise',
        isJournal: true,
        files: ['thames-boat.png'],
        voiceMemo: null,
        country: 'UK',
        tag: 'travel',
        coordinate: { lat: 51.5079, lng: -0.0877 }
      },
      {
        title: 'Cambridge Weekend',
        isJournal: false,
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
        isJournal: false,
        files: ['eiffel-day.jpg'],
        voiceMemo: 'tower-ambience.webm',
        country: 'France',
        tag: 'landmark',
        coordinate: { lat: 48.8584, lng: 2.2945 }
      },
      {
        title: 'Louvre Sketching',
        isJournal: true,
        files: ['louvre-sketch.png'],
        voiceMemo: null,
        country: 'France',
        tag: 'art',
        coordinate: { lat: 48.8606, lng: 2.3376 }
      },
      {
        title: 'Bordeaux Wine Tasting',
        isJournal: false,
        files: ['bordeaux-wine.jpg'],
        voiceMemo: 'vineyard-sounds.webm',
        country: 'France',
        tag: 'food & drink',
        coordinate: { lat: 44.8413, lng: -0.5805 }
      }
    ]
  };