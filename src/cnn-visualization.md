# CNN Feature Map Visualization

This interactive visualization shows a Convolutional Neural Network (CNN) architecture and allows you to explore the feature map activations at different layers.

## Instructions

1. **Click on any block** in the diagram below to view its feature map activations
2. **Use the navigation buttons** to browse through different feature maps
3. **Toggle the overlay** to switch between feature maps and the original input image
4. **Hover over blocks** to see their layer names

<div class="cnn-diagram-container">
  <div id="cnn-diagram" style="margin-bottom: 0px; padding-bottom: 0px"></div>
</div>

<div id="image-display-container" style="display: flex; justify-content: center; align-items: center; height: 300px; margin-top: 0px; padding-top: 0px"></div>


```js
const blocks = [
  {x: 50,  w: 10, h: 80, d: 40, name: "Conv1", color: "#D3D3D3", id:"conv1"},
  {x: 125, w: 10, h: 80, d: 40, name: "Layer1 Block0 Conv1", color: "#ADD8E6", id:"layer1_0_conv1"},
  {x: 175, w: 10, h: 80, d: 40, name: "Layer1 Block0 Conv2", color: "#ADD8E6", id:"layer1_0_conv2"},
  {x: 250, w: 10, h: 80, d: 40, name: "Layer1 Block1 Conv1", color: "#ADD8E6", id:"layer1_1_conv1"},
  {x: 300, w: 10, h: 80, d: 40, name: "Layer1 Block1 Conv2", color: "#ADD8E6", id:"layer1_1_conv2"},
  {x: 375, w: 10, h: 70, d: 35, name: "Layer2 Block0 Conv1", color: "#90EE90", id:"layer2_0_conv1"},
  {x: 425, w: 10, h: 70, d: 35, name: "Layer2 Block0 Conv2", color: "#90EE90", id:"layer2_0_conv2"},
  {x: 500, w: 10, h: 70, d: 35, name: "Layer2 Block1 Conv1", color: "#90EE90", id:"layer2_1_conv1"},
  {x: 550, w: 10, h: 70, d: 35, name: "Layer2 Block1 Conv2", color: "#90EE90", id:"layer2_1_conv2"},
  {x: 625, w: 10, h: 60, d: 30, name: "Layer3 Block0 Conv1", color: "#FFB19A", id:"layer3_0_conv1"},
  {x: 675, w: 10, h: 60, d: 30, name: "Layer3 Block0 Conv2", color: "#FFB19A", id:"layer3_0_conv2"},
  {x: 750, w: 10, h: 60, d: 30, name: "Layer3 Block1 Conv1", color: "#FFB19A", id:"layer3_1_conv1"},
  {x: 800, w: 10, h: 60, d: 30, name: "Layer3 Block1 Conv2", color: "#FFB19A", id:"layer3_1_conv2"},
  {x: 875, w: 10, h: 50, d: 25, name: "Layer4 Block0 Conv1", color: "#B7C9E2", id:"layer4_0_conv1"},
  {x: 925, w: 10, h: 50, d: 25, name: "Layer4 Block0 Conv2", color: "#B7C9E2", id:"layer4_0_conv2"},
  {x: 1000, w: 10, h: 50, d: 25, name: "Layer4 Block1 Conv1", color: "#B7C9E2", id:"layer4_1_conv1"},
  {x: 1050, w: 10, h: 50, d: 25, name: "Layer4 Block1 Conv2", color: "#B7C9E2", id:"layer4_1_conv2"},
  {x: 1120, w: 10, h: 40, d: 10, name: "FC", color: "#FFFF00", id:"fc"},
].map(b => ({
  ...b,
  y: 250 - (b.h / 2 - b.d / 4)
}));

const residualConnections = [
  { from: "conv1", to: "layer1_1_conv1" },
  { from: "layer1_0_conv2", to: "layer2_0_conv1" },
  { from: "layer1_1_conv2", to: "layer2_1_conv1" },
  { from: "layer2_0_conv2", to: "layer3_0_conv1" },
  { from: "layer2_1_conv2", to: "layer3_1_conv1" },
  { from: "layer3_0_conv2", to: "layer4_0_conv1" },
  { from: "layer3_1_conv2", to: "layer4_1_conv1" },
  { from: "layer4_0_conv2", to: "fc" },
];

const legendData = [
  { name: "Conv1", color: "#D3D3D3" },
  { name: "Layer 1", color: "#ADD8E6" },
  { name: "Layer 2", color: "#90EE90" },
  { name: "Layer 3", color: "#FFB19A" },
  { name: "Layer 4", color: "#B7C9E2" },
  { name: "FC", color: "#FFFF00" }
];

// Helper function
function darkenColor(hex, factor) {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0,2),16);
  const g = parseInt(hex.substring(2,4),16);
  const b = parseInt(hex.substring(4,6),16);
  const rD = Math.floor(r * factor);
  const gD = Math.floor(g * factor);
  const bD = Math.floor(b * factor);
  return "#" + [rD,gD,bD].map(x => x.toString(16).padStart(2, "0")).join("");
}

function createBlackBox() {
  const blackBox = document.createElement("div");
  blackBox.id = "black-box";
  blackBox.style.cssText = `
    position: absolute;
    top: 22%;
    left: 0%;
    width: 900px;
    height: 500px;
    background: linear-gradient(135deg, #1a1a1a 0%, #000000 50%, #1a1a1a 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 1000;
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    border: 3px solid #333;
    border-radius: 15px;
    box-shadow: 0 0 30px rgba(0,0,0,0.8), inset 0 0 30px rgba(255,255,255,0.1);
  `;
  
  blackBox.innerHTML = `
    <div style="text-align: center; color: #fff; font-family: 'Courier New', monospace;">
      <div style="font-size: 48px; margin-bottom: 20px; text-shadow: 0 0 20px #fff;">ResNet18</div>
      <h2 style="margin: 0 0 10px 0; font-size: 32px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">BLACK BOX</h2>
      <div style="font-size: 14px; opacity: 0.6; animation: pulse 2s infinite;">
        Click to reveal the inner workings
      </div>
    </div>
    <style>
      @keyframes pulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }
    </style>
  `;
  
  blackBox.onclick = () => {
    blackBoxRevealed = true;
    blackBox.style.transform = "scale(0) rotate(180deg)";
    blackBox.style.opacity = "0";
    setTimeout(() => {
      blackBox.style.display = "none";
    }, 800);
  };
  
  return blackBox;
}

// State management
let selectedBlockId = null;
let featureMapIndex = 0;
let blackBoxRevealed = false;
let animalIdx = 0;
let animalList = ["labrador", "flamingo", "pelican", "triceratops", "zebra"];
let animal = animalList[animalIdx];

// Create image display
function createImageDisplay() {
  let overlayOn = true;
  let currentFeatureMapIndex = 0;

  const container = document.createElement("div");
  container.id = "image-display";
  container.style.cssText = "display: flex; align-items: center; gap: 10px;";

  container.innerHTML = `
<!-- Fixed button group on the left -->
<div style="display: flex; flex-direction: column; gap: 10px; min-width: 180px; justify-content: center;">
  <button id="switchAnimal" style="background-color: #333; color: #f5f5f5; border: 1px solid #444; padding: 10px 20px; border-radius: 6px; font-size: 14px; cursor: pointer; height: 44px;">Switch to flamingo</button>

  <button id="toggleOverlay" style="background-color: #333; color: #f5f5f5; border: 1px solid #444; padding: 10px 20px; border-radius: 6px; font-size: 14px; cursor: pointer; height: 44px;">Hide Overlay</button>
</div>


<div id="imageContainer" style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
  <div style="display: flex; flex-direction: row; gap: 20px; align-items: center;">
    
    <!-- Image and caption -->
    <figure style="margin: 0; text-align: center;">
      <img id="mainImage" src="/mnt/data/80b1d5b0-7cd9-4228-8a06-a62d60d508f2.png" width="256" height="256" style="background: #f0f0f0; display: block; border-radius: 6px; margin-bottom: 8px;">
      <figcaption id="caption" style="color: #aaa; font-size: 13px;">Feature Map View</figcaption>
    </figure>

    <!-- Buttons stacked vertically -->
    <div style="display: flex; flex-direction: column; gap: 10px;">
      <button id="prev" style="background-color: #333; color: #f5f5f5; border: 1px solid #444; padding: 10px 20px; border-radius: 6px; font-size: 14px; cursor: pointer; visibility: visible;">⟵ Prev</button>
      <button id="next" style="background-color: #333; color: #f5f5f5; border: 1px solid #444; padding: 10px 20px; border-radius: 6px; font-size: 14px; cursor: pointer;">Next ⟶</button>
    </div>
  </div>
</div>

</div>

<div id="infoText" style="margin-top: 25px; font-style: italic; color: #ccc; text-align: center; display: none;">
  Click on a block in the diagram above to see its feature map activation.
</div>
  `;

  const imgElem = container.querySelector("#mainImage");
  const captionElem = container.querySelector("#caption");
  const toggleBtn = container.querySelector("#toggleOverlay");
  const switchAnimalBtn = container.querySelector("#switchAnimal");
  const prevBtn = container.querySelector("#prev");
  const nextBtn = container.querySelector("#next");
  const imageContainer = container.querySelector("#imageContainer");
  const infoText = container.querySelector("#infoText");

  const sampleImages = {
flamingo: FileAttachment("data/vis/flamingo/flamingo.png"),
flamingo_conv1_0: FileAttachment("data/vis/flamingo/conv1/feature_000.png"),
flamingo_conv1_1: FileAttachment("data/vis/flamingo/conv1/feature_001.png"),
flamingo_conv1_2: FileAttachment("data/vis/flamingo/conv1/feature_002.png"),
flamingo_conv1_3: FileAttachment("data/vis/flamingo/conv1/feature_003.png"),
flamingo_conv1_4: FileAttachment("data/vis/flamingo/conv1/feature_004.png"),
flamingo_conv1_5: FileAttachment("data/vis/flamingo/conv1/feature_005.png"),
flamingo_conv1_6: FileAttachment("data/vis/flamingo/conv1/feature_006.png"),
flamingo_conv1_7: FileAttachment("data/vis/flamingo/conv1/feature_007.png"),
flamingo_conv1_8: FileAttachment("data/vis/flamingo/conv1/feature_008.png"),
flamingo_conv1_9: FileAttachment("data/vis/flamingo/conv1/feature_009.png"),
flamingo_conv1_10: FileAttachment("data/vis/flamingo/conv1/feature_010.png"),
flamingo_conv1_11: FileAttachment("data/vis/flamingo/conv1/feature_011.png"),
flamingo_conv1_12: FileAttachment("data/vis/flamingo/conv1/feature_012.png"),
flamingo_conv1_13: FileAttachment("data/vis/flamingo/conv1/feature_013.png"),
flamingo_conv1_14: FileAttachment("data/vis/flamingo/conv1/feature_014.png"),
flamingo_conv1_15: FileAttachment("data/vis/flamingo/conv1/feature_015.png"),
flamingo_layer1_0_conv1_0: FileAttachment("data/vis/flamingo/layer1_0_conv1/feature_000.png"),
flamingo_layer1_0_conv1_1: FileAttachment("data/vis/flamingo/layer1_0_conv1/feature_001.png"),
flamingo_layer1_0_conv1_2: FileAttachment("data/vis/flamingo/layer1_0_conv1/feature_002.png"),
flamingo_layer1_0_conv1_3: FileAttachment("data/vis/flamingo/layer1_0_conv1/feature_003.png"),
flamingo_layer1_0_conv1_4: FileAttachment("data/vis/flamingo/layer1_0_conv1/feature_004.png"),
flamingo_layer1_0_conv1_5: FileAttachment("data/vis/flamingo/layer1_0_conv1/feature_005.png"),
flamingo_layer1_0_conv1_6: FileAttachment("data/vis/flamingo/layer1_0_conv1/feature_006.png"),
flamingo_layer1_0_conv1_7: FileAttachment("data/vis/flamingo/layer1_0_conv1/feature_007.png"),
flamingo_layer1_0_conv1_8: FileAttachment("data/vis/flamingo/layer1_0_conv1/feature_008.png"),
flamingo_layer1_0_conv1_9: FileAttachment("data/vis/flamingo/layer1_0_conv1/feature_009.png"),
flamingo_layer1_0_conv1_10: FileAttachment("data/vis/flamingo/layer1_0_conv1/feature_010.png"),
flamingo_layer1_0_conv1_11: FileAttachment("data/vis/flamingo/layer1_0_conv1/feature_011.png"),
flamingo_layer1_0_conv1_12: FileAttachment("data/vis/flamingo/layer1_0_conv1/feature_012.png"),
flamingo_layer1_0_conv1_13: FileAttachment("data/vis/flamingo/layer1_0_conv1/feature_013.png"),
flamingo_layer1_0_conv1_14: FileAttachment("data/vis/flamingo/layer1_0_conv1/feature_014.png"),
flamingo_layer1_0_conv1_15: FileAttachment("data/vis/flamingo/layer1_0_conv1/feature_015.png"),
flamingo_layer1_0_conv2_0: FileAttachment("data/vis/flamingo/layer1_0_conv2/feature_000.png"),
flamingo_layer1_0_conv2_1: FileAttachment("data/vis/flamingo/layer1_0_conv2/feature_001.png"),
flamingo_layer1_0_conv2_2: FileAttachment("data/vis/flamingo/layer1_0_conv2/feature_002.png"),
flamingo_layer1_0_conv2_3: FileAttachment("data/vis/flamingo/layer1_0_conv2/feature_003.png"),
flamingo_layer1_0_conv2_4: FileAttachment("data/vis/flamingo/layer1_0_conv2/feature_004.png"),
flamingo_layer1_0_conv2_5: FileAttachment("data/vis/flamingo/layer1_0_conv2/feature_005.png"),
flamingo_layer1_0_conv2_6: FileAttachment("data/vis/flamingo/layer1_0_conv2/feature_006.png"),
flamingo_layer1_0_conv2_7: FileAttachment("data/vis/flamingo/layer1_0_conv2/feature_007.png"),
flamingo_layer1_0_conv2_8: FileAttachment("data/vis/flamingo/layer1_0_conv2/feature_008.png"),
flamingo_layer1_0_conv2_9: FileAttachment("data/vis/flamingo/layer1_0_conv2/feature_009.png"),
flamingo_layer1_0_conv2_10: FileAttachment("data/vis/flamingo/layer1_0_conv2/feature_010.png"),
flamingo_layer1_0_conv2_11: FileAttachment("data/vis/flamingo/layer1_0_conv2/feature_011.png"),
flamingo_layer1_0_conv2_12: FileAttachment("data/vis/flamingo/layer1_0_conv2/feature_012.png"),
flamingo_layer1_0_conv2_13: FileAttachment("data/vis/flamingo/layer1_0_conv2/feature_013.png"),
flamingo_layer1_0_conv2_14: FileAttachment("data/vis/flamingo/layer1_0_conv2/feature_014.png"),
flamingo_layer1_0_conv2_15: FileAttachment("data/vis/flamingo/layer1_0_conv2/feature_015.png"),
flamingo_layer1_1_conv1_0: FileAttachment("data/vis/flamingo/layer1_1_conv1/feature_000.png"),
flamingo_layer1_1_conv1_1: FileAttachment("data/vis/flamingo/layer1_1_conv1/feature_001.png"),
flamingo_layer1_1_conv1_2: FileAttachment("data/vis/flamingo/layer1_1_conv1/feature_002.png"),
flamingo_layer1_1_conv1_3: FileAttachment("data/vis/flamingo/layer1_1_conv1/feature_003.png"),
flamingo_layer1_1_conv1_4: FileAttachment("data/vis/flamingo/layer1_1_conv1/feature_004.png"),
flamingo_layer1_1_conv1_5: FileAttachment("data/vis/flamingo/layer1_1_conv1/feature_005.png"),
flamingo_layer1_1_conv1_6: FileAttachment("data/vis/flamingo/layer1_1_conv1/feature_006.png"),
flamingo_layer1_1_conv1_7: FileAttachment("data/vis/flamingo/layer1_1_conv1/feature_007.png"),
flamingo_layer1_1_conv1_8: FileAttachment("data/vis/flamingo/layer1_1_conv1/feature_008.png"),
flamingo_layer1_1_conv1_9: FileAttachment("data/vis/flamingo/layer1_1_conv1/feature_009.png"),
flamingo_layer1_1_conv1_10: FileAttachment("data/vis/flamingo/layer1_1_conv1/feature_010.png"),
flamingo_layer1_1_conv1_11: FileAttachment("data/vis/flamingo/layer1_1_conv1/feature_011.png"),
flamingo_layer1_1_conv1_12: FileAttachment("data/vis/flamingo/layer1_1_conv1/feature_012.png"),
flamingo_layer1_1_conv1_13: FileAttachment("data/vis/flamingo/layer1_1_conv1/feature_013.png"),
flamingo_layer1_1_conv1_14: FileAttachment("data/vis/flamingo/layer1_1_conv1/feature_014.png"),
flamingo_layer1_1_conv1_15: FileAttachment("data/vis/flamingo/layer1_1_conv1/feature_015.png"),
flamingo_layer1_1_conv2_0: FileAttachment("data/vis/flamingo/layer1_1_conv2/feature_000.png"),
flamingo_layer1_1_conv2_1: FileAttachment("data/vis/flamingo/layer1_1_conv2/feature_001.png"),
flamingo_layer1_1_conv2_2: FileAttachment("data/vis/flamingo/layer1_1_conv2/feature_002.png"),
flamingo_layer1_1_conv2_3: FileAttachment("data/vis/flamingo/layer1_1_conv2/feature_003.png"),
flamingo_layer1_1_conv2_4: FileAttachment("data/vis/flamingo/layer1_1_conv2/feature_004.png"),
flamingo_layer1_1_conv2_5: FileAttachment("data/vis/flamingo/layer1_1_conv2/feature_005.png"),
flamingo_layer1_1_conv2_6: FileAttachment("data/vis/flamingo/layer1_1_conv2/feature_006.png"),
flamingo_layer1_1_conv2_7: FileAttachment("data/vis/flamingo/layer1_1_conv2/feature_007.png"),
flamingo_layer1_1_conv2_8: FileAttachment("data/vis/flamingo/layer1_1_conv2/feature_008.png"),
flamingo_layer1_1_conv2_9: FileAttachment("data/vis/flamingo/layer1_1_conv2/feature_009.png"),
flamingo_layer1_1_conv2_10: FileAttachment("data/vis/flamingo/layer1_1_conv2/feature_010.png"),
flamingo_layer1_1_conv2_11: FileAttachment("data/vis/flamingo/layer1_1_conv2/feature_011.png"),
flamingo_layer1_1_conv2_12: FileAttachment("data/vis/flamingo/layer1_1_conv2/feature_012.png"),
flamingo_layer1_1_conv2_13: FileAttachment("data/vis/flamingo/layer1_1_conv2/feature_013.png"),
flamingo_layer1_1_conv2_14: FileAttachment("data/vis/flamingo/layer1_1_conv2/feature_014.png"),
flamingo_layer1_1_conv2_15: FileAttachment("data/vis/flamingo/layer1_1_conv2/feature_015.png"),
flamingo_layer2_0_conv1_0: FileAttachment("data/vis/flamingo/layer2_0_conv1/feature_000.png"),
flamingo_layer2_0_conv1_1: FileAttachment("data/vis/flamingo/layer2_0_conv1/feature_001.png"),
flamingo_layer2_0_conv1_2: FileAttachment("data/vis/flamingo/layer2_0_conv1/feature_002.png"),
flamingo_layer2_0_conv1_3: FileAttachment("data/vis/flamingo/layer2_0_conv1/feature_003.png"),
flamingo_layer2_0_conv1_4: FileAttachment("data/vis/flamingo/layer2_0_conv1/feature_004.png"),
flamingo_layer2_0_conv1_5: FileAttachment("data/vis/flamingo/layer2_0_conv1/feature_005.png"),
flamingo_layer2_0_conv1_6: FileAttachment("data/vis/flamingo/layer2_0_conv1/feature_006.png"),
flamingo_layer2_0_conv1_7: FileAttachment("data/vis/flamingo/layer2_0_conv1/feature_007.png"),
flamingo_layer2_0_conv1_8: FileAttachment("data/vis/flamingo/layer2_0_conv1/feature_008.png"),
flamingo_layer2_0_conv1_9: FileAttachment("data/vis/flamingo/layer2_0_conv1/feature_009.png"),
flamingo_layer2_0_conv1_10: FileAttachment("data/vis/flamingo/layer2_0_conv1/feature_010.png"),
flamingo_layer2_0_conv1_11: FileAttachment("data/vis/flamingo/layer2_0_conv1/feature_011.png"),
flamingo_layer2_0_conv1_12: FileAttachment("data/vis/flamingo/layer2_0_conv1/feature_012.png"),
flamingo_layer2_0_conv1_13: FileAttachment("data/vis/flamingo/layer2_0_conv1/feature_013.png"),
flamingo_layer2_0_conv1_14: FileAttachment("data/vis/flamingo/layer2_0_conv1/feature_014.png"),
flamingo_layer2_0_conv1_15: FileAttachment("data/vis/flamingo/layer2_0_conv1/feature_015.png"),
flamingo_layer2_0_conv2_0: FileAttachment("data/vis/flamingo/layer2_0_conv2/feature_000.png"),
flamingo_layer2_0_conv2_1: FileAttachment("data/vis/flamingo/layer2_0_conv2/feature_001.png"),
flamingo_layer2_0_conv2_2: FileAttachment("data/vis/flamingo/layer2_0_conv2/feature_002.png"),
flamingo_layer2_0_conv2_3: FileAttachment("data/vis/flamingo/layer2_0_conv2/feature_003.png"),
flamingo_layer2_0_conv2_4: FileAttachment("data/vis/flamingo/layer2_0_conv2/feature_004.png"),
flamingo_layer2_0_conv2_5: FileAttachment("data/vis/flamingo/layer2_0_conv2/feature_005.png"),
flamingo_layer2_0_conv2_6: FileAttachment("data/vis/flamingo/layer2_0_conv2/feature_006.png"),
flamingo_layer2_0_conv2_7: FileAttachment("data/vis/flamingo/layer2_0_conv2/feature_007.png"),
flamingo_layer2_0_conv2_8: FileAttachment("data/vis/flamingo/layer2_0_conv2/feature_008.png"),
flamingo_layer2_0_conv2_9: FileAttachment("data/vis/flamingo/layer2_0_conv2/feature_009.png"),
flamingo_layer2_0_conv2_10: FileAttachment("data/vis/flamingo/layer2_0_conv2/feature_010.png"),
flamingo_layer2_0_conv2_11: FileAttachment("data/vis/flamingo/layer2_0_conv2/feature_011.png"),
flamingo_layer2_0_conv2_12: FileAttachment("data/vis/flamingo/layer2_0_conv2/feature_012.png"),
flamingo_layer2_0_conv2_13: FileAttachment("data/vis/flamingo/layer2_0_conv2/feature_013.png"),
flamingo_layer2_0_conv2_14: FileAttachment("data/vis/flamingo/layer2_0_conv2/feature_014.png"),
flamingo_layer2_0_conv2_15: FileAttachment("data/vis/flamingo/layer2_0_conv2/feature_015.png"),
flamingo_layer2_1_conv1_0: FileAttachment("data/vis/flamingo/layer2_1_conv1/feature_000.png"),
flamingo_layer2_1_conv1_1: FileAttachment("data/vis/flamingo/layer2_1_conv1/feature_001.png"),
flamingo_layer2_1_conv1_2: FileAttachment("data/vis/flamingo/layer2_1_conv1/feature_002.png"),
flamingo_layer2_1_conv1_3: FileAttachment("data/vis/flamingo/layer2_1_conv1/feature_003.png"),
flamingo_layer2_1_conv1_4: FileAttachment("data/vis/flamingo/layer2_1_conv1/feature_004.png"),
flamingo_layer2_1_conv1_5: FileAttachment("data/vis/flamingo/layer2_1_conv1/feature_005.png"),
flamingo_layer2_1_conv1_6: FileAttachment("data/vis/flamingo/layer2_1_conv1/feature_006.png"),
flamingo_layer2_1_conv1_7: FileAttachment("data/vis/flamingo/layer2_1_conv1/feature_007.png"),
flamingo_layer2_1_conv1_8: FileAttachment("data/vis/flamingo/layer2_1_conv1/feature_008.png"),
flamingo_layer2_1_conv1_9: FileAttachment("data/vis/flamingo/layer2_1_conv1/feature_009.png"),
flamingo_layer2_1_conv1_10: FileAttachment("data/vis/flamingo/layer2_1_conv1/feature_010.png"),
flamingo_layer2_1_conv1_11: FileAttachment("data/vis/flamingo/layer2_1_conv1/feature_011.png"),
flamingo_layer2_1_conv1_12: FileAttachment("data/vis/flamingo/layer2_1_conv1/feature_012.png"),
flamingo_layer2_1_conv1_13: FileAttachment("data/vis/flamingo/layer2_1_conv1/feature_013.png"),
flamingo_layer2_1_conv1_14: FileAttachment("data/vis/flamingo/layer2_1_conv1/feature_014.png"),
flamingo_layer2_1_conv1_15: FileAttachment("data/vis/flamingo/layer2_1_conv1/feature_015.png"),
flamingo_layer2_1_conv2_0: FileAttachment("data/vis/flamingo/layer2_1_conv2/feature_000.png"),
flamingo_layer2_1_conv2_1: FileAttachment("data/vis/flamingo/layer2_1_conv2/feature_001.png"),
flamingo_layer2_1_conv2_2: FileAttachment("data/vis/flamingo/layer2_1_conv2/feature_002.png"),
flamingo_layer2_1_conv2_3: FileAttachment("data/vis/flamingo/layer2_1_conv2/feature_003.png"),
flamingo_layer2_1_conv2_4: FileAttachment("data/vis/flamingo/layer2_1_conv2/feature_004.png"),
flamingo_layer2_1_conv2_5: FileAttachment("data/vis/flamingo/layer2_1_conv2/feature_005.png"),
flamingo_layer2_1_conv2_6: FileAttachment("data/vis/flamingo/layer2_1_conv2/feature_006.png"),
flamingo_layer2_1_conv2_7: FileAttachment("data/vis/flamingo/layer2_1_conv2/feature_007.png"),
flamingo_layer2_1_conv2_8: FileAttachment("data/vis/flamingo/layer2_1_conv2/feature_008.png"),
flamingo_layer2_1_conv2_9: FileAttachment("data/vis/flamingo/layer2_1_conv2/feature_009.png"),
flamingo_layer2_1_conv2_10: FileAttachment("data/vis/flamingo/layer2_1_conv2/feature_010.png"),
flamingo_layer2_1_conv2_11: FileAttachment("data/vis/flamingo/layer2_1_conv2/feature_011.png"),
flamingo_layer2_1_conv2_12: FileAttachment("data/vis/flamingo/layer2_1_conv2/feature_012.png"),
flamingo_layer2_1_conv2_13: FileAttachment("data/vis/flamingo/layer2_1_conv2/feature_013.png"),
flamingo_layer2_1_conv2_14: FileAttachment("data/vis/flamingo/layer2_1_conv2/feature_014.png"),
flamingo_layer2_1_conv2_15: FileAttachment("data/vis/flamingo/layer2_1_conv2/feature_015.png"),
flamingo_layer3_0_conv1_0: FileAttachment("data/vis/flamingo/layer3_0_conv1/feature_000.png"),
flamingo_layer3_0_conv1_1: FileAttachment("data/vis/flamingo/layer3_0_conv1/feature_001.png"),
flamingo_layer3_0_conv1_2: FileAttachment("data/vis/flamingo/layer3_0_conv1/feature_002.png"),
flamingo_layer3_0_conv1_3: FileAttachment("data/vis/flamingo/layer3_0_conv1/feature_003.png"),
flamingo_layer3_0_conv1_4: FileAttachment("data/vis/flamingo/layer3_0_conv1/feature_004.png"),
flamingo_layer3_0_conv1_5: FileAttachment("data/vis/flamingo/layer3_0_conv1/feature_005.png"),
flamingo_layer3_0_conv1_6: FileAttachment("data/vis/flamingo/layer3_0_conv1/feature_006.png"),
flamingo_layer3_0_conv1_7: FileAttachment("data/vis/flamingo/layer3_0_conv1/feature_007.png"),
flamingo_layer3_0_conv1_8: FileAttachment("data/vis/flamingo/layer3_0_conv1/feature_008.png"),
flamingo_layer3_0_conv1_9: FileAttachment("data/vis/flamingo/layer3_0_conv1/feature_009.png"),
flamingo_layer3_0_conv1_10: FileAttachment("data/vis/flamingo/layer3_0_conv1/feature_010.png"),
flamingo_layer3_0_conv1_11: FileAttachment("data/vis/flamingo/layer3_0_conv1/feature_011.png"),
flamingo_layer3_0_conv1_12: FileAttachment("data/vis/flamingo/layer3_0_conv1/feature_012.png"),
flamingo_layer3_0_conv1_13: FileAttachment("data/vis/flamingo/layer3_0_conv1/feature_013.png"),
flamingo_layer3_0_conv1_14: FileAttachment("data/vis/flamingo/layer3_0_conv1/feature_014.png"),
flamingo_layer3_0_conv1_15: FileAttachment("data/vis/flamingo/layer3_0_conv1/feature_015.png"),
flamingo_layer3_0_conv2_0: FileAttachment("data/vis/flamingo/layer3_0_conv2/feature_000.png"),
flamingo_layer3_0_conv2_1: FileAttachment("data/vis/flamingo/layer3_0_conv2/feature_001.png"),
flamingo_layer3_0_conv2_2: FileAttachment("data/vis/flamingo/layer3_0_conv2/feature_002.png"),
flamingo_layer3_0_conv2_3: FileAttachment("data/vis/flamingo/layer3_0_conv2/feature_003.png"),
flamingo_layer3_0_conv2_4: FileAttachment("data/vis/flamingo/layer3_0_conv2/feature_004.png"),
flamingo_layer3_0_conv2_5: FileAttachment("data/vis/flamingo/layer3_0_conv2/feature_005.png"),
flamingo_layer3_0_conv2_6: FileAttachment("data/vis/flamingo/layer3_0_conv2/feature_006.png"),
flamingo_layer3_0_conv2_7: FileAttachment("data/vis/flamingo/layer3_0_conv2/feature_007.png"),
flamingo_layer3_0_conv2_8: FileAttachment("data/vis/flamingo/layer3_0_conv2/feature_008.png"),
flamingo_layer3_0_conv2_9: FileAttachment("data/vis/flamingo/layer3_0_conv2/feature_009.png"),
flamingo_layer3_0_conv2_10: FileAttachment("data/vis/flamingo/layer3_0_conv2/feature_010.png"),
flamingo_layer3_0_conv2_11: FileAttachment("data/vis/flamingo/layer3_0_conv2/feature_011.png"),
flamingo_layer3_0_conv2_12: FileAttachment("data/vis/flamingo/layer3_0_conv2/feature_012.png"),
flamingo_layer3_0_conv2_13: FileAttachment("data/vis/flamingo/layer3_0_conv2/feature_013.png"),
flamingo_layer3_0_conv2_14: FileAttachment("data/vis/flamingo/layer3_0_conv2/feature_014.png"),
flamingo_layer3_0_conv2_15: FileAttachment("data/vis/flamingo/layer3_0_conv2/feature_015.png"),
flamingo_layer3_1_conv1_0: FileAttachment("data/vis/flamingo/layer3_1_conv1/feature_000.png"),
flamingo_layer3_1_conv1_1: FileAttachment("data/vis/flamingo/layer3_1_conv1/feature_001.png"),
flamingo_layer3_1_conv1_2: FileAttachment("data/vis/flamingo/layer3_1_conv1/feature_002.png"),
flamingo_layer3_1_conv1_3: FileAttachment("data/vis/flamingo/layer3_1_conv1/feature_003.png"),
flamingo_layer3_1_conv1_4: FileAttachment("data/vis/flamingo/layer3_1_conv1/feature_004.png"),
flamingo_layer3_1_conv1_5: FileAttachment("data/vis/flamingo/layer3_1_conv1/feature_005.png"),
flamingo_layer3_1_conv1_6: FileAttachment("data/vis/flamingo/layer3_1_conv1/feature_006.png"),
flamingo_layer3_1_conv1_7: FileAttachment("data/vis/flamingo/layer3_1_conv1/feature_007.png"),
flamingo_layer3_1_conv1_8: FileAttachment("data/vis/flamingo/layer3_1_conv1/feature_008.png"),
flamingo_layer3_1_conv1_9: FileAttachment("data/vis/flamingo/layer3_1_conv1/feature_009.png"),
flamingo_layer3_1_conv1_10: FileAttachment("data/vis/flamingo/layer3_1_conv1/feature_010.png"),
flamingo_layer3_1_conv1_11: FileAttachment("data/vis/flamingo/layer3_1_conv1/feature_011.png"),
flamingo_layer3_1_conv1_12: FileAttachment("data/vis/flamingo/layer3_1_conv1/feature_012.png"),
flamingo_layer3_1_conv1_13: FileAttachment("data/vis/flamingo/layer3_1_conv1/feature_013.png"),
flamingo_layer3_1_conv1_14: FileAttachment("data/vis/flamingo/layer3_1_conv1/feature_014.png"),
flamingo_layer3_1_conv1_15: FileAttachment("data/vis/flamingo/layer3_1_conv1/feature_015.png"),
flamingo_layer3_1_conv2_0: FileAttachment("data/vis/flamingo/layer3_1_conv2/feature_000.png"),
flamingo_layer3_1_conv2_1: FileAttachment("data/vis/flamingo/layer3_1_conv2/feature_001.png"),
flamingo_layer3_1_conv2_2: FileAttachment("data/vis/flamingo/layer3_1_conv2/feature_002.png"),
flamingo_layer3_1_conv2_3: FileAttachment("data/vis/flamingo/layer3_1_conv2/feature_003.png"),
flamingo_layer3_1_conv2_4: FileAttachment("data/vis/flamingo/layer3_1_conv2/feature_004.png"),
flamingo_layer3_1_conv2_5: FileAttachment("data/vis/flamingo/layer3_1_conv2/feature_005.png"),
flamingo_layer3_1_conv2_6: FileAttachment("data/vis/flamingo/layer3_1_conv2/feature_006.png"),
flamingo_layer3_1_conv2_7: FileAttachment("data/vis/flamingo/layer3_1_conv2/feature_007.png"),
flamingo_layer3_1_conv2_8: FileAttachment("data/vis/flamingo/layer3_1_conv2/feature_008.png"),
flamingo_layer3_1_conv2_9: FileAttachment("data/vis/flamingo/layer3_1_conv2/feature_009.png"),
flamingo_layer3_1_conv2_10: FileAttachment("data/vis/flamingo/layer3_1_conv2/feature_010.png"),
flamingo_layer3_1_conv2_11: FileAttachment("data/vis/flamingo/layer3_1_conv2/feature_011.png"),
flamingo_layer3_1_conv2_12: FileAttachment("data/vis/flamingo/layer3_1_conv2/feature_012.png"),
flamingo_layer3_1_conv2_13: FileAttachment("data/vis/flamingo/layer3_1_conv2/feature_013.png"),
flamingo_layer3_1_conv2_14: FileAttachment("data/vis/flamingo/layer3_1_conv2/feature_014.png"),
flamingo_layer3_1_conv2_15: FileAttachment("data/vis/flamingo/layer3_1_conv2/feature_015.png"),
flamingo_layer4_0_conv1_0: FileAttachment("data/vis/flamingo/layer4_0_conv1/feature_000.png"),
flamingo_layer4_0_conv1_1: FileAttachment("data/vis/flamingo/layer4_0_conv1/feature_001.png"),
flamingo_layer4_0_conv1_2: FileAttachment("data/vis/flamingo/layer4_0_conv1/feature_002.png"),
flamingo_layer4_0_conv1_3: FileAttachment("data/vis/flamingo/layer4_0_conv1/feature_003.png"),
flamingo_layer4_0_conv1_4: FileAttachment("data/vis/flamingo/layer4_0_conv1/feature_004.png"),
flamingo_layer4_0_conv1_5: FileAttachment("data/vis/flamingo/layer4_0_conv1/feature_005.png"),
flamingo_layer4_0_conv1_6: FileAttachment("data/vis/flamingo/layer4_0_conv1/feature_006.png"),
flamingo_layer4_0_conv1_7: FileAttachment("data/vis/flamingo/layer4_0_conv1/feature_007.png"),
flamingo_layer4_0_conv1_8: FileAttachment("data/vis/flamingo/layer4_0_conv1/feature_008.png"),
flamingo_layer4_0_conv1_9: FileAttachment("data/vis/flamingo/layer4_0_conv1/feature_009.png"),
flamingo_layer4_0_conv1_10: FileAttachment("data/vis/flamingo/layer4_0_conv1/feature_010.png"),
flamingo_layer4_0_conv1_11: FileAttachment("data/vis/flamingo/layer4_0_conv1/feature_011.png"),
flamingo_layer4_0_conv1_12: FileAttachment("data/vis/flamingo/layer4_0_conv1/feature_012.png"),
flamingo_layer4_0_conv1_13: FileAttachment("data/vis/flamingo/layer4_0_conv1/feature_013.png"),
flamingo_layer4_0_conv1_14: FileAttachment("data/vis/flamingo/layer4_0_conv1/feature_014.png"),
flamingo_layer4_0_conv1_15: FileAttachment("data/vis/flamingo/layer4_0_conv1/feature_015.png"),
flamingo_layer4_0_conv2_0: FileAttachment("data/vis/flamingo/layer4_0_conv2/feature_000.png"),
flamingo_layer4_0_conv2_1: FileAttachment("data/vis/flamingo/layer4_0_conv2/feature_001.png"),
flamingo_layer4_0_conv2_2: FileAttachment("data/vis/flamingo/layer4_0_conv2/feature_002.png"),
flamingo_layer4_0_conv2_3: FileAttachment("data/vis/flamingo/layer4_0_conv2/feature_003.png"),
flamingo_layer4_0_conv2_4: FileAttachment("data/vis/flamingo/layer4_0_conv2/feature_004.png"),
flamingo_layer4_0_conv2_5: FileAttachment("data/vis/flamingo/layer4_0_conv2/feature_005.png"),
flamingo_layer4_0_conv2_6: FileAttachment("data/vis/flamingo/layer4_0_conv2/feature_006.png"),
flamingo_layer4_0_conv2_7: FileAttachment("data/vis/flamingo/layer4_0_conv2/feature_007.png"),
flamingo_layer4_0_conv2_8: FileAttachment("data/vis/flamingo/layer4_0_conv2/feature_008.png"),
flamingo_layer4_0_conv2_9: FileAttachment("data/vis/flamingo/layer4_0_conv2/feature_009.png"),
flamingo_layer4_0_conv2_10: FileAttachment("data/vis/flamingo/layer4_0_conv2/feature_010.png"),
flamingo_layer4_0_conv2_11: FileAttachment("data/vis/flamingo/layer4_0_conv2/feature_011.png"),
flamingo_layer4_0_conv2_12: FileAttachment("data/vis/flamingo/layer4_0_conv2/feature_012.png"),
flamingo_layer4_0_conv2_13: FileAttachment("data/vis/flamingo/layer4_0_conv2/feature_013.png"),
flamingo_layer4_0_conv2_14: FileAttachment("data/vis/flamingo/layer4_0_conv2/feature_014.png"),
flamingo_layer4_0_conv2_15: FileAttachment("data/vis/flamingo/layer4_0_conv2/feature_015.png"),
flamingo_layer4_1_conv1_0: FileAttachment("data/vis/flamingo/layer4_1_conv1/feature_000.png"),
flamingo_layer4_1_conv1_1: FileAttachment("data/vis/flamingo/layer4_1_conv1/feature_001.png"),
flamingo_layer4_1_conv1_2: FileAttachment("data/vis/flamingo/layer4_1_conv1/feature_002.png"),
flamingo_layer4_1_conv1_3: FileAttachment("data/vis/flamingo/layer4_1_conv1/feature_003.png"),
flamingo_layer4_1_conv1_4: FileAttachment("data/vis/flamingo/layer4_1_conv1/feature_004.png"),
flamingo_layer4_1_conv1_5: FileAttachment("data/vis/flamingo/layer4_1_conv1/feature_005.png"),
flamingo_layer4_1_conv1_6: FileAttachment("data/vis/flamingo/layer4_1_conv1/feature_006.png"),
flamingo_layer4_1_conv1_7: FileAttachment("data/vis/flamingo/layer4_1_conv1/feature_007.png"),
flamingo_layer4_1_conv1_8: FileAttachment("data/vis/flamingo/layer4_1_conv1/feature_008.png"),
flamingo_layer4_1_conv1_9: FileAttachment("data/vis/flamingo/layer4_1_conv1/feature_009.png"),
flamingo_layer4_1_conv1_10: FileAttachment("data/vis/flamingo/layer4_1_conv1/feature_010.png"),
flamingo_layer4_1_conv1_11: FileAttachment("data/vis/flamingo/layer4_1_conv1/feature_011.png"),
flamingo_layer4_1_conv1_12: FileAttachment("data/vis/flamingo/layer4_1_conv1/feature_012.png"),
flamingo_layer4_1_conv1_13: FileAttachment("data/vis/flamingo/layer4_1_conv1/feature_013.png"),
flamingo_layer4_1_conv1_14: FileAttachment("data/vis/flamingo/layer4_1_conv1/feature_014.png"),
flamingo_layer4_1_conv1_15: FileAttachment("data/vis/flamingo/layer4_1_conv1/feature_015.png"),
flamingo_layer4_1_conv2_0: FileAttachment("data/vis/flamingo/layer4_1_conv2/feature_000.png"),
flamingo_layer4_1_conv2_1: FileAttachment("data/vis/flamingo/layer4_1_conv2/feature_001.png"),
flamingo_layer4_1_conv2_2: FileAttachment("data/vis/flamingo/layer4_1_conv2/feature_002.png"),
flamingo_layer4_1_conv2_3: FileAttachment("data/vis/flamingo/layer4_1_conv2/feature_003.png"),
flamingo_layer4_1_conv2_4: FileAttachment("data/vis/flamingo/layer4_1_conv2/feature_004.png"),
flamingo_layer4_1_conv2_5: FileAttachment("data/vis/flamingo/layer4_1_conv2/feature_005.png"),
flamingo_layer4_1_conv2_6: FileAttachment("data/vis/flamingo/layer4_1_conv2/feature_006.png"),
flamingo_layer4_1_conv2_7: FileAttachment("data/vis/flamingo/layer4_1_conv2/feature_007.png"),
flamingo_layer4_1_conv2_8: FileAttachment("data/vis/flamingo/layer4_1_conv2/feature_008.png"),
flamingo_layer4_1_conv2_9: FileAttachment("data/vis/flamingo/layer4_1_conv2/feature_009.png"),
flamingo_layer4_1_conv2_10: FileAttachment("data/vis/flamingo/layer4_1_conv2/feature_010.png"),
flamingo_layer4_1_conv2_11: FileAttachment("data/vis/flamingo/layer4_1_conv2/feature_011.png"),
flamingo_layer4_1_conv2_12: FileAttachment("data/vis/flamingo/layer4_1_conv2/feature_012.png"),
flamingo_layer4_1_conv2_13: FileAttachment("data/vis/flamingo/layer4_1_conv2/feature_013.png"),
flamingo_layer4_1_conv2_14: FileAttachment("data/vis/flamingo/layer4_1_conv2/feature_014.png"),
flamingo_layer4_1_conv2_15: FileAttachment("data/vis/flamingo/layer4_1_conv2/feature_015.png"),
labrador: FileAttachment("data/vis/labrador/labrador.png"),
labrador_conv1_0: FileAttachment("data/vis/labrador/conv1/feature_000.png"),
labrador_conv1_1: FileAttachment("data/vis/labrador/conv1/feature_001.png"),
labrador_conv1_2: FileAttachment("data/vis/labrador/conv1/feature_002.png"),
labrador_conv1_3: FileAttachment("data/vis/labrador/conv1/feature_003.png"),
labrador_conv1_4: FileAttachment("data/vis/labrador/conv1/feature_004.png"),
labrador_conv1_5: FileAttachment("data/vis/labrador/conv1/feature_005.png"),
labrador_conv1_6: FileAttachment("data/vis/labrador/conv1/feature_006.png"),
labrador_conv1_7: FileAttachment("data/vis/labrador/conv1/feature_007.png"),
labrador_conv1_8: FileAttachment("data/vis/labrador/conv1/feature_008.png"),
labrador_conv1_9: FileAttachment("data/vis/labrador/conv1/feature_009.png"),
labrador_conv1_10: FileAttachment("data/vis/labrador/conv1/feature_010.png"),
labrador_conv1_11: FileAttachment("data/vis/labrador/conv1/feature_011.png"),
labrador_conv1_12: FileAttachment("data/vis/labrador/conv1/feature_012.png"),
labrador_conv1_13: FileAttachment("data/vis/labrador/conv1/feature_013.png"),
labrador_conv1_14: FileAttachment("data/vis/labrador/conv1/feature_014.png"),
labrador_conv1_15: FileAttachment("data/vis/labrador/conv1/feature_015.png"),
labrador_layer1_0_conv1_0: FileAttachment("data/vis/labrador/layer1_0_conv1/feature_000.png"),
labrador_layer1_0_conv1_1: FileAttachment("data/vis/labrador/layer1_0_conv1/feature_001.png"),
labrador_layer1_0_conv1_2: FileAttachment("data/vis/labrador/layer1_0_conv1/feature_002.png"),
labrador_layer1_0_conv1_3: FileAttachment("data/vis/labrador/layer1_0_conv1/feature_003.png"),
labrador_layer1_0_conv1_4: FileAttachment("data/vis/labrador/layer1_0_conv1/feature_004.png"),
labrador_layer1_0_conv1_5: FileAttachment("data/vis/labrador/layer1_0_conv1/feature_005.png"),
labrador_layer1_0_conv1_6: FileAttachment("data/vis/labrador/layer1_0_conv1/feature_006.png"),
labrador_layer1_0_conv1_7: FileAttachment("data/vis/labrador/layer1_0_conv1/feature_007.png"),
labrador_layer1_0_conv1_8: FileAttachment("data/vis/labrador/layer1_0_conv1/feature_008.png"),
labrador_layer1_0_conv1_9: FileAttachment("data/vis/labrador/layer1_0_conv1/feature_009.png"),
labrador_layer1_0_conv1_10: FileAttachment("data/vis/labrador/layer1_0_conv1/feature_010.png"),
labrador_layer1_0_conv1_11: FileAttachment("data/vis/labrador/layer1_0_conv1/feature_011.png"),
labrador_layer1_0_conv1_12: FileAttachment("data/vis/labrador/layer1_0_conv1/feature_012.png"),
labrador_layer1_0_conv1_13: FileAttachment("data/vis/labrador/layer1_0_conv1/feature_013.png"),
labrador_layer1_0_conv1_14: FileAttachment("data/vis/labrador/layer1_0_conv1/feature_014.png"),
labrador_layer1_0_conv1_15: FileAttachment("data/vis/labrador/layer1_0_conv1/feature_015.png"),
labrador_layer1_0_conv2_0: FileAttachment("data/vis/labrador/layer1_0_conv2/feature_000.png"),
labrador_layer1_0_conv2_1: FileAttachment("data/vis/labrador/layer1_0_conv2/feature_001.png"),
labrador_layer1_0_conv2_2: FileAttachment("data/vis/labrador/layer1_0_conv2/feature_002.png"),
labrador_layer1_0_conv2_3: FileAttachment("data/vis/labrador/layer1_0_conv2/feature_003.png"),
labrador_layer1_0_conv2_4: FileAttachment("data/vis/labrador/layer1_0_conv2/feature_004.png"),
labrador_layer1_0_conv2_5: FileAttachment("data/vis/labrador/layer1_0_conv2/feature_005.png"),
labrador_layer1_0_conv2_6: FileAttachment("data/vis/labrador/layer1_0_conv2/feature_006.png"),
labrador_layer1_0_conv2_7: FileAttachment("data/vis/labrador/layer1_0_conv2/feature_007.png"),
labrador_layer1_0_conv2_8: FileAttachment("data/vis/labrador/layer1_0_conv2/feature_008.png"),
labrador_layer1_0_conv2_9: FileAttachment("data/vis/labrador/layer1_0_conv2/feature_009.png"),
labrador_layer1_0_conv2_10: FileAttachment("data/vis/labrador/layer1_0_conv2/feature_010.png"),
labrador_layer1_0_conv2_11: FileAttachment("data/vis/labrador/layer1_0_conv2/feature_011.png"),
labrador_layer1_0_conv2_12: FileAttachment("data/vis/labrador/layer1_0_conv2/feature_012.png"),
labrador_layer1_0_conv2_13: FileAttachment("data/vis/labrador/layer1_0_conv2/feature_013.png"),
labrador_layer1_0_conv2_14: FileAttachment("data/vis/labrador/layer1_0_conv2/feature_014.png"),
labrador_layer1_0_conv2_15: FileAttachment("data/vis/labrador/layer1_0_conv2/feature_015.png"),
labrador_layer1_1_conv1_0: FileAttachment("data/vis/labrador/layer1_1_conv1/feature_000.png"),
labrador_layer1_1_conv1_1: FileAttachment("data/vis/labrador/layer1_1_conv1/feature_001.png"),
labrador_layer1_1_conv1_2: FileAttachment("data/vis/labrador/layer1_1_conv1/feature_002.png"),
labrador_layer1_1_conv1_3: FileAttachment("data/vis/labrador/layer1_1_conv1/feature_003.png"),
labrador_layer1_1_conv1_4: FileAttachment("data/vis/labrador/layer1_1_conv1/feature_004.png"),
labrador_layer1_1_conv1_5: FileAttachment("data/vis/labrador/layer1_1_conv1/feature_005.png"),
labrador_layer1_1_conv1_6: FileAttachment("data/vis/labrador/layer1_1_conv1/feature_006.png"),
labrador_layer1_1_conv1_7: FileAttachment("data/vis/labrador/layer1_1_conv1/feature_007.png"),
labrador_layer1_1_conv1_8: FileAttachment("data/vis/labrador/layer1_1_conv1/feature_008.png"),
labrador_layer1_1_conv1_9: FileAttachment("data/vis/labrador/layer1_1_conv1/feature_009.png"),
labrador_layer1_1_conv1_10: FileAttachment("data/vis/labrador/layer1_1_conv1/feature_010.png"),
labrador_layer1_1_conv1_11: FileAttachment("data/vis/labrador/layer1_1_conv1/feature_011.png"),
labrador_layer1_1_conv1_12: FileAttachment("data/vis/labrador/layer1_1_conv1/feature_012.png"),
labrador_layer1_1_conv1_13: FileAttachment("data/vis/labrador/layer1_1_conv1/feature_013.png"),
labrador_layer1_1_conv1_14: FileAttachment("data/vis/labrador/layer1_1_conv1/feature_014.png"),
labrador_layer1_1_conv1_15: FileAttachment("data/vis/labrador/layer1_1_conv1/feature_015.png"),
labrador_layer1_1_conv2_0: FileAttachment("data/vis/labrador/layer1_1_conv2/feature_000.png"),
labrador_layer1_1_conv2_1: FileAttachment("data/vis/labrador/layer1_1_conv2/feature_001.png"),
labrador_layer1_1_conv2_2: FileAttachment("data/vis/labrador/layer1_1_conv2/feature_002.png"),
labrador_layer1_1_conv2_3: FileAttachment("data/vis/labrador/layer1_1_conv2/feature_003.png"),
labrador_layer1_1_conv2_4: FileAttachment("data/vis/labrador/layer1_1_conv2/feature_004.png"),
labrador_layer1_1_conv2_5: FileAttachment("data/vis/labrador/layer1_1_conv2/feature_005.png"),
labrador_layer1_1_conv2_6: FileAttachment("data/vis/labrador/layer1_1_conv2/feature_006.png"),
labrador_layer1_1_conv2_7: FileAttachment("data/vis/labrador/layer1_1_conv2/feature_007.png"),
labrador_layer1_1_conv2_8: FileAttachment("data/vis/labrador/layer1_1_conv2/feature_008.png"),
labrador_layer1_1_conv2_9: FileAttachment("data/vis/labrador/layer1_1_conv2/feature_009.png"),
labrador_layer1_1_conv2_10: FileAttachment("data/vis/labrador/layer1_1_conv2/feature_010.png"),
labrador_layer1_1_conv2_11: FileAttachment("data/vis/labrador/layer1_1_conv2/feature_011.png"),
labrador_layer1_1_conv2_12: FileAttachment("data/vis/labrador/layer1_1_conv2/feature_012.png"),
labrador_layer1_1_conv2_13: FileAttachment("data/vis/labrador/layer1_1_conv2/feature_013.png"),
labrador_layer1_1_conv2_14: FileAttachment("data/vis/labrador/layer1_1_conv2/feature_014.png"),
labrador_layer1_1_conv2_15: FileAttachment("data/vis/labrador/layer1_1_conv2/feature_015.png"),
labrador_layer2_0_conv1_0: FileAttachment("data/vis/labrador/layer2_0_conv1/feature_000.png"),
labrador_layer2_0_conv1_1: FileAttachment("data/vis/labrador/layer2_0_conv1/feature_001.png"),
labrador_layer2_0_conv1_2: FileAttachment("data/vis/labrador/layer2_0_conv1/feature_002.png"),
labrador_layer2_0_conv1_3: FileAttachment("data/vis/labrador/layer2_0_conv1/feature_003.png"),
labrador_layer2_0_conv1_4: FileAttachment("data/vis/labrador/layer2_0_conv1/feature_004.png"),
labrador_layer2_0_conv1_5: FileAttachment("data/vis/labrador/layer2_0_conv1/feature_005.png"),
labrador_layer2_0_conv1_6: FileAttachment("data/vis/labrador/layer2_0_conv1/feature_006.png"),
labrador_layer2_0_conv1_7: FileAttachment("data/vis/labrador/layer2_0_conv1/feature_007.png"),
labrador_layer2_0_conv1_8: FileAttachment("data/vis/labrador/layer2_0_conv1/feature_008.png"),
labrador_layer2_0_conv1_9: FileAttachment("data/vis/labrador/layer2_0_conv1/feature_009.png"),
labrador_layer2_0_conv1_10: FileAttachment("data/vis/labrador/layer2_0_conv1/feature_010.png"),
labrador_layer2_0_conv1_11: FileAttachment("data/vis/labrador/layer2_0_conv1/feature_011.png"),
labrador_layer2_0_conv1_12: FileAttachment("data/vis/labrador/layer2_0_conv1/feature_012.png"),
labrador_layer2_0_conv1_13: FileAttachment("data/vis/labrador/layer2_0_conv1/feature_013.png"),
labrador_layer2_0_conv1_14: FileAttachment("data/vis/labrador/layer2_0_conv1/feature_014.png"),
labrador_layer2_0_conv1_15: FileAttachment("data/vis/labrador/layer2_0_conv1/feature_015.png"),
labrador_layer2_0_conv2_0: FileAttachment("data/vis/labrador/layer2_0_conv2/feature_000.png"),
labrador_layer2_0_conv2_1: FileAttachment("data/vis/labrador/layer2_0_conv2/feature_001.png"),
labrador_layer2_0_conv2_2: FileAttachment("data/vis/labrador/layer2_0_conv2/feature_002.png"),
labrador_layer2_0_conv2_3: FileAttachment("data/vis/labrador/layer2_0_conv2/feature_003.png"),
labrador_layer2_0_conv2_4: FileAttachment("data/vis/labrador/layer2_0_conv2/feature_004.png"),
labrador_layer2_0_conv2_5: FileAttachment("data/vis/labrador/layer2_0_conv2/feature_005.png"),
labrador_layer2_0_conv2_6: FileAttachment("data/vis/labrador/layer2_0_conv2/feature_006.png"),
labrador_layer2_0_conv2_7: FileAttachment("data/vis/labrador/layer2_0_conv2/feature_007.png"),
labrador_layer2_0_conv2_8: FileAttachment("data/vis/labrador/layer2_0_conv2/feature_008.png"),
labrador_layer2_0_conv2_9: FileAttachment("data/vis/labrador/layer2_0_conv2/feature_009.png"),
labrador_layer2_0_conv2_10: FileAttachment("data/vis/labrador/layer2_0_conv2/feature_010.png"),
labrador_layer2_0_conv2_11: FileAttachment("data/vis/labrador/layer2_0_conv2/feature_011.png"),
labrador_layer2_0_conv2_12: FileAttachment("data/vis/labrador/layer2_0_conv2/feature_012.png"),
labrador_layer2_0_conv2_13: FileAttachment("data/vis/labrador/layer2_0_conv2/feature_013.png"),
labrador_layer2_0_conv2_14: FileAttachment("data/vis/labrador/layer2_0_conv2/feature_014.png"),
labrador_layer2_0_conv2_15: FileAttachment("data/vis/labrador/layer2_0_conv2/feature_015.png"),
labrador_layer2_1_conv1_0: FileAttachment("data/vis/labrador/layer2_1_conv1/feature_000.png"),
labrador_layer2_1_conv1_1: FileAttachment("data/vis/labrador/layer2_1_conv1/feature_001.png"),
labrador_layer2_1_conv1_2: FileAttachment("data/vis/labrador/layer2_1_conv1/feature_002.png"),
labrador_layer2_1_conv1_3: FileAttachment("data/vis/labrador/layer2_1_conv1/feature_003.png"),
labrador_layer2_1_conv1_4: FileAttachment("data/vis/labrador/layer2_1_conv1/feature_004.png"),
labrador_layer2_1_conv1_5: FileAttachment("data/vis/labrador/layer2_1_conv1/feature_005.png"),
labrador_layer2_1_conv1_6: FileAttachment("data/vis/labrador/layer2_1_conv1/feature_006.png"),
labrador_layer2_1_conv1_7: FileAttachment("data/vis/labrador/layer2_1_conv1/feature_007.png"),
labrador_layer2_1_conv1_8: FileAttachment("data/vis/labrador/layer2_1_conv1/feature_008.png"),
labrador_layer2_1_conv1_9: FileAttachment("data/vis/labrador/layer2_1_conv1/feature_009.png"),
labrador_layer2_1_conv1_10: FileAttachment("data/vis/labrador/layer2_1_conv1/feature_010.png"),
labrador_layer2_1_conv1_11: FileAttachment("data/vis/labrador/layer2_1_conv1/feature_011.png"),
labrador_layer2_1_conv1_12: FileAttachment("data/vis/labrador/layer2_1_conv1/feature_012.png"),
labrador_layer2_1_conv1_13: FileAttachment("data/vis/labrador/layer2_1_conv1/feature_013.png"),
labrador_layer2_1_conv1_14: FileAttachment("data/vis/labrador/layer2_1_conv1/feature_014.png"),
labrador_layer2_1_conv1_15: FileAttachment("data/vis/labrador/layer2_1_conv1/feature_015.png"),
labrador_layer2_1_conv2_0: FileAttachment("data/vis/labrador/layer2_1_conv2/feature_000.png"),
labrador_layer2_1_conv2_1: FileAttachment("data/vis/labrador/layer2_1_conv2/feature_001.png"),
labrador_layer2_1_conv2_2: FileAttachment("data/vis/labrador/layer2_1_conv2/feature_002.png"),
labrador_layer2_1_conv2_3: FileAttachment("data/vis/labrador/layer2_1_conv2/feature_003.png"),
labrador_layer2_1_conv2_4: FileAttachment("data/vis/labrador/layer2_1_conv2/feature_004.png"),
labrador_layer2_1_conv2_5: FileAttachment("data/vis/labrador/layer2_1_conv2/feature_005.png"),
labrador_layer2_1_conv2_6: FileAttachment("data/vis/labrador/layer2_1_conv2/feature_006.png"),
labrador_layer2_1_conv2_7: FileAttachment("data/vis/labrador/layer2_1_conv2/feature_007.png"),
labrador_layer2_1_conv2_8: FileAttachment("data/vis/labrador/layer2_1_conv2/feature_008.png"),
labrador_layer2_1_conv2_9: FileAttachment("data/vis/labrador/layer2_1_conv2/feature_009.png"),
labrador_layer2_1_conv2_10: FileAttachment("data/vis/labrador/layer2_1_conv2/feature_010.png"),
labrador_layer2_1_conv2_11: FileAttachment("data/vis/labrador/layer2_1_conv2/feature_011.png"),
labrador_layer2_1_conv2_12: FileAttachment("data/vis/labrador/layer2_1_conv2/feature_012.png"),
labrador_layer2_1_conv2_13: FileAttachment("data/vis/labrador/layer2_1_conv2/feature_013.png"),
labrador_layer2_1_conv2_14: FileAttachment("data/vis/labrador/layer2_1_conv2/feature_014.png"),
labrador_layer2_1_conv2_15: FileAttachment("data/vis/labrador/layer2_1_conv2/feature_015.png"),
labrador_layer3_0_conv1_0: FileAttachment("data/vis/labrador/layer3_0_conv1/feature_000.png"),
labrador_layer3_0_conv1_1: FileAttachment("data/vis/labrador/layer3_0_conv1/feature_001.png"),
labrador_layer3_0_conv1_2: FileAttachment("data/vis/labrador/layer3_0_conv1/feature_002.png"),
labrador_layer3_0_conv1_3: FileAttachment("data/vis/labrador/layer3_0_conv1/feature_003.png"),
labrador_layer3_0_conv1_4: FileAttachment("data/vis/labrador/layer3_0_conv1/feature_004.png"),
labrador_layer3_0_conv1_5: FileAttachment("data/vis/labrador/layer3_0_conv1/feature_005.png"),
labrador_layer3_0_conv1_6: FileAttachment("data/vis/labrador/layer3_0_conv1/feature_006.png"),
labrador_layer3_0_conv1_7: FileAttachment("data/vis/labrador/layer3_0_conv1/feature_007.png"),
labrador_layer3_0_conv1_8: FileAttachment("data/vis/labrador/layer3_0_conv1/feature_008.png"),
labrador_layer3_0_conv1_9: FileAttachment("data/vis/labrador/layer3_0_conv1/feature_009.png"),
labrador_layer3_0_conv1_10: FileAttachment("data/vis/labrador/layer3_0_conv1/feature_010.png"),
labrador_layer3_0_conv1_11: FileAttachment("data/vis/labrador/layer3_0_conv1/feature_011.png"),
labrador_layer3_0_conv1_12: FileAttachment("data/vis/labrador/layer3_0_conv1/feature_012.png"),
labrador_layer3_0_conv1_13: FileAttachment("data/vis/labrador/layer3_0_conv1/feature_013.png"),
labrador_layer3_0_conv1_14: FileAttachment("data/vis/labrador/layer3_0_conv1/feature_014.png"),
labrador_layer3_0_conv1_15: FileAttachment("data/vis/labrador/layer3_0_conv1/feature_015.png"),
labrador_layer3_0_conv2_0: FileAttachment("data/vis/labrador/layer3_0_conv2/feature_000.png"),
labrador_layer3_0_conv2_1: FileAttachment("data/vis/labrador/layer3_0_conv2/feature_001.png"),
labrador_layer3_0_conv2_2: FileAttachment("data/vis/labrador/layer3_0_conv2/feature_002.png"),
labrador_layer3_0_conv2_3: FileAttachment("data/vis/labrador/layer3_0_conv2/feature_003.png"),
labrador_layer3_0_conv2_4: FileAttachment("data/vis/labrador/layer3_0_conv2/feature_004.png"),
labrador_layer3_0_conv2_5: FileAttachment("data/vis/labrador/layer3_0_conv2/feature_005.png"),
labrador_layer3_0_conv2_6: FileAttachment("data/vis/labrador/layer3_0_conv2/feature_006.png"),
labrador_layer3_0_conv2_7: FileAttachment("data/vis/labrador/layer3_0_conv2/feature_007.png"),
labrador_layer3_0_conv2_8: FileAttachment("data/vis/labrador/layer3_0_conv2/feature_008.png"),
labrador_layer3_0_conv2_9: FileAttachment("data/vis/labrador/layer3_0_conv2/feature_009.png"),
labrador_layer3_0_conv2_10: FileAttachment("data/vis/labrador/layer3_0_conv2/feature_010.png"),
labrador_layer3_0_conv2_11: FileAttachment("data/vis/labrador/layer3_0_conv2/feature_011.png"),
labrador_layer3_0_conv2_12: FileAttachment("data/vis/labrador/layer3_0_conv2/feature_012.png"),
labrador_layer3_0_conv2_13: FileAttachment("data/vis/labrador/layer3_0_conv2/feature_013.png"),
labrador_layer3_0_conv2_14: FileAttachment("data/vis/labrador/layer3_0_conv2/feature_014.png"),
labrador_layer3_0_conv2_15: FileAttachment("data/vis/labrador/layer3_0_conv2/feature_015.png"),
labrador_layer3_1_conv1_0: FileAttachment("data/vis/labrador/layer3_1_conv1/feature_000.png"),
labrador_layer3_1_conv1_1: FileAttachment("data/vis/labrador/layer3_1_conv1/feature_001.png"),
labrador_layer3_1_conv1_2: FileAttachment("data/vis/labrador/layer3_1_conv1/feature_002.png"),
labrador_layer3_1_conv1_3: FileAttachment("data/vis/labrador/layer3_1_conv1/feature_003.png"),
labrador_layer3_1_conv1_4: FileAttachment("data/vis/labrador/layer3_1_conv1/feature_004.png"),
labrador_layer3_1_conv1_5: FileAttachment("data/vis/labrador/layer3_1_conv1/feature_005.png"),
labrador_layer3_1_conv1_6: FileAttachment("data/vis/labrador/layer3_1_conv1/feature_006.png"),
labrador_layer3_1_conv1_7: FileAttachment("data/vis/labrador/layer3_1_conv1/feature_007.png"),
labrador_layer3_1_conv1_8: FileAttachment("data/vis/labrador/layer3_1_conv1/feature_008.png"),
labrador_layer3_1_conv1_9: FileAttachment("data/vis/labrador/layer3_1_conv1/feature_009.png"),
labrador_layer3_1_conv1_10: FileAttachment("data/vis/labrador/layer3_1_conv1/feature_010.png"),
labrador_layer3_1_conv1_11: FileAttachment("data/vis/labrador/layer3_1_conv1/feature_011.png"),
labrador_layer3_1_conv1_12: FileAttachment("data/vis/labrador/layer3_1_conv1/feature_012.png"),
labrador_layer3_1_conv1_13: FileAttachment("data/vis/labrador/layer3_1_conv1/feature_013.png"),
labrador_layer3_1_conv1_14: FileAttachment("data/vis/labrador/layer3_1_conv1/feature_014.png"),
labrador_layer3_1_conv1_15: FileAttachment("data/vis/labrador/layer3_1_conv1/feature_015.png"),
labrador_layer3_1_conv2_0: FileAttachment("data/vis/labrador/layer3_1_conv2/feature_000.png"),
labrador_layer3_1_conv2_1: FileAttachment("data/vis/labrador/layer3_1_conv2/feature_001.png"),
labrador_layer3_1_conv2_2: FileAttachment("data/vis/labrador/layer3_1_conv2/feature_002.png"),
labrador_layer3_1_conv2_3: FileAttachment("data/vis/labrador/layer3_1_conv2/feature_003.png"),
labrador_layer3_1_conv2_4: FileAttachment("data/vis/labrador/layer3_1_conv2/feature_004.png"),
labrador_layer3_1_conv2_5: FileAttachment("data/vis/labrador/layer3_1_conv2/feature_005.png"),
labrador_layer3_1_conv2_6: FileAttachment("data/vis/labrador/layer3_1_conv2/feature_006.png"),
labrador_layer3_1_conv2_7: FileAttachment("data/vis/labrador/layer3_1_conv2/feature_007.png"),
labrador_layer3_1_conv2_8: FileAttachment("data/vis/labrador/layer3_1_conv2/feature_008.png"),
labrador_layer3_1_conv2_9: FileAttachment("data/vis/labrador/layer3_1_conv2/feature_009.png"),
labrador_layer3_1_conv2_10: FileAttachment("data/vis/labrador/layer3_1_conv2/feature_010.png"),
labrador_layer3_1_conv2_11: FileAttachment("data/vis/labrador/layer3_1_conv2/feature_011.png"),
labrador_layer3_1_conv2_12: FileAttachment("data/vis/labrador/layer3_1_conv2/feature_012.png"),
labrador_layer3_1_conv2_13: FileAttachment("data/vis/labrador/layer3_1_conv2/feature_013.png"),
labrador_layer3_1_conv2_14: FileAttachment("data/vis/labrador/layer3_1_conv2/feature_014.png"),
labrador_layer3_1_conv2_15: FileAttachment("data/vis/labrador/layer3_1_conv2/feature_015.png"),
labrador_layer4_0_conv1_0: FileAttachment("data/vis/labrador/layer4_0_conv1/feature_000.png"),
labrador_layer4_0_conv1_1: FileAttachment("data/vis/labrador/layer4_0_conv1/feature_001.png"),
labrador_layer4_0_conv1_2: FileAttachment("data/vis/labrador/layer4_0_conv1/feature_002.png"),
labrador_layer4_0_conv1_3: FileAttachment("data/vis/labrador/layer4_0_conv1/feature_003.png"),
labrador_layer4_0_conv1_4: FileAttachment("data/vis/labrador/layer4_0_conv1/feature_004.png"),
labrador_layer4_0_conv1_5: FileAttachment("data/vis/labrador/layer4_0_conv1/feature_005.png"),
labrador_layer4_0_conv1_6: FileAttachment("data/vis/labrador/layer4_0_conv1/feature_006.png"),
labrador_layer4_0_conv1_7: FileAttachment("data/vis/labrador/layer4_0_conv1/feature_007.png"),
labrador_layer4_0_conv1_8: FileAttachment("data/vis/labrador/layer4_0_conv1/feature_008.png"),
labrador_layer4_0_conv1_9: FileAttachment("data/vis/labrador/layer4_0_conv1/feature_009.png"),
labrador_layer4_0_conv1_10: FileAttachment("data/vis/labrador/layer4_0_conv1/feature_010.png"),
labrador_layer4_0_conv1_11: FileAttachment("data/vis/labrador/layer4_0_conv1/feature_011.png"),
labrador_layer4_0_conv1_12: FileAttachment("data/vis/labrador/layer4_0_conv1/feature_012.png"),
labrador_layer4_0_conv1_13: FileAttachment("data/vis/labrador/layer4_0_conv1/feature_013.png"),
labrador_layer4_0_conv1_14: FileAttachment("data/vis/labrador/layer4_0_conv1/feature_014.png"),
labrador_layer4_0_conv1_15: FileAttachment("data/vis/labrador/layer4_0_conv1/feature_015.png"),
labrador_layer4_0_conv2_0: FileAttachment("data/vis/labrador/layer4_0_conv2/feature_000.png"),
labrador_layer4_0_conv2_1: FileAttachment("data/vis/labrador/layer4_0_conv2/feature_001.png"),
labrador_layer4_0_conv2_2: FileAttachment("data/vis/labrador/layer4_0_conv2/feature_002.png"),
labrador_layer4_0_conv2_3: FileAttachment("data/vis/labrador/layer4_0_conv2/feature_003.png"),
labrador_layer4_0_conv2_4: FileAttachment("data/vis/labrador/layer4_0_conv2/feature_004.png"),
labrador_layer4_0_conv2_5: FileAttachment("data/vis/labrador/layer4_0_conv2/feature_005.png"),
labrador_layer4_0_conv2_6: FileAttachment("data/vis/labrador/layer4_0_conv2/feature_006.png"),
labrador_layer4_0_conv2_7: FileAttachment("data/vis/labrador/layer4_0_conv2/feature_007.png"),
labrador_layer4_0_conv2_8: FileAttachment("data/vis/labrador/layer4_0_conv2/feature_008.png"),
labrador_layer4_0_conv2_9: FileAttachment("data/vis/labrador/layer4_0_conv2/feature_009.png"),
labrador_layer4_0_conv2_10: FileAttachment("data/vis/labrador/layer4_0_conv2/feature_010.png"),
labrador_layer4_0_conv2_11: FileAttachment("data/vis/labrador/layer4_0_conv2/feature_011.png"),
labrador_layer4_0_conv2_12: FileAttachment("data/vis/labrador/layer4_0_conv2/feature_012.png"),
labrador_layer4_0_conv2_13: FileAttachment("data/vis/labrador/layer4_0_conv2/feature_013.png"),
labrador_layer4_0_conv2_14: FileAttachment("data/vis/labrador/layer4_0_conv2/feature_014.png"),
labrador_layer4_0_conv2_15: FileAttachment("data/vis/labrador/layer4_0_conv2/feature_015.png"),
labrador_layer4_1_conv1_0: FileAttachment("data/vis/labrador/layer4_1_conv1/feature_000.png"),
labrador_layer4_1_conv1_1: FileAttachment("data/vis/labrador/layer4_1_conv1/feature_001.png"),
labrador_layer4_1_conv1_2: FileAttachment("data/vis/labrador/layer4_1_conv1/feature_002.png"),
labrador_layer4_1_conv1_3: FileAttachment("data/vis/labrador/layer4_1_conv1/feature_003.png"),
labrador_layer4_1_conv1_4: FileAttachment("data/vis/labrador/layer4_1_conv1/feature_004.png"),
labrador_layer4_1_conv1_5: FileAttachment("data/vis/labrador/layer4_1_conv1/feature_005.png"),
labrador_layer4_1_conv1_6: FileAttachment("data/vis/labrador/layer4_1_conv1/feature_006.png"),
labrador_layer4_1_conv1_7: FileAttachment("data/vis/labrador/layer4_1_conv1/feature_007.png"),
labrador_layer4_1_conv1_8: FileAttachment("data/vis/labrador/layer4_1_conv1/feature_008.png"),
labrador_layer4_1_conv1_9: FileAttachment("data/vis/labrador/layer4_1_conv1/feature_009.png"),
labrador_layer4_1_conv1_10: FileAttachment("data/vis/labrador/layer4_1_conv1/feature_010.png"),
labrador_layer4_1_conv1_11: FileAttachment("data/vis/labrador/layer4_1_conv1/feature_011.png"),
labrador_layer4_1_conv1_12: FileAttachment("data/vis/labrador/layer4_1_conv1/feature_012.png"),
labrador_layer4_1_conv1_13: FileAttachment("data/vis/labrador/layer4_1_conv1/feature_013.png"),
labrador_layer4_1_conv1_14: FileAttachment("data/vis/labrador/layer4_1_conv1/feature_014.png"),
labrador_layer4_1_conv1_15: FileAttachment("data/vis/labrador/layer4_1_conv1/feature_015.png"),
labrador_layer4_1_conv2_0: FileAttachment("data/vis/labrador/layer4_1_conv2/feature_000.png"),
labrador_layer4_1_conv2_1: FileAttachment("data/vis/labrador/layer4_1_conv2/feature_001.png"),
labrador_layer4_1_conv2_2: FileAttachment("data/vis/labrador/layer4_1_conv2/feature_002.png"),
labrador_layer4_1_conv2_3: FileAttachment("data/vis/labrador/layer4_1_conv2/feature_003.png"),
labrador_layer4_1_conv2_4: FileAttachment("data/vis/labrador/layer4_1_conv2/feature_004.png"),
labrador_layer4_1_conv2_5: FileAttachment("data/vis/labrador/layer4_1_conv2/feature_005.png"),
labrador_layer4_1_conv2_6: FileAttachment("data/vis/labrador/layer4_1_conv2/feature_006.png"),
labrador_layer4_1_conv2_7: FileAttachment("data/vis/labrador/layer4_1_conv2/feature_007.png"),
labrador_layer4_1_conv2_8: FileAttachment("data/vis/labrador/layer4_1_conv2/feature_008.png"),
labrador_layer4_1_conv2_9: FileAttachment("data/vis/labrador/layer4_1_conv2/feature_009.png"),
labrador_layer4_1_conv2_10: FileAttachment("data/vis/labrador/layer4_1_conv2/feature_010.png"),
labrador_layer4_1_conv2_11: FileAttachment("data/vis/labrador/layer4_1_conv2/feature_011.png"),
labrador_layer4_1_conv2_12: FileAttachment("data/vis/labrador/layer4_1_conv2/feature_012.png"),
labrador_layer4_1_conv2_13: FileAttachment("data/vis/labrador/layer4_1_conv2/feature_013.png"),
labrador_layer4_1_conv2_14: FileAttachment("data/vis/labrador/layer4_1_conv2/feature_014.png"),
labrador_layer4_1_conv2_15: FileAttachment("data/vis/labrador/layer4_1_conv2/feature_015.png"),
pelican: FileAttachment("data/vis/pelican/pelican.png"),
pelican_conv1_0: FileAttachment("data/vis/pelican/conv1/feature_000.png"),
pelican_conv1_1: FileAttachment("data/vis/pelican/conv1/feature_001.png"),
pelican_conv1_2: FileAttachment("data/vis/pelican/conv1/feature_002.png"),
pelican_conv1_3: FileAttachment("data/vis/pelican/conv1/feature_003.png"),
pelican_conv1_4: FileAttachment("data/vis/pelican/conv1/feature_004.png"),
pelican_conv1_5: FileAttachment("data/vis/pelican/conv1/feature_005.png"),
pelican_conv1_6: FileAttachment("data/vis/pelican/conv1/feature_006.png"),
pelican_conv1_7: FileAttachment("data/vis/pelican/conv1/feature_007.png"),
pelican_conv1_8: FileAttachment("data/vis/pelican/conv1/feature_008.png"),
pelican_conv1_9: FileAttachment("data/vis/pelican/conv1/feature_009.png"),
pelican_conv1_10: FileAttachment("data/vis/pelican/conv1/feature_010.png"),
pelican_conv1_11: FileAttachment("data/vis/pelican/conv1/feature_011.png"),
pelican_conv1_12: FileAttachment("data/vis/pelican/conv1/feature_012.png"),
pelican_conv1_13: FileAttachment("data/vis/pelican/conv1/feature_013.png"),
pelican_conv1_14: FileAttachment("data/vis/pelican/conv1/feature_014.png"),
pelican_conv1_15: FileAttachment("data/vis/pelican/conv1/feature_015.png"),
pelican_layer1_0_conv1_0: FileAttachment("data/vis/pelican/layer1_0_conv1/feature_000.png"),
pelican_layer1_0_conv1_1: FileAttachment("data/vis/pelican/layer1_0_conv1/feature_001.png"),
pelican_layer1_0_conv1_2: FileAttachment("data/vis/pelican/layer1_0_conv1/feature_002.png"),
pelican_layer1_0_conv1_3: FileAttachment("data/vis/pelican/layer1_0_conv1/feature_003.png"),
pelican_layer1_0_conv1_4: FileAttachment("data/vis/pelican/layer1_0_conv1/feature_004.png"),
pelican_layer1_0_conv1_5: FileAttachment("data/vis/pelican/layer1_0_conv1/feature_005.png"),
pelican_layer1_0_conv1_6: FileAttachment("data/vis/pelican/layer1_0_conv1/feature_006.png"),
pelican_layer1_0_conv1_7: FileAttachment("data/vis/pelican/layer1_0_conv1/feature_007.png"),
pelican_layer1_0_conv1_8: FileAttachment("data/vis/pelican/layer1_0_conv1/feature_008.png"),
pelican_layer1_0_conv1_9: FileAttachment("data/vis/pelican/layer1_0_conv1/feature_009.png"),
pelican_layer1_0_conv1_10: FileAttachment("data/vis/pelican/layer1_0_conv1/feature_010.png"),
pelican_layer1_0_conv1_11: FileAttachment("data/vis/pelican/layer1_0_conv1/feature_011.png"),
pelican_layer1_0_conv1_12: FileAttachment("data/vis/pelican/layer1_0_conv1/feature_012.png"),
pelican_layer1_0_conv1_13: FileAttachment("data/vis/pelican/layer1_0_conv1/feature_013.png"),
pelican_layer1_0_conv1_14: FileAttachment("data/vis/pelican/layer1_0_conv1/feature_014.png"),
pelican_layer1_0_conv1_15: FileAttachment("data/vis/pelican/layer1_0_conv1/feature_015.png"),
pelican_layer1_0_conv2_0: FileAttachment("data/vis/pelican/layer1_0_conv2/feature_000.png"),
pelican_layer1_0_conv2_1: FileAttachment("data/vis/pelican/layer1_0_conv2/feature_001.png"),
pelican_layer1_0_conv2_2: FileAttachment("data/vis/pelican/layer1_0_conv2/feature_002.png"),
pelican_layer1_0_conv2_3: FileAttachment("data/vis/pelican/layer1_0_conv2/feature_003.png"),
pelican_layer1_0_conv2_4: FileAttachment("data/vis/pelican/layer1_0_conv2/feature_004.png"),
pelican_layer1_0_conv2_5: FileAttachment("data/vis/pelican/layer1_0_conv2/feature_005.png"),
pelican_layer1_0_conv2_6: FileAttachment("data/vis/pelican/layer1_0_conv2/feature_006.png"),
pelican_layer1_0_conv2_7: FileAttachment("data/vis/pelican/layer1_0_conv2/feature_007.png"),
pelican_layer1_0_conv2_8: FileAttachment("data/vis/pelican/layer1_0_conv2/feature_008.png"),
pelican_layer1_0_conv2_9: FileAttachment("data/vis/pelican/layer1_0_conv2/feature_009.png"),
pelican_layer1_0_conv2_10: FileAttachment("data/vis/pelican/layer1_0_conv2/feature_010.png"),
pelican_layer1_0_conv2_11: FileAttachment("data/vis/pelican/layer1_0_conv2/feature_011.png"),
pelican_layer1_0_conv2_12: FileAttachment("data/vis/pelican/layer1_0_conv2/feature_012.png"),
pelican_layer1_0_conv2_13: FileAttachment("data/vis/pelican/layer1_0_conv2/feature_013.png"),
pelican_layer1_0_conv2_14: FileAttachment("data/vis/pelican/layer1_0_conv2/feature_014.png"),
pelican_layer1_0_conv2_15: FileAttachment("data/vis/pelican/layer1_0_conv2/feature_015.png"),
pelican_layer1_1_conv1_0: FileAttachment("data/vis/pelican/layer1_1_conv1/feature_000.png"),
pelican_layer1_1_conv1_1: FileAttachment("data/vis/pelican/layer1_1_conv1/feature_001.png"),
pelican_layer1_1_conv1_2: FileAttachment("data/vis/pelican/layer1_1_conv1/feature_002.png"),
pelican_layer1_1_conv1_3: FileAttachment("data/vis/pelican/layer1_1_conv1/feature_003.png"),
pelican_layer1_1_conv1_4: FileAttachment("data/vis/pelican/layer1_1_conv1/feature_004.png"),
pelican_layer1_1_conv1_5: FileAttachment("data/vis/pelican/layer1_1_conv1/feature_005.png"),
pelican_layer1_1_conv1_6: FileAttachment("data/vis/pelican/layer1_1_conv1/feature_006.png"),
pelican_layer1_1_conv1_7: FileAttachment("data/vis/pelican/layer1_1_conv1/feature_007.png"),
pelican_layer1_1_conv1_8: FileAttachment("data/vis/pelican/layer1_1_conv1/feature_008.png"),
pelican_layer1_1_conv1_9: FileAttachment("data/vis/pelican/layer1_1_conv1/feature_009.png"),
pelican_layer1_1_conv1_10: FileAttachment("data/vis/pelican/layer1_1_conv1/feature_010.png"),
pelican_layer1_1_conv1_11: FileAttachment("data/vis/pelican/layer1_1_conv1/feature_011.png"),
pelican_layer1_1_conv1_12: FileAttachment("data/vis/pelican/layer1_1_conv1/feature_012.png"),
pelican_layer1_1_conv1_13: FileAttachment("data/vis/pelican/layer1_1_conv1/feature_013.png"),
pelican_layer1_1_conv1_14: FileAttachment("data/vis/pelican/layer1_1_conv1/feature_014.png"),
pelican_layer1_1_conv1_15: FileAttachment("data/vis/pelican/layer1_1_conv1/feature_015.png"),
pelican_layer1_1_conv2_0: FileAttachment("data/vis/pelican/layer1_1_conv2/feature_000.png"),
pelican_layer1_1_conv2_1: FileAttachment("data/vis/pelican/layer1_1_conv2/feature_001.png"),
pelican_layer1_1_conv2_2: FileAttachment("data/vis/pelican/layer1_1_conv2/feature_002.png"),
pelican_layer1_1_conv2_3: FileAttachment("data/vis/pelican/layer1_1_conv2/feature_003.png"),
pelican_layer1_1_conv2_4: FileAttachment("data/vis/pelican/layer1_1_conv2/feature_004.png"),
pelican_layer1_1_conv2_5: FileAttachment("data/vis/pelican/layer1_1_conv2/feature_005.png"),
pelican_layer1_1_conv2_6: FileAttachment("data/vis/pelican/layer1_1_conv2/feature_006.png"),
pelican_layer1_1_conv2_7: FileAttachment("data/vis/pelican/layer1_1_conv2/feature_007.png"),
pelican_layer1_1_conv2_8: FileAttachment("data/vis/pelican/layer1_1_conv2/feature_008.png"),
pelican_layer1_1_conv2_9: FileAttachment("data/vis/pelican/layer1_1_conv2/feature_009.png"),
pelican_layer1_1_conv2_10: FileAttachment("data/vis/pelican/layer1_1_conv2/feature_010.png"),
pelican_layer1_1_conv2_11: FileAttachment("data/vis/pelican/layer1_1_conv2/feature_011.png"),
pelican_layer1_1_conv2_12: FileAttachment("data/vis/pelican/layer1_1_conv2/feature_012.png"),
pelican_layer1_1_conv2_13: FileAttachment("data/vis/pelican/layer1_1_conv2/feature_013.png"),
pelican_layer1_1_conv2_14: FileAttachment("data/vis/pelican/layer1_1_conv2/feature_014.png"),
pelican_layer1_1_conv2_15: FileAttachment("data/vis/pelican/layer1_1_conv2/feature_015.png"),
pelican_layer2_0_conv1_0: FileAttachment("data/vis/pelican/layer2_0_conv1/feature_000.png"),
pelican_layer2_0_conv1_1: FileAttachment("data/vis/pelican/layer2_0_conv1/feature_001.png"),
pelican_layer2_0_conv1_2: FileAttachment("data/vis/pelican/layer2_0_conv1/feature_002.png"),
pelican_layer2_0_conv1_3: FileAttachment("data/vis/pelican/layer2_0_conv1/feature_003.png"),
pelican_layer2_0_conv1_4: FileAttachment("data/vis/pelican/layer2_0_conv1/feature_004.png"),
pelican_layer2_0_conv1_5: FileAttachment("data/vis/pelican/layer2_0_conv1/feature_005.png"),
pelican_layer2_0_conv1_6: FileAttachment("data/vis/pelican/layer2_0_conv1/feature_006.png"),
pelican_layer2_0_conv1_7: FileAttachment("data/vis/pelican/layer2_0_conv1/feature_007.png"),
pelican_layer2_0_conv1_8: FileAttachment("data/vis/pelican/layer2_0_conv1/feature_008.png"),
pelican_layer2_0_conv1_9: FileAttachment("data/vis/pelican/layer2_0_conv1/feature_009.png"),
pelican_layer2_0_conv1_10: FileAttachment("data/vis/pelican/layer2_0_conv1/feature_010.png"),
pelican_layer2_0_conv1_11: FileAttachment("data/vis/pelican/layer2_0_conv1/feature_011.png"),
pelican_layer2_0_conv1_12: FileAttachment("data/vis/pelican/layer2_0_conv1/feature_012.png"),
pelican_layer2_0_conv1_13: FileAttachment("data/vis/pelican/layer2_0_conv1/feature_013.png"),
pelican_layer2_0_conv1_14: FileAttachment("data/vis/pelican/layer2_0_conv1/feature_014.png"),
pelican_layer2_0_conv1_15: FileAttachment("data/vis/pelican/layer2_0_conv1/feature_015.png"),
pelican_layer2_0_conv2_0: FileAttachment("data/vis/pelican/layer2_0_conv2/feature_000.png"),
pelican_layer2_0_conv2_1: FileAttachment("data/vis/pelican/layer2_0_conv2/feature_001.png"),
pelican_layer2_0_conv2_2: FileAttachment("data/vis/pelican/layer2_0_conv2/feature_002.png"),
pelican_layer2_0_conv2_3: FileAttachment("data/vis/pelican/layer2_0_conv2/feature_003.png"),
pelican_layer2_0_conv2_4: FileAttachment("data/vis/pelican/layer2_0_conv2/feature_004.png"),
pelican_layer2_0_conv2_5: FileAttachment("data/vis/pelican/layer2_0_conv2/feature_005.png"),
pelican_layer2_0_conv2_6: FileAttachment("data/vis/pelican/layer2_0_conv2/feature_006.png"),
pelican_layer2_0_conv2_7: FileAttachment("data/vis/pelican/layer2_0_conv2/feature_007.png"),
pelican_layer2_0_conv2_8: FileAttachment("data/vis/pelican/layer2_0_conv2/feature_008.png"),
pelican_layer2_0_conv2_9: FileAttachment("data/vis/pelican/layer2_0_conv2/feature_009.png"),
pelican_layer2_0_conv2_10: FileAttachment("data/vis/pelican/layer2_0_conv2/feature_010.png"),
pelican_layer2_0_conv2_11: FileAttachment("data/vis/pelican/layer2_0_conv2/feature_011.png"),
pelican_layer2_0_conv2_12: FileAttachment("data/vis/pelican/layer2_0_conv2/feature_012.png"),
pelican_layer2_0_conv2_13: FileAttachment("data/vis/pelican/layer2_0_conv2/feature_013.png"),
pelican_layer2_0_conv2_14: FileAttachment("data/vis/pelican/layer2_0_conv2/feature_014.png"),
pelican_layer2_0_conv2_15: FileAttachment("data/vis/pelican/layer2_0_conv2/feature_015.png"),
pelican_layer2_1_conv1_0: FileAttachment("data/vis/pelican/layer2_1_conv1/feature_000.png"),
pelican_layer2_1_conv1_1: FileAttachment("data/vis/pelican/layer2_1_conv1/feature_001.png"),
pelican_layer2_1_conv1_2: FileAttachment("data/vis/pelican/layer2_1_conv1/feature_002.png"),
pelican_layer2_1_conv1_3: FileAttachment("data/vis/pelican/layer2_1_conv1/feature_003.png"),
pelican_layer2_1_conv1_4: FileAttachment("data/vis/pelican/layer2_1_conv1/feature_004.png"),
pelican_layer2_1_conv1_5: FileAttachment("data/vis/pelican/layer2_1_conv1/feature_005.png"),
pelican_layer2_1_conv1_6: FileAttachment("data/vis/pelican/layer2_1_conv1/feature_006.png"),
pelican_layer2_1_conv1_7: FileAttachment("data/vis/pelican/layer2_1_conv1/feature_007.png"),
pelican_layer2_1_conv1_8: FileAttachment("data/vis/pelican/layer2_1_conv1/feature_008.png"),
pelican_layer2_1_conv1_9: FileAttachment("data/vis/pelican/layer2_1_conv1/feature_009.png"),
pelican_layer2_1_conv1_10: FileAttachment("data/vis/pelican/layer2_1_conv1/feature_010.png"),
pelican_layer2_1_conv1_11: FileAttachment("data/vis/pelican/layer2_1_conv1/feature_011.png"),
pelican_layer2_1_conv1_12: FileAttachment("data/vis/pelican/layer2_1_conv1/feature_012.png"),
pelican_layer2_1_conv1_13: FileAttachment("data/vis/pelican/layer2_1_conv1/feature_013.png"),
pelican_layer2_1_conv1_14: FileAttachment("data/vis/pelican/layer2_1_conv1/feature_014.png"),
pelican_layer2_1_conv1_15: FileAttachment("data/vis/pelican/layer2_1_conv1/feature_015.png"),
pelican_layer2_1_conv2_0: FileAttachment("data/vis/pelican/layer2_1_conv2/feature_000.png"),
pelican_layer2_1_conv2_1: FileAttachment("data/vis/pelican/layer2_1_conv2/feature_001.png"),
pelican_layer2_1_conv2_2: FileAttachment("data/vis/pelican/layer2_1_conv2/feature_002.png"),
pelican_layer2_1_conv2_3: FileAttachment("data/vis/pelican/layer2_1_conv2/feature_003.png"),
pelican_layer2_1_conv2_4: FileAttachment("data/vis/pelican/layer2_1_conv2/feature_004.png"),
pelican_layer2_1_conv2_5: FileAttachment("data/vis/pelican/layer2_1_conv2/feature_005.png"),
pelican_layer2_1_conv2_6: FileAttachment("data/vis/pelican/layer2_1_conv2/feature_006.png"),
pelican_layer2_1_conv2_7: FileAttachment("data/vis/pelican/layer2_1_conv2/feature_007.png"),
pelican_layer2_1_conv2_8: FileAttachment("data/vis/pelican/layer2_1_conv2/feature_008.png"),
pelican_layer2_1_conv2_9: FileAttachment("data/vis/pelican/layer2_1_conv2/feature_009.png"),
pelican_layer2_1_conv2_10: FileAttachment("data/vis/pelican/layer2_1_conv2/feature_010.png"),
pelican_layer2_1_conv2_11: FileAttachment("data/vis/pelican/layer2_1_conv2/feature_011.png"),
pelican_layer2_1_conv2_12: FileAttachment("data/vis/pelican/layer2_1_conv2/feature_012.png"),
pelican_layer2_1_conv2_13: FileAttachment("data/vis/pelican/layer2_1_conv2/feature_013.png"),
pelican_layer2_1_conv2_14: FileAttachment("data/vis/pelican/layer2_1_conv2/feature_014.png"),
pelican_layer2_1_conv2_15: FileAttachment("data/vis/pelican/layer2_1_conv2/feature_015.png"),
pelican_layer3_0_conv1_0: FileAttachment("data/vis/pelican/layer3_0_conv1/feature_000.png"),
pelican_layer3_0_conv1_1: FileAttachment("data/vis/pelican/layer3_0_conv1/feature_001.png"),
pelican_layer3_0_conv1_2: FileAttachment("data/vis/pelican/layer3_0_conv1/feature_002.png"),
pelican_layer3_0_conv1_3: FileAttachment("data/vis/pelican/layer3_0_conv1/feature_003.png"),
pelican_layer3_0_conv1_4: FileAttachment("data/vis/pelican/layer3_0_conv1/feature_004.png"),
pelican_layer3_0_conv1_5: FileAttachment("data/vis/pelican/layer3_0_conv1/feature_005.png"),
pelican_layer3_0_conv1_6: FileAttachment("data/vis/pelican/layer3_0_conv1/feature_006.png"),
pelican_layer3_0_conv1_7: FileAttachment("data/vis/pelican/layer3_0_conv1/feature_007.png"),
pelican_layer3_0_conv1_8: FileAttachment("data/vis/pelican/layer3_0_conv1/feature_008.png"),
pelican_layer3_0_conv1_9: FileAttachment("data/vis/pelican/layer3_0_conv1/feature_009.png"),
pelican_layer3_0_conv1_10: FileAttachment("data/vis/pelican/layer3_0_conv1/feature_010.png"),
pelican_layer3_0_conv1_11: FileAttachment("data/vis/pelican/layer3_0_conv1/feature_011.png"),
pelican_layer3_0_conv1_12: FileAttachment("data/vis/pelican/layer3_0_conv1/feature_012.png"),
pelican_layer3_0_conv1_13: FileAttachment("data/vis/pelican/layer3_0_conv1/feature_013.png"),
pelican_layer3_0_conv1_14: FileAttachment("data/vis/pelican/layer3_0_conv1/feature_014.png"),
pelican_layer3_0_conv1_15: FileAttachment("data/vis/pelican/layer3_0_conv1/feature_015.png"),
pelican_layer3_0_conv2_0: FileAttachment("data/vis/pelican/layer3_0_conv2/feature_000.png"),
pelican_layer3_0_conv2_1: FileAttachment("data/vis/pelican/layer3_0_conv2/feature_001.png"),
pelican_layer3_0_conv2_2: FileAttachment("data/vis/pelican/layer3_0_conv2/feature_002.png"),
pelican_layer3_0_conv2_3: FileAttachment("data/vis/pelican/layer3_0_conv2/feature_003.png"),
pelican_layer3_0_conv2_4: FileAttachment("data/vis/pelican/layer3_0_conv2/feature_004.png"),
pelican_layer3_0_conv2_5: FileAttachment("data/vis/pelican/layer3_0_conv2/feature_005.png"),
pelican_layer3_0_conv2_6: FileAttachment("data/vis/pelican/layer3_0_conv2/feature_006.png"),
pelican_layer3_0_conv2_7: FileAttachment("data/vis/pelican/layer3_0_conv2/feature_007.png"),
pelican_layer3_0_conv2_8: FileAttachment("data/vis/pelican/layer3_0_conv2/feature_008.png"),
pelican_layer3_0_conv2_9: FileAttachment("data/vis/pelican/layer3_0_conv2/feature_009.png"),
pelican_layer3_0_conv2_10: FileAttachment("data/vis/pelican/layer3_0_conv2/feature_010.png"),
pelican_layer3_0_conv2_11: FileAttachment("data/vis/pelican/layer3_0_conv2/feature_011.png"),
pelican_layer3_0_conv2_12: FileAttachment("data/vis/pelican/layer3_0_conv2/feature_012.png"),
pelican_layer3_0_conv2_13: FileAttachment("data/vis/pelican/layer3_0_conv2/feature_013.png"),
pelican_layer3_0_conv2_14: FileAttachment("data/vis/pelican/layer3_0_conv2/feature_014.png"),
pelican_layer3_0_conv2_15: FileAttachment("data/vis/pelican/layer3_0_conv2/feature_015.png"),
pelican_layer3_1_conv1_0: FileAttachment("data/vis/pelican/layer3_1_conv1/feature_000.png"),
pelican_layer3_1_conv1_1: FileAttachment("data/vis/pelican/layer3_1_conv1/feature_001.png"),
pelican_layer3_1_conv1_2: FileAttachment("data/vis/pelican/layer3_1_conv1/feature_002.png"),
pelican_layer3_1_conv1_3: FileAttachment("data/vis/pelican/layer3_1_conv1/feature_003.png"),
pelican_layer3_1_conv1_4: FileAttachment("data/vis/pelican/layer3_1_conv1/feature_004.png"),
pelican_layer3_1_conv1_5: FileAttachment("data/vis/pelican/layer3_1_conv1/feature_005.png"),
pelican_layer3_1_conv1_6: FileAttachment("data/vis/pelican/layer3_1_conv1/feature_006.png"),
pelican_layer3_1_conv1_7: FileAttachment("data/vis/pelican/layer3_1_conv1/feature_007.png"),
pelican_layer3_1_conv1_8: FileAttachment("data/vis/pelican/layer3_1_conv1/feature_008.png"),
pelican_layer3_1_conv1_9: FileAttachment("data/vis/pelican/layer3_1_conv1/feature_009.png"),
pelican_layer3_1_conv1_10: FileAttachment("data/vis/pelican/layer3_1_conv1/feature_010.png"),
pelican_layer3_1_conv1_11: FileAttachment("data/vis/pelican/layer3_1_conv1/feature_011.png"),
pelican_layer3_1_conv1_12: FileAttachment("data/vis/pelican/layer3_1_conv1/feature_012.png"),
pelican_layer3_1_conv1_13: FileAttachment("data/vis/pelican/layer3_1_conv1/feature_013.png"),
pelican_layer3_1_conv1_14: FileAttachment("data/vis/pelican/layer3_1_conv1/feature_014.png"),
pelican_layer3_1_conv1_15: FileAttachment("data/vis/pelican/layer3_1_conv1/feature_015.png"),
pelican_layer3_1_conv2_0: FileAttachment("data/vis/pelican/layer3_1_conv2/feature_000.png"),
pelican_layer3_1_conv2_1: FileAttachment("data/vis/pelican/layer3_1_conv2/feature_001.png"),
pelican_layer3_1_conv2_2: FileAttachment("data/vis/pelican/layer3_1_conv2/feature_002.png"),
pelican_layer3_1_conv2_3: FileAttachment("data/vis/pelican/layer3_1_conv2/feature_003.png"),
pelican_layer3_1_conv2_4: FileAttachment("data/vis/pelican/layer3_1_conv2/feature_004.png"),
pelican_layer3_1_conv2_5: FileAttachment("data/vis/pelican/layer3_1_conv2/feature_005.png"),
pelican_layer3_1_conv2_6: FileAttachment("data/vis/pelican/layer3_1_conv2/feature_006.png"),
pelican_layer3_1_conv2_7: FileAttachment("data/vis/pelican/layer3_1_conv2/feature_007.png"),
pelican_layer3_1_conv2_8: FileAttachment("data/vis/pelican/layer3_1_conv2/feature_008.png"),
pelican_layer3_1_conv2_9: FileAttachment("data/vis/pelican/layer3_1_conv2/feature_009.png"),
pelican_layer3_1_conv2_10: FileAttachment("data/vis/pelican/layer3_1_conv2/feature_010.png"),
pelican_layer3_1_conv2_11: FileAttachment("data/vis/pelican/layer3_1_conv2/feature_011.png"),
pelican_layer3_1_conv2_12: FileAttachment("data/vis/pelican/layer3_1_conv2/feature_012.png"),
pelican_layer3_1_conv2_13: FileAttachment("data/vis/pelican/layer3_1_conv2/feature_013.png"),
pelican_layer3_1_conv2_14: FileAttachment("data/vis/pelican/layer3_1_conv2/feature_014.png"),
pelican_layer3_1_conv2_15: FileAttachment("data/vis/pelican/layer3_1_conv2/feature_015.png"),
pelican_layer4_0_conv1_0: FileAttachment("data/vis/pelican/layer4_0_conv1/feature_000.png"),
pelican_layer4_0_conv1_1: FileAttachment("data/vis/pelican/layer4_0_conv1/feature_001.png"),
pelican_layer4_0_conv1_2: FileAttachment("data/vis/pelican/layer4_0_conv1/feature_002.png"),
pelican_layer4_0_conv1_3: FileAttachment("data/vis/pelican/layer4_0_conv1/feature_003.png"),
pelican_layer4_0_conv1_4: FileAttachment("data/vis/pelican/layer4_0_conv1/feature_004.png"),
pelican_layer4_0_conv1_5: FileAttachment("data/vis/pelican/layer4_0_conv1/feature_005.png"),
pelican_layer4_0_conv1_6: FileAttachment("data/vis/pelican/layer4_0_conv1/feature_006.png"),
pelican_layer4_0_conv1_7: FileAttachment("data/vis/pelican/layer4_0_conv1/feature_007.png"),
pelican_layer4_0_conv1_8: FileAttachment("data/vis/pelican/layer4_0_conv1/feature_008.png"),
pelican_layer4_0_conv1_9: FileAttachment("data/vis/pelican/layer4_0_conv1/feature_009.png"),
pelican_layer4_0_conv1_10: FileAttachment("data/vis/pelican/layer4_0_conv1/feature_010.png"),
pelican_layer4_0_conv1_11: FileAttachment("data/vis/pelican/layer4_0_conv1/feature_011.png"),
pelican_layer4_0_conv1_12: FileAttachment("data/vis/pelican/layer4_0_conv1/feature_012.png"),
pelican_layer4_0_conv1_13: FileAttachment("data/vis/pelican/layer4_0_conv1/feature_013.png"),
pelican_layer4_0_conv1_14: FileAttachment("data/vis/pelican/layer4_0_conv1/feature_014.png"),
pelican_layer4_0_conv1_15: FileAttachment("data/vis/pelican/layer4_0_conv1/feature_015.png"),
pelican_layer4_0_conv2_0: FileAttachment("data/vis/pelican/layer4_0_conv2/feature_000.png"),
pelican_layer4_0_conv2_1: FileAttachment("data/vis/pelican/layer4_0_conv2/feature_001.png"),
pelican_layer4_0_conv2_2: FileAttachment("data/vis/pelican/layer4_0_conv2/feature_002.png"),
pelican_layer4_0_conv2_3: FileAttachment("data/vis/pelican/layer4_0_conv2/feature_003.png"),
pelican_layer4_0_conv2_4: FileAttachment("data/vis/pelican/layer4_0_conv2/feature_004.png"),
pelican_layer4_0_conv2_5: FileAttachment("data/vis/pelican/layer4_0_conv2/feature_005.png"),
pelican_layer4_0_conv2_6: FileAttachment("data/vis/pelican/layer4_0_conv2/feature_006.png"),
pelican_layer4_0_conv2_7: FileAttachment("data/vis/pelican/layer4_0_conv2/feature_007.png"),
pelican_layer4_0_conv2_8: FileAttachment("data/vis/pelican/layer4_0_conv2/feature_008.png"),
pelican_layer4_0_conv2_9: FileAttachment("data/vis/pelican/layer4_0_conv2/feature_009.png"),
pelican_layer4_0_conv2_10: FileAttachment("data/vis/pelican/layer4_0_conv2/feature_010.png"),
pelican_layer4_0_conv2_11: FileAttachment("data/vis/pelican/layer4_0_conv2/feature_011.png"),
pelican_layer4_0_conv2_12: FileAttachment("data/vis/pelican/layer4_0_conv2/feature_012.png"),
pelican_layer4_0_conv2_13: FileAttachment("data/vis/pelican/layer4_0_conv2/feature_013.png"),
pelican_layer4_0_conv2_14: FileAttachment("data/vis/pelican/layer4_0_conv2/feature_014.png"),
pelican_layer4_0_conv2_15: FileAttachment("data/vis/pelican/layer4_0_conv2/feature_015.png"),
pelican_layer4_1_conv1_0: FileAttachment("data/vis/pelican/layer4_1_conv1/feature_000.png"),
pelican_layer4_1_conv1_1: FileAttachment("data/vis/pelican/layer4_1_conv1/feature_001.png"),
pelican_layer4_1_conv1_2: FileAttachment("data/vis/pelican/layer4_1_conv1/feature_002.png"),
pelican_layer4_1_conv1_3: FileAttachment("data/vis/pelican/layer4_1_conv1/feature_003.png"),
pelican_layer4_1_conv1_4: FileAttachment("data/vis/pelican/layer4_1_conv1/feature_004.png"),
pelican_layer4_1_conv1_5: FileAttachment("data/vis/pelican/layer4_1_conv1/feature_005.png"),
pelican_layer4_1_conv1_6: FileAttachment("data/vis/pelican/layer4_1_conv1/feature_006.png"),
pelican_layer4_1_conv1_7: FileAttachment("data/vis/pelican/layer4_1_conv1/feature_007.png"),
pelican_layer4_1_conv1_8: FileAttachment("data/vis/pelican/layer4_1_conv1/feature_008.png"),
pelican_layer4_1_conv1_9: FileAttachment("data/vis/pelican/layer4_1_conv1/feature_009.png"),
pelican_layer4_1_conv1_10: FileAttachment("data/vis/pelican/layer4_1_conv1/feature_010.png"),
pelican_layer4_1_conv1_11: FileAttachment("data/vis/pelican/layer4_1_conv1/feature_011.png"),
pelican_layer4_1_conv1_12: FileAttachment("data/vis/pelican/layer4_1_conv1/feature_012.png"),
pelican_layer4_1_conv1_13: FileAttachment("data/vis/pelican/layer4_1_conv1/feature_013.png"),
pelican_layer4_1_conv1_14: FileAttachment("data/vis/pelican/layer4_1_conv1/feature_014.png"),
pelican_layer4_1_conv1_15: FileAttachment("data/vis/pelican/layer4_1_conv1/feature_015.png"),
pelican_layer4_1_conv2_0: FileAttachment("data/vis/pelican/layer4_1_conv2/feature_000.png"),
pelican_layer4_1_conv2_1: FileAttachment("data/vis/pelican/layer4_1_conv2/feature_001.png"),
pelican_layer4_1_conv2_2: FileAttachment("data/vis/pelican/layer4_1_conv2/feature_002.png"),
pelican_layer4_1_conv2_3: FileAttachment("data/vis/pelican/layer4_1_conv2/feature_003.png"),
pelican_layer4_1_conv2_4: FileAttachment("data/vis/pelican/layer4_1_conv2/feature_004.png"),
pelican_layer4_1_conv2_5: FileAttachment("data/vis/pelican/layer4_1_conv2/feature_005.png"),
pelican_layer4_1_conv2_6: FileAttachment("data/vis/pelican/layer4_1_conv2/feature_006.png"),
pelican_layer4_1_conv2_7: FileAttachment("data/vis/pelican/layer4_1_conv2/feature_007.png"),
pelican_layer4_1_conv2_8: FileAttachment("data/vis/pelican/layer4_1_conv2/feature_008.png"),
pelican_layer4_1_conv2_9: FileAttachment("data/vis/pelican/layer4_1_conv2/feature_009.png"),
pelican_layer4_1_conv2_10: FileAttachment("data/vis/pelican/layer4_1_conv2/feature_010.png"),
pelican_layer4_1_conv2_11: FileAttachment("data/vis/pelican/layer4_1_conv2/feature_011.png"),
pelican_layer4_1_conv2_12: FileAttachment("data/vis/pelican/layer4_1_conv2/feature_012.png"),
pelican_layer4_1_conv2_13: FileAttachment("data/vis/pelican/layer4_1_conv2/feature_013.png"),
pelican_layer4_1_conv2_14: FileAttachment("data/vis/pelican/layer4_1_conv2/feature_014.png"),
pelican_layer4_1_conv2_15: FileAttachment("data/vis/pelican/layer4_1_conv2/feature_015.png"),
triceratops: FileAttachment("data/vis/triceratops/triceratops.png"),
triceratops_conv1_0: FileAttachment("data/vis/triceratops/conv1/feature_000.png"),
triceratops_conv1_1: FileAttachment("data/vis/triceratops/conv1/feature_001.png"),
triceratops_conv1_2: FileAttachment("data/vis/triceratops/conv1/feature_002.png"),
triceratops_conv1_3: FileAttachment("data/vis/triceratops/conv1/feature_003.png"),
triceratops_conv1_4: FileAttachment("data/vis/triceratops/conv1/feature_004.png"),
triceratops_conv1_5: FileAttachment("data/vis/triceratops/conv1/feature_005.png"),
triceratops_conv1_6: FileAttachment("data/vis/triceratops/conv1/feature_006.png"),
triceratops_conv1_7: FileAttachment("data/vis/triceratops/conv1/feature_007.png"),
triceratops_conv1_8: FileAttachment("data/vis/triceratops/conv1/feature_008.png"),
triceratops_conv1_9: FileAttachment("data/vis/triceratops/conv1/feature_009.png"),
triceratops_conv1_10: FileAttachment("data/vis/triceratops/conv1/feature_010.png"),
triceratops_conv1_11: FileAttachment("data/vis/triceratops/conv1/feature_011.png"),
triceratops_conv1_12: FileAttachment("data/vis/triceratops/conv1/feature_012.png"),
triceratops_conv1_13: FileAttachment("data/vis/triceratops/conv1/feature_013.png"),
triceratops_conv1_14: FileAttachment("data/vis/triceratops/conv1/feature_014.png"),
triceratops_conv1_15: FileAttachment("data/vis/triceratops/conv1/feature_015.png"),
triceratops_layer1_0_conv1_0: FileAttachment("data/vis/triceratops/layer1_0_conv1/feature_000.png"),
triceratops_layer1_0_conv1_1: FileAttachment("data/vis/triceratops/layer1_0_conv1/feature_001.png"),
triceratops_layer1_0_conv1_2: FileAttachment("data/vis/triceratops/layer1_0_conv1/feature_002.png"),
triceratops_layer1_0_conv1_3: FileAttachment("data/vis/triceratops/layer1_0_conv1/feature_003.png"),
triceratops_layer1_0_conv1_4: FileAttachment("data/vis/triceratops/layer1_0_conv1/feature_004.png"),
triceratops_layer1_0_conv1_5: FileAttachment("data/vis/triceratops/layer1_0_conv1/feature_005.png"),
triceratops_layer1_0_conv1_6: FileAttachment("data/vis/triceratops/layer1_0_conv1/feature_006.png"),
triceratops_layer1_0_conv1_7: FileAttachment("data/vis/triceratops/layer1_0_conv1/feature_007.png"),
triceratops_layer1_0_conv1_8: FileAttachment("data/vis/triceratops/layer1_0_conv1/feature_008.png"),
triceratops_layer1_0_conv1_9: FileAttachment("data/vis/triceratops/layer1_0_conv1/feature_009.png"),
triceratops_layer1_0_conv1_10: FileAttachment("data/vis/triceratops/layer1_0_conv1/feature_010.png"),
triceratops_layer1_0_conv1_11: FileAttachment("data/vis/triceratops/layer1_0_conv1/feature_011.png"),
triceratops_layer1_0_conv1_12: FileAttachment("data/vis/triceratops/layer1_0_conv1/feature_012.png"),
triceratops_layer1_0_conv1_13: FileAttachment("data/vis/triceratops/layer1_0_conv1/feature_013.png"),
triceratops_layer1_0_conv1_14: FileAttachment("data/vis/triceratops/layer1_0_conv1/feature_014.png"),
triceratops_layer1_0_conv1_15: FileAttachment("data/vis/triceratops/layer1_0_conv1/feature_015.png"),
triceratops_layer1_0_conv2_0: FileAttachment("data/vis/triceratops/layer1_0_conv2/feature_000.png"),
triceratops_layer1_0_conv2_1: FileAttachment("data/vis/triceratops/layer1_0_conv2/feature_001.png"),
triceratops_layer1_0_conv2_2: FileAttachment("data/vis/triceratops/layer1_0_conv2/feature_002.png"),
triceratops_layer1_0_conv2_3: FileAttachment("data/vis/triceratops/layer1_0_conv2/feature_003.png"),
triceratops_layer1_0_conv2_4: FileAttachment("data/vis/triceratops/layer1_0_conv2/feature_004.png"),
triceratops_layer1_0_conv2_5: FileAttachment("data/vis/triceratops/layer1_0_conv2/feature_005.png"),
triceratops_layer1_0_conv2_6: FileAttachment("data/vis/triceratops/layer1_0_conv2/feature_006.png"),
triceratops_layer1_0_conv2_7: FileAttachment("data/vis/triceratops/layer1_0_conv2/feature_007.png"),
triceratops_layer1_0_conv2_8: FileAttachment("data/vis/triceratops/layer1_0_conv2/feature_008.png"),
triceratops_layer1_0_conv2_9: FileAttachment("data/vis/triceratops/layer1_0_conv2/feature_009.png"),
triceratops_layer1_0_conv2_10: FileAttachment("data/vis/triceratops/layer1_0_conv2/feature_010.png"),
triceratops_layer1_0_conv2_11: FileAttachment("data/vis/triceratops/layer1_0_conv2/feature_011.png"),
triceratops_layer1_0_conv2_12: FileAttachment("data/vis/triceratops/layer1_0_conv2/feature_012.png"),
triceratops_layer1_0_conv2_13: FileAttachment("data/vis/triceratops/layer1_0_conv2/feature_013.png"),
triceratops_layer1_0_conv2_14: FileAttachment("data/vis/triceratops/layer1_0_conv2/feature_014.png"),
triceratops_layer1_0_conv2_15: FileAttachment("data/vis/triceratops/layer1_0_conv2/feature_015.png"),
triceratops_layer1_1_conv1_0: FileAttachment("data/vis/triceratops/layer1_1_conv1/feature_000.png"),
triceratops_layer1_1_conv1_1: FileAttachment("data/vis/triceratops/layer1_1_conv1/feature_001.png"),
triceratops_layer1_1_conv1_2: FileAttachment("data/vis/triceratops/layer1_1_conv1/feature_002.png"),
triceratops_layer1_1_conv1_3: FileAttachment("data/vis/triceratops/layer1_1_conv1/feature_003.png"),
triceratops_layer1_1_conv1_4: FileAttachment("data/vis/triceratops/layer1_1_conv1/feature_004.png"),
triceratops_layer1_1_conv1_5: FileAttachment("data/vis/triceratops/layer1_1_conv1/feature_005.png"),
triceratops_layer1_1_conv1_6: FileAttachment("data/vis/triceratops/layer1_1_conv1/feature_006.png"),
triceratops_layer1_1_conv1_7: FileAttachment("data/vis/triceratops/layer1_1_conv1/feature_007.png"),
triceratops_layer1_1_conv1_8: FileAttachment("data/vis/triceratops/layer1_1_conv1/feature_008.png"),
triceratops_layer1_1_conv1_9: FileAttachment("data/vis/triceratops/layer1_1_conv1/feature_009.png"),
triceratops_layer1_1_conv1_10: FileAttachment("data/vis/triceratops/layer1_1_conv1/feature_010.png"),
triceratops_layer1_1_conv1_11: FileAttachment("data/vis/triceratops/layer1_1_conv1/feature_011.png"),
triceratops_layer1_1_conv1_12: FileAttachment("data/vis/triceratops/layer1_1_conv1/feature_012.png"),
triceratops_layer1_1_conv1_13: FileAttachment("data/vis/triceratops/layer1_1_conv1/feature_013.png"),
triceratops_layer1_1_conv1_14: FileAttachment("data/vis/triceratops/layer1_1_conv1/feature_014.png"),
triceratops_layer1_1_conv1_15: FileAttachment("data/vis/triceratops/layer1_1_conv1/feature_015.png"),
triceratops_layer1_1_conv2_0: FileAttachment("data/vis/triceratops/layer1_1_conv2/feature_000.png"),
triceratops_layer1_1_conv2_1: FileAttachment("data/vis/triceratops/layer1_1_conv2/feature_001.png"),
triceratops_layer1_1_conv2_2: FileAttachment("data/vis/triceratops/layer1_1_conv2/feature_002.png"),
triceratops_layer1_1_conv2_3: FileAttachment("data/vis/triceratops/layer1_1_conv2/feature_003.png"),
triceratops_layer1_1_conv2_4: FileAttachment("data/vis/triceratops/layer1_1_conv2/feature_004.png"),
triceratops_layer1_1_conv2_5: FileAttachment("data/vis/triceratops/layer1_1_conv2/feature_005.png"),
triceratops_layer1_1_conv2_6: FileAttachment("data/vis/triceratops/layer1_1_conv2/feature_006.png"),
triceratops_layer1_1_conv2_7: FileAttachment("data/vis/triceratops/layer1_1_conv2/feature_007.png"),
triceratops_layer1_1_conv2_8: FileAttachment("data/vis/triceratops/layer1_1_conv2/feature_008.png"),
triceratops_layer1_1_conv2_9: FileAttachment("data/vis/triceratops/layer1_1_conv2/feature_009.png"),
triceratops_layer1_1_conv2_10: FileAttachment("data/vis/triceratops/layer1_1_conv2/feature_010.png"),
triceratops_layer1_1_conv2_11: FileAttachment("data/vis/triceratops/layer1_1_conv2/feature_011.png"),
triceratops_layer1_1_conv2_12: FileAttachment("data/vis/triceratops/layer1_1_conv2/feature_012.png"),
triceratops_layer1_1_conv2_13: FileAttachment("data/vis/triceratops/layer1_1_conv2/feature_013.png"),
triceratops_layer1_1_conv2_14: FileAttachment("data/vis/triceratops/layer1_1_conv2/feature_014.png"),
triceratops_layer1_1_conv2_15: FileAttachment("data/vis/triceratops/layer1_1_conv2/feature_015.png"),
triceratops_layer2_0_conv1_0: FileAttachment("data/vis/triceratops/layer2_0_conv1/feature_000.png"),
triceratops_layer2_0_conv1_1: FileAttachment("data/vis/triceratops/layer2_0_conv1/feature_001.png"),
triceratops_layer2_0_conv1_2: FileAttachment("data/vis/triceratops/layer2_0_conv1/feature_002.png"),
triceratops_layer2_0_conv1_3: FileAttachment("data/vis/triceratops/layer2_0_conv1/feature_003.png"),
triceratops_layer2_0_conv1_4: FileAttachment("data/vis/triceratops/layer2_0_conv1/feature_004.png"),
triceratops_layer2_0_conv1_5: FileAttachment("data/vis/triceratops/layer2_0_conv1/feature_005.png"),
triceratops_layer2_0_conv1_6: FileAttachment("data/vis/triceratops/layer2_0_conv1/feature_006.png"),
triceratops_layer2_0_conv1_7: FileAttachment("data/vis/triceratops/layer2_0_conv1/feature_007.png"),
triceratops_layer2_0_conv1_8: FileAttachment("data/vis/triceratops/layer2_0_conv1/feature_008.png"),
triceratops_layer2_0_conv1_9: FileAttachment("data/vis/triceratops/layer2_0_conv1/feature_009.png"),
triceratops_layer2_0_conv1_10: FileAttachment("data/vis/triceratops/layer2_0_conv1/feature_010.png"),
triceratops_layer2_0_conv1_11: FileAttachment("data/vis/triceratops/layer2_0_conv1/feature_011.png"),
triceratops_layer2_0_conv1_12: FileAttachment("data/vis/triceratops/layer2_0_conv1/feature_012.png"),
triceratops_layer2_0_conv1_13: FileAttachment("data/vis/triceratops/layer2_0_conv1/feature_013.png"),
triceratops_layer2_0_conv1_14: FileAttachment("data/vis/triceratops/layer2_0_conv1/feature_014.png"),
triceratops_layer2_0_conv1_15: FileAttachment("data/vis/triceratops/layer2_0_conv1/feature_015.png"),
triceratops_layer2_0_conv2_0: FileAttachment("data/vis/triceratops/layer2_0_conv2/feature_000.png"),
triceratops_layer2_0_conv2_1: FileAttachment("data/vis/triceratops/layer2_0_conv2/feature_001.png"),
triceratops_layer2_0_conv2_2: FileAttachment("data/vis/triceratops/layer2_0_conv2/feature_002.png"),
triceratops_layer2_0_conv2_3: FileAttachment("data/vis/triceratops/layer2_0_conv2/feature_003.png"),
triceratops_layer2_0_conv2_4: FileAttachment("data/vis/triceratops/layer2_0_conv2/feature_004.png"),
triceratops_layer2_0_conv2_5: FileAttachment("data/vis/triceratops/layer2_0_conv2/feature_005.png"),
triceratops_layer2_0_conv2_6: FileAttachment("data/vis/triceratops/layer2_0_conv2/feature_006.png"),
triceratops_layer2_0_conv2_7: FileAttachment("data/vis/triceratops/layer2_0_conv2/feature_007.png"),
triceratops_layer2_0_conv2_8: FileAttachment("data/vis/triceratops/layer2_0_conv2/feature_008.png"),
triceratops_layer2_0_conv2_9: FileAttachment("data/vis/triceratops/layer2_0_conv2/feature_009.png"),
triceratops_layer2_0_conv2_10: FileAttachment("data/vis/triceratops/layer2_0_conv2/feature_010.png"),
triceratops_layer2_0_conv2_11: FileAttachment("data/vis/triceratops/layer2_0_conv2/feature_011.png"),
triceratops_layer2_0_conv2_12: FileAttachment("data/vis/triceratops/layer2_0_conv2/feature_012.png"),
triceratops_layer2_0_conv2_13: FileAttachment("data/vis/triceratops/layer2_0_conv2/feature_013.png"),
triceratops_layer2_0_conv2_14: FileAttachment("data/vis/triceratops/layer2_0_conv2/feature_014.png"),
triceratops_layer2_0_conv2_15: FileAttachment("data/vis/triceratops/layer2_0_conv2/feature_015.png"),
triceratops_layer2_1_conv1_0: FileAttachment("data/vis/triceratops/layer2_1_conv1/feature_000.png"),
triceratops_layer2_1_conv1_1: FileAttachment("data/vis/triceratops/layer2_1_conv1/feature_001.png"),
triceratops_layer2_1_conv1_2: FileAttachment("data/vis/triceratops/layer2_1_conv1/feature_002.png"),
triceratops_layer2_1_conv1_3: FileAttachment("data/vis/triceratops/layer2_1_conv1/feature_003.png"),
triceratops_layer2_1_conv1_4: FileAttachment("data/vis/triceratops/layer2_1_conv1/feature_004.png"),
triceratops_layer2_1_conv1_5: FileAttachment("data/vis/triceratops/layer2_1_conv1/feature_005.png"),
triceratops_layer2_1_conv1_6: FileAttachment("data/vis/triceratops/layer2_1_conv1/feature_006.png"),
triceratops_layer2_1_conv1_7: FileAttachment("data/vis/triceratops/layer2_1_conv1/feature_007.png"),
triceratops_layer2_1_conv1_8: FileAttachment("data/vis/triceratops/layer2_1_conv1/feature_008.png"),
triceratops_layer2_1_conv1_9: FileAttachment("data/vis/triceratops/layer2_1_conv1/feature_009.png"),
triceratops_layer2_1_conv1_10: FileAttachment("data/vis/triceratops/layer2_1_conv1/feature_010.png"),
triceratops_layer2_1_conv1_11: FileAttachment("data/vis/triceratops/layer2_1_conv1/feature_011.png"),
triceratops_layer2_1_conv1_12: FileAttachment("data/vis/triceratops/layer2_1_conv1/feature_012.png"),
triceratops_layer2_1_conv1_13: FileAttachment("data/vis/triceratops/layer2_1_conv1/feature_013.png"),
triceratops_layer2_1_conv1_14: FileAttachment("data/vis/triceratops/layer2_1_conv1/feature_014.png"),
triceratops_layer2_1_conv1_15: FileAttachment("data/vis/triceratops/layer2_1_conv1/feature_015.png"),
triceratops_layer2_1_conv2_0: FileAttachment("data/vis/triceratops/layer2_1_conv2/feature_000.png"),
triceratops_layer2_1_conv2_1: FileAttachment("data/vis/triceratops/layer2_1_conv2/feature_001.png"),
triceratops_layer2_1_conv2_2: FileAttachment("data/vis/triceratops/layer2_1_conv2/feature_002.png"),
triceratops_layer2_1_conv2_3: FileAttachment("data/vis/triceratops/layer2_1_conv2/feature_003.png"),
triceratops_layer2_1_conv2_4: FileAttachment("data/vis/triceratops/layer2_1_conv2/feature_004.png"),
triceratops_layer2_1_conv2_5: FileAttachment("data/vis/triceratops/layer2_1_conv2/feature_005.png"),
triceratops_layer2_1_conv2_6: FileAttachment("data/vis/triceratops/layer2_1_conv2/feature_006.png"),
triceratops_layer2_1_conv2_7: FileAttachment("data/vis/triceratops/layer2_1_conv2/feature_007.png"),
triceratops_layer2_1_conv2_8: FileAttachment("data/vis/triceratops/layer2_1_conv2/feature_008.png"),
triceratops_layer2_1_conv2_9: FileAttachment("data/vis/triceratops/layer2_1_conv2/feature_009.png"),
triceratops_layer2_1_conv2_10: FileAttachment("data/vis/triceratops/layer2_1_conv2/feature_010.png"),
triceratops_layer2_1_conv2_11: FileAttachment("data/vis/triceratops/layer2_1_conv2/feature_011.png"),
triceratops_layer2_1_conv2_12: FileAttachment("data/vis/triceratops/layer2_1_conv2/feature_012.png"),
triceratops_layer2_1_conv2_13: FileAttachment("data/vis/triceratops/layer2_1_conv2/feature_013.png"),
triceratops_layer2_1_conv2_14: FileAttachment("data/vis/triceratops/layer2_1_conv2/feature_014.png"),
triceratops_layer2_1_conv2_15: FileAttachment("data/vis/triceratops/layer2_1_conv2/feature_015.png"),
triceratops_layer3_0_conv1_0: FileAttachment("data/vis/triceratops/layer3_0_conv1/feature_000.png"),
triceratops_layer3_0_conv1_1: FileAttachment("data/vis/triceratops/layer3_0_conv1/feature_001.png"),
triceratops_layer3_0_conv1_2: FileAttachment("data/vis/triceratops/layer3_0_conv1/feature_002.png"),
triceratops_layer3_0_conv1_3: FileAttachment("data/vis/triceratops/layer3_0_conv1/feature_003.png"),
triceratops_layer3_0_conv1_4: FileAttachment("data/vis/triceratops/layer3_0_conv1/feature_004.png"),
triceratops_layer3_0_conv1_5: FileAttachment("data/vis/triceratops/layer3_0_conv1/feature_005.png"),
triceratops_layer3_0_conv1_6: FileAttachment("data/vis/triceratops/layer3_0_conv1/feature_006.png"),
triceratops_layer3_0_conv1_7: FileAttachment("data/vis/triceratops/layer3_0_conv1/feature_007.png"),
triceratops_layer3_0_conv1_8: FileAttachment("data/vis/triceratops/layer3_0_conv1/feature_008.png"),
triceratops_layer3_0_conv1_9: FileAttachment("data/vis/triceratops/layer3_0_conv1/feature_009.png"),
triceratops_layer3_0_conv1_10: FileAttachment("data/vis/triceratops/layer3_0_conv1/feature_010.png"),
triceratops_layer3_0_conv1_11: FileAttachment("data/vis/triceratops/layer3_0_conv1/feature_011.png"),
triceratops_layer3_0_conv1_12: FileAttachment("data/vis/triceratops/layer3_0_conv1/feature_012.png"),
triceratops_layer3_0_conv1_13: FileAttachment("data/vis/triceratops/layer3_0_conv1/feature_013.png"),
triceratops_layer3_0_conv1_14: FileAttachment("data/vis/triceratops/layer3_0_conv1/feature_014.png"),
triceratops_layer3_0_conv1_15: FileAttachment("data/vis/triceratops/layer3_0_conv1/feature_015.png"),
triceratops_layer3_0_conv2_0: FileAttachment("data/vis/triceratops/layer3_0_conv2/feature_000.png"),
triceratops_layer3_0_conv2_1: FileAttachment("data/vis/triceratops/layer3_0_conv2/feature_001.png"),
triceratops_layer3_0_conv2_2: FileAttachment("data/vis/triceratops/layer3_0_conv2/feature_002.png"),
triceratops_layer3_0_conv2_3: FileAttachment("data/vis/triceratops/layer3_0_conv2/feature_003.png"),
triceratops_layer3_0_conv2_4: FileAttachment("data/vis/triceratops/layer3_0_conv2/feature_004.png"),
triceratops_layer3_0_conv2_5: FileAttachment("data/vis/triceratops/layer3_0_conv2/feature_005.png"),
triceratops_layer3_0_conv2_6: FileAttachment("data/vis/triceratops/layer3_0_conv2/feature_006.png"),
triceratops_layer3_0_conv2_7: FileAttachment("data/vis/triceratops/layer3_0_conv2/feature_007.png"),
triceratops_layer3_0_conv2_8: FileAttachment("data/vis/triceratops/layer3_0_conv2/feature_008.png"),
triceratops_layer3_0_conv2_9: FileAttachment("data/vis/triceratops/layer3_0_conv2/feature_009.png"),
triceratops_layer3_0_conv2_10: FileAttachment("data/vis/triceratops/layer3_0_conv2/feature_010.png"),
triceratops_layer3_0_conv2_11: FileAttachment("data/vis/triceratops/layer3_0_conv2/feature_011.png"),
triceratops_layer3_0_conv2_12: FileAttachment("data/vis/triceratops/layer3_0_conv2/feature_012.png"),
triceratops_layer3_0_conv2_13: FileAttachment("data/vis/triceratops/layer3_0_conv2/feature_013.png"),
triceratops_layer3_0_conv2_14: FileAttachment("data/vis/triceratops/layer3_0_conv2/feature_014.png"),
triceratops_layer3_0_conv2_15: FileAttachment("data/vis/triceratops/layer3_0_conv2/feature_015.png"),
triceratops_layer3_1_conv1_0: FileAttachment("data/vis/triceratops/layer3_1_conv1/feature_000.png"),
triceratops_layer3_1_conv1_1: FileAttachment("data/vis/triceratops/layer3_1_conv1/feature_001.png"),
triceratops_layer3_1_conv1_2: FileAttachment("data/vis/triceratops/layer3_1_conv1/feature_002.png"),
triceratops_layer3_1_conv1_3: FileAttachment("data/vis/triceratops/layer3_1_conv1/feature_003.png"),
triceratops_layer3_1_conv1_4: FileAttachment("data/vis/triceratops/layer3_1_conv1/feature_004.png"),
triceratops_layer3_1_conv1_5: FileAttachment("data/vis/triceratops/layer3_1_conv1/feature_005.png"),
triceratops_layer3_1_conv1_6: FileAttachment("data/vis/triceratops/layer3_1_conv1/feature_006.png"),
triceratops_layer3_1_conv1_7: FileAttachment("data/vis/triceratops/layer3_1_conv1/feature_007.png"),
triceratops_layer3_1_conv1_8: FileAttachment("data/vis/triceratops/layer3_1_conv1/feature_008.png"),
triceratops_layer3_1_conv1_9: FileAttachment("data/vis/triceratops/layer3_1_conv1/feature_009.png"),
triceratops_layer3_1_conv1_10: FileAttachment("data/vis/triceratops/layer3_1_conv1/feature_010.png"),
triceratops_layer3_1_conv1_11: FileAttachment("data/vis/triceratops/layer3_1_conv1/feature_011.png"),
triceratops_layer3_1_conv1_12: FileAttachment("data/vis/triceratops/layer3_1_conv1/feature_012.png"),
triceratops_layer3_1_conv1_13: FileAttachment("data/vis/triceratops/layer3_1_conv1/feature_013.png"),
triceratops_layer3_1_conv1_14: FileAttachment("data/vis/triceratops/layer3_1_conv1/feature_014.png"),
triceratops_layer3_1_conv1_15: FileAttachment("data/vis/triceratops/layer3_1_conv1/feature_015.png"),
triceratops_layer3_1_conv2_0: FileAttachment("data/vis/triceratops/layer3_1_conv2/feature_000.png"),
triceratops_layer3_1_conv2_1: FileAttachment("data/vis/triceratops/layer3_1_conv2/feature_001.png"),
triceratops_layer3_1_conv2_2: FileAttachment("data/vis/triceratops/layer3_1_conv2/feature_002.png"),
triceratops_layer3_1_conv2_3: FileAttachment("data/vis/triceratops/layer3_1_conv2/feature_003.png"),
triceratops_layer3_1_conv2_4: FileAttachment("data/vis/triceratops/layer3_1_conv2/feature_004.png"),
triceratops_layer3_1_conv2_5: FileAttachment("data/vis/triceratops/layer3_1_conv2/feature_005.png"),
triceratops_layer3_1_conv2_6: FileAttachment("data/vis/triceratops/layer3_1_conv2/feature_006.png"),
triceratops_layer3_1_conv2_7: FileAttachment("data/vis/triceratops/layer3_1_conv2/feature_007.png"),
triceratops_layer3_1_conv2_8: FileAttachment("data/vis/triceratops/layer3_1_conv2/feature_008.png"),
triceratops_layer3_1_conv2_9: FileAttachment("data/vis/triceratops/layer3_1_conv2/feature_009.png"),
triceratops_layer3_1_conv2_10: FileAttachment("data/vis/triceratops/layer3_1_conv2/feature_010.png"),
triceratops_layer3_1_conv2_11: FileAttachment("data/vis/triceratops/layer3_1_conv2/feature_011.png"),
triceratops_layer3_1_conv2_12: FileAttachment("data/vis/triceratops/layer3_1_conv2/feature_012.png"),
triceratops_layer3_1_conv2_13: FileAttachment("data/vis/triceratops/layer3_1_conv2/feature_013.png"),
triceratops_layer3_1_conv2_14: FileAttachment("data/vis/triceratops/layer3_1_conv2/feature_014.png"),
triceratops_layer3_1_conv2_15: FileAttachment("data/vis/triceratops/layer3_1_conv2/feature_015.png"),
triceratops_layer4_0_conv1_0: FileAttachment("data/vis/triceratops/layer4_0_conv1/feature_000.png"),
triceratops_layer4_0_conv1_1: FileAttachment("data/vis/triceratops/layer4_0_conv1/feature_001.png"),
triceratops_layer4_0_conv1_2: FileAttachment("data/vis/triceratops/layer4_0_conv1/feature_002.png"),
triceratops_layer4_0_conv1_3: FileAttachment("data/vis/triceratops/layer4_0_conv1/feature_003.png"),
triceratops_layer4_0_conv1_4: FileAttachment("data/vis/triceratops/layer4_0_conv1/feature_004.png"),
triceratops_layer4_0_conv1_5: FileAttachment("data/vis/triceratops/layer4_0_conv1/feature_005.png"),
triceratops_layer4_0_conv1_6: FileAttachment("data/vis/triceratops/layer4_0_conv1/feature_006.png"),
triceratops_layer4_0_conv1_7: FileAttachment("data/vis/triceratops/layer4_0_conv1/feature_007.png"),
triceratops_layer4_0_conv1_8: FileAttachment("data/vis/triceratops/layer4_0_conv1/feature_008.png"),
triceratops_layer4_0_conv1_9: FileAttachment("data/vis/triceratops/layer4_0_conv1/feature_009.png"),
triceratops_layer4_0_conv1_10: FileAttachment("data/vis/triceratops/layer4_0_conv1/feature_010.png"),
triceratops_layer4_0_conv1_11: FileAttachment("data/vis/triceratops/layer4_0_conv1/feature_011.png"),
triceratops_layer4_0_conv1_12: FileAttachment("data/vis/triceratops/layer4_0_conv1/feature_012.png"),
triceratops_layer4_0_conv1_13: FileAttachment("data/vis/triceratops/layer4_0_conv1/feature_013.png"),
triceratops_layer4_0_conv1_14: FileAttachment("data/vis/triceratops/layer4_0_conv1/feature_014.png"),
triceratops_layer4_0_conv1_15: FileAttachment("data/vis/triceratops/layer4_0_conv1/feature_015.png"),
triceratops_layer4_0_conv2_0: FileAttachment("data/vis/triceratops/layer4_0_conv2/feature_000.png"),
triceratops_layer4_0_conv2_1: FileAttachment("data/vis/triceratops/layer4_0_conv2/feature_001.png"),
triceratops_layer4_0_conv2_2: FileAttachment("data/vis/triceratops/layer4_0_conv2/feature_002.png"),
triceratops_layer4_0_conv2_3: FileAttachment("data/vis/triceratops/layer4_0_conv2/feature_003.png"),
triceratops_layer4_0_conv2_4: FileAttachment("data/vis/triceratops/layer4_0_conv2/feature_004.png"),
triceratops_layer4_0_conv2_5: FileAttachment("data/vis/triceratops/layer4_0_conv2/feature_005.png"),
triceratops_layer4_0_conv2_6: FileAttachment("data/vis/triceratops/layer4_0_conv2/feature_006.png"),
triceratops_layer4_0_conv2_7: FileAttachment("data/vis/triceratops/layer4_0_conv2/feature_007.png"),
triceratops_layer4_0_conv2_8: FileAttachment("data/vis/triceratops/layer4_0_conv2/feature_008.png"),
triceratops_layer4_0_conv2_9: FileAttachment("data/vis/triceratops/layer4_0_conv2/feature_009.png"),
triceratops_layer4_0_conv2_10: FileAttachment("data/vis/triceratops/layer4_0_conv2/feature_010.png"),
triceratops_layer4_0_conv2_11: FileAttachment("data/vis/triceratops/layer4_0_conv2/feature_011.png"),
triceratops_layer4_0_conv2_12: FileAttachment("data/vis/triceratops/layer4_0_conv2/feature_012.png"),
triceratops_layer4_0_conv2_13: FileAttachment("data/vis/triceratops/layer4_0_conv2/feature_013.png"),
triceratops_layer4_0_conv2_14: FileAttachment("data/vis/triceratops/layer4_0_conv2/feature_014.png"),
triceratops_layer4_0_conv2_15: FileAttachment("data/vis/triceratops/layer4_0_conv2/feature_015.png"),
triceratops_layer4_1_conv1_0: FileAttachment("data/vis/triceratops/layer4_1_conv1/feature_000.png"),
triceratops_layer4_1_conv1_1: FileAttachment("data/vis/triceratops/layer4_1_conv1/feature_001.png"),
triceratops_layer4_1_conv1_2: FileAttachment("data/vis/triceratops/layer4_1_conv1/feature_002.png"),
triceratops_layer4_1_conv1_3: FileAttachment("data/vis/triceratops/layer4_1_conv1/feature_003.png"),
triceratops_layer4_1_conv1_4: FileAttachment("data/vis/triceratops/layer4_1_conv1/feature_004.png"),
triceratops_layer4_1_conv1_5: FileAttachment("data/vis/triceratops/layer4_1_conv1/feature_005.png"),
triceratops_layer4_1_conv1_6: FileAttachment("data/vis/triceratops/layer4_1_conv1/feature_006.png"),
triceratops_layer4_1_conv1_7: FileAttachment("data/vis/triceratops/layer4_1_conv1/feature_007.png"),
triceratops_layer4_1_conv1_8: FileAttachment("data/vis/triceratops/layer4_1_conv1/feature_008.png"),
triceratops_layer4_1_conv1_9: FileAttachment("data/vis/triceratops/layer4_1_conv1/feature_009.png"),
triceratops_layer4_1_conv1_10: FileAttachment("data/vis/triceratops/layer4_1_conv1/feature_010.png"),
triceratops_layer4_1_conv1_11: FileAttachment("data/vis/triceratops/layer4_1_conv1/feature_011.png"),
triceratops_layer4_1_conv1_12: FileAttachment("data/vis/triceratops/layer4_1_conv1/feature_012.png"),
triceratops_layer4_1_conv1_13: FileAttachment("data/vis/triceratops/layer4_1_conv1/feature_013.png"),
triceratops_layer4_1_conv1_14: FileAttachment("data/vis/triceratops/layer4_1_conv1/feature_014.png"),
triceratops_layer4_1_conv1_15: FileAttachment("data/vis/triceratops/layer4_1_conv1/feature_015.png"),
triceratops_layer4_1_conv2_0: FileAttachment("data/vis/triceratops/layer4_1_conv2/feature_000.png"),
triceratops_layer4_1_conv2_1: FileAttachment("data/vis/triceratops/layer4_1_conv2/feature_001.png"),
triceratops_layer4_1_conv2_2: FileAttachment("data/vis/triceratops/layer4_1_conv2/feature_002.png"),
triceratops_layer4_1_conv2_3: FileAttachment("data/vis/triceratops/layer4_1_conv2/feature_003.png"),
triceratops_layer4_1_conv2_4: FileAttachment("data/vis/triceratops/layer4_1_conv2/feature_004.png"),
triceratops_layer4_1_conv2_5: FileAttachment("data/vis/triceratops/layer4_1_conv2/feature_005.png"),
triceratops_layer4_1_conv2_6: FileAttachment("data/vis/triceratops/layer4_1_conv2/feature_006.png"),
triceratops_layer4_1_conv2_7: FileAttachment("data/vis/triceratops/layer4_1_conv2/feature_007.png"),
triceratops_layer4_1_conv2_8: FileAttachment("data/vis/triceratops/layer4_1_conv2/feature_008.png"),
triceratops_layer4_1_conv2_9: FileAttachment("data/vis/triceratops/layer4_1_conv2/feature_009.png"),
triceratops_layer4_1_conv2_10: FileAttachment("data/vis/triceratops/layer4_1_conv2/feature_010.png"),
triceratops_layer4_1_conv2_11: FileAttachment("data/vis/triceratops/layer4_1_conv2/feature_011.png"),
triceratops_layer4_1_conv2_12: FileAttachment("data/vis/triceratops/layer4_1_conv2/feature_012.png"),
triceratops_layer4_1_conv2_13: FileAttachment("data/vis/triceratops/layer4_1_conv2/feature_013.png"),
triceratops_layer4_1_conv2_14: FileAttachment("data/vis/triceratops/layer4_1_conv2/feature_014.png"),
triceratops_layer4_1_conv2_15: FileAttachment("data/vis/triceratops/layer4_1_conv2/feature_015.png"),
zebra: FileAttachment("data/vis/zebra/zebra.png"),
zebra_conv1_0: FileAttachment("data/vis/zebra/conv1/feature_000.png"),
zebra_conv1_1: FileAttachment("data/vis/zebra/conv1/feature_001.png"),
zebra_conv1_2: FileAttachment("data/vis/zebra/conv1/feature_002.png"),
zebra_conv1_3: FileAttachment("data/vis/zebra/conv1/feature_003.png"),
zebra_conv1_4: FileAttachment("data/vis/zebra/conv1/feature_004.png"),
zebra_conv1_5: FileAttachment("data/vis/zebra/conv1/feature_005.png"),
zebra_conv1_6: FileAttachment("data/vis/zebra/conv1/feature_006.png"),
zebra_conv1_7: FileAttachment("data/vis/zebra/conv1/feature_007.png"),
zebra_conv1_8: FileAttachment("data/vis/zebra/conv1/feature_008.png"),
zebra_conv1_9: FileAttachment("data/vis/zebra/conv1/feature_009.png"),
zebra_conv1_10: FileAttachment("data/vis/zebra/conv1/feature_010.png"),
zebra_conv1_11: FileAttachment("data/vis/zebra/conv1/feature_011.png"),
zebra_conv1_12: FileAttachment("data/vis/zebra/conv1/feature_012.png"),
zebra_conv1_13: FileAttachment("data/vis/zebra/conv1/feature_013.png"),
zebra_conv1_14: FileAttachment("data/vis/zebra/conv1/feature_014.png"),
zebra_conv1_15: FileAttachment("data/vis/zebra/conv1/feature_015.png"),
zebra_layer1_0_conv1_0: FileAttachment("data/vis/zebra/layer1_0_conv1/feature_000.png"),
zebra_layer1_0_conv1_1: FileAttachment("data/vis/zebra/layer1_0_conv1/feature_001.png"),
zebra_layer1_0_conv1_2: FileAttachment("data/vis/zebra/layer1_0_conv1/feature_002.png"),
zebra_layer1_0_conv1_3: FileAttachment("data/vis/zebra/layer1_0_conv1/feature_003.png"),
zebra_layer1_0_conv1_4: FileAttachment("data/vis/zebra/layer1_0_conv1/feature_004.png"),
zebra_layer1_0_conv1_5: FileAttachment("data/vis/zebra/layer1_0_conv1/feature_005.png"),
zebra_layer1_0_conv1_6: FileAttachment("data/vis/zebra/layer1_0_conv1/feature_006.png"),
zebra_layer1_0_conv1_7: FileAttachment("data/vis/zebra/layer1_0_conv1/feature_007.png"),
zebra_layer1_0_conv1_8: FileAttachment("data/vis/zebra/layer1_0_conv1/feature_008.png"),
zebra_layer1_0_conv1_9: FileAttachment("data/vis/zebra/layer1_0_conv1/feature_009.png"),
zebra_layer1_0_conv1_10: FileAttachment("data/vis/zebra/layer1_0_conv1/feature_010.png"),
zebra_layer1_0_conv1_11: FileAttachment("data/vis/zebra/layer1_0_conv1/feature_011.png"),
zebra_layer1_0_conv1_12: FileAttachment("data/vis/zebra/layer1_0_conv1/feature_012.png"),
zebra_layer1_0_conv1_13: FileAttachment("data/vis/zebra/layer1_0_conv1/feature_013.png"),
zebra_layer1_0_conv1_14: FileAttachment("data/vis/zebra/layer1_0_conv1/feature_014.png"),
zebra_layer1_0_conv1_15: FileAttachment("data/vis/zebra/layer1_0_conv1/feature_015.png"),
zebra_layer1_0_conv2_0: FileAttachment("data/vis/zebra/layer1_0_conv2/feature_000.png"),
zebra_layer1_0_conv2_1: FileAttachment("data/vis/zebra/layer1_0_conv2/feature_001.png"),
zebra_layer1_0_conv2_2: FileAttachment("data/vis/zebra/layer1_0_conv2/feature_002.png"),
zebra_layer1_0_conv2_3: FileAttachment("data/vis/zebra/layer1_0_conv2/feature_003.png"),
zebra_layer1_0_conv2_4: FileAttachment("data/vis/zebra/layer1_0_conv2/feature_004.png"),
zebra_layer1_0_conv2_5: FileAttachment("data/vis/zebra/layer1_0_conv2/feature_005.png"),
zebra_layer1_0_conv2_6: FileAttachment("data/vis/zebra/layer1_0_conv2/feature_006.png"),
zebra_layer1_0_conv2_7: FileAttachment("data/vis/zebra/layer1_0_conv2/feature_007.png"),
zebra_layer1_0_conv2_8: FileAttachment("data/vis/zebra/layer1_0_conv2/feature_008.png"),
zebra_layer1_0_conv2_9: FileAttachment("data/vis/zebra/layer1_0_conv2/feature_009.png"),
zebra_layer1_0_conv2_10: FileAttachment("data/vis/zebra/layer1_0_conv2/feature_010.png"),
zebra_layer1_0_conv2_11: FileAttachment("data/vis/zebra/layer1_0_conv2/feature_011.png"),
zebra_layer1_0_conv2_12: FileAttachment("data/vis/zebra/layer1_0_conv2/feature_012.png"),
zebra_layer1_0_conv2_13: FileAttachment("data/vis/zebra/layer1_0_conv2/feature_013.png"),
zebra_layer1_0_conv2_14: FileAttachment("data/vis/zebra/layer1_0_conv2/feature_014.png"),
zebra_layer1_0_conv2_15: FileAttachment("data/vis/zebra/layer1_0_conv2/feature_015.png"),
zebra_layer1_1_conv1_0: FileAttachment("data/vis/zebra/layer1_1_conv1/feature_000.png"),
zebra_layer1_1_conv1_1: FileAttachment("data/vis/zebra/layer1_1_conv1/feature_001.png"),
zebra_layer1_1_conv1_2: FileAttachment("data/vis/zebra/layer1_1_conv1/feature_002.png"),
zebra_layer1_1_conv1_3: FileAttachment("data/vis/zebra/layer1_1_conv1/feature_003.png"),
zebra_layer1_1_conv1_4: FileAttachment("data/vis/zebra/layer1_1_conv1/feature_004.png"),
zebra_layer1_1_conv1_5: FileAttachment("data/vis/zebra/layer1_1_conv1/feature_005.png"),
zebra_layer1_1_conv1_6: FileAttachment("data/vis/zebra/layer1_1_conv1/feature_006.png"),
zebra_layer1_1_conv1_7: FileAttachment("data/vis/zebra/layer1_1_conv1/feature_007.png"),
zebra_layer1_1_conv1_8: FileAttachment("data/vis/zebra/layer1_1_conv1/feature_008.png"),
zebra_layer1_1_conv1_9: FileAttachment("data/vis/zebra/layer1_1_conv1/feature_009.png"),
zebra_layer1_1_conv1_10: FileAttachment("data/vis/zebra/layer1_1_conv1/feature_010.png"),
zebra_layer1_1_conv1_11: FileAttachment("data/vis/zebra/layer1_1_conv1/feature_011.png"),
zebra_layer1_1_conv1_12: FileAttachment("data/vis/zebra/layer1_1_conv1/feature_012.png"),
zebra_layer1_1_conv1_13: FileAttachment("data/vis/zebra/layer1_1_conv1/feature_013.png"),
zebra_layer1_1_conv1_14: FileAttachment("data/vis/zebra/layer1_1_conv1/feature_014.png"),
zebra_layer1_1_conv1_15: FileAttachment("data/vis/zebra/layer1_1_conv1/feature_015.png"),
zebra_layer1_1_conv2_0: FileAttachment("data/vis/zebra/layer1_1_conv2/feature_000.png"),
zebra_layer1_1_conv2_1: FileAttachment("data/vis/zebra/layer1_1_conv2/feature_001.png"),
zebra_layer1_1_conv2_2: FileAttachment("data/vis/zebra/layer1_1_conv2/feature_002.png"),
zebra_layer1_1_conv2_3: FileAttachment("data/vis/zebra/layer1_1_conv2/feature_003.png"),
zebra_layer1_1_conv2_4: FileAttachment("data/vis/zebra/layer1_1_conv2/feature_004.png"),
zebra_layer1_1_conv2_5: FileAttachment("data/vis/zebra/layer1_1_conv2/feature_005.png"),
zebra_layer1_1_conv2_6: FileAttachment("data/vis/zebra/layer1_1_conv2/feature_006.png"),
zebra_layer1_1_conv2_7: FileAttachment("data/vis/zebra/layer1_1_conv2/feature_007.png"),
zebra_layer1_1_conv2_8: FileAttachment("data/vis/zebra/layer1_1_conv2/feature_008.png"),
zebra_layer1_1_conv2_9: FileAttachment("data/vis/zebra/layer1_1_conv2/feature_009.png"),
zebra_layer1_1_conv2_10: FileAttachment("data/vis/zebra/layer1_1_conv2/feature_010.png"),
zebra_layer1_1_conv2_11: FileAttachment("data/vis/zebra/layer1_1_conv2/feature_011.png"),
zebra_layer1_1_conv2_12: FileAttachment("data/vis/zebra/layer1_1_conv2/feature_012.png"),
zebra_layer1_1_conv2_13: FileAttachment("data/vis/zebra/layer1_1_conv2/feature_013.png"),
zebra_layer1_1_conv2_14: FileAttachment("data/vis/zebra/layer1_1_conv2/feature_014.png"),
zebra_layer1_1_conv2_15: FileAttachment("data/vis/zebra/layer1_1_conv2/feature_015.png"),
zebra_layer2_0_conv1_0: FileAttachment("data/vis/zebra/layer2_0_conv1/feature_000.png"),
zebra_layer2_0_conv1_1: FileAttachment("data/vis/zebra/layer2_0_conv1/feature_001.png"),
zebra_layer2_0_conv1_2: FileAttachment("data/vis/zebra/layer2_0_conv1/feature_002.png"),
zebra_layer2_0_conv1_3: FileAttachment("data/vis/zebra/layer2_0_conv1/feature_003.png"),
zebra_layer2_0_conv1_4: FileAttachment("data/vis/zebra/layer2_0_conv1/feature_004.png"),
zebra_layer2_0_conv1_5: FileAttachment("data/vis/zebra/layer2_0_conv1/feature_005.png"),
zebra_layer2_0_conv1_6: FileAttachment("data/vis/zebra/layer2_0_conv1/feature_006.png"),
zebra_layer2_0_conv1_7: FileAttachment("data/vis/zebra/layer2_0_conv1/feature_007.png"),
zebra_layer2_0_conv1_8: FileAttachment("data/vis/zebra/layer2_0_conv1/feature_008.png"),
zebra_layer2_0_conv1_9: FileAttachment("data/vis/zebra/layer2_0_conv1/feature_009.png"),
zebra_layer2_0_conv1_10: FileAttachment("data/vis/zebra/layer2_0_conv1/feature_010.png"),
zebra_layer2_0_conv1_11: FileAttachment("data/vis/zebra/layer2_0_conv1/feature_011.png"),
zebra_layer2_0_conv1_12: FileAttachment("data/vis/zebra/layer2_0_conv1/feature_012.png"),
zebra_layer2_0_conv1_13: FileAttachment("data/vis/zebra/layer2_0_conv1/feature_013.png"),
zebra_layer2_0_conv1_14: FileAttachment("data/vis/zebra/layer2_0_conv1/feature_014.png"),
zebra_layer2_0_conv1_15: FileAttachment("data/vis/zebra/layer2_0_conv1/feature_015.png"),
zebra_layer2_0_conv2_0: FileAttachment("data/vis/zebra/layer2_0_conv2/feature_000.png"),
zebra_layer2_0_conv2_1: FileAttachment("data/vis/zebra/layer2_0_conv2/feature_001.png"),
zebra_layer2_0_conv2_2: FileAttachment("data/vis/zebra/layer2_0_conv2/feature_002.png"),
zebra_layer2_0_conv2_3: FileAttachment("data/vis/zebra/layer2_0_conv2/feature_003.png"),
zebra_layer2_0_conv2_4: FileAttachment("data/vis/zebra/layer2_0_conv2/feature_004.png"),
zebra_layer2_0_conv2_5: FileAttachment("data/vis/zebra/layer2_0_conv2/feature_005.png"),
zebra_layer2_0_conv2_6: FileAttachment("data/vis/zebra/layer2_0_conv2/feature_006.png"),
zebra_layer2_0_conv2_7: FileAttachment("data/vis/zebra/layer2_0_conv2/feature_007.png"),
zebra_layer2_0_conv2_8: FileAttachment("data/vis/zebra/layer2_0_conv2/feature_008.png"),
zebra_layer2_0_conv2_9: FileAttachment("data/vis/zebra/layer2_0_conv2/feature_009.png"),
zebra_layer2_0_conv2_10: FileAttachment("data/vis/zebra/layer2_0_conv2/feature_010.png"),
zebra_layer2_0_conv2_11: FileAttachment("data/vis/zebra/layer2_0_conv2/feature_011.png"),
zebra_layer2_0_conv2_12: FileAttachment("data/vis/zebra/layer2_0_conv2/feature_012.png"),
zebra_layer2_0_conv2_13: FileAttachment("data/vis/zebra/layer2_0_conv2/feature_013.png"),
zebra_layer2_0_conv2_14: FileAttachment("data/vis/zebra/layer2_0_conv2/feature_014.png"),
zebra_layer2_0_conv2_15: FileAttachment("data/vis/zebra/layer2_0_conv2/feature_015.png"),
zebra_layer2_1_conv1_0: FileAttachment("data/vis/zebra/layer2_1_conv1/feature_000.png"),
zebra_layer2_1_conv1_1: FileAttachment("data/vis/zebra/layer2_1_conv1/feature_001.png"),
zebra_layer2_1_conv1_2: FileAttachment("data/vis/zebra/layer2_1_conv1/feature_002.png"),
zebra_layer2_1_conv1_3: FileAttachment("data/vis/zebra/layer2_1_conv1/feature_003.png"),
zebra_layer2_1_conv1_4: FileAttachment("data/vis/zebra/layer2_1_conv1/feature_004.png"),
zebra_layer2_1_conv1_5: FileAttachment("data/vis/zebra/layer2_1_conv1/feature_005.png"),
zebra_layer2_1_conv1_6: FileAttachment("data/vis/zebra/layer2_1_conv1/feature_006.png"),
zebra_layer2_1_conv1_7: FileAttachment("data/vis/zebra/layer2_1_conv1/feature_007.png"),
zebra_layer2_1_conv1_8: FileAttachment("data/vis/zebra/layer2_1_conv1/feature_008.png"),
zebra_layer2_1_conv1_9: FileAttachment("data/vis/zebra/layer2_1_conv1/feature_009.png"),
zebra_layer2_1_conv1_10: FileAttachment("data/vis/zebra/layer2_1_conv1/feature_010.png"),
zebra_layer2_1_conv1_11: FileAttachment("data/vis/zebra/layer2_1_conv1/feature_011.png"),
zebra_layer2_1_conv1_12: FileAttachment("data/vis/zebra/layer2_1_conv1/feature_012.png"),
zebra_layer2_1_conv1_13: FileAttachment("data/vis/zebra/layer2_1_conv1/feature_013.png"),
zebra_layer2_1_conv1_14: FileAttachment("data/vis/zebra/layer2_1_conv1/feature_014.png"),
zebra_layer2_1_conv1_15: FileAttachment("data/vis/zebra/layer2_1_conv1/feature_015.png"),
zebra_layer2_1_conv2_0: FileAttachment("data/vis/zebra/layer2_1_conv2/feature_000.png"),
zebra_layer2_1_conv2_1: FileAttachment("data/vis/zebra/layer2_1_conv2/feature_001.png"),
zebra_layer2_1_conv2_2: FileAttachment("data/vis/zebra/layer2_1_conv2/feature_002.png"),
zebra_layer2_1_conv2_3: FileAttachment("data/vis/zebra/layer2_1_conv2/feature_003.png"),
zebra_layer2_1_conv2_4: FileAttachment("data/vis/zebra/layer2_1_conv2/feature_004.png"),
zebra_layer2_1_conv2_5: FileAttachment("data/vis/zebra/layer2_1_conv2/feature_005.png"),
zebra_layer2_1_conv2_6: FileAttachment("data/vis/zebra/layer2_1_conv2/feature_006.png"),
zebra_layer2_1_conv2_7: FileAttachment("data/vis/zebra/layer2_1_conv2/feature_007.png"),
zebra_layer2_1_conv2_8: FileAttachment("data/vis/zebra/layer2_1_conv2/feature_008.png"),
zebra_layer2_1_conv2_9: FileAttachment("data/vis/zebra/layer2_1_conv2/feature_009.png"),
zebra_layer2_1_conv2_10: FileAttachment("data/vis/zebra/layer2_1_conv2/feature_010.png"),
zebra_layer2_1_conv2_11: FileAttachment("data/vis/zebra/layer2_1_conv2/feature_011.png"),
zebra_layer2_1_conv2_12: FileAttachment("data/vis/zebra/layer2_1_conv2/feature_012.png"),
zebra_layer2_1_conv2_13: FileAttachment("data/vis/zebra/layer2_1_conv2/feature_013.png"),
zebra_layer2_1_conv2_14: FileAttachment("data/vis/zebra/layer2_1_conv2/feature_014.png"),
zebra_layer2_1_conv2_15: FileAttachment("data/vis/zebra/layer2_1_conv2/feature_015.png"),
zebra_layer3_0_conv1_0: FileAttachment("data/vis/zebra/layer3_0_conv1/feature_000.png"),
zebra_layer3_0_conv1_1: FileAttachment("data/vis/zebra/layer3_0_conv1/feature_001.png"),
zebra_layer3_0_conv1_2: FileAttachment("data/vis/zebra/layer3_0_conv1/feature_002.png"),
zebra_layer3_0_conv1_3: FileAttachment("data/vis/zebra/layer3_0_conv1/feature_003.png"),
zebra_layer3_0_conv1_4: FileAttachment("data/vis/zebra/layer3_0_conv1/feature_004.png"),
zebra_layer3_0_conv1_5: FileAttachment("data/vis/zebra/layer3_0_conv1/feature_005.png"),
zebra_layer3_0_conv1_6: FileAttachment("data/vis/zebra/layer3_0_conv1/feature_006.png"),
zebra_layer3_0_conv1_7: FileAttachment("data/vis/zebra/layer3_0_conv1/feature_007.png"),
zebra_layer3_0_conv1_8: FileAttachment("data/vis/zebra/layer3_0_conv1/feature_008.png"),
zebra_layer3_0_conv1_9: FileAttachment("data/vis/zebra/layer3_0_conv1/feature_009.png"),
zebra_layer3_0_conv1_10: FileAttachment("data/vis/zebra/layer3_0_conv1/feature_010.png"),
zebra_layer3_0_conv1_11: FileAttachment("data/vis/zebra/layer3_0_conv1/feature_011.png"),
zebra_layer3_0_conv1_12: FileAttachment("data/vis/zebra/layer3_0_conv1/feature_012.png"),
zebra_layer3_0_conv1_13: FileAttachment("data/vis/zebra/layer3_0_conv1/feature_013.png"),
zebra_layer3_0_conv1_14: FileAttachment("data/vis/zebra/layer3_0_conv1/feature_014.png"),
zebra_layer3_0_conv1_15: FileAttachment("data/vis/zebra/layer3_0_conv1/feature_015.png"),
zebra_layer3_0_conv2_0: FileAttachment("data/vis/zebra/layer3_0_conv2/feature_000.png"),
zebra_layer3_0_conv2_1: FileAttachment("data/vis/zebra/layer3_0_conv2/feature_001.png"),
zebra_layer3_0_conv2_2: FileAttachment("data/vis/zebra/layer3_0_conv2/feature_002.png"),
zebra_layer3_0_conv2_3: FileAttachment("data/vis/zebra/layer3_0_conv2/feature_003.png"),
zebra_layer3_0_conv2_4: FileAttachment("data/vis/zebra/layer3_0_conv2/feature_004.png"),
zebra_layer3_0_conv2_5: FileAttachment("data/vis/zebra/layer3_0_conv2/feature_005.png"),
zebra_layer3_0_conv2_6: FileAttachment("data/vis/zebra/layer3_0_conv2/feature_006.png"),
zebra_layer3_0_conv2_7: FileAttachment("data/vis/zebra/layer3_0_conv2/feature_007.png"),
zebra_layer3_0_conv2_8: FileAttachment("data/vis/zebra/layer3_0_conv2/feature_008.png"),
zebra_layer3_0_conv2_9: FileAttachment("data/vis/zebra/layer3_0_conv2/feature_009.png"),
zebra_layer3_0_conv2_10: FileAttachment("data/vis/zebra/layer3_0_conv2/feature_010.png"),
zebra_layer3_0_conv2_11: FileAttachment("data/vis/zebra/layer3_0_conv2/feature_011.png"),
zebra_layer3_0_conv2_12: FileAttachment("data/vis/zebra/layer3_0_conv2/feature_012.png"),
zebra_layer3_0_conv2_13: FileAttachment("data/vis/zebra/layer3_0_conv2/feature_013.png"),
zebra_layer3_0_conv2_14: FileAttachment("data/vis/zebra/layer3_0_conv2/feature_014.png"),
zebra_layer3_0_conv2_15: FileAttachment("data/vis/zebra/layer3_0_conv2/feature_015.png"),
zebra_layer3_1_conv1_0: FileAttachment("data/vis/zebra/layer3_1_conv1/feature_000.png"),
zebra_layer3_1_conv1_1: FileAttachment("data/vis/zebra/layer3_1_conv1/feature_001.png"),
zebra_layer3_1_conv1_2: FileAttachment("data/vis/zebra/layer3_1_conv1/feature_002.png"),
zebra_layer3_1_conv1_3: FileAttachment("data/vis/zebra/layer3_1_conv1/feature_003.png"),
zebra_layer3_1_conv1_4: FileAttachment("data/vis/zebra/layer3_1_conv1/feature_004.png"),
zebra_layer3_1_conv1_5: FileAttachment("data/vis/zebra/layer3_1_conv1/feature_005.png"),
zebra_layer3_1_conv1_6: FileAttachment("data/vis/zebra/layer3_1_conv1/feature_006.png"),
zebra_layer3_1_conv1_7: FileAttachment("data/vis/zebra/layer3_1_conv1/feature_007.png"),
zebra_layer3_1_conv1_8: FileAttachment("data/vis/zebra/layer3_1_conv1/feature_008.png"),
zebra_layer3_1_conv1_9: FileAttachment("data/vis/zebra/layer3_1_conv1/feature_009.png"),
zebra_layer3_1_conv1_10: FileAttachment("data/vis/zebra/layer3_1_conv1/feature_010.png"),
zebra_layer3_1_conv1_11: FileAttachment("data/vis/zebra/layer3_1_conv1/feature_011.png"),
zebra_layer3_1_conv1_12: FileAttachment("data/vis/zebra/layer3_1_conv1/feature_012.png"),
zebra_layer3_1_conv1_13: FileAttachment("data/vis/zebra/layer3_1_conv1/feature_013.png"),
zebra_layer3_1_conv1_14: FileAttachment("data/vis/zebra/layer3_1_conv1/feature_014.png"),
zebra_layer3_1_conv1_15: FileAttachment("data/vis/zebra/layer3_1_conv1/feature_015.png"),
zebra_layer3_1_conv2_0: FileAttachment("data/vis/zebra/layer3_1_conv2/feature_000.png"),
zebra_layer3_1_conv2_1: FileAttachment("data/vis/zebra/layer3_1_conv2/feature_001.png"),
zebra_layer3_1_conv2_2: FileAttachment("data/vis/zebra/layer3_1_conv2/feature_002.png"),
zebra_layer3_1_conv2_3: FileAttachment("data/vis/zebra/layer3_1_conv2/feature_003.png"),
zebra_layer3_1_conv2_4: FileAttachment("data/vis/zebra/layer3_1_conv2/feature_004.png"),
zebra_layer3_1_conv2_5: FileAttachment("data/vis/zebra/layer3_1_conv2/feature_005.png"),
zebra_layer3_1_conv2_6: FileAttachment("data/vis/zebra/layer3_1_conv2/feature_006.png"),
zebra_layer3_1_conv2_7: FileAttachment("data/vis/zebra/layer3_1_conv2/feature_007.png"),
zebra_layer3_1_conv2_8: FileAttachment("data/vis/zebra/layer3_1_conv2/feature_008.png"),
zebra_layer3_1_conv2_9: FileAttachment("data/vis/zebra/layer3_1_conv2/feature_009.png"),
zebra_layer3_1_conv2_10: FileAttachment("data/vis/zebra/layer3_1_conv2/feature_010.png"),
zebra_layer3_1_conv2_11: FileAttachment("data/vis/zebra/layer3_1_conv2/feature_011.png"),
zebra_layer3_1_conv2_12: FileAttachment("data/vis/zebra/layer3_1_conv2/feature_012.png"),
zebra_layer3_1_conv2_13: FileAttachment("data/vis/zebra/layer3_1_conv2/feature_013.png"),
zebra_layer3_1_conv2_14: FileAttachment("data/vis/zebra/layer3_1_conv2/feature_014.png"),
zebra_layer3_1_conv2_15: FileAttachment("data/vis/zebra/layer3_1_conv2/feature_015.png"),
zebra_layer4_0_conv1_0: FileAttachment("data/vis/zebra/layer4_0_conv1/feature_000.png"),
zebra_layer4_0_conv1_1: FileAttachment("data/vis/zebra/layer4_0_conv1/feature_001.png"),
zebra_layer4_0_conv1_2: FileAttachment("data/vis/zebra/layer4_0_conv1/feature_002.png"),
zebra_layer4_0_conv1_3: FileAttachment("data/vis/zebra/layer4_0_conv1/feature_003.png"),
zebra_layer4_0_conv1_4: FileAttachment("data/vis/zebra/layer4_0_conv1/feature_004.png"),
zebra_layer4_0_conv1_5: FileAttachment("data/vis/zebra/layer4_0_conv1/feature_005.png"),
zebra_layer4_0_conv1_6: FileAttachment("data/vis/zebra/layer4_0_conv1/feature_006.png"),
zebra_layer4_0_conv1_7: FileAttachment("data/vis/zebra/layer4_0_conv1/feature_007.png"),
zebra_layer4_0_conv1_8: FileAttachment("data/vis/zebra/layer4_0_conv1/feature_008.png"),
zebra_layer4_0_conv1_9: FileAttachment("data/vis/zebra/layer4_0_conv1/feature_009.png"),
zebra_layer4_0_conv1_10: FileAttachment("data/vis/zebra/layer4_0_conv1/feature_010.png"),
zebra_layer4_0_conv1_11: FileAttachment("data/vis/zebra/layer4_0_conv1/feature_011.png"),
zebra_layer4_0_conv1_12: FileAttachment("data/vis/zebra/layer4_0_conv1/feature_012.png"),
zebra_layer4_0_conv1_13: FileAttachment("data/vis/zebra/layer4_0_conv1/feature_013.png"),
zebra_layer4_0_conv1_14: FileAttachment("data/vis/zebra/layer4_0_conv1/feature_014.png"),
zebra_layer4_0_conv1_15: FileAttachment("data/vis/zebra/layer4_0_conv1/feature_015.png"),
zebra_layer4_0_conv2_0: FileAttachment("data/vis/zebra/layer4_0_conv2/feature_000.png"),
zebra_layer4_0_conv2_1: FileAttachment("data/vis/zebra/layer4_0_conv2/feature_001.png"),
zebra_layer4_0_conv2_2: FileAttachment("data/vis/zebra/layer4_0_conv2/feature_002.png"),
zebra_layer4_0_conv2_3: FileAttachment("data/vis/zebra/layer4_0_conv2/feature_003.png"),
zebra_layer4_0_conv2_4: FileAttachment("data/vis/zebra/layer4_0_conv2/feature_004.png"),
zebra_layer4_0_conv2_5: FileAttachment("data/vis/zebra/layer4_0_conv2/feature_005.png"),
zebra_layer4_0_conv2_6: FileAttachment("data/vis/zebra/layer4_0_conv2/feature_006.png"),
zebra_layer4_0_conv2_7: FileAttachment("data/vis/zebra/layer4_0_conv2/feature_007.png"),
zebra_layer4_0_conv2_8: FileAttachment("data/vis/zebra/layer4_0_conv2/feature_008.png"),
zebra_layer4_0_conv2_9: FileAttachment("data/vis/zebra/layer4_0_conv2/feature_009.png"),
zebra_layer4_0_conv2_10: FileAttachment("data/vis/zebra/layer4_0_conv2/feature_010.png"),
zebra_layer4_0_conv2_11: FileAttachment("data/vis/zebra/layer4_0_conv2/feature_011.png"),
zebra_layer4_0_conv2_12: FileAttachment("data/vis/zebra/layer4_0_conv2/feature_012.png"),
zebra_layer4_0_conv2_13: FileAttachment("data/vis/zebra/layer4_0_conv2/feature_013.png"),
zebra_layer4_0_conv2_14: FileAttachment("data/vis/zebra/layer4_0_conv2/feature_014.png"),
zebra_layer4_0_conv2_15: FileAttachment("data/vis/zebra/layer4_0_conv2/feature_015.png"),
zebra_layer4_1_conv1_0: FileAttachment("data/vis/zebra/layer4_1_conv1/feature_000.png"),
zebra_layer4_1_conv1_1: FileAttachment("data/vis/zebra/layer4_1_conv1/feature_001.png"),
zebra_layer4_1_conv1_2: FileAttachment("data/vis/zebra/layer4_1_conv1/feature_002.png"),
zebra_layer4_1_conv1_3: FileAttachment("data/vis/zebra/layer4_1_conv1/feature_003.png"),
zebra_layer4_1_conv1_4: FileAttachment("data/vis/zebra/layer4_1_conv1/feature_004.png"),
zebra_layer4_1_conv1_5: FileAttachment("data/vis/zebra/layer4_1_conv1/feature_005.png"),
zebra_layer4_1_conv1_6: FileAttachment("data/vis/zebra/layer4_1_conv1/feature_006.png"),
zebra_layer4_1_conv1_7: FileAttachment("data/vis/zebra/layer4_1_conv1/feature_007.png"),
zebra_layer4_1_conv1_8: FileAttachment("data/vis/zebra/layer4_1_conv1/feature_008.png"),
zebra_layer4_1_conv1_9: FileAttachment("data/vis/zebra/layer4_1_conv1/feature_009.png"),
zebra_layer4_1_conv1_10: FileAttachment("data/vis/zebra/layer4_1_conv1/feature_010.png"),
zebra_layer4_1_conv1_11: FileAttachment("data/vis/zebra/layer4_1_conv1/feature_011.png"),
zebra_layer4_1_conv1_12: FileAttachment("data/vis/zebra/layer4_1_conv1/feature_012.png"),
zebra_layer4_1_conv1_13: FileAttachment("data/vis/zebra/layer4_1_conv1/feature_013.png"),
zebra_layer4_1_conv1_14: FileAttachment("data/vis/zebra/layer4_1_conv1/feature_014.png"),
zebra_layer4_1_conv1_15: FileAttachment("data/vis/zebra/layer4_1_conv1/feature_015.png"),
zebra_layer4_1_conv2_0: FileAttachment("data/vis/zebra/layer4_1_conv2/feature_000.png"),
zebra_layer4_1_conv2_1: FileAttachment("data/vis/zebra/layer4_1_conv2/feature_001.png"),
zebra_layer4_1_conv2_2: FileAttachment("data/vis/zebra/layer4_1_conv2/feature_002.png"),
zebra_layer4_1_conv2_3: FileAttachment("data/vis/zebra/layer4_1_conv2/feature_003.png"),
zebra_layer4_1_conv2_4: FileAttachment("data/vis/zebra/layer4_1_conv2/feature_004.png"),
zebra_layer4_1_conv2_5: FileAttachment("data/vis/zebra/layer4_1_conv2/feature_005.png"),
zebra_layer4_1_conv2_6: FileAttachment("data/vis/zebra/layer4_1_conv2/feature_006.png"),
zebra_layer4_1_conv2_7: FileAttachment("data/vis/zebra/layer4_1_conv2/feature_007.png"),
zebra_layer4_1_conv2_8: FileAttachment("data/vis/zebra/layer4_1_conv2/feature_008.png"),
zebra_layer4_1_conv2_9: FileAttachment("data/vis/zebra/layer4_1_conv2/feature_009.png"),
zebra_layer4_1_conv2_10: FileAttachment("data/vis/zebra/layer4_1_conv2/feature_010.png"),
zebra_layer4_1_conv2_11: FileAttachment("data/vis/zebra/layer4_1_conv2/feature_011.png"),
zebra_layer4_1_conv2_12: FileAttachment("data/vis/zebra/layer4_1_conv2/feature_012.png"),
zebra_layer4_1_conv2_13: FileAttachment("data/vis/zebra/layer4_1_conv2/feature_013.png"),
zebra_layer4_1_conv2_14: FileAttachment("data/vis/zebra/layer4_1_conv2/feature_014.png"),
zebra_layer4_1_conv2_15: FileAttachment("data/vis/zebra/layer4_1_conv2/feature_015.png"),
  };

  function getImageKey(animal, layerId, index) {
    return `${animal}_${layerId}_${index}`;
  }

  async function updateImage(index = currentFeatureMapIndex) {
    if (!selectedBlockId || selectedBlockId === "fc") {
      imageContainer.style.display = "none";
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
      switchAnimalBtn.style.display = "none";
      toggleBtn.style.display = "none";
      infoText.style.display = "block";
      return;
    }

    imageContainer.style.display = "flex";
    if (currentFeatureMapIndex == 0){
      prevBtn.style.display = "none";
    }
    nextBtn.style.display = "";
    switchAnimalBtn.style.display = "";
    toggleBtn.style.display = "";
    infoText.style.display = "none";

    if (overlayOn) {
      const imageKey = getImageKey(animal, selectedBlockId, index);
      
      if (sampleImages[imageKey]) {
        try {
          const imageUrl = await sampleImages[imageKey].url();
          imgElem.src = imageUrl;
          captionElem.innerHTML = `Layer: <b>${selectedBlockId}</b>, Feature Map: <b>${index}</b>`;
          nextBtn.style.display = "block";
        } catch (error) {
          console.warn(`Failed to load image: ${imageKey}`, error);
          imgElem.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjEyOCIgeT0iMTI4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjYiPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=";
          captionElem.innerHTML = `Layer: <b>${selectedBlockId}</b>, Feature Map: <b>${index}</b> (not found)`;
        }
      } else {
        imgElem.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjEyOCIgeT0iMTI4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjYiPkZlYXR1cmUgbWFwIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+";
        captionElem.innerHTML = `Layer: <b>${selectedBlockId}</b>, Feature Map: <b>${index}</b> (not available)`;
      }
    } else {
      try {
        const originalUrl = await sampleImages[animal].url();
        imgElem.src = originalUrl;
        captionElem.textContent = "Input Image";
        prevBtn.style.display = "none";
        nextBtn.style.display = "none";
      } catch (error) {
        console.warn(`Failed to load original image`, error);
        imgElem.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjEyOCIgeT0iMTI4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjYiPk9yaWdpbmFsIGltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=";
        captionElem.textContent = "Input Image (not found)";
      }
    }
  }

  toggleBtn.onclick = async () => {
    overlayOn = !overlayOn;
    toggleBtn.textContent = overlayOn ? "Hide Overlay" : "Show Overlay";
    await updateImage();
  };

  switchAnimalBtn.onclick = async () => {
    animalIdx = (animalIdx + 1) % animalList.length;
    animal = animalList[animalIdx];
    switchAnimalBtn.textContent = `Switch to ${animalList[(animalIdx + 1) % animalList.length]}`;
    await updateImage();
  };

  prevBtn.onclick = async () => {
    if (!overlayOn) return;
    currentFeatureMapIndex = Math.max(0, currentFeatureMapIndex - 1);
    await updateImage(currentFeatureMapIndex);
    if (currentFeatureMapIndex  == 0){
      prevBtn.style.display = "none";
    }
    nextBtn.style.display = "";
  };

  nextBtn.onclick = async () => {
    if (!overlayOn) return;
    currentFeatureMapIndex = currentFeatureMapIndex + 1;
    await updateImage(currentFeatureMapIndex);
    if (currentFeatureMapIndex > 14){
      nextBtn.style.display = "none";
    }
    prevBtn.style.display = "";
  };

  container.update = async (newSelectedBlockId, newFeatureMapIndex = 0) => {
    selectedBlockId = newSelectedBlockId;
    currentFeatureMapIndex = newFeatureMapIndex;
    await updateImage();
  };

  updateImage();
  const blackBox = createBlackBox();
  container.appendChild(blackBox);
  return container;
}

function createCNNDiagram() {
  const svg = d3.create("svg")
      .attr("viewBox", "0 0 1200 400")
      .style("width", "100%")
      .style("height", "auto");

  const blockGroups = svg.selectAll("g.layer")
    .data(blocks)
    .join("g")
      .classed("cnn-block", true)
      .style("cursor", "pointer")
      .on("click", async (event, d) => {
        const newId = (selectedBlockId === d.id) ? null : d.id;
        selectedBlockId = newId;
        featureMapIndex = 0;
        await imageDisplay.update(selectedBlockId, featureMapIndex);
        updateDiagram();
      });

  // Front face
  blockGroups.append("polygon")
      .attr("points", d => `${d.x},${d.y} ${d.x + d.w},${d.y} ${d.x + d.w},${d.y + d.h} ${d.x},${d.y + d.h}`)
      .attr("fill", d => d.color || "#3498db")
      .attr("stroke", d => (d.id === selectedBlockId) ? "#F5F5DC" : "none")
      .attr("stroke-width", 2);

  // Top face
  blockGroups.append("polygon")
      .attr("points", d => `${d.x},${d.y} ${d.x + d.d},${d.y - d.d * 0.75} ${d.x + d.w + d.d},${d.y - d.d * 0.75} ${d.x + d.w},${d.y}`)
      .attr("fill", d => darkenColor(d.color || "#3498db", 0.8))
      .attr("stroke", d => (d.id === selectedBlockId) ? "#F5F5DC" : "none")
      .attr("stroke-width", 2);

  // Right face
  blockGroups.append("polygon")
      .attr("points", d => `${d.x + d.w},${d.y} ${d.x + d.w + d.d},${d.y - d.d * 0.75} ${d.x + d.w + d.d},${d.y + d.h - d.d * 0.75} ${d.x + d.w},${d.y + d.h}`)
      .attr("fill", d => darkenColor(d.color || "#3498db", 0.6))
      .attr("stroke", d => (d.id === selectedBlockId) ? "#F5F5DC" : "none")
      .attr("stroke-width", 2);

  // Arrow marker
  svg.append("defs").append("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 5)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#F5F5DC");

  for (let i = 0; i < blocks.length - 1; i++) {
    const from = blocks[i];
    const to = blocks[i + 1];
    const x1 = from.x + from.w + from.d/2;
    const y1 = from.y + from.h / 2 - from.d/4;
    const x2 = to.x;
    const y2 = y1;

    svg.append("line")
      .attr("x1", x1)
      .attr("y1", y1)
      .attr("x2", x2 - 7)
      .attr("y2", y2)
      .attr("stroke", "#F5F5DC")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow)");
  }

  residualConnections.forEach(({ from, to }) => {
    const fromBlock = blocks.find(b => b.id === from);
    const toBlock = blocks.find(b => b.id === to);

    if (!fromBlock || !toBlock) return;

    const x1 = fromBlock.x + fromBlock.w + fromBlock.d / 2 + 23;
    const y1 = fromBlock.y + fromBlock.h / 2 - fromBlock.d / 4;
    const x2 = toBlock.x - 5 - 22;
    const y2 = toBlock.y + toBlock.h / 2 - toBlock.d / 4 - 5;

    const curve = d3.path();
    curve.moveTo(x1, y1);
    
    const midX = (x1 + x2) / 2;
    const peakY = Math.min(y1, y2) - 300;
    
    curve.quadraticCurveTo(midX, peakY, x2, y2);

    svg.append("path")
      .attr("d", curve.toString())
      .attr("stroke", "#F5F5DC")
      .attr("stroke-width", 2)
      .attr("fill", "none")
      .attr("marker-end", "url(#arrow)");
  });

  const labels = blockGroups.append("text")
      .text(d => d.name)
      .attr("x", (d) => d.x + d.w * 2.5)
      .attr("y", (d) => d.y + d.h + 20)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", "16")
      .attr("font-family", "sans-serif")
      .style("pointer-events", "none")
      .style("fill", "#F5F5DC")
      .style("visibility", "hidden");

  blockGroups
    .on("mouseenter", function() {
      d3.select(this).select("text").style("visibility", "visible");
    })
    .on("mouseleave", function() {
      d3.select(this).select("text").style("visibility", "hidden");
    });

  const legend = svg.append("g")
    .attr("transform", "translate(1100, 5)");

  legend.selectAll("rect")
    .data(legendData)
    .join("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 20)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", d => d.color)
      .attr("stroke", "#333");

  legend.selectAll("text")
    .data(legendData)
    .join("text")
      .attr("x", 20)
      .attr("y", (d, i) => i * 20 + 12)
      .text(d => d.name)
      .attr("font-size", "12px")
      .attr("font-family", "sans-serif")
      .attr("fill", "#F5F5DC");

  return svg.node();
}

const imageDisplay = createImageDisplay();

function updateDiagram() {
  const diagramContainer = document.getElementById("cnn-diagram");
  const diagram = createCNNDiagram();
  diagramContainer.innerHTML = "";
  diagramContainer.appendChild(diagram);
}

updateDiagram();
document.getElementById("image-display-container").appendChild(imageDisplay);
```
## Architecture Overview

The CNN consists of the following components:

- **Conv1**: Initial convolutional layer
- **Layer 1-4**: Residual blocks with skip connections
- **FC**: Final fully connected layer

Each layer processes the input through convolution operations, with residual connections allowing information to flow directly between non-adjacent layers. The visualization shows how features are extracted and transformed at each stage of the network.

## Data Requirements

Place your extracted visualization data in the `src/data/` directory with the following structure:

```
src/data/
├── vis/
│   ├── labrador/
│   │   ├── layer1_0_conv1/
│   │   ├───── feature_000.png
│   │   ├───── feature_001.png
│   |   └───── ...
│   ├── flamingo/
│   ├── pelican/
│   └── ...
```