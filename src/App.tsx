import ClerkProviderWithRoutes from "./auth/ClerkProviderWithRoutes";
import './App.css'
import {Route, Routes} from "react-router-dom";
import {AuthenticationPage} from "./auth/AuthenticationPage.tsx";
import {LayOut} from "./layout/LayOut.tsx";
import {HistoryPanel} from "./history/HistoryPanel.tsx";
import {ChallengeGenerator} from "./challenge/ChallengeGenerator.tsx";

function App() {
  return <>
    <ClerkProviderWithRoutes>
        <Routes>
            <Route path="/sign-in/*" element={<AuthenticationPage/>} />
            <Route path="/sign-up" element={<AuthenticationPage/>} />
            <Route element={<LayOut/>}>
                <Route path="/" element={<ChallengeGenerator/>}/>
                <Route path="/history" element={<HistoryPanel/>}/>
            </Route>
        </Routes>
    </ClerkProviderWithRoutes>
  </>
}

export default App
