# CNN Visualization

An interactive visualization of a Convolutional Neural Network (CNN) showing the architecture and feature map activations.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Extract your CNN visualization data (zip file) to the `src/data/` directory

3. Run the development server:
   ```
   npm run dev
   ```

## Structure

- `src/components/cnn-diagram.js` - The main CNN diagram component
- `src/components/image-display.js` - Image display component for feature maps
- `src/data/blocks.js` - CNN block configuration data
- `src/cnn-visualization.md` - Main visualization page
- `src/index.md` - Home page

## Features

- Interactive CNN architecture diagram
- Clickable blocks to view feature map activations
- Navigation through different feature maps
- Toggle between original image and feature maps
- Residual connections visualization