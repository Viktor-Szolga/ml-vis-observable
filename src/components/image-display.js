export function createImageDisplay(selectedBlockId, onFeatureMapChange) {
  let overlayOn = true;
  let currentFeatureMapIndex = 0;

  const container = document.createElement("div");
  container.id = "image-display";
  container.style.cssText = "display: flex; align-items: center; gap: 10px;";

  container.innerHTML = `
    <button id="prev">⟵ Prev</button>
    <div id="imageContainer" style="display: flex; flex-direction: column; align-items: center;">
      <button id="toggleOverlay" style="margin-bottom: 5px;">Hide Overlay</button>
      <figure style="margin: 0; text-align: center;">
        <img id="mainImage" src="" width="256" height="256" style="background:#f0f0f0; display: block;">
        <figcaption id="caption"></figcaption>
      </figure>
    </div>
    <button id="next">Next ⟶</button>
    <div id="infoText" style="display: none; font-style: italic;">
      Click on a block in the diagram above to see its feature map activation.
    </div>
  `;

  const imgElem = container.querySelector("#mainImage");
  const captionElem = container.querySelector("#caption");
  const toggleBtn = container.querySelector("#toggleOverlay");
  const prevBtn = container.querySelector("#prev");
  const nextBtn = container.querySelector("#next");
  const imageContainer = container.querySelector("#imageContainer");
  const infoText = container.querySelector("#infoText");

  function featureMapPath(layerId, index) {
   return "/data/vis/original.png";
   return `/data/vis/${layerId}/feature_${String(index).padStart(3, '0')}.png`;
  }

  function updateImage(index = currentFeatureMapIndex) {
    if (!selectedBlockId || selectedBlockId === "fc") {
      // Hide image container and buttons
      imageContainer.style.display = "none";
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
      infoText.style.display = "block";
      return;
    }

    // Show image container and buttons
    imageContainer.style.display = "flex";
    prevBtn.style.display = "";
    nextBtn.style.display = "";
    infoText.style.display = "none";

    if (overlayOn) {
      const path = featureMapPath(selectedBlockId, index);
      imgElem.src = path;
      imgElem.onerror = () => {
        imgElem.src = "test";
      };
      captionElem.innerHTML = `Layer: <b>${selectedBlockId}</b>, Feature Map: <b>${index}</b>`;
    } else {
      const originalPath = "/data/vis/original.png";
      imgElem.src = originalPath;
      imgElem.onerror = () => {
        imgElem.src = "test";
      };
      captionElem.textContent = "Input Image";
    }
  }

  // Event handlers
  toggleBtn.onclick = () => {
    overlayOn = !overlayOn;
    toggleBtn.textContent = overlayOn ? "Hide Overlay" : "Show Overlay";
    updateImage();
  };

  prevBtn.onclick = () => {
    if (!overlayOn) return;
    currentFeatureMapIndex = Math.max(0, currentFeatureMapIndex - 1);
    updateImage(currentFeatureMapIndex);
    onFeatureMapChange(currentFeatureMapIndex);
  };

  nextBtn.onclick = () => {
    if (!overlayOn) return;
    currentFeatureMapIndex = currentFeatureMapIndex + 1;
    updateImage(currentFeatureMapIndex);
    onFeatureMapChange(currentFeatureMapIndex);
  };

  // Update function to be called from parent
  container.update = (newSelectedBlockId, newFeatureMapIndex = 0) => {
    selectedBlockId = newSelectedBlockId;
    currentFeatureMapIndex = newFeatureMapIndex;
    updateImage();
  };

  // Initial update
  updateImage();

  return container;
}