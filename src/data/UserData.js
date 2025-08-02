// Fake user data including profile and initial memories
export const jamals_data = {
  profile: {
    age: 21,
    username: 'wander_joe',
    hometown: 'Auckland'
  },
  memories: [
    {
      title: "Melbourne Skyline",
      journal: "I woke before dawn to catch the sunrise over Melbourne’s skyline. The streets were quiet and the skyscrapers along the Yarra River glowed in soft pastel light as the city came to life.",
      files: ['IMG_1716.jpg'],              // default image
      voiceMemo: 'melbourne-ambience.webm',
      country: 'Australia',
      tag: 'travel',
      coordinate: { lat: -37.8136, lng: 144.9631 }
    },
    {
      title: 'Top of New Zealand',
      journal: "I journeyed to Cape Reinga, the northern-most tip of the North Island. Standing where the Tasman Sea meets the Pacific Ocean, I felt the wild wind whip around the lighthouse and watched two oceans collide on the horizon.",
      files: ['IMG_1597.jpg'],
      voiceMemo: null,
      country: 'New Zealand',
      tag: 'adventure',
      coordinate: { lat: -34.4278, lng: 172.6811 }
    },
    {
      title: 'Motorcycle Ride Through the Nights of Vietnam',
      journal: "Zoomed through the bustling streets of Hanoi on a motorbike at night, neon lights reflecting off wet pavement while the scent of street-food stalls and incense filled the air.",
      files: ['IMG_1346.jpg'],
      voiceMemo: 'hanoi-ride.webm',
      country: 'Vietnam',
      tag: 'travel',
      coordinate: { lat: 21.0278, lng: 105.8342 }
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