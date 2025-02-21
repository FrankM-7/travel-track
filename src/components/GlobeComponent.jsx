import React, { useEffect, useRef, useState } from "react";
import Globe from 'react-globe.gl';
import * as THREE from 'three'; // Import Three.js for 3D objects

const GlobeComponent = ({ arcs }) => {
  const globeRef = useRef(null);
  const [globeImageUrl, setGlobeImageUrl] = useState("//unpkg.com/three-globe/example/img/earth-night.jpg");
  const [bumpImageUrl, setBumpImageUrl] = useState("//unpkg.com/three-globe/example/img/earth-topology.png");
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("//unpkg.com/three-globe/example/img/night-sky.png");

  useEffect(() => {
    if (!globeRef.current) return;

    const globe = globeRef.current;

    // Create a basic plane (a box for simplicity)
    const createPlane = (lat, lng) => {
      const geometry = new THREE.BoxGeometry(2, 2, 2); // Create a simple cube
      const material = new THREE.MeshBasicMaterial({ color: 0xff5722 });
      const plane = new THREE.Mesh(geometry, material);
      
      // Position the plane on the globe using lat and lng coordinates
      const globeCoord = globe.getCoords(lat, lng);
      const [x, y, z] = [globeCoord.x, globeCoord.y, globeCoord.z];
      plane.position.set(x, y, z);

      return plane;
    };

    // Add planes for each arc's start and end point
    arcs.forEach((arc) => {
      const startPlane = createPlane(arc.startLat, arc.startLng);
      const endPlane = createPlane(arc.endLat, arc.endLng);
      globe.scene().add(startPlane);
      globe.scene().add(endPlane);
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
