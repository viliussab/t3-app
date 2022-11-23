import * as dateFns from "date-fns";

const campaignStartWeekDay = 2; // Tuesday

const isNotCampaignDay = (date: Date) => {
  return date.getDay() !== campaignStartWeekDay;
};

const getCurrentCampaignDay = () => {
  const lastDayOfWeek = dateFns.lastDayOfWeek(new Date(), {
    weekStartsOn: campaignStartWeekDay
  });
    
  const campaignDayOfWeek = dateFns.addDays(lastDayOfWeek, -6);

  return campaignDayOfWeek;
};
  
const formatToYearWeek = (date: Date) => {
  if (!date) {
    return undefined;
  }
  
  const week = dateFns.getWeek(date, {
    weekStartsOn: campaignStartWeekDay
  });
  
  const year = dateFns.getWeekYear(date, {
    weekStartsOn: campaignStartWeekDay
  });
  
  return `${year} m. ${week} sav.`;
};

const dateService = {
  isNotCampaignDay,
  getCurrentCampaignDay,
  formatToYearWeek
};

export default dateService;
