import React, { createContext, useEffect, useState } from "react"

export const MilestoneContext = createContext()

const MilestoneContextProvider = (props) => {
  const [activeId, setActiveId] = useState(null)
  const [isDefault, setIsDefault] = useState(false)
  const [points, setPoints] = useState([])
  const [position, setPosition] = useState({ x: "-45", y: "45" })
  const [isZooming, setIsZooming] = useState(false)

  const [milestones, setmilestones] = useState(() => {
    const localMilestones = sessionStorage.getItem("milestones")
    return localMilestones ? JSON.parse(localMilestones) : []
  })

  const addMilestone = (name, x, y, id) => {
    setmilestones([...milestones, { name, x, y, id: Math.random() }])
  }

  const removeMilestone = (id) => {
    setmilestones(milestones.filter((milestone) => milestone.id !== id))
  }

  const activeMilestone = (id) => {
    setActiveId(id)
  }

  useEffect(() => {
    sessionStorage.setItem("milestones", JSON.stringify(milestones))
  }, [milestones])

  useEffect(() => {
    sessionStorage.setItem("points", JSON.stringify(points))
  }, [points])

  return (
    <MilestoneContext.Provider
      value={{
        milestones,
        addMilestone,
        removeMilestone,
        setmilestones,
        activeId,
        setActiveId,
        activeMilestone,
        isDefault,
        setIsDefault,
        points,
        setPoints,
        position,
        setPosition,
        isZooming,
        setIsZooming,
      }}
    >
      {props.children}
    </MilestoneContext.Provider>
  )
}

export default MilestoneContextProvider
