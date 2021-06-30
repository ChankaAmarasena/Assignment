import React, { useEffect, useRef, useState } from "react"
import { Object3D } from "three"

const scratchPoint = new Object3D()
function PointModel({ data }) {
  const meshRef = useRef()

  const [numPoints] = useState(() => {
    return data.length !== 0 ? data[0].ranges.length : null
  })

  useEffect(() => {
    const mesh = meshRef.current
    data.map((d) => {
      console.log(d.ranges.length)
      let theta = d.angle_min
      d.ranges.map((c, index) => {
        theta += d.angle_increment
        const x = c * Math.sign(theta)
        const y = c * Math.cos(theta)
        scratchPoint.position.set(x, 1, y)
        scratchPoint.updateMatrix()
        mesh.setMatrixAt(index, scratchPoint.matrix)

        return null
      })
      return null
    })
    mesh.instanceMatrix.needsUpdate = true
  }, [data])
  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, numPoints]}
      frustumCulled={false}
    >
      <sphereBufferGeometry args={[0.2, 50, 50]} attach="geometry" />
      <meshStandardMaterial attach="material" color="red" />
    </instancedMesh>
  )
}

export default PointModel
