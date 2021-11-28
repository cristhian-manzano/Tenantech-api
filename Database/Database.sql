CREATE TABLE "Roles" (
	"id" SERIAL NOT NULL,
	"name" VARCHAR(75) UNIQUE NOT NULL,
	CONSTRAINT "Roles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Users" (
	"id" BIGSERIAL NOT NULL,
	"email" VARCHAR(75) UNIQUE NOT NULL,
	"password" VARCHAR(255) NOT NULL,
	"idNumber" VARCHAR(25) UNIQUE NULL,
	"firstName" VARCHAR(100) NULL,
	"lastName" VARCHAR(100) NULL,
	"phone" VARCHAR(25) NULL,
	"details" JSONB NULL DEFAULT '{}'::JSONB,
	"createdAt" TIMESTAMPTZ NULL,
	"updatedAt" TIMESTAMPTZ NULL,	
	"idRole" INTEGER NOT NULL,
	CONSTRAINT "Users_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "Users_idRole_fkey" FOREIGN KEY ("idRole") REFERENCES "Roles"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Provinces" (
	"id" SERIAL NOT NULL,
	"name" VARCHAR(100) NOT NULL,
	CONSTRAINT "Provinces_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Cantons" (
	"id" SERIAL NOT NULL,
	"name" VARCHAR(100) NOT NULL,
	"idProvince" INTEGER NOT NULL,
	CONSTRAINT "Cantons_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "Cantons_idProvince_fkey" FOREIGN KEY ("idProvince") REFERENCES "Provinces"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "MeterServices" (
	"id" BIGSERIAL NOT NULL,
	"lightMeter" VARCHAR(25) NULL,
	"waterMeter" VARCHAR(25) NULL,
	CONSTRAINT "MeterServices_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Properties" (
	"id" BIGSERIAL NOT NULL,
	"name" VARCHAR(100) NULL,
	"apartmentsNumber" INTEGER NULL,
	"totalFloors" INTEGER NULL,
	"address" VARCHAR(255) NULL,
	"zipCode" VARCHAR(50) NULL,
	"idCanton" INTEGER NOT NULL,
	"idOwner" INTEGER NOT NULL,
	"idMeterServices" BIGINT NULL,
	CONSTRAINT "Properties_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "Properties_idCanton_fkey" FOREIGN KEY ("idCanton") REFERENCES "Cantons"("id") ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "Properties_idOwner_fkey" FOREIGN KEY ("idOwner") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "Properties_idMeterServices_fkey" FOREIGN KEY ("idMeterServices") REFERENCES "MeterServices"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Apartments" (
	"id" BIGSERIAL NOT NULL,
	"code" VARCHAR(100) NULL,
	"width" NUMERIC(8,2) NULL,
	"length" NUMERIC(8,2) NULL,
	"floor" INTEGER NULL,
	"monthlyPrice" NUMERIC(8,2) NULL,
	"bedroomCount" INTEGER NULL,
	"bathroomCount" INTEGER NULL,
	"kitchenCount" INTEGER NULL,
	"available" BOOLEAN NULL,
	"lightIncluded"  BOOLEAN NULL,
	"waterIncluded"  BOOLEAN NULL,
	"internetIncluded"  BOOLEAN NULL,
	"furnished" BOOLEAN NULL,
	"idProperty" INTEGER NOT NULL,
	"idMeterServices" BIGINT NULL,
	CONSTRAINT "Apartments_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "Apartments_idProperty_fkey" FOREIGN KEY ("idProperty") REFERENCES "Properties"("id") ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "Apartments_idMeterServices_fkey" FOREIGN KEY ("idMeterServices") REFERENCES "MeterServices"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Rents" (
	"id" BIGSERIAL NOT NULL,	
	"startDate" TIMESTAMPTZ NOT NULL,
	"endDate" TIMESTAMPTZ NULL,
	"guaranteeDeposit" NUMERIC(8,2) NULL,
	"idTenant" BIGINT NOT NULL,
	"idApartment" INTEGER NOT NULL,
	CONSTRAINT "Rent_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "Rent_idTenant_fkey" FOREIGN KEY ("idTenant") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "Rent_idApartment_fkey" FOREIGN KEY ("idApartment") REFERENCES "Apartments"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Observations" (
	"id" BIGSERIAL NOT NULL,	
	"description" TEXT NOT NULL,
	"date" TIMESTAMPTZ NOT NULL,
	"solved" BOOLEAN NOT NULL,
	"idRent" BIGINT NOT NULL,
	"idUser" BIGINT NOT NULL,
	CONSTRAINT "Observations_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "Observations_idRent_fkey" FOREIGN KEY ("idRent") REFERENCES "Rents"("id") ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "Observations_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Contract" (
	"id" BIGSERIAL NOT NULL,	
	"date" TIMESTAMPTZ NOT NULL,
	"contractTerm" DATE NULL,
	"contractFile" VARCHAR(255) NULL,
	"active" BOOLEAN NOT NULL,
	"idRent" BIGINT NOT NULL,
	CONSTRAINT "Contract_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "Contract_idRent_fkey" FOREIGN KEY ("idRent") REFERENCES "Rents"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "PaymentTypes" (
	"id" INTEGER NOT NULL,
	"name" VARCHAR(100) NOT NULL,
	CONSTRAINT "PaymentTypes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Payments" (
	"id" BIGSERIAL NOT NULL,	
	"code" VARCHAR(100) NULL,
	"amount" NUMERIC(8,2) NOT NULL,
	"date" TIMESTAMPTZ NOT NULL,
	"dueDate" DATE NOT NULL,
	"idRent" BIGINT NOT NULL,
	"idPaymentType" INTEGER NOT NULL,
	CONSTRAINT "Payments_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "Payments_idRent_fkey" FOREIGN KEY ("idRent") REFERENCES "Rents"("id") ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "Payments_idPaymentType_fkey" FOREIGN KEY ("idPaymentType") REFERENCES "PaymentTypes"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
