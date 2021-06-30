import React, { useContext, useEffect, useState, useRef } from "react"
import { MilestoneContext } from "../context/MilestoneContext"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import { Button, CircularProgress, Snackbar } from "@material-ui/core"
import MuiAlert from "@material-ui/lab/Alert"
function MilestoneJsonImporter() {
  const { setmilestones, milestones } = useContext(MilestoneContext)
  const [isUploading, setIsUpoading] = useState(false)
  const [mjson, setMjson] = useState(null)
  const [open, setOpen] = React.useState(false)
  const [open2, setOpen2] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const getData = () => {
    fetch(mjson, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then(function (response) {
        return response.json()
      })
      .then(function (myJson) {
        console.log(myJson)
        setmilestones([...milestones, ...myJson])
        setMjson(null)
        setIsUpoading(false)
        setOpen2(true)
      })
  }
  useEffect(() => {
    if (mjson) {
      getData()
    }
  }, [mjson])

  const fileInput = useRef(null)
  const onButtonClick = (e) => {
    setOpen(false)
    fileInput.current.click()
  }

  const jsonUploader = async (e) => {
    setIsUpoading(true)
    setOpen2(false)
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
    setMjson(file.secure_url)
    console.log(file.secure_url)
    e.target.value = ""
  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
  }

  const handleClose2 = (event, reason) => {
    if (reason === "clickaway") {
      return
    }

    setOpen2(false)
  }

  return (
    <div class="json">
      <input
        type="file"
        ref={fileInput}
        style={{ display: "none" }}
        onChange={jsonUploader}
      ></input>
      {!isUploading ? (
        <Button
          type="input"
          variant="outlined"
          color="primary"
          onClick={handleClickOpen}
        >
          IMPORT
        </Button>
      ) : (
        <CircularProgress />
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are You Sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Import milestone to the current milestones list
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button
            onClick={onButtonClick}
            variant="outlined"
            color="secondary"
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        open={open2}
        autoHideDuration={6000}
        onClose={handleClose2}
      >
        <Alert onClose={handleClose2} severity="success">
          Milestone Added Successfully
        </Alert>
      </Snackbar>
    </div>
  )
}

export default React.memo(MilestoneJsonImporter)
