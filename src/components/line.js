import * as THREE from 'three';

export function Line3dObject(w, h, x, y, z, clr = 0x000000) {
  const docLineMaterial = new THREE.MeshBasicMaterial({
    color: clr,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const docLineGeometry = new THREE.PlaneGeometry(w, h);
  docLineGeometry.translate(x, y, z);
  const docLine = new THREE.Mesh(docLineGeometry, docLineMaterial);

  return docLine;
}
