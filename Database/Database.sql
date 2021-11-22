CREATE TABLE "Roles" (
	"id" SERIAL NOT NULL,
	"code" VARCHAR(25) UNIQUE NOT NULL,
	"name" VARCHAR(75) UNIQUE NOT NULL,
	CONSTRAINT "Roles_pkey" PRIMARY KEY ("code")
);


CREATE TABLE "Users" (
	"id" BIGSERIAL NOT NULL,
	"email" VARCHAR(75) UNIQUE NOT NULL,
	"password" VARCHAR(255) NOT NULL,
	"idNumber" VARCHAR(25) UNIQUE NOT NULL,
	"firstName" VARCHAR(100) NOT NULL,
	"lastName" VARCHAR(100) NOT NULL,
	"phone" VARCHAR(25) NULL,
	"details" JSONB NULL default '{}'::JSONB,
	"createdAt" TIMESTAMPTZ NOT NULL,
	"updatedAt" TIMESTAMPTZ NOT NULL,	
	"codeRole" VARCHAR(25) NOT NULL,
	CONSTRAINT "Users_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "Users_codeRole_fkey" FOREIGN KEY ("codeRole") REFERENCES "Roles"("code") ON DELETE CASCADE ON UPDATE CASCADE
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



CREATE TABLE "Properties" (
	"id" bigserial NOT NULL,
	"name" VARCHAR(100) NULL,
	"apartmentsNumber" INTEGER NOT NULL,
	"totalFloors" INTEGER NOT NULL,
	address VARCHAR(255) NULL,
	"zipCode" VARCHAR(50) NULL,
	"idCanton" INTEGER NOT NULL,
	"idOwner" INTEGER NULL,
	CONSTRAINT "Properties_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "Properties_idCanton_fkey" FOREIGN KEY ("idCanton") REFERENCES "Cantons"("id") ON DELETE CASCADE ON UPDATE cascade,
	CONSTRAINT "Properties_idOwner_fkey" FOREIGN KEY ("idOwner") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE "ApartmentFeatures" (
	"id" bigserial NOT NULL,
	"guaranteePayment" NUMERIC(8,2) NULL,
	"parking" BOOLEAN NULL,
	"furnished" BOOLEAN NULL,
	"airConditioning"  BOOLEAN NULL,
	"petsAllowed"  BOOLEAN NULL,
	"lightIncluded"  BOOLEAN NULL,
	"waterIncluded"  BOOLEAN NULL,
	"internetIncluded"  BOOLEAN null,
	CONSTRAINT "ApartmentFeatures_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "Apartments" (
	"id" bigserial NOT NULL,
	"code" VARCHAR(100) NULL,
	"width" NUMERIC(7,2) NULL,
	"length" NUMERIC(7,2) NULL,
	"floor" INTEGER NULL,
	"monthlyPrice" NUMERIC(8,2) NOT NULL,
	"bedroomCount" INTEGER NOT NULL,
	"bathroomCount" INTEGER NOT NULL,
	"kitchenCount" INTEGER NOT NULL,
	"available" BOOLEAN NULL,
	"idApartmentFeatures" INTEGER NULL, 
	"idProperty" INTEGER NOT NULL,
	CONSTRAINT "Apartments_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "Apartments_idApartmentFeatures_fkey" FOREIGN KEY ("idApartmentFeatures") REFERENCES "ApartmentFeatures"("id") ON DELETE CASCADE ON UPDATE cascade,
	CONSTRAINT "Apartments_idProperty_fkey" FOREIGN KEY ("idProperty") REFERENCES "Properties"("id") ON DELETE CASCADE ON UPDATE CASCADE
);



CREATE TABLE "Observations" (
	"id" bigserial NOT NULL,	
	"description" TEXT NOT NULL,
	"date" TIMESTAMPTZ NOT NULL,
	"solved" BOOLEAN NOT NULL,
	"idApartment" INTEGER NOT NULL,
	"idUser" INTEGER NOT NULL,
	CONSTRAINT "Observations_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "Observations_idApartment_fkey" FOREIGN KEY ("idApartment") REFERENCES "Apartments"("id") ON DELETE CASCADE ON UPDATE cascade,
	CONSTRAINT "Observations_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE "PaymentTypes" (
	"id" INTEGER NOT NULL,
	"name" VARCHAR(100) NOT NULL,
	CONSTRAINT "PaymentTypes_pkey" PRIMARY KEY ("id")
);


CREATE TABLE "Leases" (
	"id" bigserial NOT NULL,	
	"date" TIMESTAMPTZ NOT NULL,
	"startDate" TIMESTAMPTZ NOT NULL,
	"endDate" TIMESTAMPTZ NULL,
	"leaseTerm" DATE NULL,
	"contractFile" VARCHAR(255) NULL,
	"guaranteeDeposit" NUMERIC(8,2) NULL,
	"active" BOOLEAN NOT NULL,
	"idTenant" INTEGER NOT NULL,
	"idApartment" INTEGER NOT NULL,
	CONSTRAINT "Leases_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "Leases_idTenant_fkey" FOREIGN KEY ("idTenant") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE cascade,
	CONSTRAINT "Leases_idApartment_fkey" FOREIGN KEY ("idApartment") REFERENCES "Apartments"("id") ON DELETE CASCADE ON UPDATE cascade
);




CREATE TABLE "Payments" (
	"id" bigserial NOT NULL,	
	"code" VARCHAR(100) NULL,
	"amount" NUMERIC(8,2) NOT NULL,
	"date" TIMESTAMPTZ NOT NULL,
	"dueDate" DATE NOT NULL,
	"idLease" INTEGER NOT NULL,
	"idPaymentType" INTEGER NOT NULL,
	CONSTRAINT "Payments_pkey" PRIMARY KEY ("id"),
	CONSTRAINT "Payments_idLease_fkey" FOREIGN KEY ("idLease") REFERENCES "Leases"("id") ON DELETE CASCADE ON UPDATE cascade,
	CONSTRAINT "Payments_idPaymentType_fkey" FOREIGN KEY ("idPaymentType") REFERENCES "PaymentTypes"("id") ON DELETE CASCADE ON UPDATE cascade
);

