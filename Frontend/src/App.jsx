import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./Component/HomePage";
import EventDetailsPage from "./Component/EventDetailsPage";
import CreateEventPage from "./Component/CreateEventPage";
import MyBookingPage from "./Component/MyBookingPage";
import NotFoundPage from "./Component/NotFoundPage";
function App() {
  return (
    <BrowserRouter>
      <nav style={{ marginBottom: 24 }}>
        <Link to="/"> Home</Link> | <Link to="/create"> Create Event </Link> |{" "}
        <Link to="/my-bookings"> My Bookings</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/events/:id" element={<EventDetailsPage />}></Route>
        <Route path="/create" element={<CreateEventPage />}></Route>
        <Route path="/my-bookings" element={<MyBookingPage />}></Route>
        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
