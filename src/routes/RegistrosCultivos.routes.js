import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getRegistros,
  getRegistro,
  createRegistro,
  deleteRegistro,
  updateRegistro,
} from "../controllers/RegistrosCultivos.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createRegistroSchema } from "../schemas/RegistroCultivos.schema.js";

const router = Router();

router.get("/", authRequired, getRegistros);

router.get("/:id", authRequired, getRegistro);

router.post(
  "/",
  authRequired,
  validateSchema(createRegistroSchema),
  createRegistro
);

router.delete("/:id", authRequired, deleteRegistro);

router.put("/:id", authRequired, updateRegistro);

export default router;
