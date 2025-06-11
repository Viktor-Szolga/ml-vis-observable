// CNN blocks configuration
export const blocks = [
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

export const residualConnections = [
  { from: "conv1", to: "layer1_1_conv1" },
  { from: "layer1_0_conv2", to: "layer2_0_conv1" },
  { from: "layer1_1_conv2", to: "layer2_1_conv1" },
  { from: "layer2_0_conv2", to: "layer3_0_conv1" },
  { from: "layer2_1_conv2", to: "layer3_1_conv1" },
  { from: "layer3_0_conv2", to: "layer4_0_conv1" },
  { from: "layer3_1_conv2", to: "layer4_1_conv1" },
  { from: "layer4_0_conv2", to: "fc" },
];

export const legendData = [
  { name: "Conv1", color: "#D3D3D3" },
  { name: "Layer 1", color: "#ADD8E6" },
  { name: "Layer 2", color: "#90EE90" },
  { name: "Layer 3", color: "#FFB19A" },
  { name: "Layer 4", color: "#B7C9E2" },
  { name: "FC", color: "#FFFF00" }
];