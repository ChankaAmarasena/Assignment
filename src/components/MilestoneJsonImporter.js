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
  const [openPop, setOpenPop] = React.useState(false)

  const openDialogBox = () => {
    setOpen(true)
  }

  const closeDialogBox = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (mjson) {
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
          setmilestones([...milestones, ...myJson])
          setMjson(null)
          setIsUpoading(false)
          setOpenPop(true)
        })
    }
  }, [mjson, milestones, setmilestones])

  const fileInput = useRef(null)
  const openFile = (e) => {
    setOpen(false)
    fileInput.current.click()
  }

  const jsonUploader = async (e) => {
    setIsUpoading(true)
    setOpenPop(false)
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

    e.target.value = ""
  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
  }

  const closePopUp = (event, reason) => {
    if (reason === "clickaway") {
      return
    }

    setOpenPop(false)
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
          onClick={openDialogBox}
        >
          IMPORT
        </Button>
      ) : (
        <CircularProgress />
      )}

      <Dialog
        open={open}
        onClose={closeDialogBox}
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
          <Button onClick={closeDialogBox} color="primary">
            Cancel
          </Button>
          <Button
            onClick={openFile}
            variant="outlined"
            color="secondary"
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        open={openPop}
        autoHideDuration={6000}
        onClose={closePopUp}
      >
        <Alert onClose={closePopUp} severity="success">
          Milestone Added Successfully
        </Alert>
      </Snackbar>
    </div>
  )
}

export default React.memo(MilestoneJsonImporter)
