# Path Testing

<script>
console.log("Testing different paths...");

const paths = [
  "/data/vis/original.png",           // Current failing path
  "/src/data/vis/original.png",       // Try src prefix
  "./data/vis/original.png",          // Relative path
  "data/vis/original.png",            // No leading slash
  "/vis/original.png",                // No data prefix
  "./src/data/vis/original.png"       // Full relative path
];

paths.forEach((path, index) => {
  const img = document.createElement("img");
  img.width = 100;
  img.height = 100;
  img.style.border = "1px solid red";
  img.style.margin = "5px";
  
  img.onload = () => console.log(`✅ Path ${index + 1} WORKS: ${path}`);
  img.onerror = () => console.log(`❌ Path ${index + 1} FAILS: ${path}`);
  
  document.body.appendChild(img);
  img.src = path;
});
</script>

<p>HTML reference (works): <img src="/data/vis/original.png" width="100" height="100"></p>