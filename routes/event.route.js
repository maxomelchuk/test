import { Router } from "express";
import eventController from "../controllers/event.controller.js";
import { validate, Joi } from "express-validation";

const dateValidation = {
  query: Joi.object({
    date: Joi.string()
      .regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)
      .required(),
  }),
};

const periodValidation = {
  query: Joi.object({
    start: Joi.string()
      .regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)
      .required(),
    end: Joi.string()
      .regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)
      .required(),
  }),
};

const router = new Router();

router.get(
  "/click-through-rate",
  validate(dateValidation, {}, {}),
  eventController.getCTR
);
router.get(
  "/statistic",
  validate(periodValidation, {}, {}),
  eventController.getStatistic
);

export default router;
