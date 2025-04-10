import dayjs from "dayjs";
import Subscription from "../models/subscriptions.models.js";
import { createRequire } from "module";
import { sendReminderEmail } from "../utils/send-email.js";

const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");

const REMINDERS = [
    { label: "7 days before reminder", daysBefore: 7 },
    { label: "5 days before reminder", daysBefore: 5 },
    { label: "2 days before reminder", daysBefore: 2 },
    { label: "1 day before reminder", daysBefore: 1 },
    { label: "Final day reminder", daysBefore: 0 },
];

export const sendReminders = serve(async (context) => {
    console.log("Running Send");
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if (!subscription || subscription.status !== "active") return;

    const renewalDate = dayjs(subscription.renewalDate);

    if (renewalDate.isBefore(dayjs())) {
        console.log(
            `Renewal date has passed for subscription ${subscriptionId}. Stopping Workflow`
        );
        return;
    }

    for (const reminder of REMINDERS) {
        const reminderDate = renewalDate.subtract(reminder.daysBefore, "day");

        if (reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, reminder.label, reminderDate);
        }

        if (dayjs().isSame(reminderDate, "day")) {
            await triggerReminder(context, reminder.label, subscription);
        }
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run("get subscription", async () => {
        return Subscription.findById(subscriptionId).populate("user", "name email");
    });
};

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label, subscription) => {
    console.log("Running trigger");

    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder`);

        console.log("User data:", subscription.user);

        const email = subscription?.user?.email;

        if (!email || typeof email !== "string") {
            console.error(
                `Invalid or missing email for subscription ${subscription._id}`
            );
            return;
        }

        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription: subscription,
        });
    });
};
