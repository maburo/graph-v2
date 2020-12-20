import React, { useState, useEffect, useRef, EventHandler, useContext } from 'react';
import AABB from '../../math/aabb';
import { LayerProperties } from './layer-props';

interface SelectProperties extends LayerProperties {
  region: AABB
}

export function SelectLayer(props: SelectProperties) {
  const { region } = props;
  return (
    <div 
      className="select layer"
      style={{
        top: region.minY,
        left: region.minX,
        width: region.maxX - region.minX,
        height: region.maxY - region.minY
      }} />
  )
}