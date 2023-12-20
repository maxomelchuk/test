import eventService from "../services/event.service.js";

class EventController {
  async getCTR(req, res) {
    const data = await eventService.getCTR(req.query.date);
    res.status(200).send(data);
  }

  async getStatistic(req, res) {
    const data = await eventService.getStatistic(
      req.query.start,
      req.query.end
    );
    res.status(200).send(data);
  }
}
export default new EventController();
