import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./component/LoginPage";
import UserList from "./component/UserList";

function App() {
  return (
    <>
      <Routes>
        <Route path="/users" element={<UserList />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
