import { Button, CircularProgress } from "@material-ui/core"
import React, { useContext, useEffect, useRef, useState } from "react"
import { MilestoneContext } from "../context/MilestoneContext"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"

function PointCloudAdder() {
  const { setPoints } = useContext(MilestoneContext)
  const [pjson, setPjson] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [open, setOpen] = useState(false)

  const openDialogBox = () => {
    setOpen(true)
  }

  const closeDialogBox = () => {
    setOpen(false)
  }

  const getData = () => {
    fetch(pjson, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then(function (response) {
        return response.json()
      })
      .then(function (myJson) {
        setPoints(myJson)
      })
  }
  useEffect(() => {
    if (pjson) {
      return getData()
    }
  }, [pjson])

  const fileInput = useRef(null)

  const openFile = (e) => {
    fileInput.current.click()
    setOpen(false)
  }

  const clearPointCloud = (e) => {
    setPjson(null)
    setPoints([])
  }
  const jsonUploader = async (e) => {
    setIsUploading(true)
    const files = e.target.files
    const data = new FormData()
    data.append("file", files[0])
    data.append("upload_preset", "wardoc")

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/wardoc/raw/upload",
      {
        method: "POST",
        body: data,
      }
    )
    const file = await res.json()
    setPjson(file.secure_url)

    setIsUploading(false)
    e.target.value = ""
  }

  return (
    <div class="pointcloudAdder">
      <h4>Add PointCloud</h4>
      <input
        type="file"
        ref={fileInput}
        style={{ display: "none" }}
        onChange={jsonUploader}
      ></input>
      {!pjson ? (
        [
          !isUploading ? (
            <Button
              type="input"
              variant="outlined"
              color="primary"
              onClick={openDialogBox}
            >
              Insert
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
          type="input"
          variant="outlined"
          onClick={clearPointCloud}
        >
          Clear
        </Button>
      )}
      <Dialog
        open={open}
        onClose={closeDialogBox}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"What is your choise?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This means if you click <b>Ok</b>, Pointclouds will be loaded over
            map. To go back click <b>Cancel</b>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialogBox} color="primary">
            Cancel
          </Button>
          <Button onClick={openFile} variant="outlined" color="secondary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default PointCloudAdder
