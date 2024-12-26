import axios from "axios";
import requests from "./httpService";
import moment from "moment";

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[arr.length - 1]), 
      n = bstr.length, 
      u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
}

const DateGuardService = {
  dataURLtoFile,
  setupCodes(userId, body) {
    /*
            request url params 
            userId
            request body
            {
                "decoyCode": "111",
                "disarmCode": "222",
            }
        */
    return requests.post(`/dateguardcodes/create/${userId}`, body);
  },
  verifyUserFace(userId, body) {
    // /verify-face/:userId

    return requests.post(`/users/verify-face/${userId}`, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  setupCodesPassword(userId, body, email) {
    /*
            request url params 
            userId
            request body
            {
                "decoyCode": "111",
                "disarmCode": "222",
                "password": "secret"
            }
        */
    return requests
      .post("/users/check-password", {
        email,
        password: body.password,
      })
      .then((res) => {
        if (res.message === "Password is correct") {
          return this.setupCodes(userId, body);
        } else {
          return Promise.reject(new Error("Password is incorrect"));
        }
      });
  },
  createGroup(userId, body) {
    /*
            request url params 
            userId
            request body
            {
                "name": "test",
            }
        */
    return requests.post(`/dateguardgroup/create/${userId}`, body);
  },
  getGroups(userId) {
    /*
            sample response
            [
                {
                    "id": 1,
                    "name": "Los",
                    "members": [1, 2],
                    "userId": "userId"
                },
                {
                    "id": 2,
                    "name": "Family",
                    "members": [3, 2],
                    "userId": "userId"
                },
                {
                    "id": 3,
                    "name": "Atlanta",
                    "members": [1],
                    "userId": "userId"
                }
            ]
        */
    return requests.get(`/dateguardgroup/all/${userId}`);
  },
  getSingleGroup(groupId) {
    /*
            request url params 
            groupId
        */
    return requests.get(`/dateguardgroup/group/${groupId}`);
  },
  updateGroup(groupId, body) {
    /*
            request url params
            groupId
            request body
            {
                "groupName": "updated name",
                "members": [ updated list of member ids ]
            }
        */
    return requests.put(`/dateguardgroup/group/update/${groupId}`, body);
  },
  inviteToGroup(groupId, body) {
    /*
            request url params
            groupId
            request body
            {
                "memberId": "id of member from members list",
            }
        */
    return requests.post(`/dateguardgroup/invite/${groupId}`, body);
  },
  removeFromGroup(groupId, body) {
    /*
            request url params
            groupId
            request body
            {
                "memberId": "id of member from members list",
            }
        */
    return requests.post(`/dateguardgroup/remove/${groupId}`, body);
  },
  getMembers(userId) {
    /*
            request url params
            userId
        */
    return requests.get(`/dateguardmember/${userId}`);
  },
  createMember(body, userId) {
    // body = {
    //     ...body
    // }
    return requests.post(`/dateguardmember/add/${userId}`, body);
  },
  getAppointments(userId, query='') {
    return requests.get(`/varidate/appointment/upcoming/${userId}${query}`);
    return new Promise((resolve) => {
      return resolve([
        {
          id: "6512f4985eec8ac9968afd09",
          date: moment(), //moment("07/09/2023 22:00:00", "DD/MM/YYYY HH:mm:ss"),
          duration: 90,
          person: {
            name: "James Fuji",
          },
        },
        {
          id: "6512f4985eec8ac9968afd00",
          date: moment(), //moment("02/12/2023 12:00:00", "DD/MM/YYYY HH:mm:ss"),
          duration: 30,
          person: {
            name: "David Pol",
          },
        },
      ]);
    });
  },

  getAppointment(appointmentId) {
    return requests.get(`/varidate/appointment/${appointmentId}`);
    return new Promise((resolve) => {
      return resolve(
        [
          {
            id: "6512f4985eec8ac9968afd09",
            date: moment(),//moment("05/10/2023 22:00:00", "DD/MM/YYYY HH:mm:ss"),
            duration: 90,
            service: "Escort",
            extras: [
              {
                name: "MSOG",
                price: "50$",
              },
              {
                name: "BBBJ",
                price: "50$",
              },
            ],
            outcall: "1439 Inverness Miami FI 34598",
            gender: "Female",
            vairifyId: "ID#658H39P",
            validate: "0046893490",
            person: {
              name: "james Fuji",
            },
          },
          {
            id: "6512f4985eec8ac9968afd00",
            date: moment(), //moment("02/12/2023 12:00:00", "DD/MM/YYYY HH:mm:ss"),
            duration: 30,
            service: "Escort",
            extras: [
              {
                name: "MSOG",
                price: "50$",
              },
              {
                name: "BBBJ",
                price: "50$",
              },
            ],
            outcall: "1439 Inverness Miami FI 34598",
            gender: "Female",
            vairifyId: "ID#658H39P",
            validate: "0046893490",
            person: {
              name: "David Pol",
            },
          },
        ].find((appointment) => appointment.id === appointmentId)
      );
    });
  },

  setAlarm(body) {
    /*
      {
        "groupId": "6512f4985eec8ac9968afd08",
        "appointmentId": "6512f4985eec8ac9968afd09",
        "hours": "12",
        "minutes": "40",
        "meridiem": "AM",
        "alarmDelay": 10
      }
    */
    return requests.post(`/dateguardgroup/set-alarm`, body);
  },
  getAlarm(groupId, appointmentId, alarmId = "") {
    return requests.get(
      `/dateguardgroup/get-alarm?groupId=${groupId}&appointmentId=${appointmentId}&alarmId=${alarmId}`
    );
  },
  uploadProof(body) {
    return requests.post(`/dateguardgroup/upload-proof`, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  startTimer(body) {
    return requests.post(`/dateguardgroup/start-timer`, body);
  },
  activateAlarm(body) {
    return requests.post(`/dateguardgroup/disarm-alarm`, body);
  },
  verifyInvitationCode(body) {
    return requests.post(`/dateguardgroup/verify`, body);
  },
};

export default DateGuardService;
