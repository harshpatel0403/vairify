import moment from "moment";

export default function organizeNotificationsByDay(notifications) {
    const organizedNotifications = [];
    let reducedCount = 0;

    notifications?.forEach((notification) => {
        const createdAt = moment(notification.createdAt);
        const dateKey = createdAt.format("YYYY-MM-DD");

        let existingEntry = organizedNotifications.find((entry) => entry.date === dateKey);
        if (!existingEntry) {
            existingEntry = {
                date: dateKey,
                notifications: [],
            };
            organizedNotifications.push(existingEntry);
        }

        const reduceNotification = (type) => {
            const senderId = notification?.senderId?._id;

            const existingNotification = existingEntry.notifications.find(
                (n) => n.type === type && n.senderId?._id === senderId
            );

            // if (
            //     !existingNotification ||
            //     moment(notification.createdAt).isAfter(moment(existingNotification.createdAt))
            // ) {
            //     if (existingNotification) {
            //         if (!existingNotification.read) {
            //             reducedCount++;
            //         }
            //         existingEntry.notifications = existingEntry.notifications.filter(
            //             (n) => !(n.type === type && n.senderId?._id === senderId)
            //         );
            //     }
            //     existingEntry.notifications.push(notification);
            // }
            // else {
            //     reducedCount++;
            // }
            if (!existingNotification || moment(notification.createdAt).isAfter(moment(existingNotification.createdAt))) {
                if (existingNotification) {
                    const isReplacingUnreadWithRead =
                        !existingNotification.read && notification.read;
                    if (isReplacingUnreadWithRead) {
                        reducedCount++;
                    }
                    existingEntry.notifications = existingEntry.notifications.filter(
                        (n) => !(n.type === type && n.senderId?._id === senderId)
                    );
                }
                existingEntry.notifications.push(notification);
            } else {
                // Only increase reducedCount if the existing one is unread
                if (!notification.read) {
                    reducedCount++;
                }
            }

        };

        if (notification.type === "CHAT") {
            reduceNotification("CHAT");
        }
        else {
            existingEntry.notifications.push(notification);
        }
    });

    organizedNotifications.forEach((entry) => {
        entry.notifications.sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)));
    });

    organizedNotifications.sort((a, b) => {
        if (a.date === moment().format("YYYY-MM-DD")) return -1; // Today comes first
        if (b.date === moment().format("YYYY-MM-DD")) return 1;  // Today comes first
        return moment(b.date).diff(moment(a.date));
    });

    return { organizedNotifications, reducedCount };
}