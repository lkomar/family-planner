import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentHousehold } from "@/lib/household";
import { parseWeekdayList } from "@/lib/weekdays";
import type { Weekday } from "@/lib/generated/prisma/enums";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const day = searchParams.get("day") as Weekday | null;
    const childrenIdsParam = searchParams.get("childrenIds");

    if (!day || !childrenIdsParam) {
      return NextResponse.json(
        { error: "Missing day or childrenIds parameter" },
        { status: 400 },
      );
    }

    const household = await getCurrentHousehold();
    const childrenIds = childrenIdsParam.split(",").filter(Boolean);

    // Fetch timetable slots for the selected day
    const timetable = await db.timetableSlot.findMany({
      where: {
        childId: { in: childrenIds },
        weekday: day,
      },
      include: {
        child: {
          select: { name: true },
        },
      },
      orderBy: { order: "asc" },
    });

    // Fetch activities for the selected day
    // Activities have a comma-separated list of weekdays, so we need to filter in memory
    const allActivities = await db.activity.findMany({
      where: {
        childId: { in: childrenIds },
      },
      include: {
        child: {
          select: { name: true },
        },
      },
    });

    // Filter activities by the selected day
    const activities = allActivities.filter((activity) => {
      const weekdays = parseWeekdayList(activity.weekdays);
      return weekdays.includes(day);
    });

    return NextResponse.json({
      activities: activities.map((activity) => ({
        id: activity.id,
        name: activity.name,
        startTime: activity.startTime,
        endTime: activity.endTime,
        location: activity.location,
        childName: activity.child.name,
      })),
      timetable: timetable.map((slot) => ({
        id: slot.id,
        subject: slot.subject,
        startTime: slot.startTime,
        endTime: slot.endTime,
        order: slot.order,
        childName: slot.child.name,
      })),
    });
  } catch (error) {
    console.error("Error fetching day activities:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
