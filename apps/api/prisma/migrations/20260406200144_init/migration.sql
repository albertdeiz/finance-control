-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "bank" TEXT,
    "color" TEXT,
    "cutoffDay" INTEGER NOT NULL,
    "paymentDueDay" INTEGER NOT NULL,
    "creditLimit" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "purchaseDate" DATETIME NOT NULL,
    "cardId" TEXT NOT NULL,
    "installmentCount" INTEGER,
    "endDate" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Expense_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Charge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expenseId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "billingYear" INTEGER NOT NULL,
    "billingMonth" INTEGER NOT NULL,
    "installmentNo" INTEGER,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paidAt" DATETIME,
    CONSTRAINT "Charge_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Charge_billingYear_billingMonth_idx" ON "Charge"("billingYear", "billingMonth");

-- CreateIndex
CREATE UNIQUE INDEX "Charge_expenseId_billingYear_billingMonth_key" ON "Charge"("expenseId", "billingYear", "billingMonth");
