import { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL || "https://localhost:3000";
export default function MyBookingPage() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  const fetchBookings = async (e) => {
    e.prevantDeafult();
    setError("");
    setBookings([]);
    const res = await fetch(
      `${API_URL}/users/${encodeURIComponent(email)}/bookings`
    );

    if (res.ok) {
      setBookings(await res.json());
    } else {
      setError("No bookings found or error occured.");
    }
  };

  return (
    <div>
      <h1>My Bookings</h1>
      <form onSubmit={fetchBookings}>
        <label>
          Email :{" "}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">View Bookings</button>
      </form>
      {error && <p>{error}</p>}
      <ul>
        {bookings.map((b) => (
          <li key={b.id}>
            Event: {b.slot.event.title} <br />
            Slot: {new Date(b.slot.start).toLocaleString()} -{" "}
            {new Date(b.slot.end).toLocaleString()} <br />
            Booked At: {new Date(b.bookedAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
