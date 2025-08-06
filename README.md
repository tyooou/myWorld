# myWorld 🌍

A retro-styled, pixelated interactive memory mapping application where users can create, share, and explore memories on a beautiful 3D globe.

## ✨ Features

### 🗺️ Interactive Map
- **Pixelated Aesthetic**: Retro 8-bit style map with dynamic pixelation effects
- **3D/2D Toggle**: Switch between immersive globe view and traditional 2D map
- **Custom Pushpins**: Pixel art pushpins with unique colors for each user
- **Real-time Location**: Automatic geolocation with "Locate Me" functionality

### 📍 Memory Management
- **Pin Memories**: Click anywhere on the map to create new memories
- **Rich Content**: Add photos, journal entries, voice memos, and tags
- **Timeline View**: Browse memories chronologically with interactive timeline
- **User Profiles**: Personalized experiences with unique usernames and colors

### 🎨 Visual Design
- **Pixel Perfect**: Authentic pixel art pushpins with 3D shading
- **Color-Coded Users**: Each user gets a unique color scheme
- **Smooth Animations**: Fluid transitions and hover effects
- **Responsive Design**: Works seamlessly across devices

### 🔍 Search & Navigation
- **Geocoding**: Search for places with integrated Mapbox Geocoder
- **Memory Search**: Find memories by location, date, or content
- **Globe Navigation**: Smooth flying transitions between locations
- **Marker Visibility**: Smart marker hiding/showing on globe rotation

## 🚀 Technology Stack

- **Frontend**: React 18 with Vite
- **Mapping**: Mapbox GL JS with custom styling
- **Styling**: Tailwind CSS with custom pixel fonts
- **Storage**: localStorage for persistent user data
- **Icons**: Custom pixel art SVG icons
- **Audio**: Web Audio API for voice memos

## 🎮 User Experience

### User Color Mapping
Each user gets a unique color for their pushpins:
- **wander_joe**: Red (#E74C3C)
- **dave_explorer**: Pink (#FF69B4)
- **mclovin**: Blue (#3498DB)
- **sesalover123**: Yellow (#F1C40F)
- **ibrahimovic**: Purple (#9B59B6)
- **rocketleaguer55**: Teal (#1ABC9C)

### Memory Data Structure
```javascript
{
  id: timestamp,
  title: "Memory Title",
  journal: "Memory description",
  files: [/* uploaded images */],
  voiceMemo: blob,
  country: "Location",
  tag: "Category",
  coordinate: { lat: number, lng: number },
  date: "YYYY-MM-DD",
  createdAt: "ISO string",
  friend: "username" // for shared memories
}
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tyooou/myWorld.git
   cd myWorld
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Mapbox token**
   - Get a free Mapbox API token from [mapbox.com](https://mapbox.com)
   - Add your token to the `mapboxgl.accessToken` in `MemoryMap.jsx`

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
myWorld/
├── public/
│   ├── pin-icon.svg          # Pixel art pushpin icon
│   └── [user photos]         # Uploaded memory images
├── src/
│   ├── components/
│   │   ├── MemoryMap.jsx     # Main map component
│   │   ├── Timeline/         # Timeline components
│   │   ├── memory/           # Memory creation forms
│   │   └── system/           # UI system components
│   ├── data/
│   │   └── UserData.js       # User data management
│   ├── assets/
│   │   └── fonts/            # Pixel fonts
│   └── LoadingScreens/       # Loading animations
├── index.html
├── package.json
└── README.md
```

## 🎯 Key Components

### MemoryMap.jsx
The core component handling:
- Map initialization and rendering
- Memory CRUD operations
- User interactions and events
- Timeline integration
- Pixelation effects

### Timeline Component
- Chronological memory browsing
- Memory filtering and search
- Interactive memory selection
- Responsive design

### System Components
Reusable UI elements with consistent pixel art styling:
- SystemButton, SystemLabel, SystemTabs
- SystemTextInput, SystemTextArea
- SystemUpload for file handling

## 🔧 Configuration

### Map Styling
- Custom Mapbox style: `mapbox://styles/eborweed/cmdtnwc8b007x01srgmfwar2m`
- Pixelation effects with dynamic scaling
- Globe projection with marker visibility management

### Local Storage
User data persists locally using the pattern:
```javascript
localStorage.setItem(`userData_${username}`, JSON.stringify(userData))
```

## 🎨 Customization

### Adding New Users
Add entries to the `userColorMap` in MemoryMap.jsx:
```javascript
const userColorMap = {
  new_username: "#HEX_COLOR",
  // ...existing users
};
```

### Custom Pushpin Colors
Pushpins automatically generate:
- Main color: User's assigned color
- Border: 40% darker shade
- Highlight: 40% lighter shade

## 🌟 Features in Detail

### Pixelated Map Effect
- Dynamic pixelation based on zoom level
- Smooth transitions between pixel densities
- Performance-optimized with requestAnimationFrame

### Memory Creation
1. Click anywhere on the map
2. Map flies to location and places temporary pin
3. Fill out memory form with rich content
4. Save creates permanent pixelated pushpin

### Globe Navigation
- Smart marker visibility on globe rotation
- Smooth flying between memory locations
- 3D/2D projection switching

## 🚧 Future Enhancements

- [ ] Memory sharing between users
- [ ] Export memories as images/PDFs
- [ ] Advanced search and filtering
- [ ] Memory categories and tags
- [ ] Social features and comments
- [ ] Mobile app version
- [ ] Cloud storage integration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, email your-email@example.com or open an issue on GitHub.

---

**Made with ❤️ and pixels** - Turn your world into an interactive memory map!+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
