import { parse } from "csv-parse/sync";
import fs from "fs/promises";

class EventService {
  async getFileNames() {
    return await fs.readdir(process.cwd() + "/db_files/events");
  }

  async fileToObject(fileName) {
    const fileContent = await fs.readFile(
      process.cwd() + "/db_files/events/" + fileName
    );
    const records = await parse(fileContent, { columns: true });
    return records;
  }

  getUniqSessions() {}

  async getCTR(date) {
    const fileRequests = [];
    const fileNames = await this.getFileNames();
    fileNames.forEach((name) => {
      if (name.includes(date)) {
        fileRequests.push(this.fileToObject(name));
      }
    });
    const data = await Promise.all(fileRequests);
    const campaigns = {};
    const result = [];
    if (data.length) {
      for (let file of data) {
        for (let el of file) {
          if (!campaigns[el.campaign]) campaigns[el.campaign] = {};
          if (!campaigns[el.campaign][el.session])
            campaigns[el.campaign][el.session] = {};

          if (el.view == "1") {
            campaigns[el.campaign][el.session].view = 1;
          }
          if (el.ad_click == "1") {
            campaigns[el.campaign][el.session].click = 1;
          }
        }
      }

      for (let campaign in campaigns) {
        let views = 0;
        let clicks = 0;
        for (let session in campaigns[campaign]) {
          if (campaigns[campaign][session].view) views++;
          if (campaigns[campaign][session].click) clicks++;
        }
        result.push({ campaign, ctr: (clicks / views).toFixed(2) });
      }
    }

    return result;
  }

  async getStatistic(startDate, endDate) {
    const fileRequests = [];
    const fileNames = await this.getFileNames();

    fileNames.forEach((name) => {
      const fileDate = name.substring(9, 19);
      if (fileDate >= startDate && fileDate <= endDate) {
        fileRequests.push(this.fileToObject(name));
      }
    });
    const data = await Promise.all(fileRequests);
    const result = [];
    if (data.length) {
      for (let file of data) {
        let date = null;
        let clicks = 0;
        let views = 0;
        let uniqueSessions = {};
        for (let el of file) {
          if (!date) date = el.day;
          if (el.ad_click == "1") clicks++;
          if (el.view == "1") views++;
          uniqueSessions[el.session] = 1;
        }
        if (date) {
          result.push({
            date,
            clicks,
            views,
            uniqueSessions: Object.keys(uniqueSessions).length,
          });
        }
      }
    }

    return result;
  }
}
export default new EventService();
