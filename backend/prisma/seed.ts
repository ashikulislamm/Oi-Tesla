import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed for Oi Tesla cast...");

  // Clean existing data for deterministic test/demo runs
  await prisma.statusHistory.deleteMany();
  await prisma.fare.deleteMany();
  await prisma.rideRequest.deleteMany();
  await prisma.pool.deleteMany();
  await prisma.tesla.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = "TeslaPassword123!";
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  // 1. Jashim — Driver operating Bullet (3-seat capacity)
  const jashim = await prisma.user.create({
    data: {
      name: "Jashim",
      email: "jashim@oitesla.com",
      passwordHash,
      role: Role.driver,
      tesla: {
        create: {
          plateOrName: "Bullet (Tesla Model 3)",
          capacity: 3,
          isOnline: true,
        },
      },
    },
    include: {
      tesla: true,
    },
  });

  // 2. Nusrat — Passenger (Banani -> Mohakhali)
  const nusrat = await prisma.user.create({
    data: {
      name: "Nusrat",
      email: "nusrat@oitesla.com",
      passwordHash,
      role: Role.passenger,
    },
  });

  // 3. Rafiq — Passenger (Banani -> Gulshan 1)
  const rafiq = await prisma.user.create({
    data: {
      name: "Rafiq",
      email: "rafiq@oitesla.com",
      passwordHash,
      role: Role.passenger,
    },
  });

  // 4. Shirin — Passenger (Seat race contender)
  const shirin = await prisma.user.create({
    data: {
      name: "Shirin",
      email: "shirin@oitesla.com",
      passwordHash,
      role: Role.passenger,
    },
  });

  console.log("✅ Seed completed successfully with cast:");
  console.log(`- Driver: Jashim (${jashim.email}) | Tesla: ${jashim.tesla?.plateOrName} (Capacity: ${jashim.tesla?.capacity})`);
  console.log(`- Passenger: Nusrat (${nusrat.email})`);
  console.log(`- Passenger: Rafiq (${rafiq.email})`);
  console.log(`- Passenger: Shirin (${shirin.email})`);
  console.log(`- Default Password: ${defaultPassword}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
