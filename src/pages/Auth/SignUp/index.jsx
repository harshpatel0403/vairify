import CompanionProviderPage from "../../../components/Auth/Categories/CompanionProviderPage";
import ClientHobbyistPage from "../../../components/Auth/Categories/ClientHobbyistPage";
import AgencyBusinessPage from "../../../components/Auth/Categories/AgencyBusinessPage";
import InfluencerAffiliatePage from "../../../components/Auth/Categories/InfluencerAffiliatePage";
import { useLocation } from "react-router-dom";

export default function Index() {
  const { state } = useLocation();
  return state.type === "client-hobbyist" ? (
    <ClientHobbyistPage />
  ) : state.type === "companion-provider" ? (
    <CompanionProviderPage />
  ) : state.type === "agency-business" ? (
    <AgencyBusinessPage />
  ) : (
    <InfluencerAffiliatePage />
  );
}
