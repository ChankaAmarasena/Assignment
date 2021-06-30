import { Button } from "@material-ui/core"
import React, { useContext, useState, useRef } from "react"
import Snackbar from "@material-ui/core/Snackbar"
import MuiAlert from "@material-ui/lab/Alert"
import { MilestoneContext } from "../context/MilestoneContext"

function MilestoneAdder() {
  const { addMilestone } = useContext(MilestoneContext)
  const [name, setName] = useState("")
  const [x, setX] = useState("")
  const [y, setY] = useState("")
  const [open, setOpen] = React.useState(false)
  const mAdd = useRef(null)
  const handleSubmit = (e) => {
    setOpen(false)
    e.preventDefault()
    addMilestone(name, x, y)
    setName("")
    setX("")
    setY("")
    setOpen(true)
  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }

    setOpen(false)
  }

  return (
    <>
      <div class="head">
        <h4>Configuration</h4>
      </div>
      <div class="form">
        <form onSubmit={handleSubmit}>
          <div class="data">
            <p>Name :</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></input>
          </div>
          <div class="data">
            <p>X :</p>
            <input value={x} onChange={(e) => setX(e.target.value)}></input>
          </div>
          <div class="data">
            <p>Y :</p>
            <input value={y} onChange={(e) => setY(e.target.value)}></input>
          </div>

          <Button
            ref={mAdd}
            type="submit"
            variant="outlined"
            color="primary"
            style={{ display: "none" }}
          >
            Add
          </Button>
        </form>
      </div>
      <div class="submit_btn">
        <Button
          type="submit"
          variant="outlined"
          color="primary"
          onClick={() => mAdd.current.click()}
        >
          Add
        </Button>
      </div>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success">
          Milestone Added Successfully
        </Alert>
      </Snackbar>
    </>
  )
}

export default MilestoneAdder
