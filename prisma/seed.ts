import { string } from 'zod';
import { prisma } from '../src/config/prisma.js'; // Ajustez le chemin selon votre structure
import bcrypt from 'bcryptjs';


interface AdminCredentials {
    adminEmail: string;
    adminPassword: string;
}

const DEFAULT_ADMIN: AdminCredentials = {
  adminEmail: 'admin2@tenderplatform.com',
  adminPassword: 'password123',
};
export async function seedAdmin(credentials: AdminCredentials = DEFAULT_ADMIN){
  
  
  // Vérifier si l'admin existe déjà pour éviter les doublons
  const existingAdmin = await prisma.user.findUnique({
    where: { email: credentials.adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(credentials.adminPassword, 10);
    
    await prisma.user.create({
      data: {
        email: credentials.adminEmail,
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

seedAdmin()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  })
