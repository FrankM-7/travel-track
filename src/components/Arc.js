import React from 'react';

const Arc = ({ startLat, startLng, endLat, endLng, color, altitude }) => {
  return {
    startLat,
    startLng,
    endLat,
    endLng,
    color,
    altitude,
  };
};

export default Arc;
