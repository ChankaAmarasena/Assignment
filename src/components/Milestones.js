import { Button, IconButton } from "@material-ui/core"
import React, { useContext, useEffect, useState } from "react"
import "../css/card.css"
import { MilestoneContext } from "../context/MilestoneContext"
import DeleteIcon from "@material-ui/icons/Delete"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import { AutoSizer, List } from "react-virtualized"

const Milestones = (props) => {
  const {
    milestones,
    removeMilestone,
    activeId,
    activeMilestone,
    setPosition,
    setIsDefault,
    isZooming,
    setIsZooming,
  } = useContext(MilestoneContext)
  const listRef = React.useRef()
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setIsZooming(false)
  }

  useEffect(() => {
    if (activeId) {
      listRef.current.scrollToRow(
        milestones.findIndex((item) => item.id === activeId)
      )
    }
  }, [activeId])

  const Row = ({ index, style, key }) => (
    <div style={style} key={key}>
      <div
        className={
          !(activeId === milestones[index].id) ? "card" : "card_active"
        }
        key={milestones[index].id}
        onClick={() => {
          activeMilestone(milestones[index].id)
          const newposition = {
            x: milestones[index].x,
            y: milestones[index].y,
          }

          setPosition(newposition)
          setIsZooming(true)
          setIsDefault(true)
        }}
      >
        <h5>{milestones[index].name}</h5>

        <IconButton
          style={{
            color: "#3f51b5",
            index: 2,
          }}
          color="secondary"
          aria-label="upload picture"
          component="span"
          onClick={handleClickOpen}
        >
          <DeleteIcon />
        </IconButton>
        <Dialog
          open={activeId === milestones[index].id && open ? true : false}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            id="alert-dialog-title"
            style={{ backgroundColor: "#C70039 " }}
          >
            {"Are you Sure?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This means if you click AGREE milestone name{" "}
              {milestones[index].name} will be deleted
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                console.log(isZooming)
                handleClose()
              }}
              color="primary"
            >
              Disagree
            </Button>
            <Button
              onClick={() => {
                removeMilestone(milestones[index].id)
                handleClose()
              }}
              variant="outlined"
              color="secondary"
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  )

  return milestones.length ? (
    <AutoSizer>
      {({ width, height }) => {
        return (
          <List
            className="List"
            height={height}
            rowCount={milestones.length}
            rowHeight={80}
            width={width}
            ref={listRef}
            rowRenderer={Row}
          />
        )
      }}
    </AutoSizer>
  ) : (
    <div class="card">
      <h5>Empty list</h5>
    </div>
  )
}

export default React.memo(Milestones)
