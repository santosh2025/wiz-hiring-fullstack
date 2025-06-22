import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "https://localhost:3000";

export default function CreateEventPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slots, setSlots] = useState([{ start: "", end: "", maxBookings: 1 }]);
  const [message, setMessage] = useState("");

  const handleSlotChange = (idx, field, value) => {
    setSlots((slots) =>
      slots.map((slot, i) =>
        i === idx
          ? {
              ...slot,
              [field]: field === "maxBookings" ? Number(value) : value,
            }
          : slot
      )
    );
  };

  const addSlot = () =>
    setSlots([...slots, { start: "", end: "", maxBookings: 1 }]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const preparedSlots = slots.map((slot) => ({
      ...slot,
      maxBookings: Number(slot.maxBookings),
    }));

    const res = await fetch(`${API_URL}/events`, {
      method: "POST",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify({ title, description, slots: preparedSlots }),
    });

    if (res.ok) setMessage("Event Created!");
    else {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error || "Failed to create Event");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-blod mb-6 text-blue-700">Create Event</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white rounded shadow p-6"
      >
        <label className="block">
          <span className="bloack mb-1 font-medium"> Title:</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border roundeed px-2 py-1"
          />
        </label>
        <label className="block">
          <span className="bloack mb-1 font-medium">Description:</span>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border roundeed px-2 py-1"
          />
        </label>
        <h3 className="text-xl font-semibold mt-4 mb-3 text-blue-700">Slots</h3>
        {slots.map((slot, idx) => (
          <div key={idx} className="flex flex-wrap gap-4 items-end mb-2">
            <label className="block">
              <span className="block mb-1">Start (UTC):</span>
              <input
                type="datetime-local"
                value={slot.start}
                onChange={(e) => handleSlotChange(idx, "start", e.target.value)}
                required
                className="border rounded px-2 py-1"
              />
            </label>
            <label className="block">
              <span className="block mb-1">End (UTC):</span>
              <input
                type="datetime-local"
                value={slot.end}
                onChange={(e) => handleSlotChange(idx, "end", e.target.value)}
                required
                className="border rounded px-2 py-1"
              />
            </label>
            <label className="block">
              <span className="block mb-1">Max Bookings :</span>
              <input
                type="number"
                min="1"
                value={slot.maxBookings}
                onChange={(e) =>
                  handleSlotChange(idx, "maxBookings", e.target.value)
                }
                required
                className="border rounded px-2 py-1 w-24"
              />
            </label>
          </div>
        ))}
        <button
          type="button"
          onClick={addSlot}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded"
        >
          Add Slot
        </button>
        <br />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Event
        </button>
      </form>
      {message && (
        <p className="mt-4 text-cente font-semibold text-green-700">
          {message}
        </p>
      )}
    </div>
  );
}
