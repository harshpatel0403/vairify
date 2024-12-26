import { combineReducers } from "redux";
import { TotalVairipay } from "./vairipay";
import { HandleAuth } from "./Auth";
import { HandleVAI } from "./VAI";
import { HandleServices } from "./Services";
import { HandleAdvanceServices } from "./AdvancedSearch.JSX";
import { HandleMarketplace } from "./MarketplaceSearch";
import { HandleCalendarSchedule } from "./CalendarSchedule";
import { HandleCurrentLocation } from "./UserCurrentLocation";
import { HandleProfile } from "./Profile";
import { HandleGallary } from "./Gallary";
import { HandleSocial } from "./Social";

const reducer = combineReducers({
  TotalVairipay: TotalVairipay,
  Auth: HandleAuth,
  Vai: HandleVAI,
  Services: HandleServices,
  AdvanceServices: HandleAdvanceServices,
  Market: HandleMarketplace,
  Calendar: HandleCalendarSchedule,
  CurrentLocation: HandleCurrentLocation,
  Profile:HandleProfile,
  Gallary:HandleGallary,
  Social:HandleSocial,
});

export default reducer;
