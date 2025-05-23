import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
  // console.log("Client IP:", req.ip);
  // console.log("X-Forwarded-For:", req.get("X-Forwarded-For"));
  // console.log("Request IP:", req.ip);
  // console.log("User-Agent:", req.headers["user-agent"]);
  // console.log("Accept-Language:", req.headers["accept-language"]);

  // ? NOT IMPORTANT, CODE STILL WORKS PERFECTLY: JUST PREVENT ARCJET FROM RUNNING ON INITIAL BUILD DISPLAYING SOME IP ERRORS AND DURING HEALTH CHECKS ON RENDER PLATFORM BECAUSE ARCJET REQUIRES THE IP OF THE REQUEST FROM THE CLIENT AND THOSE RENDER internal REQUEST DOSENT PROVIDE THAT.
  // Skip Arcjet for health checks by render on initial build (no X-Forwarded-For or localhost IP)
  // if (
  //   !req.get("X-Forwarded-For") ||
  //   req.ip === "::1" ||
  //   req.ip === "127.0.0.1"
  // ) {
  //   console.log("Skipping Arcjet for health check request");
  //   return next();
  // }

  try {
    const decision = await aj.protect(req, { requested: 1 });
    // console.log("Arcjet Decision:", JSON.stringify(decision, null, 2));

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit())
        return res.status(429).json({ message: "Rate limit exceeded" });

      if (decision.reason.isBot())
        return res.status(403).json({ message: "Bot detected" });

      return res.status(403).json({ message: "Access denied" });
    }

    // Continue to the next step
    next();
  } catch (error) {
    console.log("Arcjet Middleware Error:", error);

    next(error);
  }
};

export default arcjetMiddleware;

// ? EVERYTHING WORKS FINE 😊
