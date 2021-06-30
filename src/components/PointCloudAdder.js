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

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
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

  const onButtonClick = (e) => {
    fileInput.current.click()
    setOpen(false)
  }

  const onButtonClick2 = (e) => {
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
              onClick={handleClickOpen}
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
          onClick={onButtonClick2}
        >
          Clear
        </Button>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"What is your choise?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This means if you click <b>AGREE</b>, Pointclouds will be loaded
            over map. To go back click <b>DISAGREE</b>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button onClick={onButtonClick} variant="outlined" color="secondary">
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default PointCloudAdder
