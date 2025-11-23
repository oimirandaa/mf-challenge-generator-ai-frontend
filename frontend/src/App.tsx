import ClerkProviderWithRoutes from "./auth/ClerkProviderWithRoutes";
import './App.css'
import {Routes} from "react-router-dom";

function App() {
  return <>
    <ClerkProviderWithRoutes>
        <Routes>
        
        </Routes>
    </ClerkProviderWithRoutes>
  </>
}

export default App
