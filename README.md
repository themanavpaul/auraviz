# AuraViz - Vision for the Visually Impaired

## What is AuraViz?

AuraViz is a mobile application designed to serve as "eyes" for visually impaired individuals. Using advanced computer vision AI, AuraViz captures the world through the smartphone camera and provides detailed audio descriptions of the surroundings. The app transforms visual information into concise, helpful audio feedback, making the visual world more accessible to those with visual impairments.

## Why is it Useful?

For the 285 million people worldwide with visual impairments, navigating daily life presents unique challenges:

- **Independence**: AuraViz empowers users to independently identify objects, read text, and understand their surroundings without relying on assistance from others.
- **Information Access**: Visual information in everyday environments becomes accessible through real-time audio descriptions.
- **Safety**: Users can better identify potential obstacles and navigate unfamiliar environments.
- **Inclusivity**: AuraViz bridges the accessibility gap by providing essential visual information through alternative means.
- **Convenience**: As a smartphone application, it's always available without requiring additional specialized hardware.

## Features

### 🔍 Scene Description
Provides concise descriptions of the user's surroundings, capturing the essence of the environment in clear, straightforward language.

### 📦 Object Identification
Quickly identifies and names objects in the camera's view, helping users locate specific items or understand what's around them.

### 🎨 Color Detection
Describes colors of objects and surroundings, useful for matching clothes, identifying products, or appreciating visual aesthetics.

### 📝 Text Recognition
Reads text from signs, packages, labels, and documents, making written information accessible through audio.

### Additional Features
- **Stability Detection**: Automatically captures images when the device is held steady
- **Voice Feedback**: Clear audio descriptions via text-to-speech
- **Simple Interface**: Designed for accessibility with screen reader compatibility
- **Low Battery Consumption**: Optimized processing to preserve battery life

## Tech Stack

### Frontend
- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform for React Native
- **Expo Camera**: For camera access and image capture
- **React Native TTS**: Text-to-speech functionality
- **React Native Haptic Feedback**: For tactile feedback

### Backend/API
- **Qwen2-VL-7B-Instruct**: AI vision model for image analysis
- **Firebase**: Authentication and analytics

### Device Features
- **Accelerometer/Gyroscope**: For device stability detection
- **Text-to-Speech**: Native device capabilities

## Installation & Usage

```bash
# Clone the repository
git clone https://github.com/yourusername/auraviz.git

# Navigate to project directory
cd auraviz

# Install dependencies
npm install

# Start the development server
expo start
```

### Using the App

1. **Launch AuraViz**: Open the app and grant camera permissions
2. **Position Camera**: Point your device at what you want to identify
3. **Hold Steady**: The app will automatically capture and process images when stable
4. **Listen**: Audio description will play automatically
5. **Navigate**: Simple swipe gestures or voice commands to switch between modes

## Key Improvements & Innovations

- **Stability-Based Capture**: Unlike similar apps that continuously process images, AuraViz intelligently detects when the device is stable to capture clearer images and conserve battery
- **Context-Aware Descriptions**: The AI model provides descriptions tailored to the specific needs of visually impaired users
- **Minimal Interface**: Designed from the ground up for accessibility, not as an afterthought
- **Offline Capabilities**: Core features work without internet connection
- **Battery Efficiency**: Optimized processing and selective image capture

## Future Scope

- **Navigation Assistance**: Turn-by-turn directions and obstacle detection
- **Object Memory**: Remember and recognize specific personal items
- **Facial Recognition**: Identify known contacts and describe unfamiliar faces
- **Currency Identification**: Specifically recognize and name different denominations
- **AR Audio**: Spatially positioned audio feedback corresponding to object locations
- **Custom Voice Commands**: User-defined commands for specific tasks
- **Multi-language Support**: Expanded language options for global accessibility
- **Shopping Assistant**: Product recognition and information retrieval
- **Wearable Integration**: Support for smart glasses and other wearable devices

## Contributing

Contributions are always welcome!

See [CONTRIBUTING.md](CONTRIBUTING.md) for ways to get started.

## License

[MIT](https://choosealicense.com/licenses/mit/)

---

Created with ❤️ for the Visionary Hackathon 2025
