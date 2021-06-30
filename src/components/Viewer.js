import React, { Suspense, useContext } from "react"
import "../css/Viewer.css"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, MapControls } from "@react-three/drei"
import MilestoneModel from "./MilestoneModel"
import * as THREE from "three"
import Light from "./Light"
import Back from "./Back"
import { Vector3 } from "three"
import { MilestoneContext } from "../context/MilestoneContext"
import PointModel from "./PointModel"
import { Button } from "@material-ui/core"

function Viewer({ url }) {
  const {
    milestones,
    activeMilestone,
    activeId,
    points,
    position,
    isDefault,
    setIsDefault,
    isZooming,
    setIsZooming,
  } = useContext(MilestoneContext)

  const Texture = ({ texture }) => {
    return (
      <mesh rotation={new THREE.Euler(-Math.PI / 2, 0, 0)} scale={4}>
        <planeBufferGeometry attach="geometry" args={[50, 30]} />
        <meshBasicMaterial
          attach="material"
          map={texture}
          side={THREE.DoubleSide}
          transparent={true}
        />
      </mesh>
    )
  }
  const MapImage = ({ url }) => {
    var loader = new THREE.TextureLoader()
    loader.setCrossOrigin("")
    const texture = loader.load(url)

    return <Texture texture={texture} />
  }

  function Camera() {
    useFrame(({ camera }) => {
      const vec = new THREE.Vector3()
      if (isDefault) {
        if (isZooming) {
          const step = 0.1

          camera.position.lerp(
            vec.set((2 * position.x) / 3, 15, (2 * position.y) / 3),
            step
          )
          camera.lookAt(position.x, 2, position.y)

          camera.updateProjectionMatrix()
        } else {
          const step = 0.1
          camera.position.lerp(vec.set(45, 45, 0), step)
          camera.lookAt(0, 20, 0)
        }
      }
    })
    return null
  }

  const Milestones = () => {
    return milestones.map((milestone) => {
      console.log("run")
      return (
        <MilestoneModel
          position={new Vector3(milestone.x, 0, milestone.y)}
          rotation={new THREE.Euler(0, 0, 0)}
          scale={0.8}
          name={milestone.name}
          key={milestone.id}
          onClick={() => {
            activeMilestone(milestone.id)
          }}
          mkey={milestone.id}
          mid={activeId}
        />
      )
    })
  }

  const areEqual = (pevState, nextState) => {
    return pevState.milestones === nextState.milestones
  }
  const MemodMilestones = React.memo(Milestones, areEqual)

  const PointCloud = () => {
    return <PointModel data={points} />
  }

  return (
    <div class="viewer">
      <Canvas
        mode="legacy"
        className="canvas"
        camera={{
          fov: 70,
          position: [position.x, position.y, 0],
        }}
      >
        {url ? <MapImage url={url} /> : null}

        <Suspense fallback={null}>
          {console.log("run2")}
          <MemodMilestones />
          <Environment preset="sunset" background />
        </Suspense>

        <PointCloud />

        <Light />
        <MapControls maxDistance={300} />
        <axesHelper scale={10} />
        <Back />
        <Camera />

        <gridHelper args={[200, 200]} />
      </Canvas>
      <div class="can_btn">
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            setIsDefault(false)
          }}
        >
          Control view
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            setIsZooming(false)
          }}
        >
          Default view
        </Button>
      </div>
    </div>
  )
}

export default React.memo(Viewer)
