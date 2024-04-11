import * as THREE from 'three';

export function Sphere3DObject(clr) {
  const sphereMaterial = new THREE.MeshBasicMaterial( {color: clr || 0x000000 } );
  const sphereGeometry = new THREE.SphereGeometry( 3, 32, 16 );

  return (new THREE.Mesh( sphereGeometry, sphereMaterial ));
}
