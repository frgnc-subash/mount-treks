-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "duration" TEXT NOT NULL,
    "altitude" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "idealFor" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "pricing" JSONB NOT NULL,
    "itinerary" JSONB NOT NULL,
    "includes" JSONB NOT NULL,
    "excludes" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Destination" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "elevation" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "desc" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "bestSeason" TEXT NOT NULL,
    "permits" TEXT NOT NULL,
    "mapCenter" JSONB NOT NULL,
    "mapZoom" INTEGER NOT NULL,
    "trailCoordinates" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Destination_pkey" PRIMARY KEY ("id")
);
