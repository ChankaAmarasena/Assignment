import React, { useState, useEffect } from "react"
import "../css/AppBody.css"
import SideBar from "./SideBar"
import Viewer from "./Viewer"

function AppBody() {
  const [imageUrl, setimageUrl] = useState(() => {
    const localData = sessionStorage.getItem("imageUrl")
    return localData ? JSON.parse(localData) : null
  })

  useEffect(() => {
    sessionStorage.setItem("imageUrl", JSON.stringify(imageUrl))
  }, [imageUrl])

  return (
    <div Class="appBody">
      <div class="SidePannel">
        <SideBar setimageUrl={setimageUrl} imageUrl={imageUrl} />
      </div>
      <div class="viewer">
        <Viewer url={imageUrl} />
      </div>
    </div>
  )
}

export default React.memo(AppBody)
