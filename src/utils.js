import moment from "moment";

export function generateTimeSlots(durationMinutes, startHour, endHour, bufferMinutes, blackOutPeriod, bookedSlots) {
    const start = moment(startHour || '12:00 AM', 'hh:mm A');
    const end = moment(endHour || '11:59 PM', 'hh:mm A');
    const timeSlots = [];

    // Extracting date and month from selectedDate in blackOutPeriod
    const blackoutDate = moment();
    const blackoutDay = blackoutDate.date();
    const blackoutMonth = blackoutDate.month();
    
    
    if (blackOutPeriod?.selectedDate) {
        const selectedDate = moment(blackOutPeriod?.selectedDate);
        const selectedDay = selectedDate.date();
        const selectedMonth = selectedDate.month();
        start.set('date', selectedDay)
        start.set('month', selectedMonth)
        end.set('date', selectedDay)
        end.set('month', selectedMonth)
    }

    console.log(start, end, start.isBefore(end), "Slot date")
    while (start.isBefore(end)) {
        const slotStartDate = moment(start);
        const slotStart = start.format('h:mma');
        const slotEndDate = start.add(durationMinutes, 'minutes');
        if (slotEndDate.isAfter(end)) {
            break;
        }
        
        const currentTime = moment();
        const slotEnd = slotEndDate.format('h:mma');

        // Set the start time of the blackout period using extracted date and month
        const blackoutStart = moment()
            .set('date', blackoutDay)
            .set('month', blackoutMonth)
            .set('hours', currentTime.hours())
            .set('minutes', currentTime.minutes())
            .add(parseInt(blackOutPeriod?.hr) || 0, 'hour')
            .add(parseInt(blackOutPeriod?.min) || 0, 'minute');


        let isBooked = false;

        // Check if the slot overlaps with any booked slot
        if (bookedSlots) {
            for (const bookedSlot of bookedSlots) {
                const bookedStart = moment(bookedSlot.startDateTime);
                const bookedEnd = moment(bookedSlot.endDateTime);

                if (slotStartDate.isBetween(bookedStart, bookedEnd) || slotEndDate.isBetween(bookedStart, bookedEnd) || slotEndDate.isSame(bookedEnd) || bookedStart.isBetween(slotStartDate, slotEndDate) || bookedEnd.isBetween(slotStartDate, slotEndDate)) {
                    isBooked = true;
                    break;
                }
            }
        }

        if (!isBooked && slotStartDate.isAfter(blackoutStart)) {
            timeSlots.push(`${slotStart} - ${slotEnd}`);
        } else {
            start.add(bufferMinutes, 'minutes'); // Add buffer time after each slot
        }


    }
    console.log(timeSlots, "time slote is this")

    return timeSlots;
}

export function addMinutesToTime(inputTime, minutesToAdd) {
    const inputMoment = moment(inputTime, 'h:mma');
    const resultMoment = inputMoment.add(minutesToAdd, 'minutes');
    return resultMoment.format('h:mma');
}

// Function to combine Date object and time
export function combineDateTime(date, time) {
    // Parse the time string using Moment.js
    const parsedTime = moment(time, 'h:mma');

    // Extract the hours and minutes from the parsed time
    const hours = parsedTime.hours();
    const minutes = parsedTime.minutes();

    // Set the time for the Date object
    let selectedDate = moment(date)
    selectedDate.set('hours', hours)
    selectedDate.set('minutes', minutes)
    // Return the combined Date object with the updated time
    return selectedDate.toDate();
}

export function calculateTotalMinutes(bufferTime) {
    const totalMinutes = moment.duration({
        days: parseInt(bufferTime?.day || 0),
        hours: parseInt(bufferTime?.hr || 0),
        minutes: parseInt(bufferTime?.min || 0)
    }).asMinutes();
    return totalMinutes || 0;
}

export function getDayInWordFromIndex(date) {
    let dayIndex = moment(date).day();
    if (dayIndex == 0) {
        return "Su"
    } else if (dayIndex == 1) {
        return "Mo"
    } else if (dayIndex == 2) {
        return "Tu"
    } else if (dayIndex == 3) {
        return "We"
    } else if (dayIndex == 4) {
        return "Th"
    } else if (dayIndex == 5) {
        return "Fr"
    } else if (dayIndex == 6) {
        return "Sa"
    }
}

export const fetchLocation = async () => {
    if (navigator.geolocation) {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
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