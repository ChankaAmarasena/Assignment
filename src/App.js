import "./App.css"
import Header from "./components/Header"
import MilestoneContextProvider from "./context/MilestoneContext"
import AppBody from "./components/AppBody"

function App() {
  return (
    <div className="app">
      <Header />

      <MilestoneContextProvider>
        <AppBody />
      </MilestoneContextProvider>
    </div>
  )
}

export default App
