import React, { useEffect, useRef, useState } from "react";
import Globe from 'react-globe.gl';
import * as THREE from 'three'; // Import Three.js for 3D objects
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import filePath from '../resources/Airplane.glb'; // Path to the GLTF model

const GlobeComponent = ({ arcs }) => {
  const globeRef = useRef(null);
  const [globeImageUrl, setGlobeImageUrl] = useState("//unpkg.com/three-globe/example/img/earth-night.jpg");
  const [bumpImageUrl, setBumpImageUrl] = useState("//unpkg.com/three-globe/example/img/earth-topology.png");
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("//unpkg.com/three-globe/example/img/night-sky.png");
  const loader = new GLTFLoader(); // Initialize the GLTF loader

  useEffect(() => {
    if (!globeRef.current) return;

    const globe = globeRef.current;

    // Load the GLTF model and add it to the globe
    const loadModel = (lat, lng, modelUrl) => {
      loader.load(
        modelUrl,
        (gltf) => {
          const model = gltf.scene;

          // Position the model on the globe using lat and lng coordinates
          const coords = globe.getCoords(lat, lng);
          model.position.set(coords.x, coords.y, coords.z);

          // Optionally scale the model if necessary
          model.scale.set(.5, .5, .5); // Adjust the scale to fit
          // rotate 
          model.rotation.x = Math.PI / 2;
          model.rotation.y = Math.PI / 2;
          

          // Add the model to the scene
          globe.scene().add(model);
        },
        undefined, // onProgress (optional)
        (error) => {
          console.error('Error loading GLTF model:', error);
        }
      );
    };

    // Loop through the arcs and add the GLTF model at start and end points
    arcs.forEach((arc) => {
      // Provide the path to your GLTF model
      const modelUrl = filePath;      
      loadModel(arc.startLat, arc.startLng, modelUrl);
      loadModel(arc.endLat, arc.endLng, modelUrl);
    });
  }, [arcs]);

  return (
    <Globe
      ref={globeRef}
      globeImageUrl={globeImageUrl}
      bumpImageUrl={bumpImageUrl}
      backgroundImageUrl={backgroundImageUrl}
      arcsData={arcs}
    />
  );
};

export default GlobeComponent;
