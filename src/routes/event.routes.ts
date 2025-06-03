import { Router } from "express";
import { Event } from "../models/event.model.js";
import { redis } from "../config/redis.js";

const router = Router();

router.post("/", async (req, res) => {
  const {
    cid,
    eventType,
    eventValue,
    page,
    ctaClicked,
    meta,
    email,
    name,
    fingerprint,
  } = req.body;

  try {
    const newEvent = new Event({
      cid,
      eventType,
      eventValue,
      page,
      ctaClicked,
      meta,
      email,
      name,
      fingerprint,
    });

    await newEvent.save();

    // ✅ Cache the new event by ID
    await redis.set(
      `event:${newEvent._id}`,
      JSON.stringify(newEvent),
      "EX",
      600,
    );

    console.log("New event created:", newEvent);
    res.status(201).json(newEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const redisKey = `event:${id}`;

  redis
    .get(redisKey)
    .then((cached) => {
      if (cached) {
        console.log("⚡ Cache hit for event:", id);
        return res.json(JSON.parse(cached));
      } else {
        console.log("💾 Cache miss for event:", id);
        return Event.findById(id)
          .then((event) => {
            if (!event) {
              return res.status(404).json({ message: "Event not found" });
            }
            // Cache the event in Redis
            redis.set(redisKey, JSON.stringify(event), "EX", 600);
            console.log("Event cached in Redis:", id);
            res.json(event);
          })
          .catch((err) => {
            console.error("Error fetching from MongoDB:", err);
            res.status(500).json({ message: "Server error" });
          });
      }
    })
    .catch((err) => {
      console.error("Error fetching from Redis:", err);
      res.status(500).json({ message: "Error fetching from cache" });
    });
});

router.get("/", async (req, res) => {
  const { eventType, eventValue, name, page, cid } = req.query;

  try {
    const query: any = {};

    if (eventType) query.eventType = eventType;
    if (eventValue) query.eventValue = eventValue;
    if (name) query.name = name;
    if (page) query.page = page;
    if (cid) query.cid = cid;

    // Check Redis cache first
    const cacheKey = `events:${JSON.stringify(query)}`;
    const cachedEvents = await redis.get(cacheKey);
    if (cachedEvents) {
      console.log("⚡ Cache hit for events:", query);
      res.json(JSON.parse(cachedEvents));
      return;
    }

    const events = await Event.find(query).sort({ createdAt: -1 });

    // Cache all events in redis
    await redis.set(
      `events:${JSON.stringify(query)}`,
      JSON.stringify(events),
      "EX",
      600,
    );

    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
