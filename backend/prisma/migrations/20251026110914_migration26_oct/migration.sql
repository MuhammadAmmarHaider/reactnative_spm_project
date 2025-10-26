-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isOnboarded" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCategoryPreference" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "UserCategoryPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserCategoryPreference_userId_categoryId_key" ON "UserCategoryPreference"("userId", "categoryId");

-- AddForeignKey
ALTER TABLE "UserCategoryPreference" ADD CONSTRAINT "UserCategoryPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCategoryPreference" ADD CONSTRAINT "UserCategoryPreference_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_category_fkey" FOREIGN KEY ("category") REFERENCES "Category"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
