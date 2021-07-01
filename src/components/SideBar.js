import React, { useContext, useRef, useState } from "react"
import "../css/SideBar.css"
import Button from "@material-ui/core/Button"
import Milestones from "./Milestones"
import MilestoneAdder from "./MilestoneAdder"
import { MilestoneContext } from "../context/MilestoneContext"
import PointCloudAdder from "./PointCloudAdder"
import { CircularProgress } from "@material-ui/core"
import MilestoneJsonImporter from "./MilestoneJsonImporter"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"

function SideBar({ setimageUrl, imageUrl }) {
  const mapImage = useRef(null)
  const [isUploading, setIsUploading] = useState(false)
  const [open, setOpen] = useState(false)
  const { setmilestones, milestones } = useContext(MilestoneContext)

  const openDialogBox = () => {
    setOpen(true)
  }

  const closeDialogBox = () => {
    setOpen(false)
  }

  const clearList = () => {
    setOpen(false)
    setmilestones([])
  }

  const openFile = (e) => {
    e.preventDefault()
    mapImage.current.click()
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsUploading(true)
    const files = e.target.files
    const data = new FormData()
    data.append("file", files[0])
    data.append("upload_preset", "wardoc")

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/wardoc/image/upload",
      {
        method: "POST",
        body: data,
      }
    )
    const file = await res.json()

    setimageUrl(file.secure_url)
    setIsUploading(false)
    e.target.value = ""
  }

  return (
    <div class="sideBar">
      <div class="mapUploader">
        <p>Map image</p>
        <form>
          <input
            type="file"
            name="input"
            onChange={onSubmit}
            ref={mapImage}
            style={{ display: "none" }}
          />
          {!imageUrl ? (
            [
              !isUploading ? (
                <Button
                  variant="outlined"
                  color="primary"
                  component="span"
                  onClick={openFile}
                >
                  Upload
                </Button>
              ) : (
                <CircularProgress />
              ),
            ]
          ) : (
            <Button
              style={{
                color: "#c51162",
                borderColor: "#c51162",
              }}
              variant="outlined"
              component="span"
              onClick={() => setimageUrl(null)}
            >
              Change
            </Button>
          )}
        </form>
      </div>
      <div class="milestoneAdder">
        <MilestoneAdder />
      </div>
      <div class="milestoneAdder">
        <PointCloudAdder />
      </div>
      <div class="list">
        <div class="listTop">
          <h4>Milestone List</h4>
          <MilestoneJsonImporter />
        </div>

        <div class="mlist">
          <Milestones />
        </div>
        <div class="listBottom">
          <Button variant="outlined" color="primary" onClick={openDialogBox}>
            Clear
          </Button>

          <Button
            variant="outlined"
            color="primary"
            href={`data:text/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(milestones)
            )}`}
            download="milestone.json"
          >
            Export
          </Button>
        </div>
      </div>

      <Dialog
        open={open}
        onClose={closeDialogBox}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are You Sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Clear milestones list without saving
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialogBox} color="primary">
            Cancel
          </Button>
          <Button
            onClick={clearList}
            variant="outlined"
            color="secondary"
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default SideBar
