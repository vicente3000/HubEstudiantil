import { Router } from "express";
import {
  getGoogleCallbackHandler,
  getGoogleStartHandler,
  getOauthConfigHandler,
  postDevTokenHandler,
  postPasswordLoginHandler
} from "./auth.handlers.js";

const router = Router();

router.get("/oauth-config", getOauthConfigHandler);
router.get("/google", getGoogleStartHandler);
router.get("/google/callback", getGoogleCallbackHandler);
router.post("/login", postPasswordLoginHandler);
router.post("/dev/token", postDevTokenHandler);

export default router;
