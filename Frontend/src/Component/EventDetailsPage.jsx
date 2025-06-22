import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "https://localhost:3000";

export default function EventDetaildsPage() {
  const { id } = useParams();
  const { event, setEvent } = useState(null);
  const { slotId, setSlotId } = useState("");
  const { name, setName } = useState("");
  const { email, setEmail } = useState("");
  const { message, setMessage } = useState("");

  useEffect(() => {
    fetch(`${API_URL}/events/${id}`)
      .then((res) => res.json())
      .then(setEvent)
      .catch(() => setEvent(null));
  }, [id, setEvent]);

  const handleBook = async (e) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch(`${API_URL}/${id}/bookings`, {
      method: "POST",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify({ slotId, name, email }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("Booking succeddfull!");
    } else {
      setMessage(data.error || "Booking Failed");
    }
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <h2>Slots</h2>
      <ul>
        {event.slots.map((slot) => (
          <li key={slot.id}>
            {new Date(slot.start).toLocaleString()} -{" "}
            {new Date(slot.end).toLocaleString}
            {" | "}
            {slot.available ? "Available" : "Full"}
            {" | "}
            {slot.bookingCount}/{slot.maxBookings} booked
          </li>
        ))}
      </ul>
      <h3>Book a Slot </h3>
      <form onsubmit={handleBook}>
        <label htmlFor="">
          Slot :
          <select
            value="slotid"
            onchange={(e) => setSlotId(e.target.value)}
            required
          >
            <option value="">Select Slot</option>
            {event.slots
              .filter((s) => s.available)
              .map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {new Date(slot.start).toLocaleString()} -{" "}
                  {new Date(slot.end).toLocaleString}
                </option>
              ))}
          </select>
        </label>
        <br />
        <label>
          Name :{" "}
          <input
            value={name}
            onchange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Email :{" "}
          <input
            value={email}
            onchange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Book</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
