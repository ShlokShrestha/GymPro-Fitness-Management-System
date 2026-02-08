import cron from "node-cron";
import prisma from "../../prisma/prismaClient";

//This job runs every day at midnight and expires memberships whose endDate has passed
export const scheduleExpireMemberships = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running expire memberships job...");
    const now = new Date();
    await prisma.membership.updateMany({
      where: {
        status: "ACTIVE",
        endDate: { lt: now },
      },
      data: { status: "EXPIRED" },
    });
  });
};
