import React from "react";
import IconButton from "../../../components/IconButton";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  HandleCreateCalendarSetting,
  HandleGetCalendarSettings,
} from "../../../redux/action/CalendarSchedule";
import Loading from "../../../components/Loading/Index";
import { useEffect } from "react";

export default function VaiNow() {

   
  return (
    <div className="flex flex-col justify-between main-container px-0 min-h-[calc(100vh-150px)]">
      <div>
        <div className="w-full bg-gradient-to-t from-[#040B4759] to-[#040B4759] h-[50px] w-full mt-10 item-center">
        <h2 className="text-[32px] font-bold my-1">VAI-NOW</h2>
        </div>
        
      </div>
      

    </div>
  );
}
