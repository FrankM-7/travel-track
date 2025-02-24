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

  function drawCube(globe, x, y, z) {
    // DEBUG: Add small cube markers along the path
    const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5); // Tiny cubes
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.copy(new THREE.Vector3(x, y, z));
    globe.scene().add(cube);
  }

  function slerp(p1, p2, t) {
    const omega = Math.acos(Math.min(Math.max(p1.clone().dot(p2.clone()), -1.0), 1.0));
    const so = Math.sin(omega);
    const first = (Math.sin((1 - t) * omega) / so);
    const second = p1.clone();
    const third = (Math.sin(t * omega) / so);
    const fourth = p2.clone();

    return second.multiplyScalar(first).add(fourth.multiplyScalar(third));
  }

  function generateArcPoints(p1, p2, numPoints = 100, arc_height = 0.5) {
    // normalize p1 and p2
    const p1_n = p1.clone().normalize();
    const p2_n = p2.clone().normalize();
    const points = [];
    for(let i = 0; i < numPoints; i++) {
      const t = i / (numPoints - 1);
      const point = slerp(p1_n, p2_n, t);
      const elevatedPoint = (point.normalize()).multiplyScalar(1 + arc_height * Math.sin(t * Math.PI));
      points.push(elevatedPoint);
    }
    return points;
  }

  useEffect(() => {
    if (!globeRef.current) return;

    const globe = globeRef.current;

    // Load the GLTF model and add it to the globe
    const loadModel = (startLat, startLng, endLat, endLng, modelUrl) => {
      loader.load(
        modelUrl,
        (gltf) => {
          const model = gltf.scene;

          // Get start and end point positions
          const startCoords = globe.getCoords(startLat, startLng);
          const endCoords = globe.getCoords(endLat, endLng);

          // Convert to normalized vectors
          const startVec = new THREE.Vector3(startCoords.x, startCoords.y, startCoords.z);
          const endVec = new THREE.Vector3(endCoords.x, endCoords.y, endCoords.z);
                    
          // Generate arc points
          const arcPoints = generateArcPoints(startVec, endVec, 100, .1).map(point =>
            // drawCube(globe, point.x * 100, point.y * 100, point.z * 100);
            new THREE.Vector3(point.x * 100, point.y * 100, point.z * 100)
          );

           // Position and scale the model
          model.position.copy(arcPoints[0]);
          model.scale.set(0.5, 0.5, 0.5);
          model.lookAt(arcPoints[1]);

          globe.scene().add(model);

          // Animation variables
          let currentIndex = 0;
          const animatePlane = () => {
            const speed = 0.2; // Lower number = slower plane, higher = faster
            let progress = 0; // Tracks movement between points
          
            const step = () => {
              if (currentIndex < arcPoints.length - 1) {
                const startPoint = arcPoints[currentIndex];
                const endPoint = arcPoints[currentIndex + 1];
          
                // Interpolate between points based on progress
                model.position.lerpVectors(startPoint, endPoint, progress);
          
                // Make the plane look toward the next point
                if (currentIndex < arcPoints.length - 2) {
                  model.lookAt(arcPoints[currentIndex + 1]);
                }
          
                progress += speed;
          
                if (progress >= 1) {
                  progress = 0;
                  currentIndex++;
                }
          
                requestAnimationFrame(step);
              }
            };
          
            step();
          };
          

          // Start the animation
          animatePlane();
            
        },
        undefined, // onProgress (optional)
        (error) => {
          console.error('Error loading GLTF model:', error);
        }
      );
    };

    // Loop through the arcs and add the GLTF model at start and end points
    arcs.forEach((arc) => {
      const modelUrl = filePath;
      loadModel(arc.startLat, arc.startLng, arc.endLat, arc.endLng, modelUrl);
    });
  }, [arcs]);

  return (
    <Globe
      ref={globeRef}
      globeImageUrl={globeImageUrl}
      bumpImageUrl={bumpImageUrl}
      backgroundImageUrl={backgroundImageUrl}
      arcsData={arcs}
      arcColor={'color'}
      arcAltitude={'altitude'}
      // showGlobe={false}
    />
  );
};

export default GlobeComponent;
