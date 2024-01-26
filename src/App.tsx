import * as THREE from "three";
import {
  Canvas,
  GroupProps,
  MeshProps,
  useFrame,
  useThree,
} from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import {
  BufferGeometry,
  Material,
  Mesh,
  NormalBufferAttributes,
  Object3DEventMap,
} from "three";
import { DepthOfField, EffectComposer } from "@react-three/postprocessing";

function Box({ z }) {
  const { nodes, materials } = useGLTF("/coin.glb");

  const { viewport, camera } = useThree();
  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, z / 2]);

  const [data] = useState({
    x: THREE.MathUtils.randFloatSpread(2),
    y: THREE.MathUtils.randFloatSpread(height),
    rX: Math.random() * Math.PI,
    rY: Math.random() * Math.PI,
    rZ: Math.random() * Math.PI,
  });

  const coin = useRef<Mesh<
    BufferGeometry<NormalBufferAttributes>,
    Material | Material[],
    Object3DEventMap
  > | null>(null);

  useFrame((state) => {
    if (coin.current) {
      coin.current.position.set(data.x * width, (data.y -= 0.04), z / 2);
      coin.current.rotation.set(
        (data.rX += 0.02),
        (data.rY += 0.001),
        (data.rZ += 0.001)
      );

      if (data.y < -height / 1.5) {
        data.y = height / 1.5;
      }
    }
  });

  return (
    <group ref={coin} scale={0.15} dispose={null}>
      <mesh
        geometry={nodes.pCylinder7_standardSurface1_0.geometry}
        material={materials["gold-plate"]}
        scale={[9.86, 1.458, 9.86]}
        rotation={[Math.PI * 0.5, 0, 0]}
        // material-emissive="lightyellow"
      />
    </group>
  );
}

// function Coin(props: GroupProps) {
//   const { nodes, materials } = useGLTF("/coin.glb");
//   return (
//     <group {...props} dispose={null}>
//       <mesh
//         geometry={nodes.pCylinder7_standardSurface1_0.geometry}
//         material={materials["gold-plate"]}
//         scale={[9.86, 1.458, 9.86]}
//         // material-emissive="lightyellow"
//       />
//     </group>
//   );
// }

function App({ count = 150, depth = 120 }) {
  // const [count, setCount] = useState(0);

  return (
    <Canvas gl={{ alpha: false }} camera={{ near: 0.01, far: 110, fov: 30 }}>
      {/* <color attach="background" args={["dimgrey"]} /> */}
      {/* <ambientLight intensity={0.2} /> */}
      {/* <spotLight position={[10, 10, 10]} /> */}
      <Suspense>
        {/* <Coin scale={0.05} rotation={[Math.PI * 0.5, 0, 0]} /> */}
        {Array.from({ length: count }, (_, i) => (
          <Box key={i} z={-(i / count) * 80 - 40} />
        ))}
        <Environment preset="sunset" />
        <EffectComposer>
          <DepthOfField
            target={[0, 0, depth / 2]}
            focalLength={0.5}
            bokehScale={11}
            height={700}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}

export default App;
