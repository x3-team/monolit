import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.SEED_ADMIN_EMAIL || "admin@smartdoc.local").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || "admin123456";
  const orgName = process.env.SEED_ORG_NAME || "Demo Organization";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Seed user already exists: ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const org = await prisma.organization.create({
    data: {
      name: orgName,
      slug: "demo",
      users: {
        create: {
          email,
          name: "Demo Admin",
          passwordHash,
          role: "ADMIN",
        },
      },
      pipelines: {
        create: {
          name: "Supplier Invoices",
          description: "Extract seller INN, amounts and invoice dates from supplier invoices.",
          schemaFields: {
            create: [
              {
                targetFieldName: "inn_seller",
                dataType: "STRING",
                description: "10 or 12 digit tax ID of the issuing company",
                promptHint: "ИНН продавца",
                required: true,
                systemFieldTarget: "Контрагент_ИНН",
                sortOrder: 0,
              },
              {
                targetFieldName: "invoice_number",
                dataType: "STRING",
                description: "Invoice number",
                required: true,
                sortOrder: 1,
              },
              {
                targetFieldName: "invoice_date",
                dataType: "DATE",
                description: "Invoice issue date",
                required: true,
                sortOrder: 2,
              },
              {
                targetFieldName: "net_amount",
                dataType: "NUMBER",
                description: "Amount excluding VAT",
                sortOrder: 3,
              },
              {
                targetFieldName: "vat_amount",
                dataType: "NUMBER",
                description: "VAT amount",
                sortOrder: 4,
              },
              {
                targetFieldName: "total_amount",
                dataType: "NUMBER",
                description: "Total amount including VAT",
                required: true,
                sortOrder: 5,
              },
            ],
          },
        },
      },
    },
  });

  console.log("Seeded organization:", org.name);
  console.log(`Login: ${email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
