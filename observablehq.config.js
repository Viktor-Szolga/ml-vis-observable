export default {
  title: "CNN Visualization",
  root: "src",
  pages: [
    {name: "Home", path: "/"},
    {name: "CNN Feature Maps", path: "/cnn-visualization"}
  ],
  
  head:     `<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0/dist/tf.min.js"></script>
  `,
  buildTime: new Date().toISOString(),
};