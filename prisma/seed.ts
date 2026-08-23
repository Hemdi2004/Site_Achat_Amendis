import { prisma } from '../src/config/prisma.js'; // Ajustez le chemin selon votre structure
import bcrypt from 'bcryptjs';



async function main() {
  const adminEmail = 'admin@tenderplatform.com';
  
  // Vérifier si l'admin existe déjà pour éviter les doublons
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('SuperSecretAdminPassword123!', 10);
    
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
        // L'admin n'a pas de companyId, ce qui est parfait avec votre schéma
      }
    });
    console.log('✅ Compte Administrateur initial créé avec succès !');
  } else {
    console.log('ℹ️ L\'administrateur existe déjà.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
