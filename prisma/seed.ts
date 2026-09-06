import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../lib/generated/prisma/client";

const db = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  }),
});

async function main() {
  await db.household.deleteMany();

  const household = await db.household.create({
    data: {
      name: "The Smith Family",
      dinnerTonight: "Homemade Tacos & Guacamole 🌮",
      todos: {
        create: [
          { text: "Pick up dry cleaning by 5 PM", completed: false },
          {
            text: "Sign Leo's permission slip for museum trip",
            completed: true,
          },
          { text: "Take out recycling bins tonight", completed: false },
          { text: "Buy cat food", completed: false },
        ],
      },
      notes: {
        create: [
          {
            author: "Mom 💖",
            content:
              "Remember piano lessons start 15 mins earlier this Thursday!",
            color: "PINK",
          },
          {
            author: "Dad 👨‍🍳",
            content:
              "Tonight's dinner is tacos! Guac ingredients are in the fridge.",
            color: "YELLOW",
          },
          {
            author: "Leo 👦",
            content: "Can we have pizza on Friday night? Pleaseee 🍕",
            color: "SKY",
          },
          {
            author: "Family Rules",
            content:
              "Turn off lights when leaving rooms & feed Buster at 6 PM!",
            color: "EMERALD",
          },
        ],
      },
      groceryItems: {
        create: [
          {
            name: "Organic Whole Milk",
            category: "DAIRY_EGGS",
            quantity: "2 Gallons",
            completed: false,
          },
          {
            name: "Avocados",
            category: "PRODUCE",
            quantity: "4 ripe",
            completed: false,
          },
          {
            name: "Sourdough Bread",
            category: "BAKERY",
            quantity: "1 loaf",
            completed: true,
          },
          {
            name: "Dishwasher Tablets",
            category: "HOUSEHOLD",
            quantity: "1 pack",
            completed: false,
          },
          {
            name: "Cheddar Cheese",
            category: "DAIRY_EGGS",
            quantity: "1 block",
            completed: false,
          },
          {
            name: "Cherry Tomatoes",
            category: "PRODUCE",
            quantity: "1 box",
            completed: false,
          },
          {
            name: "Coffee Beans",
            category: "PANTRY",
            quantity: "Medium roast",
            completed: true,
          },
        ],
      },
      trashSchedule: {
        create: [
          { weekday: "MON", wasteType: "GENERAL" },
          { weekday: "TUE", wasteType: "ORGANIC" },
          { weekday: "WED", wasteType: "PLASTICS_METALS" },
          { weekday: "THU", wasteType: "PAPER_CARDBOARD" },
          { weekday: "FRI", wasteType: "GLASS" },
          { weekday: "SAT", wasteType: "NONE" },
          { weekday: "SUN", wasteType: "NONE" },
        ],
      },
      trashGuideItems: {
        create: [
          { item: "Pizza Box (Greasy)", wasteType: "GENERAL" },
          { item: "Cardboard Box", wasteType: "PAPER_CARDBOARD" },
          { item: "Plastic Milk Jug", wasteType: "PLASTICS_METALS" },
          { item: "Banana Peel", wasteType: "ORGANIC" },
          { item: "Wine Bottle", wasteType: "GLASS" },
          { item: "Aluminum Cans", wasteType: "PLASTICS_METALS" },
          { item: "Old Batteries", wasteType: "HAZARDOUS" },
          { item: "Light Bulbs", wasteType: "HAZARDOUS" },
        ],
      },
    },
  });

  await db.child.create({
    data: {
      householdId: household.id,
      name: "Leo",
      grade: "Grade 5",
      order: 0,
      timetableSlots: {
        create: [
          {
            weekday: "MON",
            order: 1,
            startTime: "08:00",
            endTime: "08:45",
            subject: "Math",
          },
          {
            weekday: "TUE",
            order: 1,
            startTime: "08:00",
            endTime: "08:45",
            subject: "Science",
          },
          {
            weekday: "WED",
            order: 1,
            startTime: "08:00",
            endTime: "08:45",
            subject: "English",
          },
          {
            weekday: "THU",
            order: 1,
            startTime: "08:00",
            endTime: "08:45",
            subject: "History",
          },
          {
            weekday: "FRI",
            order: 1,
            startTime: "08:00",
            endTime: "08:45",
            subject: "Math",
          },

          {
            weekday: "MON",
            order: 2,
            startTime: "08:50",
            endTime: "09:35",
            subject: "English",
          },
          {
            weekday: "TUE",
            order: 2,
            startTime: "08:50",
            endTime: "09:35",
            subject: "Math",
          },
          {
            weekday: "WED",
            order: 2,
            startTime: "08:50",
            endTime: "09:35",
            subject: "Science",
          },
          {
            weekday: "THU",
            order: 2,
            startTime: "08:50",
            endTime: "09:35",
            subject: "Geography",
          },
          {
            weekday: "FRI",
            order: 2,
            startTime: "08:50",
            endTime: "09:35",
            subject: "Art",
          },

          {
            weekday: "MON",
            order: 3,
            startTime: "09:50",
            endTime: "10:35",
            subject: "Science",
          },
          {
            weekday: "TUE",
            order: 3,
            startTime: "09:50",
            endTime: "10:35",
            subject: "Art",
          },
          {
            weekday: "WED",
            order: 3,
            startTime: "09:50",
            endTime: "10:35",
            subject: "Math",
          },
          {
            weekday: "THU",
            order: 3,
            startTime: "09:50",
            endTime: "10:35",
            subject: "Math",
          },
          {
            weekday: "FRI",
            order: 3,
            startTime: "09:50",
            endTime: "10:35",
            subject: "PE",
          },

          {
            weekday: "MON",
            order: 4,
            startTime: "10:40",
            endTime: "11:25",
            subject: "History",
          },
          {
            weekday: "TUE",
            order: 4,
            startTime: "10:40",
            endTime: "11:25",
            subject: "PE",
          },
          {
            weekday: "WED",
            order: 4,
            startTime: "10:40",
            endTime: "11:25",
            subject: "Music",
          },
          {
            weekday: "THU",
            order: 4,
            startTime: "10:40",
            endTime: "11:25",
            subject: "English",
          },
          {
            weekday: "FRI",
            order: 4,
            startTime: "10:40",
            endTime: "11:25",
            subject: "Science",
          },

          {
            weekday: "MON",
            order: 5,
            startTime: "11:35",
            endTime: "12:20",
            subject: "PE",
          },
          {
            weekday: "TUE",
            order: 5,
            startTime: "11:35",
            endTime: "12:20",
            subject: "English",
          },
          {
            weekday: "WED",
            order: 5,
            startTime: "11:35",
            endTime: "12:20",
            subject: "Art",
          },
          {
            weekday: "THU",
            order: 5,
            startTime: "11:35",
            endTime: "12:20",
            subject: "Science",
          },
          {
            weekday: "FRI",
            order: 5,
            startTime: "11:35",
            endTime: "12:20",
            subject: "Library",
          },
        ],
      },
      activities: {
        create: [
          {
            name: "Soccer Practice",
            weekdays: "TUE,THU",
            startTime: "15:30",
            endTime: "17:00",
            location: "School Pitch",
          },
          {
            name: "Piano Lessons",
            weekdays: "WED",
            startTime: "14:00",
            endTime: "15:00",
            location: "Music Room B",
          },
        ],
      },
      homework: {
        create: [
          { task: "Science project model due Thursday", done: false },
          { task: "Read chapters 4 & 5 of Treasure Island", done: true },
          { task: "Math worksheet page 42", done: false },
        ],
      },
    },
  });

  await db.child.create({
    data: {
      householdId: household.id,
      name: "Mia",
      grade: "Grade 3",
      order: 1,
      timetableSlots: {
        create: [
          {
            weekday: "MON",
            order: 1,
            startTime: "08:00",
            endTime: "08:45",
            subject: "Reading",
          },
          {
            weekday: "TUE",
            order: 1,
            startTime: "08:00",
            endTime: "08:45",
            subject: "Math",
          },
          {
            weekday: "WED",
            order: 1,
            startTime: "08:00",
            endTime: "08:45",
            subject: "Art",
          },
          {
            weekday: "THU",
            order: 1,
            startTime: "08:00",
            endTime: "08:45",
            subject: "Science",
          },
          {
            weekday: "FRI",
            order: 1,
            startTime: "08:00",
            endTime: "08:45",
            subject: "Reading",
          },

          {
            weekday: "MON",
            order: 2,
            startTime: "08:50",
            endTime: "09:35",
            subject: "Math",
          },
          {
            weekday: "TUE",
            order: 2,
            startTime: "08:50",
            endTime: "09:35",
            subject: "Reading",
          },
          {
            weekday: "WED",
            order: 2,
            startTime: "08:50",
            endTime: "09:35",
            subject: "Math",
          },
          {
            weekday: "THU",
            order: 2,
            startTime: "08:50",
            endTime: "09:35",
            subject: "Music",
          },
          {
            weekday: "FRI",
            order: 2,
            startTime: "08:50",
            endTime: "09:35",
            subject: "Math",
          },

          {
            weekday: "MON",
            order: 3,
            startTime: "09:50",
            endTime: "10:35",
            subject: "Art",
          },
          {
            weekday: "TUE",
            order: 3,
            startTime: "09:50",
            endTime: "10:35",
            subject: "Science",
          },
          {
            weekday: "WED",
            order: 3,
            startTime: "09:50",
            endTime: "10:35",
            subject: "Reading",
          },
          {
            weekday: "THU",
            order: 3,
            startTime: "09:50",
            endTime: "10:35",
            subject: "Math",
          },
          {
            weekday: "FRI",
            order: 3,
            startTime: "09:50",
            endTime: "10:35",
            subject: "PE",
          },

          {
            weekday: "MON",
            order: 4,
            startTime: "10:40",
            endTime: "11:25",
            subject: "Music",
          },
          {
            weekday: "TUE",
            order: 4,
            startTime: "10:40",
            endTime: "11:25",
            subject: "PE",
          },
          {
            weekday: "WED",
            order: 4,
            startTime: "10:40",
            endTime: "11:25",
            subject: "Library",
          },
          {
            weekday: "THU",
            order: 4,
            startTime: "10:40",
            endTime: "11:25",
            subject: "Reading",
          },
          {
            weekday: "FRI",
            order: 4,
            startTime: "10:40",
            endTime: "11:25",
            subject: "Art",
          },

          {
            weekday: "MON",
            order: 5,
            startTime: "11:35",
            endTime: "12:20",
            subject: "PE",
          },
          {
            weekday: "TUE",
            order: 5,
            startTime: "11:35",
            endTime: "12:20",
            subject: "Art",
          },
          {
            weekday: "WED",
            order: 5,
            startTime: "11:35",
            endTime: "12:20",
            subject: "Science",
          },
          {
            weekday: "THU",
            order: 5,
            startTime: "11:35",
            endTime: "12:20",
            subject: "PE",
          },
          {
            weekday: "FRI",
            order: 5,
            startTime: "11:35",
            endTime: "12:20",
            subject: "Storytelling",
          },
        ],
      },
      activities: {
        create: [
          {
            name: "Ballet Class",
            weekdays: "MON",
            startTime: "16:00",
            endTime: "17:00",
            location: "Community Center",
          },
          {
            name: "Little Swimmers",
            weekdays: "SAT",
            startTime: "10:00",
            endTime: "10:45",
            location: "City Pool",
          },
        ],
      },
      homework: {
        create: [
          { task: "Spelling words practice (List #7)", done: false },
          { task: "Draw family portrait for Art class", done: true },
        ],
      },
    },
  });

  console.log(`Seeded household "${household.name}" (${household.id})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
