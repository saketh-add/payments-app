import { BrowserRouter, Routes, Route } from "react-router-dom"
import SignupPage from "./components/SignupPage"
import SigninPage from "./components/SigninPage"
import Dashboard from "./components/Dashboard"
import { RecoilRoot } from "recoil"


function App() {

  return (<RecoilRoot>
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </RecoilRoot>
  )
}

export default App
