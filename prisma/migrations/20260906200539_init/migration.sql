-- CreateEnum
CREATE TYPE "Weekday" AS ENUM ('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN');

-- CreateEnum
CREATE TYPE "NoteColor" AS ENUM ('YELLOW', 'PINK', 'EMERALD', 'SKY', 'PURPLE');

-- CreateEnum
CREATE TYPE "GroceryCategory" AS ENUM ('PRODUCE', 'DAIRY_EGGS', 'BAKERY', 'PANTRY', 'HOUSEHOLD', 'SNACKS_DRINKS');

-- CreateEnum
CREATE TYPE "WasteType" AS ENUM ('GENERAL', 'ORGANIC', 'PLASTICS_METALS', 'PAPER_CARDBOARD', 'GLASS', 'HAZARDOUS', 'NONE');

-- CreateTable
CREATE TABLE "Household" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subdomain" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "dinnerTonight" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Household_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Child" (
    "id" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimetableSlot" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "weekday" "Weekday" NOT NULL,
    "order" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "subject" TEXT NOT NULL,

    CONSTRAINT "TimetableSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "weekdays" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Homework" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Homework_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StickyNote" (
    "id" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "color" "NoteColor" NOT NULL DEFAULT 'YELLOW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StickyNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Todo" (
    "id" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroceryItem" (
    "id" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "GroceryCategory" NOT NULL,
    "quantity" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroceryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrashScheduleEntry" (
    "id" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "weekday" "Weekday" NOT NULL,
    "wasteType" "WasteType" NOT NULL,

    CONSTRAINT "TrashScheduleEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrashGuideItem" (
    "id" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "wasteType" "WasteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrashGuideItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Household_subdomain_key" ON "Household"("subdomain");

-- CreateIndex
CREATE INDEX "Child_householdId_idx" ON "Child"("householdId");

-- CreateIndex
CREATE INDEX "TimetableSlot_childId_idx" ON "TimetableSlot"("childId");

-- CreateIndex
CREATE INDEX "Activity_childId_idx" ON "Activity"("childId");

-- CreateIndex
CREATE INDEX "Homework_childId_idx" ON "Homework"("childId");

-- CreateIndex
CREATE INDEX "StickyNote_householdId_idx" ON "StickyNote"("householdId");

-- CreateIndex
CREATE INDEX "Todo_householdId_idx" ON "Todo"("householdId");

-- CreateIndex
CREATE INDEX "GroceryItem_householdId_idx" ON "GroceryItem"("householdId");

-- CreateIndex
CREATE UNIQUE INDEX "TrashScheduleEntry_householdId_weekday_key" ON "TrashScheduleEntry"("householdId", "weekday");

-- CreateIndex
CREATE INDEX "TrashGuideItem_householdId_idx" ON "TrashGuideItem"("householdId");

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableSlot" ADD CONSTRAINT "TimetableSlot_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StickyNote" ADD CONSTRAINT "StickyNote_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroceryItem" ADD CONSTRAINT "GroceryItem_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrashScheduleEntry" ADD CONSTRAINT "TrashScheduleEntry_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrashGuideItem" ADD CONSTRAINT "TrashGuideItem_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "Household"("id") ON DELETE CASCADE ON UPDATE CASCADE;
