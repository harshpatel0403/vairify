import { Component, useEffect, useState } from "react";

import "./index.css";
import { useNavigate, useParams } from "react-router-dom";
import DateGuardService from "../../services/DateGuardService";
import { toast } from "react-toastify";
import OtpInput from "react-otp-input";
import Button from "../Button";
import moment from "moment";
import { useSelector } from "react-redux";

const initialState = {
  isTimerRunning: false,
  timeElapsedInSeconds: 0,
  timerLimitInMinutes: 90,
  appointmentData: {},
  groupData: {},
  alarmData: {},
  loading: false,
  timerStarted: false,
  codeInput: "",
  alarmTimerStarted: false,
  freeze: false,
  alarmLoader: false,
  pauseMode: false,
};

class DigitalTimer extends Component {
  state = initialState;

  componentWillUnmount() {
    this.clearTimerInterval();
  }

  componentDidMount() {
    if (!this?.props?.params?.appointmentId) {
      this?.props?.navigate(-1);
    }

    this.setState({ loading: true });
    Promise.all([
      // FETCHING Appointment DETAILS
      DateGuardService.getAppointment(this?.props?.params?.appointmentId)
        .then((data) => {
          return this.setState({
            appointmentData: data,
            timerLimitInMinutes: data?.duration,
          });
        })
        .catch((error) => {
          console.log(error);
          toast.error(error?.response?.data?.error || error.message);
        }),
      // FETCHING GROUP DETAILS
      DateGuardService.getSingleGroup(this?.props?.params?.groupId)
        .then((data) => {
          return this.setState({ groupData: data });
        })
        .catch((error) => {
          console.log(error);
          toast.error(error?.response?.data?.error || error.message);
        }),
      // FETCHING alarm DETAILS
      DateGuardService.getAlarm(
        this?.props?.params?.groupId,
        this?.props?.params?.appointmentId
      )
        .then((data) => {
          return this.setState({ alarmData: data });
        })
        .catch((error) => {
          console.log(error);
          toast.error(error?.response?.data?.error || error.message);
        }),
    ])
      .then(() => {
        setTimeout(() => {
          console.log(
            this?.state?.alarmData?.alarmDisarmed,
            this?.state?.alarmData?.alarmDecoyed,
            " <== condioton chekc"
          );
          if (
            this?.state?.alarmData?.alarmDisarmed ||
            this?.state?.alarmData?.alarmDecoyed
          ) {
            this.setState({ timerLimitInMinutes: 0, freeze: true });
            return;
          }
          if (this?.state?.alarmData?.timerStartTime) {
            let diffInMinute = moment().diff(
              moment(this?.state?.alarmData?.timerStartTime),
              "minutes"
            );
            var remaining = this.state.timerLimitInMinutes - diffInMinute;
            var alarmTimerStarted = false;
            if (remaining <= 0) {
              remaining = this?.state?.alarmData?.alarmDelay + remaining;
              alarmTimerStarted = true;
            }
            if (remaining > 0) {
              this.setState({
                timerLimitInMinutes: remaining,
                alarmTimerStarted,
              });
              this.onStartOrPauseTimer();
            } else if (alarmTimerStarted) {
              this.setState({ timerLimitInMinutes: 0, freeze: true });
            }
          }
        }, 500);
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  clearTimerInterval = () => clearInterval(this.intervalId);

  onDecreaseTimerLimitInMinutes = () => {
    const { timerLimitInMinutes } = this.state;

    if (timerLimitInMinutes > 1) {
      this.setState((prevState) => ({
        timerLimitInMinutes: prevState.timerLimitInMinutes - 1,
      }));
    }
  };

  onIncreaseTimerLimitInMinutes = () =>
    this.setState((prevState) => ({
      timerLimitInMinutes: prevState.timerLimitInMinutes + 1,
    }));

  onResetTimer = () => {
    this.clearTimerInterval();
    this.setState(initialState);
  };

  incrementTimeElapsedInSeconds = () => {
    const { timerLimitInMinutes, timeElapsedInSeconds } = this.state;
    const isTimerCompleted = timeElapsedInSeconds === timerLimitInMinutes * 60;

    if (isTimerCompleted) {
      this.clearTimerInterval();
      this.setState({ isTimerRunning: false });
    } else {
      this.setState((prevState) => ({
        timeElapsedInSeconds: prevState.timeElapsedInSeconds + 1,
      }));
    }
  };

  onStartOrPauseTimer = () => {
    const {
      isTimerRunning,
      timeElapsedInSeconds,
      timerLimitInMinutes,
      freeze,
    } = this.state;

    if (freeze) {
      return;
    }

    const isTimerCompleted = timeElapsedInSeconds === timerLimitInMinutes * 60;

    if (isTimerCompleted) {
      this.setState({ timeElapsedInSeconds: 0 });
    }
    if (isTimerRunning) {
      this.clearTimerInterval();
    } else {
      this.intervalId = setInterval(this.incrementTimeElapsedInSeconds, 1000);
    }
    this.setState((prevState) => ({
      isTimerRunning: !prevState.isTimerRunning,
    }));
  };

  handleStartTimer = async () => {
    try {
      if (this?.state?.alarmData?.timerStartTime) {
        toast.error("Timer was already started earlier");
        return;
      }
      // if(!this?.state?.alarmData?.proof?.file) {
      //   toast.error('Please upload proof first')
      //   return
      // }
      await DateGuardService.startTimer({
        groupId: this?.props?.params?.groupId,
        appointmentId: this?.props?.params?.appointmentId,
        timerStartTime: new Date(),
      });
      this.onStartOrPauseTimer();
      this.setState({ timerStarted: true });
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error?.message);
    }
  };

  handleActivateAlarm = async (direct = false) => {
    try {
      this.setState({ alarmLoader: true });
      const location = await this.props.fetchLocation();
      if (!direct && !this.state.codeInput) {
        toast.error("Please add code");
        return;
      }
      await DateGuardService.activateAlarm({
        userId: this?.props?.UserDetails?._id,
        groupId: this?.props?.params?.groupId,
        appointmentId: this?.props?.params?.appointmentId,
        codeInput: this.state.codeInput,
        direct: direct,
        location: location,
        pauseMode: this.state.pauseMode,
      });
      await this.onStartOrPauseTimer();
      if (!this.state.pauseMode) {
        this.setState({ freeze: true });
        toast.success("Alarm disarmed");
        return;
      }
      this.setState({ pauseMode: false, codeInput: "" });
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error || error?.message);
    } finally {
      this.setState({ alarmLoader: false });
    }
  };

  handleImageUpload = () => {
    this.props.navigate(
      `/dateguard/take-photo/${this?.props?.params?.appointmentId}/${this?.props?.params?.groupId}`
    );
  };

  renderTimerController = () => {
    const { isTimerRunning } = this.state;

    return (
      <div className="mt-2 flex flex-row justify-center items-center relative gap-3">
        <button
          disabled={
            !isTimerRunning || this.state.alarmTimerStarted || this.state.freeze
          }
          onClick={() => this.setState({ pauseMode: true })}
          className="w-[67px] h-[67px] rounded-[100%] bg-[#4200FF] flex items-center justify-center text-[#ffffff]"
        >
          <i className="fa fa-pause"></i>
        </button>
        {this?.state?.alarmData?.timerStartTime || this.state.timerStarted ? (
          <div>
            <button
              style={{ userSelect: "none", WebkitTouchCallout: "none" }}
              // disabled={this.state.freeze}
              className={`w-[125px] h-[125px] rounded-[100%] bg-[#DB3002] border-4 border-[#DB3002]  ${
                this.state.mouseDownStarted && "start-animation"
              }`}
              // onClick={() => this.handleActivateAlarm(true)}
              onMouseDown={this.mouseDown.bind(this)}
              onMouseUp={this.mouseUp.bind(this)}
              onTouchStart={this.mouseDown.bind(this)}
              onTouchEnd={this.mouseUp.bind(this)}
              onSelect={() => false}
              type="button"
              disabled={this.state.alarmLoader}
            >
              <span
                style={{
                  userSelect: "none",
                  WebkitTouchCallout: "none",
                  WebkitUserSelect: "none",
                  MozUserSelect: "none",
                }}
                onSelect={() => false}
                className="font-bold text-[40px] text-white position-relative"
              >
                {"Alarm"}
              </span>
            </button>
            <p className="text-[#D9D9D9] mt-3">
              {this.state.alarmLoader
                ? "Please wait..."
                : "Tap and hold to activate"}
            </p>
          </div>
        ) : (
          <button
            className="w-[125px] h-[125px] rounded-[100%] bg-[#0C8A02] border-4 border-[#4200FF]"
            onClick={this.handleStartTimer}
            type="button"
          >
            <span className="font-bold text-[40px] text-white">
              {isTimerRunning ? "Pause" : "Start"}
            </span>
          </button>
        )}
        <button
          disabled={
            isTimerRunning ||
            this.state.alarmTimerStarted ||
            this.state.freeze ||
            (!this.state.timerStarted &&
              !this?.state?.alarmData?.timerStartTime)
          }
          onClick={this.onStartOrPauseTimer}
          className="w-[67px] h-[67px] rounded-[100%] bg-[#4200FF] flex items-center justify-center text-[#ffffff]"
        >
          <i className="fa fa-refresh"></i>
        </button>

        {!this?.state?.alarmData?.proof?.file && (
          <button
            onClick={this.handleImageUpload}
            style={{ right: "15%", bottom: "-50px" }}
            className="w-[67px] h-[67px] rounded-[100%] bg-[#4200FF] flex items-center justify-center absolute"
          >
            <img src={"/images/CameraIcon.png"} alt="Camera Icon" />
          </button>
        )}
        {/* <button
          className="timer-controller-btn"
          onClick={this.onResetTimer}
          type="button"
        >
          <img
            alt="reset icon"
            className="timer-controller-icon"
            src="https://assets.ccbp.in/frontend/react-js/reset-icon-img.png"
          />
          <p className="timer-controller-label change-font-family">Reset</p>
        </button> */}
      </div>
    );
  };

  // getElapsedSecondsInTimeFormat = () => {
  //   const { timerLimitInMinutes, timeElapsedInSeconds } = this.state;
  //   const totalRemainingSeconds =
  //     timerLimitInMinutes * 60 - timeElapsedInSeconds;
  //   const minutes = Math.floor(totalRemainingSeconds / 60);
  //   const seconds = Math.floor(totalRemainingSeconds % 60);
  //   const stringifiedMinutes = minutes > 9 ? minutes : `0${minutes}`;
  //   const stringifiedSeconds = seconds > 9 ? seconds : `0${seconds}`;

  //   return `${stringifiedMinutes}:${stringifiedSeconds}`;
  // };

  getElapsedSecondsInTimeFormat = () => {
    const { timerLimitInMinutes, timeElapsedInSeconds } = this.state;
    const totalRemainingSeconds =
      timerLimitInMinutes * 60 - timeElapsedInSeconds;

    const hours = Math.floor(totalRemainingSeconds / 3600);
    const minutes = Math.floor((totalRemainingSeconds % 3600) / 60);
    const seconds = Math.floor(totalRemainingSeconds % 60);

    const stringifiedHours = hours > 9 ? hours : `0${hours}`;
    const stringifiedMinutes = minutes > 9 ? minutes : `0${minutes}`;
    const stringifiedSeconds = seconds > 9 ? seconds : `0${seconds}`;

    return `${stringifiedHours}:${stringifiedMinutes}:${stringifiedSeconds}`;
  };

  componentDidUpdate() {
    const { timerLimitInMinutes, timeElapsedInSeconds, freeze } = this.state;
    const totalRemainingSeconds =
      timerLimitInMinutes * 60 - timeElapsedInSeconds;

    if (!freeze && totalRemainingSeconds == 0) {
      if (!this.state.alarmTimerStarted) {
        this.setState({
          timerLimitInMinutes: this?.state?.alarmData?.alarmDelay || 5,
          alarmTimerStarted: true,
        });
      } else {
        this.handleActivateAlarm(true);
      }
    }
  }

  delay = 2000;
  startPress = null;

  mouseDown() {
    this.setState({ mouseDownStarted: true });
    this.startPress = Date.now();
  }

  mouseUp() {
    this.setState({ mouseDownStarted: false });
    if (Date.now() - this.startPress > this.delay) {
      this.handleActivateAlarm(true);
    }
  }

  render() {
    const { state } = this;

    if (state.loading) {
      return (
        <div className="h-full min-h-[calc(100vh-230px)] flex items-center justify-center">
          <div className="text-white h-full flex justify-center items-center">
            <p>Loading...</p>
          </div>
        </div>
      );
    }

    if (!moment(state.appointmentData.startDateTime).isSame(moment(), "day")) {
      return (
        <div className="h-full min-h-[calc(100vh-230px)] flex items-center justify-center">
          <div className="text-white h-full flex justify-center items-center">
            <h3 className="text-[20px]">
              This appointment is scheduled for <br />
              <span className="text-[26px] font-bold text-[#405fc4]">
                {moment(state.appointmentData.startDateTime).format(
                  "DD/MM/YYYY"
                )}
              </span>
            </h3>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full mx-auto flex items-center justify-center">
        <div className="digital-timer-container">
          <div className="timer-display-container">
            <div className="elapsed-time-container">
              <p className="timer-state change-font-family">
                {state.isTimerRunning
                  ? state.alarmTimerStarted
                    ? "Alarm Delay"
                    : "Date time"
                  : "Paused"}
              </p>
              <h1
                className={`elapsed-time ${
                  state.alarmTimerStarted && "text-[#DB3002]"
                }`}
              >
                {this.getElapsedSecondsInTimeFormat()}
              </h1>
            </div>
          </div>
          <div className="w-full mx-auto flex flex-col justify-center items-center mt-3">
            <div className="w-full mx-auto flex flex-row justify-around items-center">
              <div>
                <span className="font-bold text-[20px] text-[#D9D9D9] change-font-family">
                  Group
                </span>
              </div>
              <div>
                <span className="font-bold text-[20px] text-[#D9D9D9] change-font-family">
                  {state?.groupData?.name}
                </span>
              </div>
            </div>
            <div className="w-full mx-auto flex flex-row justify-around items-center mt-3">
              <div>
                <span className="font-bold text-[20px] text-[#D9D9D9] change-font-family">
                  Delay
                </span>
              </div>
              <div>
                <span className="font-bold text-[20px] text-[#D9D9D9] change-font-family">
                  {state?.alarmData?.alarmDelay}:00
                  <span className="font-normal text-[14px] text-[#D9D9D9] change-font-family">
                    min
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="controls-container">
            {this.renderTimerController()}
          </div>
          {(state.alarmTimerStarted || state.pauseMode) && (
            <>
              <div className="mt-3">
                <OtpInput
                  value={state.codeInput}
                  onChange={(e) => this.setState({ codeInput: e })}
                  numInputs={3}
                  renderSeparator={<span> </span>}
                  renderInput={(props) => (
                    <input
                      {...props}
                      className={`flex-1 mr-2 border-2 bg-[#d5d6e0] h-14 w-9 text-center form-control otp_input bg-transparent text-[30px] text-white "
                  type="text`}
                      // style={{ borderColor: errorMessage.otp ? `#ef4444` : "#0247FF" }}
                    />
                  )}
                />
              </div>
              <div className="mt-3">
                <Button
                  onClick={() => this.handleActivateAlarm()}
                  text="Enter"
                  className="bg-[#05B7FD] rounded-[10px] font-bold text-[30px] h-[41px] flex items-center justify-center change-font-family p-3"
                  size="41px"
                />
              </div>
            </>
          )}
          {state.freeze && (
            <p className="text-white mt-8">This date is completed</p>
          )}
        </div>
      </div>
    );
  }
}

function DigitalTimerFunctional() {
  const params = useParams();
  const navigate = useNavigate();

  const [location, setLocation] = useState(null);

  const UserDetails = useSelector((state) => state?.Auth?.Auth?.data?.user);

  console.log(UserDetails, " <=== UserDetails");

  const fetchLocation = async () => {
    if (navigator.geolocation) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            success(position);
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            resolve({ latitude, longitude });
          },
          () => {
            error();
            resolve({});
          }
        );
      });
    } else {
      console.log("Geolocation not supported");
      return Promise.resolve({});
    }
  };

  useEffect(() => {
    if (!UserDetails) {
      navigate("/login");
      return;
    }
    if (navigator.geolocation) {
      setInterval(() => {
        navigator.geolocation.getCurrentPosition(success, error);
      }, 30000);
    } else {
      console.log("Geolocation not supported");
    }
  }, []);

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLocation({ latitude, longitude });
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  }

  function error() {
    console.log("Unable to retrieve your location");
  }

  return (
    <DigitalTimer
      params={params}
      navigate={navigate}
      location={location}
      fetchLocation={fetchLocation}
      UserDetails={UserDetails}
    />
  );
}

export default DigitalTimerFunctional;
