import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

function GLTFModel() {
  const sceneRef = useRef();
  const cameraRef = useRef();
  const rendererRef = useRef();
  const modelRef = useRef();
  const previousMousePosition = useRef({ x: 0, y: 0 });
  let isDragging = false;

  useEffect(() => {
    // Create a scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create a camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Create a renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;
    document.body.appendChild(renderer.domElement);

    // Load the GLTF model
    const loader = new GLTFLoader();

    loader.load("gltf/AntiqueCamera.gltf", (gltf) => {
      const model = gltf.scene;
      modelRef.current = model;
      scene.add(model);

      console.log("Model loaded:", gltf);

      // Animation or other manipulations can be performed here if needed
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);

      // Mouse sensitivity factor (adjust as needed)
      const sensitivity = 0.005;

      // Event listener for mouse movement
      document.addEventListener("mousedown", () => {
        isDragging = true;
      });

      document.addEventListener("mouseup", () => {
        isDragging = false;
      });

      document.addEventListener("mousemove", (event) => {
        if (!isDragging) return;

        const { clientX, clientY } = event;
        const deltaX = (clientX - previousMousePosition.current.x) * sensitivity;
        const deltaY = (clientY - previousMousePosition.current.y) * sensitivity;

        // Rotate the entire model
        modelRef.current.rotation.x += deltaY;
        modelRef.current.rotation.y += deltaX;

        // Rotate the camera as well
        cameraRef.current.rotation.x += deltaY;
        cameraRef.current.rotation.y += deltaX;

        previousMousePosition.current.x = clientX;
        previousMousePosition.current.y = clientY;

        // Render the scene
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      });

      // Adjust the camera position as needed
      camera.position.set(0, 0, 10);

      renderer.setClearColor(0x1e074e); // Set to a different color if needed

      // Render the scene
      renderer.render(scene, camera);
    });

    // Handle window resizing
    window.addEventListener("resize", () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
    });

    // Clean up the renderer on component unmount
    return () => {
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return null; // This component doesn't render anything directly
}

export default GLTFModel;
