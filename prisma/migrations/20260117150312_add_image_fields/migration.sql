-- AlterTable
ALTER TABLE "blog_posts" ADD COLUMN     "coverImage" TEXT;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
