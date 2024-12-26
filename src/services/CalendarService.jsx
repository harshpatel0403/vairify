import requests from "./httpService";

const CalendarService = {
  syncGoogleEvents(body) {
    return requests.post(`/calendar/sync-google`, body);
  },
  syncMicrosoftEvents(body) {
    return requests.post(`/calendar/sync-microsoft`, body);
  },
  
};

export default CalendarService;
