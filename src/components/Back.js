import React from "react"
import { BackSide } from "three"

function Back() {
  return (
    <mesh position={[-1.2, 0, 0]}>
      <sphereBufferGeometry args={[500, 500, 500]} attach="geometry" />
      <meshStandardMaterial
        color="#E5E5E5"
        attach="material"
        metalness={0.4}
        side={BackSide}
      />
    </mesh>
  )
}
export default Back
