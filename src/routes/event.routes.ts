import { Router } from "express";
import { Event } from "../models/event.model.js";
import { redis } from "../config/redis.js";

const router = Router();

router.post("/", async (req, res) => {
  const { cid, name, value } = req.body;
  const lpCookieHeader = req.get("X-LP-Cookie");
  const lpCookieValue = lpCookieHeader || req.cookies.LP_COOKIE || "";

  const payload = {
    ...req.body,
    // Only use cookie value if cid is not provided in the request body
    cid: cid || (lpCookieValue && lpCookieValue !== "" ? lpCookieValue : undefined),
    name,
    value
  };

  try {
    const newEvent = new Event(payload);

    await newEvent.save();

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
  const lpCookieHeader = req.get("X-LP-Cookie");
  const lpCookieValue = lpCookieHeader || req.cookies.LP_COOKIE || "";

  const { name, cid } = req.query;

  try {
    const query: any = {};

    if (name) query.name = name;
    if (lpCookieValue && lpCookieValue !== "") query.cid = lpCookieValue;
    if (!query?.cid && !!cid){
      query.cid = cid;
    }

    // Check Redis cache first
    const cacheKey = `event:${JSON.stringify(query)}`;
    const cachedEvent = await redis.get(cacheKey);
    console.log({ cachedEvent });
    if (cachedEvent) {
      console.log("⚡ Cache hit for event:", query, cachedEvent);
      res.json(JSON.parse(cachedEvent));
      return;
    }

    // Get only the newest event
    const event = await Event.findOne(query).sort({ createdAt: -1 });
    if (event) {
      // Cache the event in redis
      await redis.set(
        `event:${JSON.stringify(query)}`,
        JSON.stringify(event),
        "EX",
        600,
      );
    }

    res.json(event || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
