import React, { useRef } from "react"
import { useGLTF, Text } from "@react-three/drei"
import { Vector3 } from "three"
import * as THREE from "three"
import { Billboard } from "@react-three/drei"
import "../css/MilestoneModel.css"

function MilestoneModel(props) {
  const group = useRef()
  const { nodes, materials } = useGLTF("/flag.gltf")

  return (
    <group ref={group} {...props} dispose={null} scale={0.1}>
      <Billboard
        rotation={new THREE.Euler(0, -Math.PI / 2, 0)}
        position={[5, 70, 0]}
        args={[40, 10]}
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false}
        material-color="#5499C7"
      >
        <Text
          position={[0, 0, 1]}
          scale={[10, 10, 10]}
          color="black"
          anchorX="center"
          anchorY="middle"
          fontSize={0.4}
        >
          {props.name}
        </Text>
      </Billboard>

      <mesh
        geometry={nodes.crossbeam.geometry}
        material={materials["beam"]}
        scale={new Vector3(0.8, 30, 1)}
        position={new Vector3(0, 60, 2.4)}
        rotation={new THREE.Euler(Math.PI / 2, 0)}
      ></mesh>
      <mesh
        geometry={nodes.flag.geometry}
        position={new Vector3(0, 50, 10)}
        material={
          props.mid === props.mkey ? materials["flagac"] : materials["flag"]
        }
        scale={new Vector3(0.5, 10, 9)}
      ></mesh>
      <mesh
        geometry={nodes.Torus.geometry}
        material={materials["base"]}
        scale={new Vector3(2, 6, 2)}
        position={new Vector3(0, -0.8, 0)}
      ></mesh>
    </group>
  )
}
useGLTF.preload("/flag.gltf")
export default React.memo(MilestoneModel)
