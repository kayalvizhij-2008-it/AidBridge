import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding AidBridge database...');

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.caseTimeline.deleteMany();
  await prisma.followUp.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.serviceDelivery.deleteMany();
  await prisma.referral.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.service.deleteMany();
  await prisma.serviceProvider.deleteMany();
  await prisma.needsAssessment.deleteMany();
  await prisma.case.deleteMany();
  await prisma.individual.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organisation.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('AidBridge2026!', salt);

  // 1. Organisations
  const orgGov = await prisma.organisation.create({
    data: {
      name: 'Department of Social Welfare & Inclusion',
      type: 'GOVERNMENT',
      jurisdiction: 'Metropolitan District 1-4',
      address: '100 Civic Center Plaza, Suite 400',
      contactEmail: 'gov-admin@aidbridge.local',
      phone: '+1 (555) 019-2001',
      lat: 40.7128,
      lng: -74.006,
    },
  });

  const orgOutreach = await prisma.organisation.create({
    data: {
      name: 'StreetConnect Field Outreach Alliance',
      type: 'OUTREACH_NGO',
      jurisdiction: 'Metro Urban Core & Transit Corridors',
      address: '244 Market St, Field Depot 3',
      contactEmail: 'field@streetconnect.local',
      phone: '+1 (555) 019-2002',
      lat: 40.7188,
      lng: -73.997,
    },
  });

  const orgShelter = await prisma.organisation.create({
    data: {
      name: 'Hope Haven Emergency & Transitional Shelter',
      type: 'SHELTER',
      jurisdiction: 'East River Community Zone',
      address: '812 River Road Sanctuary',
      contactEmail: 'intake@hopehaven.local',
      phone: '+1 (555) 019-2003',
      lat: 40.7245,
      lng: -73.982,
    },
  });

  const orgHospital = await prisma.organisation.create({
    data: {
      name: 'St. Jude Metropolitan Health System',
      type: 'HOSPITAL',
      jurisdiction: 'Regional Health District',
      address: '500 Medical Center Way',
      contactEmail: 'socialcare@stjudehealth.local',
      phone: '+1 (555) 019-2004',
      lat: 40.735,
      lng: -73.991,
    },
  });

  const orgCaseMgmt = await prisma.organisation.create({
    data: {
      name: 'Unified Social Care Coordination Bureau',
      type: 'CASE_MGMT',
      jurisdiction: 'Cross-Agency Liaison',
      address: '320 Integration Ave, Floor 8',
      contactEmail: 'coordination@aidbridge.local',
      phone: '+1 (555) 019-2005',
      lat: 40.729,
      lng: -74.001,
    },
  });

  // 2. Users (5 Core Stakeholders)
  const userAdmin = await prisma.user.create({
    data: {
      name: 'Director Elena Vance',
      email: 'admin@aidbridge.local',
      passwordHash,
      role: 'ROLE_ADMIN',
      orgId: orgGov.id,
    },
  });

  const userOutreach = await prisma.user.create({
    data: {
      name: 'Marcus Chen',
      email: 'outreach@aidbridge.local',
      passwordHash,
      role: 'ROLE_OUTREACH',
      orgId: orgOutreach.id,
    },
  });

  const userShelter = await prisma.user.create({
    data: {
      name: 'Sarah Jenkins',
      email: 'shelter@aidbridge.local',
      passwordHash,
      role: 'ROLE_SHELTER',
      orgId: orgShelter.id,
    },
  });

  const userHospital = await prisma.user.create({
    data: {
      name: 'Dr. Tariq Mahmood',
      email: 'hospital@aidbridge.local',
      passwordHash,
      role: 'ROLE_HOSPITAL',
      orgId: orgHospital.id,
    },
  });

  const userManager = await prisma.user.create({
    data: {
      name: 'Amara Patel',
      email: 'manager@aidbridge.local',
      passwordHash,
      role: 'ROLE_MANAGER',
      orgId: orgCaseMgmt.id,
    },
  });

  console.log('Created 5 core role users with password "AidBridge2026!"');

  // 3. Service Providers & Resources
  const providerShelter = await prisma.serviceProvider.create({
    data: {
      name: 'Hope Haven Sanctuary Main Center',
      type: 'SHELTER',
      address: '812 River Road',
      lat: 40.7245,
      lng: -73.982,
      capacityTotal: 40,
      capacityAvailable: 7,
      contactPhone: '+1 (555) 019-2003',
      contactEmail: 'beds@hopehaven.local',
      orgId: orgShelter.id,
    },
  });

  await prisma.resource.createMany({
    data: [
      {
        providerId: providerShelter.id,
        type: 'EMERGENCY_BED',
        name: 'Urgent Night Shelter Bed',
        totalCount: 25,
        availableCount: 4,
        unit: 'beds',
      },
      {
        providerId: providerShelter.id,
        type: 'TRANSITIONAL_BED',
        name: 'Extended Care Transitional Bed',
        totalCount: 15,
        availableCount: 3,
        unit: 'beds',
      },
      {
        providerId: providerShelter.id,
        type: 'WARM_CLOTHING',
        name: 'Thermal Jacket & Winter Clothing Pack',
        totalCount: 120,
        availableCount: 38,
        unit: 'packs',
      },
    ],
  });

  const providerHospital = await prisma.serviceProvider.create({
    data: {
      name: 'St. Jude Community Clinic & Triage',
      type: 'CLINIC_HOSPITAL',
      address: '500 Medical Center Way, Pavilion B',
      lat: 40.735,
      lng: -73.991,
      capacityTotal: 18,
      capacityAvailable: 4,
      contactPhone: '+1 (555) 019-2004',
      contactEmail: 'triage@stjudehealth.local',
      orgId: orgHospital.id,
    },
  });

  await prisma.resource.createMany({
    data: [
      {
        providerId: providerHospital.id,
        type: 'MEDICAL_BED',
        name: 'Acute Medical Stabilization Bed',
        totalCount: 18,
        availableCount: 4,
        unit: 'beds',
      },
      {
        providerId: providerHospital.id,
        type: 'HYGIENE_KIT',
        name: 'Emergency Medical & Sanitation Kit',
        totalCount: 200,
        availableCount: 84,
        unit: 'kits',
      },
    ],
  });

  const providerFood = await prisma.serviceProvider.create({
    data: {
      name: 'Civic Bread & Nourishment Hub',
      type: 'FOOD_BANK',
      address: '150 Orchard Street',
      lat: 40.719,
      lng: -73.988,
      capacityTotal: 250,
      capacityAvailable: 95,
      contactPhone: '+1 (555) 019-2008',
      contactEmail: 'meals@civicbread.local',
      orgId: orgGov.id,
    },
  });

  await prisma.resource.create({
    data: {
      providerId: providerFood.id,
      type: 'MEAL_PACK',
      name: 'Nutritious Hot Meal & Ration Pack',
      totalCount: 250,
      availableCount: 95,
      unit: 'meals/day',
    },
  });

  // 4. Individuals (Minimised sensitive data, distinct categories)
  const ind1 = await prisma.individual.create({
    data: {
      caseId: 'AID-2026-001',
      firstName: 'David',
      lastName: 'K.',
      ageCategory: 'ELDERLY',
      approximateAge: 68,
      gender: 'Male',
      contactPhone: 'None (Field contact via worker)',
      currentLocus: 'East Ferry Terminal Underpass, Bench 4',
      consentGiven: true,
      consentNotes: 'Verbal consent given in presence of outreach team. Requesting shelter and arthritis care.',
      safeguardingFlags: 'Severe mobility limitation, hypothermia risk during winter nights.',
      registeredById: userOutreach.id,
      orgId: orgOutreach.id,
    },
  });

  const ind2 = await prisma.individual.create({
    data: {
      caseId: 'AID-2026-002',
      firstName: 'Maya',
      lastName: 'S. and toddler',
      ageCategory: 'CHILD',
      approximateAge: 4,
      gender: 'Female',
      contactPhone: '+1 (555) 019-4821',
      currentLocus: 'Subway Station Concourse Level 2',
      consentGiven: true,
      consentNotes: 'Mother Maya gave full informed consent for child safeguarding and family shelter support.',
      safeguardingFlags: 'Vulnerable minor with parent facing immediate eviction and infant nutrition shortage.',
      registeredById: userOutreach.id,
      orgId: orgOutreach.id,
    },
  });

  const ind3 = await prisma.individual.create({
    data: {
      caseId: 'AID-2026-003',
      firstName: 'Arthur',
      lastName: 'B.',
      ageCategory: 'ADULT',
      approximateAge: 52,
      gender: 'Male',
      contactPhone: 'None',
      currentLocus: 'Westside Library Steps',
      consentGiven: true,
      consentNotes: 'Agreed to medical evaluation for chronic respiratory condition.',
      safeguardingFlags: 'Untreated respiratory distress, needs clinical stabilization.',
      registeredById: userOutreach.id,
      orgId: orgOutreach.id,
    },
  });

  const ind4 = await prisma.individual.create({
    data: {
      caseId: 'AID-2026-004',
      firstName: 'Liam',
      lastName: 'R.',
      ageCategory: 'YOUTH',
      approximateAge: 17,
      gender: 'Male',
      contactPhone: 'Text only via youth worker',
      currentLocus: 'North Skate Park Perimeter',
      consentGiven: true,
      consentNotes: 'Youth consent protocol followed; child welfare advocate notified.',
      safeguardingFlags: 'Unaccompanied youth under 18; mandatory child protection liaison.',
      registeredById: userOutreach.id,
      orgId: orgOutreach.id,
    },
  });

  const ind5 = await prisma.individual.create({
    data: {
      caseId: 'AID-2026-005',
      firstName: 'Helen',
      lastName: 'G.',
      ageCategory: 'ELDERLY',
      approximateAge: 74,
      gender: 'Female',
      contactPhone: '+1 (555) 019-9133',
      currentLocus: 'St. Luke Parish Soup Kitchen Hall',
      consentGiven: true,
      consentNotes: 'Client requested food security assistance and hearing aid referral.',
      safeguardingFlags: 'Social isolation, cognitive vulnerability.',
      registeredById: userOutreach.id,
      orgId: orgOutreach.id,
    },
  });

  // 5. Cases, Assessments, Referrals, Deliveries, Verifications

  // CASE 1: VERIFIED & COMPLETED (Full lifecycle completed: referral -> accepted -> delivered -> verified -> closed)
  const case1 = await prisma.case.create({
    data: {
      caseNumber: 'CASE-2026-101',
      individualId: ind1.id,
      title: 'Emergency Shelter & Geriatric Care for David K.',
      status: 'CLOSED',
      priority: 'CRITICAL',
      assignedManagerId: userManager.id,
      createdById: userOutreach.id,
      orgId: orgOutreach.id,
      closedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      closeReason: 'Assistance successfully verified: 30-day shelter admission confirmed and medical checkup completed.',
    },
  });

  await prisma.needsAssessment.create({
    data: {
      caseId: case1.id,
      category: 'EMERGENCY_SHELTER',
      urgency: 'CRITICAL',
      notes: 'Living in freezing conditions with chronic arthritis. Immediate bed required.',
      assessedById: userOutreach.id,
    },
  });

  const ref1 = await prisma.referral.create({
    data: {
      caseId: case1.id,
      providerId: providerShelter.id,
      requestedService: 'Emergency Shelter Bed & Geriatric Support',
      priority: 'CRITICAL',
      status: 'COMPLETED',
      notes: 'Client transported by outreach van directly to sanctuary.',
      referredById: userOutreach.id,
      acceptedById: userShelter.id,
      respondedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    },
  });

  const del1 = await prisma.serviceDelivery.create({
    data: {
      referralId: ref1.id,
      caseId: case1.id,
      serviceType: 'Emergency Shelter Admission',
      deliveredById: userShelter.id,
      evidenceNotes: 'Client David K. admitted to Room 12-B. Warm bedding, meal, and medical triage provided. Bed card #4102 signed.',
      locationNotes: 'Hope Haven Sanctuary Main Center',
      verified: true,
    },
  });

  await prisma.verification.create({
    data: {
      serviceDeliveryId: del1.id,
      caseId: case1.id,
      verifiedById: userManager.id,
      status: 'CONFIRMED',
      remarks: 'Case Manager Amara Patel performed physical verification at Hope Haven. Client is safely housed in Room 12-B with hot meals and ongoing mobility support.',
      verifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 28),
    },
  });

  await prisma.followUp.create({
    data: {
      caseId: case1.id,
      scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      status: 'SCHEDULED',
      notes: 'Check transitional housing progression and health clinic follow-up.',
      assignedToId: userManager.id,
    },
  });

  await prisma.caseTimeline.createMany({
    data: [
      { caseId: case1.id, eventType: 'REGISTRATION', title: 'Individual Registered', description: 'David K. registered by Marcus Chen at East Ferry Terminal.', actorId: userOutreach.id, actorRole: 'ROLE_OUTREACH' },
      { caseId: case1.id, eventType: 'ASSESSMENT', title: 'Needs Assessment Completed', description: 'Urgent emergency shelter assessed as CRITICAL priority.', actorId: userOutreach.id, actorRole: 'ROLE_OUTREACH' },
      { caseId: case1.id, eventType: 'REFERRAL_SENT', title: 'Referral Sent to Hope Haven', description: 'Referral #REF-101 created for urgent emergency shelter placement.', actorId: userOutreach.id, actorRole: 'ROLE_OUTREACH' },
      { caseId: case1.id, eventType: 'REFERRAL_ACCEPTED', title: 'Referral Accepted', description: 'Sarah Jenkins accepted referral and assigned Bed 12-B.', actorId: userShelter.id, actorRole: 'ROLE_SHELTER' },
      { caseId: case1.id, eventType: 'SERVICE_DELIVERED', title: 'Shelter Admission Recorded', description: 'Physical admission recorded with bed card #4102 and meal provision.', actorId: userShelter.id, actorRole: 'ROLE_SHELTER' },
      { caseId: case1.id, eventType: 'VERIFICATION_CONFIRMED', title: 'Service Delivery Verified', description: 'Case Manager verified client on-site. Delivery confirmed with evidence.', actorId: userManager.id, actorRole: 'ROLE_MANAGER' },
      { caseId: case1.id, eventType: 'CASE_CLOSED', title: 'Case Safely Closed', description: 'Case marked resolved following verified service delivery rule.', actorId: userManager.id, actorRole: 'ROLE_MANAGER' },
    ],
  });

  // CASE 2: PENDING VERIFICATION (Service delivered, awaiting Case Manager confirmation before closing!)
  const case2 = await prisma.case.create({
    data: {
      caseNumber: 'CASE-2026-102',
      individualId: ind2.id,
      title: 'Family Safe Haven & Infant Nutrition for Maya S.',
      status: 'PENDING_VERIFICATION',
      priority: 'CRITICAL',
      assignedManagerId: userManager.id,
      createdById: userOutreach.id,
      orgId: orgOutreach.id,
    },
  });

  await prisma.needsAssessment.createMany({
    data: [
      { caseId: case2.id, category: 'CHILD_PROTECTION', urgency: 'CRITICAL', notes: '4yo child at immediate risk in subway concourse.', assessedById: userOutreach.id },
      { caseId: case2.id, category: 'FOOD_NUTRITION', urgency: 'HIGH', notes: 'Infant formula and clean water needed immediately.', assessedById: userOutreach.id },
    ],
  });

  const ref2 = await prisma.referral.create({
    data: {
      caseId: case2.id,
      providerId: providerShelter.id,
      requestedService: 'Family Suite & Child Nutrition Pack',
      priority: 'CRITICAL',
      status: 'ACCEPTED',
      notes: 'Family room requested with infant cot.',
      referredById: userOutreach.id,
      acceptedById: userShelter.id,
      respondedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    },
  });

  await prisma.serviceDelivery.create({
    data: {
      referralId: ref2.id,
      caseId: case2.id,
      serviceType: 'Family Sanctuary Placement & Infant Care Kit',
      deliveredById: userShelter.id,
      evidenceNotes: 'Mother and child settled into Family Suite 4. Distributed baby food, clothes, and diapers. Awaiting Case Manager sign-off.',
      locationNotes: 'Hope Haven Family Wing',
      verified: false,
    },
  });

  await prisma.caseTimeline.createMany({
    data: [
      { caseId: case2.id, eventType: 'REGISTRATION', title: 'Child & Parent Registered', description: 'Maya S. registered with child safeguarding priority.', actorId: userOutreach.id, actorRole: 'ROLE_OUTREACH' },
      { caseId: case2.id, eventType: 'ASSESSMENT', title: 'Child Protection Assessment', description: 'Assessed CRITICAL for shelter and food.', actorId: userOutreach.id, actorRole: 'ROLE_OUTREACH' },
      { caseId: case2.id, eventType: 'REFERRAL_ACCEPTED', title: 'Family Suite Assigned', description: 'Hope Haven accepted referral for Family Suite 4.', actorId: userShelter.id, actorRole: 'ROLE_SHELTER' },
      { caseId: case2.id, eventType: 'SERVICE_DELIVERED', title: 'Service Delivered - Awaiting Verification', description: 'Family checked in; delivery record submitted for Case Manager verification.', actorId: userShelter.id, actorRole: 'ROLE_SHELTER' },
    ],
  });

  // CASE 3: IN PROGRESS / REFERRED (Medical Referral Accepted at Hospital, pending clinical treatment)
  const case3 = await prisma.case.create({
    data: {
      caseNumber: 'CASE-2026-103',
      individualId: ind3.id,
      title: 'Acute Respiratory Stabilization for Arthur B.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      assignedManagerId: userManager.id,
      createdById: userOutreach.id,
      orgId: orgOutreach.id,
    },
  });

  await prisma.needsAssessment.create({
    data: {
      caseId: case3.id,
      category: 'MEDICAL_ASSISTANCE',
      urgency: 'HIGH',
      notes: 'Severe wheezing, persistent cough, possible pneumonia. Immediate clinical consult required.',
      assessedById: userOutreach.id,
    },
  });

  await prisma.referral.create({
    data: {
      caseId: case3.id,
      providerId: providerHospital.id,
      requestedService: 'Clinical Respiratory Evaluation & Inpatient Bed',
      priority: 'HIGH',
      status: 'ACCEPTED',
      notes: 'Referred to Dr. Tariq Mahmood at St. Jude Community Clinic.',
      referredById: userOutreach.id,
      acceptedById: userHospital.id,
      respondedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    },
  });

  // CASE 4: ESCALATED / OVERDUE FOLLOW-UP (Youth needs urgent intervention, follow-up overdue)
  const case4 = await prisma.case.create({
    data: {
      caseNumber: 'CASE-2026-104',
      individualId: ind4.id,
      title: 'Youth Protection & Transitional Placement for Liam R.',
      status: 'ESCALATED',
      priority: 'CRITICAL',
      assignedManagerId: userManager.id,
      createdById: userOutreach.id,
      orgId: orgOutreach.id,
    },
  });

  await prisma.needsAssessment.create({
    data: {
      caseId: case4.id,
      category: 'CHILD_PROTECTION',
      urgency: 'CRITICAL',
      notes: 'Unaccompanied minor with no safe nighttime housing. Requires designated youth shelter placement.',
      assessedById: userOutreach.id,
    },
  });

  const ref4 = await prisma.referral.create({
    data: {
      caseId: case4.id,
      providerId: providerShelter.id,
      requestedService: 'Youth Wing Transitional Bed',
      priority: 'CRITICAL',
      status: 'REJECTED',
      rejectionReason: 'Adult shelter facility cannot accept minors under 18 without dedicated juvenile safeguarding unit. Transferred to child welfare queue.',
      referredById: userOutreach.id,
      acceptedById: userShelter.id,
      respondedAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
    },
  });

  await prisma.followUp.create({
    data: {
      caseId: case4.id,
      scheduledDate: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days overdue
      status: 'OVERDUE',
      notes: 'URGENT: Re-refer Liam R. to Municipal Youth Crisis Shelter; previous referral rejected due to age restriction.',
      assignedToId: userManager.id,
    },
  });

  await prisma.caseTimeline.createMany({
    data: [
      { caseId: case4.id, eventType: 'REGISTRATION', title: 'Youth Registered', description: 'Liam R. registered with safeguarding alert.', actorId: userOutreach.id, actorRole: 'ROLE_OUTREACH' },
      { caseId: case4.id, eventType: 'REFERRAL_REJECTED', title: 'Referral Unsuccessful - Age Policy', description: 'Hope Haven shelter rejected: Adult facility lacks minor safeguarding unit.', actorId: userShelter.id, actorRole: 'ROLE_SHELTER' },
      { caseId: case4.id, eventType: 'ESCALATION', title: 'Case Escalated to Lead Manager', description: 'Overdue follow-up triggered automatic priority escalation for minor safeguarding.', actorId: userManager.id, actorRole: 'ROLE_MANAGER' },
    ],
  });

  // CASE 5: OPEN / NEWLY ASSESSED (Helen G. Needs Assessment Completed, pending referral creation)
  const case5 = await prisma.case.create({
    data: {
      caseNumber: 'CASE-2026-105',
      individualId: ind5.id,
      title: 'Nutrition Support & Welfare Benefit Advocacy for Helen G.',
      status: 'OPEN',
      priority: 'MEDIUM',
      assignedManagerId: userManager.id,
      createdById: userOutreach.id,
      orgId: orgOutreach.id,
    },
  });

  await prisma.needsAssessment.createMany({
    data: [
      { caseId: case5.id, category: 'FOOD_NUTRITION', urgency: 'MEDIUM', notes: 'Weekly grocery stipend and hot meal delivery required.', assessedById: userOutreach.id },
      { caseId: case5.id, category: 'WELFARE_SUPPORT', urgency: 'MEDIUM', notes: 'Assistance needed applying for elderly public pension subsidy.', assessedById: userOutreach.id },
    ],
  });

  // 6. Notifications
  await prisma.notification.createMany({
    data: [
      {
        roleTarget: 'ROLE_MANAGER',
        title: 'Delivery Verification Required',
        message: 'Maya S. (CASE-2026-102) has received family shelter placement. Please confirm verified delivery.',
        type: 'VERIFICATION',
        linkUrl: '/dashboard/manager',
      },
      {
        roleTarget: 'ROLE_MANAGER',
        title: 'OVERDUE FOLLOW-UP: Youth Protection',
        message: 'Liam R. (CASE-2026-104) has an overdue action: Adult shelter referral was rejected. Immediate re-referral needed.',
        type: 'ESCALATION',
        linkUrl: '/dashboard/manager',
      },
      {
        roleTarget: 'ROLE_SHELTER',
        title: 'Incoming Critical Referral',
        message: 'New shelter referral pending for Arthur B. (CASE-2026-103).',
        type: 'REFERRAL',
        linkUrl: '/dashboard/shelter',
      },
      {
        roleTarget: 'ROLE_ADMIN',
        title: 'System Audit: Monthly Assistance Milestone',
        message: 'Over 2,900 verified assistance deliveries recorded across 5 municipal districts.',
        type: 'RESOURCE',
        linkUrl: '/dashboard/admin',
      },
    ],
  });

  // 7. Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        actorId: userManager.id,
        actorEmail: userManager.email,
        actorRole: userManager.role,
        action: 'VERIFY',
        entity: 'SERVICE_DELIVERY',
        entityId: del1.id,
        details: JSON.stringify({ verified: true, remarks: 'Confirmed shelter delivery at Hope Haven' }),
      },
      {
        actorId: userManager.id,
        actorEmail: userManager.email,
        actorRole: userManager.role,
        action: 'CLOSE',
        entity: 'CASE',
        entityId: case1.id,
        details: JSON.stringify({ reason: 'Verified delivery confirmed by authorized manager' }),
      },
      {
        actorId: userShelter.id,
        actorEmail: userShelter.email,
        actorRole: userShelter.role,
        action: 'UPDATE',
        entity: 'REFERRAL',
        entityId: ref4.id,
        details: JSON.stringify({ status: 'REJECTED', reason: 'Age limitation policy' }),
      },
    ],
  });

  console.log('AidBridge database successfully populated with rich synthetic demonstration data.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
