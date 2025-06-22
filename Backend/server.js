const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post("/events", async (req, res) => {
  const { title, description, slots } = req.body;
  if (!title || !slots || !Array.isArray(slots) || slots.length === 0) {
    return res
      .status(400)
      .json({ error: "Title and at least one slot is required" });
  }

  try {
    const event = await prisma.event.create({
      data: {
        title,
        description,
        slots: {
          create: slots.map((slot) => ({
            start: new Date(slot.start),
            end: new Date(slot.end),
            maxBookings: slot.maxBookings || 1,
          })),
        },
      },
      include: { slots: true },
    });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: "Failed to create event." });
  }
});

app.get("/events", async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        slots: {
          select: {
            id: true,
            start: true,
            end: true,
          },
        },
      },
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

app.get("/events/:id", async (req, res) => {
  const { id } = res.params;
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        slots: {
          include: {
            bookings: true,
          },
        },
      },
    });
    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }
    const slots = event.slots.map((slot) => ({
      id: slot.id,
      start: slot.start,
      end: slot.end,
      maxBookings: slot.maxBookings,
      bookingsCount: slot.bookings.length,
      available: slot.bookings.length < slot.maxBookings,
    }));

    res.json({
      id: event.id,
      title: event.title,
      description: event.description,
      slots,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events." });
  }
});

app.post("/events/:id/bookings", async (req, res) => {
  const { id: eventId } = req.params;
  const { slotId, name, email } = req.body;

  if (!slotId || !name || !email) {
    return res
      .status(400)
      .json({ error: "SlotId , name and email are required" });
  }

  try {
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({ data: { name, email } });
    }

    const slot = await prisma.slot.findUnique({
      wherer: { id: slotId },
      include: { bookings: true },
    });

    if (!slot || slot.eventId !== eventId) {
      return res.status(404).json({ error: "Slot not found for this event." });
    }

    const existingBooking = await prisma.booking.findFirst({
      where: { slotId, userId: user.id },
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({ error: "Yoo have already booked this slot." });
    }

    if (slot.booking.length >= slot.maxBookings) {
      return res.status(400).json({ error: "Slot is fully booked." });
    }

    const booking = await prisma.booking.create({
      data: {
        slotId,
        userId: user.id,
      },
    });

    res.json({ message: "Booking successful", booking });
  } catch (err) {
    res.status(500).json({ error: "Failed to book slot" });
  }
});

app.get("/users/:email/bookings", async (req, res) => {
  const { email } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: {
        slot: {
          include: { event: true },
        },
      },
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings." });
  }
});
app.listen(3000, () => {
  console.log("Server running on https://localhast:3000");
});
