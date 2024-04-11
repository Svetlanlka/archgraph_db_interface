import { useRef, useCallback, useMemo } from 'react';
import { ForceGraph3D } from 'react-force-graph';
import { genRandomTree } from '../utils/genData';
import * as THREE from 'three';
import { Line3dObject } from './line';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import ReactDOM from 'react-dom/client';
import { createPortal } from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import { Sphere3DObject } from './sphere';
React.useLayoutEffect = React.useEffect;


// import { Canvas, useFrame, useThree } from 'react-three-fiber/css3d'
// import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'
// import './styles.css'

// interface DOMObjectProps {
//   dom: React.RefObject<HTMLElement>
// }
// function DOMObject({ dom }: DOMObjectProps) {
//   const { scene } = useThree()
//   const ref = useRef<CSS3DObject | null>(null)
//   useFrame(() => (ref.current!.rotation.x = ref.current!.rotation.y += 0.01))
//   useEffect(() => {
//     ref.current = new CSS3DObject(dom.current)
//     scene.add(ref.current)
//     return () => scene.remove(ref.current)
//   }, [dom, scene])
//   return null
// }

// // interface PortalProps {
// //   children: React.ReactNode
// // }
// function Portal({ children }: PortalProps) {
//   const root = useMemo(() => document.createElement('div'), [])
//   return ReactDOM.createPortal(<Fragment>{children}</Fragment>, root)
// }
// function Portal({ children }: PortalProps) {
//   const root = useMemo(() => document.createElement('div'), [])
//   return ReactDOM.createPortal(<Fragment>{children}</Fragment>, root)
// }

// function World() {
//   const ref = useRef(null)
//   return (
//     <Fragment>
//       <Canvas camera={{ position: [0, 0, 15] }}>
//         <DOMObject dom={ref} />
//       </Canvas>
//       <Portal>
//         <div ref={ref}>hello</div>
//       </Portal>
//     </Fragment>
//   )
// }

// function Portal({ children }) {
//   const root = useMemo(() => document.createElement('div'), [])
//   return createPortal(<div>{'portal work!'}</div>, root)
// }

const Graph = () => {
  const fgRef = useRef();

  const handleClick = useCallback(node => {
    // Aim at node from outside it
    const distance = 40;
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

    fgRef.current.cameraPosition(
      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
      node, // lookAt ({ x, y, z })
      3000  // ms transition duration
    );

    // console.log(document.getElementById('node' + node.id))

    // ForceGraph3D()(document.getElementById('node' + node.id))
    // .graphData({nodes: [{"id": 101}]})
    // .linkWidth(0)
    // .linkOpacity(1);
    
    // createPortal(<div>work!</div>, document.getElementById('node4'));
  }, [fgRef]);

  const extraRenderers = [new CSS3DRenderer()];
  const metagraph = new THREE.Group();
  const s1 = new Sphere3DObject(0xffffff);
  const s2 = new Sphere3DObject(0xffffff);
  const s3 = new Sphere3DObject(0xffffff);
  metagraph.add(s1);
  metagraph.add(s2);
  metagraph.add(s3);

  return <ForceGraph3D
    ref={fgRef}
    graphData={genRandomTree(10)}
    nodeLabel="id"
    nodeAutoColorBy="group"
    onNodeClick={handleClick}

    extraRenderers={extraRenderers}
    //nodeThreeObjectExtend={true}
    // onNodeDrag={}

    nodeThreeObject={(node) => {
      const primaryColor = 0x03bafc;

      // cube
      const cubeMaterial = new THREE.MeshBasicMaterial( { color: 0x000011 } );
      const cubeGeometry = new THREE.BoxGeometry( 7, 7, 7 );
      const cubeBase = new THREE.Mesh(cubeGeometry, cubeMaterial);

      const linesMaterial = new THREE.LineBasicMaterial( { color: primaryColor } );
      const borderLines = new THREE.EdgesGeometry( cubeGeometry );
      const cubeLines = new THREE.LineSegments(borderLines, linesMaterial); 

      const cube = new THREE.Group();
      cube.add(cubeBase);
      cube.add(cubeLines);

      // sphere
      const sphere = Sphere3DObject(primaryColor);

      // doc
      const docMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
      const docGeometry = new THREE.BoxGeometry( 6, 8, 1 );
      const docBase = new THREE.Mesh(docGeometry, docMaterial);

      const doc = new THREE.Group();
      doc.add(docBase);
      doc.add(Line3dObject(4, 0.5, 0, 0, 0.6));
      doc.add(Line3dObject(4, 0.5, 0, 1, 0.6));
      doc.add(Line3dObject(4, 0.5, 0, 2, 0.6));

      doc.add(Line3dObject(4, 0.5, 0, 0, -0.6));
      doc.add(Line3dObject(4, 0.5, 0, 1, -0.6));
      doc.add(Line3dObject(4, 0.5, 0, 2, -0.6));

      // table
      const tableMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
      const tableGeometry = new THREE.BoxGeometry( 8, 4, 1 );
      const tableBase = new THREE.Mesh(tableGeometry, tableMaterial);

      const tableHeaderMaterial = new THREE.MeshBasicMaterial( { color: primaryColor } );
      const tableHeaderGeometry = new THREE.BoxGeometry( 8, 2, 1 );
      const tableHeader = new THREE.Mesh(tableHeaderGeometry, tableHeaderMaterial);
      tableHeader.translateY(3);

      const table = new THREE.Group();
      table.add(tableBase);
      table.add(tableHeader);

      table.add(Line3dObject(8, 0.5, 0, 0, 0.6));
      table.add(Line3dObject(8, 0.5, 0, 0, -0.6));
      table.add(Line3dObject(0.5, 4, 1.5, 0, 0.6));
      table.add(Line3dObject(0.5, 4, 1.5, 0, -0.6));
      table.add(Line3dObject(0.5, 4, -1.5, 0, 0.6));
      table.add(Line3dObject(0.5, 4, -1.5, 0, -0.6));

      // graph
      const nodeEl = document.createElement("div");
      nodeEl.id = "node" + node.id;
      nodeEl.textContent = "text";
      nodeEl.style.color = "white";
      // const graphObject = new CSS3DObject(nodeEl);

      

      const graph = new THREE.Group();

      //const reactElement = <ForceGraph3D graphData={{nodes: [{id: 0}, {id: 1}], links: [{source: 1, target: 0}]}}/>;
      const reactElement1 = <div><div>aaa</div><div>bbb</div></div>

        // {nodes: [{"id": 101}, {"id": 102}, {"id": 103}], 
        // links: [{"target": 101, "source": 102}, {"target": 101, "source": 103}] }}/>);

      // nodeEl.innerHTML = staticElement;
      // const graph = new CSS3DObject(nodeEl);

      // const htmlString = ReactDOMServer.renderToString(reactElement);
      // const graphObject = new CSS3DObject(new HTMLElement(htmlString));

      const output = document.createElement('div');
      output.id = "node" + node.id;
      const staticElement = renderToStaticMarkup(reactElement1);
      ///output.innerHTML = staticElement;
      const graphObject = new CSS3DObject(output);


      const transparentSphereMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff, transparent: true, opacity: 0.5 } );
      const transparentSphereGeometry = new THREE.SphereGeometry( 8, 32, 16 );
      const transparentSphere = new THREE.Mesh(transparentSphereGeometry, transparentSphereMaterial);

      graph.add(graphObject);
      graph.add(transparentSphere);


      // const scene = new THREE.Scene();
      // const renderer = new THREE.WebGLRenderer();
      // renderer.setSize(10, 10);
      const vMaterial = new THREE.MeshBasicMaterial( {color: primaryColor } );
      const vGeometry = new THREE.SphereGeometry( 2, 8, 8 );
      const v1 = new THREE.Mesh(vGeometry, vMaterial);
      const v2 = new THREE.Mesh(vGeometry, vMaterial);
      const v3 = new THREE.Mesh(vGeometry, vMaterial);
      
      graph.add(v1);
      graph.add(v2);
      graph.add(v3);
      v1.translateY(4);
      v2.translateY(-4);
      v3.translateX(4);

      const lineMaterial = new THREE.LineBasicMaterial( { color: 0x555555 } );
      const points1 = [];
      points1.push(new THREE.Vector3(0, 4, 0));
      points1.push(new THREE.Vector3(0, -4, 0));
      const points2 = [];
      points2.push(new THREE.Vector3(0, 4, 0));
      points2.push(new THREE.Vector3(4, 0, 0));

      const lineGeometry1 = new THREE.BufferGeometry().setFromPoints(points1);
      const line1 = new THREE.Line(lineGeometry1, lineMaterial);
      const lineGeometry2 = new THREE.BufferGeometry().setFromPoints(points2);
      const line2 = new THREE.Line(lineGeometry2, lineMaterial);
      graph.add(line1);
      graph.add(line2);

      // const graphEl = <ForceGraph3D nodeId={"node" + node.id} graphData={
      //    {nodes: [{"id": 101}]}}/>;
      // console.log(graphEl);
      
      //const graph = new CSS3DObject();

      // if (node.id === 10 || node.id === 11 || node.id === 12) {
      //   metagraph.add(sphere);
      //   return sphere;
      // }

      if (node.id === 10) {
        return s1;
      }
      if (node.id === 11) {
        return s2;
      }
      if (node.id === 12) {
        return s3;
      }

      if (node.id === 13) {
        console.log('metagraph');
        console.log(metagraph);

        // const vect = new THREE.Vector3(1, 1, 1);
        // const box = new THREE.Box3();
        // box.setFromCenterAndSize( new THREE.Vector3( 1, 1, 1 ), new THREE.Vector3( 2, 1, 3 ) );
        // const helper = new THREE.Box3Helper( box, 0xffff00 );


        //const sphere = new THREE.SphereGeometry();
        //const object = new THREE.Mesh( transparentSphereGeometry, new THREE.MeshBasicMaterial( 0xff0000 ) );
        const box = new THREE.BoxHelper( transparentSphere, 0xffff00 );
        const gg = new THREE.Group();
        gg.add(box);
        gg.add(metagraph);
        gg.add(transparentSphere);
        return gg;
      }

      switch (node.id % 5) {
        case 1:
          return cube;
        case 2:
          return doc;
        case 3:
          return table;
        case 4:
          return graph;
          //return sphere;  
          //return transparentSphere;
        default:
          return sphere;
      }
 
      // const imgTexture = new THREE.TextureLoader().load(`./imgs/${img}`);
      // imgTexture.colorSpace = THREE.SRGBColorSpace;
      // const material = new THREE.SpriteMaterial({ map: imgTexture });
      // const sprite = new THREE.Sprite(material);
      // sprite.scale.set(12, 12);

      // return sprite;
    }}

    // extraRenderers={extraRenderers}
    // nodeThreeObject={node => {
    //   const nodeEl = document.createElement('div');
    //   nodeEl.textContent = node.id;
    //   nodeEl.style.color = node.color;
    //   nodeEl.className = 'node-label';
    //   return new CSS2DObject(nodeEl);
    // }}

  />;
}

export default Graph;