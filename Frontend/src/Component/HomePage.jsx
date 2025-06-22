import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "https://localhost:3000";

export default function HomePage() {
  /**
   * @typedef {{ id: string | number, title : string, description : string } } Event
   */
  const [events, setEevents] = useState(/** @type {[Event[]]} */ ([]));

  useEffect(() => {
    fetch(`${API_URL}`)
      .then((res) => res.json())
      .then(setEevents)
      .catch(() => setEevents([]));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-vlue-700"> ALL Events</h1>
      {events.length == 0 && (
        <p className="text-gresy-500"> No Events found.</p>
      )}
      <ul className="space-y-4 mb-10">
        {events.map((ev) => (
          <li
            key={ev.id}
            className="bg-white rounded-lg shadow hover:bg-blue-50 transition"
          >
            <Link
              to={`/events/${ev.id}`}
              className="text-xl font-semibold text-blue-600 hover:underline"
            >
              {ev.title}
            </Link>
            <br />
            <small className="text-gray-600">{ev.description}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
