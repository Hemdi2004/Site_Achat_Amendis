import { PrismaClient } from './generated/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean up existing records to avoid unique constraint collisions on re-runs
  await prisma.rolePermission.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.role.deleteMany({});
  await prisma.permission.deleteMany({});

  console.log('🧹 Database cleaned.');

  // 2. Define all system permissions
  const permissionsData = [
    { name: 'tender:create', description: 'Can create a new tender' },
    { name: 'tender:edit', description: 'Can edit existing tenders' },
    { name: 'tender:publish', description: 'Can publish tenders to the public' },
    { name: 'tender:close', description: 'Can close or archive tenders' },
    { name: 'tender:view_public', description: 'Can view published public tenders' },
    { name: 'application:view', description: 'Can view all company applications' },
    { name: 'application:download', description: 'Can download application documents' },
    { name: 'application:submit', description: 'Can submit a bid application for a tender' },
    { name: 'application:view_own', description: 'Can view their own submitted applications' },
    { name: 'winner:select', description: 'Can select the winning bid for a tender' },
    { name: 'history:view', description: 'Can view system audit history logs' },
  ];

  console.log(`📦 Seeding ${permissionsData.length} permissions...`);
  
  // Use Promise.all to create all permissions concurrently
  const createdPermissions = await Promise.all(
    permissionsData.map((perm) =>
      prisma.permission.create({
        data: perm,
      })
    )
  );

  // Turn created permissions array into a handy lookup map by name
  const permMap = new Map(createdPermissions.map((p) => [p.name, p.id]));

  // 3. Define Roles
  console.log('🎭 Seeding roles...');
  const superAdminRole = await prisma.role.create({
    data: { name: 'SUPER_ADMIN', description: 'Platform owner with unrestricted access' },
  });

  const adminRole = await prisma.role.create({
    data: { name: 'ADMIN', description: 'Internal staff managing tenders and applications' },
  });

  const companyRole = await prisma.role.create({
    data: { name: 'COMPANY', description: 'External vendor submitting bids' },
  });

  // 4. Map Permissions to Roles (Role-Based Access Control Mapping)
  console.log('🔗 Linking roles and permissions...');

  // Helper function to link a list of permission names to a single role ID
  async function linkPermissionsToRole(roleId: string, allowedPermissionNames: string[]) {
    const records = allowedPermissionNames.map((name) => {
      const permissionId = permMap.get(name);
      if (!permissionId) throw new Error(`Permission not found during seeding: ${name}`);
      return { roleId, permissionId };
    });

    await prisma.rolePermission.createMany({
      data: records,
    });
  }

  // A. SUPER_ADMIN gets ALL permissions
  const allPermissionNames = permissionsData.map((p) => p.name);
  await linkPermissionsToRole(superAdminRole.id, allPermissionNames);

  // B. ADMIN permissions
  const adminPermissions = [
    'tender:create',
    'tender:edit',
    'tender:publish',
    'tender:close',
    'application:view',
    'application:download',
    'winner:select',
  ];
  await linkPermissionsToRole(adminRole.id, adminPermissions);

  // C. COMPANY permissions
  const companyPermissions = [
    'tender:view_public',
    'application:submit',
    'application:view_own',
  ];
  await linkPermissionsToRole(companyRole.id, companyPermissions);

  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });