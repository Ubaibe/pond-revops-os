import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data (respect FK order: child tables first)
  await prisma.activity.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.company.deleteMany();
  await prisma.prospect.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.client.deleteMany();

  console.log('🧹 Cleared existing data');

  // Create 3 clients
  const northstar = await prisma.client.create({
    data: {
      name: 'Northstar Climate',
      domain: 'northstarclimate.example',
      status: 'ACTIVE',
      metadata: JSON.stringify({ industry: 'Climate / Sustainability', tier: 'Enterprise', region: 'NA' }),
    },
  });

  const civiclayer = await prisma.client.create({
    data: {
      name: 'CivicLayer',
      domain: 'civiclayersystems.example',
      status: 'ACTIVE',
      metadata: JSON.stringify({ industry: 'GovTech / Public Infrastructure', tier: 'Growth', region: 'NA' }),
    },
  });

  const wellspring = await prisma.client.create({
    data: {
      name: 'WellSpring Labs',
      domain: 'wellspringlabs.example',
      status: 'ACTIVE',
      metadata: JSON.stringify({ industry: 'Health / Workforce Benefits', tier: 'Enterprise', region: 'EU' }),
    },
  });

  console.log('✅ Created 3 clients');

  // 8 companies per client = 24 total
  const companiesData = [
    // Northstar Climate (Climate / Sustainability)
    { name: 'Aura Solar', domain: 'aurasolar.example', size: '201-500', industry: 'Renewable Energy', location: 'Denver, CO', clientId: northstar.id },
    { name: 'TerraGrid Energy', domain: 'terragrid.example', size: '501-1000', industry: 'Grid Infrastructure', location: 'Austin, TX', clientId: northstar.id },
    { name: 'CarbonSense Analytics', domain: 'carbonsense.example', size: '51-200', industry: 'Carbon Accounting', location: 'San Francisco, CA', clientId: northstar.id },
    { name: 'GreenHaven Materials', domain: 'greenhaven.example', size: '201-500', industry: 'Sustainable Materials', location: 'Portland, OR', clientId: northstar.id },
    { name: 'BlueOcean Carbon', domain: 'blueocean.example', size: '11-50', industry: 'Blue Carbon', location: 'Miami, FL', clientId: northstar.id },
    { name: 'Windward Turbines', domain: 'windward.example', size: '1001-5000', industry: 'Wind Energy', location: 'Chicago, IL', clientId: northstar.id },
    { name: 'Solaris Storage', domain: 'solarisstorage.example', size: '201-500', industry: 'Energy Storage', location: 'Phoenix, AZ', clientId: northstar.id },
    { name: 'EcoFlux Consulting', domain: 'ecoflux.example', size: '11-50', industry: 'Sustainability Consulting', location: 'Seattle, WA', clientId: northstar.id },

    // CivicLayer (GovTech / Public Infrastructure)
    { name: 'MuniWorks Platform', domain: 'muniworks.example', size: '201-500', industry: 'Municipal Software', location: 'Washington, DC', clientId: civiclayer.id },
    { name: 'TransitLogic Systems', domain: 'transitlogic.example', size: '501-1000', industry: 'Transit Technology', location: 'Boston, MA', clientId: civiclayer.id },
    { name: 'PermitFlow', domain: 'permitflow.example', size: '51-200', industry: 'Permitting Software', location: 'Atlanta, GA', clientId: civiclayer.id },
    { name: 'CivicSense Data', domain: 'civicsense.example', size: '11-50', industry: 'Civic Analytics', location: 'Minneapolis, MN', clientId: civiclayer.id },
    { name: 'InfrastructureIQ', domain: 'infrastructureiq.example', size: '201-500', industry: 'Infrastructure Monitoring', location: 'Dallas, TX', clientId: civiclayer.id },
    { name: 'PublicRecord Hub', domain: 'publicrecord.example', size: '11-50', industry: 'Records Management', location: 'Raleigh, NC', clientId: civiclayer.id },
    { name: 'CityPulse IoT', domain: 'citypulse.example', size: '201-500', industry: 'Smart City IoT', location: 'San Diego, CA', clientId: civiclayer.id },
    { name: 'GovSecure Identity', domain: 'govsecure.example', size: '501-1000', industry: 'Digital Identity', location: 'Arlington, VA', clientId: civiclayer.id },

    // WellSpring Labs (Health / Workforce Benefits)
    { name: 'Vitality Benefits', domain: 'vitalitybenefits.example', size: '1001-5000', industry: 'Employee Benefits', location: 'New York, NY', clientId: wellspring.id },
    { name: 'CarePath Wellness', domain: 'carepath.example', size: '201-500', industry: 'Corporate Wellness', location: 'Nashville, TN', clientId: wellspring.id },
    { name: 'HealthBridge Platform', domain: 'healthbridge.example', size: '501-1000', industry: 'Health Navigation', location: 'Philadelphia, PA', clientId: wellspring.id },
    { name: 'MendRx Pharmacy', domain: 'mendrx.example', size: '1001-5000', industry: 'Pharmacy Benefits', location: 'St. Louis, MO', clientId: wellspring.id },
    { name: 'Thrive Mental Health', domain: 'thrivemh.example', size: '51-200', industry: 'Mental Health Platform', location: 'Boulder, CO', clientId: wellspring.id },
    { name: 'Pulse Occupational Health', domain: 'pulseoh.example', size: '201-500', industry: 'Occupational Health', location: 'Cleveland, OH', clientId: wellspring.id },
    { name: 'FlexBenefits Admin', domain: 'flexbenefits.example', size: '201-500', industry: 'Benefits Administration', location: 'Hartford, CT', clientId: wellspring.id },
    { name: 'WellnessIQ Analytics', domain: 'wellnessiq.example', size: '11-50', industry: 'Health Analytics', location: 'Madison, WI', clientId: wellspring.id },
  ];

  for (const c of companiesData) {
    await prisma.company.create({ data: c });
  }

  console.log('✅ Created 24 companies');

  // Fetch created companies to link contacts
  const companies = await prisma.company.findMany({
    include: { client: true },
  });

  // Contact data: 12 per client (36 total)
  const contactsData = [
    // Northstar Climate companies (8 companies, 12 contacts = ~1.5 per company)
    { firstName: 'Marcus', lastName: 'Chen', email: 'mchen@aurasolar.example', phone: '+1-303-555-0101', title: 'CEO', linkedin: 'linkedin.com/in/marcuschen', companyName: 'Aura Solar', clientId: northstar.id },
    { firstName: 'Elena', lastName: 'Rodriguez', email: 'erodriguez@aurasolar.example', phone: '+1-303-555-0102', title: 'VP Sales', linkedin: 'linkedin.com/in/elenarodriguez', companyName: 'Aura Solar', clientId: northstar.id },
    { firstName: 'James', lastName: 'Okonkwo', email: 'jokonkwo@terragrid.example', phone: '+1-512-555-0101', title: 'COO', linkedin: 'linkedin.com/in/jamesokonkwo', companyName: 'TerraGrid Energy', clientId: northstar.id },
    { firstName: 'Priya', lastName: 'Sharma', email: 'psharma@terragrid.example', phone: '+1-512-555-0102', title: 'Head of Operations', linkedin: 'linkedin.com/in/priyasharma', companyName: 'TerraGrid Energy', clientId: northstar.id },
    { firstName: 'David', lastName: 'Park', email: 'dpark@carbonsense.example', phone: '+1-415-555-0101', title: 'Founder', linkedin: 'linkedin.com/in/davidpark', companyName: 'CarbonSense Analytics', clientId: northstar.id },
    { firstName: 'Sarah', lastName: 'Kim', email: 'skim@greenhaven.example', phone: '+1-503-555-0101', title: 'Director of Sustainability', linkedin: 'linkedin.com/in/sarahkim', companyName: 'GreenHaven Materials', clientId: northstar.id },
    { firstName: 'Michael', lastName: 'Thompson', email: 'mthompson@blueocean.example', phone: '+1-305-555-0101', title: 'CEO', linkedin: 'linkedin.com/in/michaelthompson', companyName: 'BlueOcean Carbon', clientId: northstar.id },
    { firstName: 'Lisa', lastName: 'Nguyen', email: 'lnguyen@windward.example', phone: '+1-312-555-0101', title: 'VP Partnerships', linkedin: 'linkedin.com/in/lisanguyen', companyName: 'Windward Turbines', clientId: northstar.id },
    { firstName: 'Robert', lastName: 'Garcia', email: 'rgarcia@windward.example', phone: '+1-312-555-0102', title: 'CFO', linkedin: 'linkedin.com/in/robertgarcia', companyName: 'Windward Turbines', clientId: northstar.id },
    { firstName: 'Jennifer', lastName: 'Wu', email: 'jwu@solarisstorage.example', phone: '+1-602-555-0101', title: 'Head of Procurement', linkedin: 'linkedin.com/in/jenniferwu', companyName: 'Solaris Storage', clientId: northstar.id },
    { firstName: 'Thomas', lastName: 'Anderson', email: 'tanderson@ecoflux.example', phone: '+1-206-555-0101', title: 'Founder', linkedin: 'linkedin.com/in/thomasanderson', companyName: 'EcoFlux Consulting', clientId: northstar.id },
    { firstName: 'Amanda', lastName: 'Foster', email: 'afoster@ecoflux.example', phone: '+1-206-555-0102', title: 'Director of Strategy', linkedin: 'linkedin.com/in/amandafoster', companyName: 'EcoFlux Consulting', clientId: northstar.id },

    // CivicLayer companies (8 companies, 12 contacts)
    { firstName: 'Christopher', lastName: 'Williams', email: 'cwilliams@muniworks.example', phone: '+1-202-555-0101', title: 'CEO', linkedin: 'linkedin.com/in/christopherwilliams', companyName: 'MuniWorks Platform', clientId: civiclayer.id },
    { firstName: 'Patricia', lastName: 'Davis', email: 'pdavis@muniworks.example', phone: '+1-202-555-0102', title: 'VP Sales', linkedin: 'linkedin.com/in/patriciadavis', companyName: 'MuniWorks Platform', clientId: civiclayer.id },
    { firstName: 'Daniel', lastName: 'Martinez', email: 'dmartinez@transitlogic.example', phone: '+1-617-555-0101', title: 'COO', linkedin: 'linkedin.com/in/danielmartinez', companyName: 'TransitLogic Systems', clientId: civiclayer.id },
    { firstName: 'Michelle', lastName: 'Taylor', email: 'mtaylor@permitflow.example', phone: '+1-404-555-0101', title: 'Founder', linkedin: 'linkedin.com/in/michelletaylor', companyName: 'PermitFlow', clientId: civiclayer.id },
    { firstName: 'Kevin', lastName: 'Brown', email: 'kbrown@civicsense.example', phone: '+1-612-555-0101', title: 'Head of Operations', linkedin: 'linkedin.com/in/kevinbrown', companyName: 'CivicSense Data', clientId: civiclayer.id },
    { firstName: 'Laura', lastName: 'Wilson', email: 'lwilson@infrastructureiq.example', phone: '+1-214-555-0101', title: 'Director of Partnerships', linkedin: 'linkedin.com/in/laurawilson', companyName: 'InfrastructureIQ', clientId: civiclayer.id },
    { firstName: 'Steven', lastName: 'Miller', email: 'smiller@publicrecord.example', phone: '+1-919-555-0101', title: 'CEO', linkedin: 'linkedin.com/in/stevenmiller', companyName: 'PublicRecord Hub', clientId: civiclayer.id },
    { firstName: 'Nicole', lastName: 'Moore', email: 'nmoore@citypulse.example', phone: '+1-619-555-0101', title: 'VP Operations', linkedin: 'linkedin.com/in/nicolemoore', companyName: 'CityPulse IoT', clientId: civiclayer.id },
    { firstName: 'Anthony', lastName: 'Jackson', email: 'ajackson@citypulse.example', phone: '+1-619-555-0102', title: 'CFO', linkedin: 'linkedin.com/in/anthonyjackson', companyName: 'CityPulse IoT', clientId: civiclayer.id },
    { firstName: 'Rebecca', lastName: 'White', email: 'rwhite@govsecure.example', phone: '+1-703-555-0101', title: 'Director of Procurement', linkedin: 'linkedin.com/in/rebeccawhite', companyName: 'GovSecure Identity', clientId: civiclayer.id },
    { firstName: 'Matthew', lastName: 'Harris', email: 'mharris@govsecure.example', phone: '+1-703-555-0102', title: 'Head of Strategy', linkedin: 'linkedin.com/in/matthwewharris', companyName: 'GovSecure Identity', clientId: civiclayer.id },
    { firstName: 'Stephanie', lastName: 'Clark', email: 'sclark@transitlogic.example', phone: '+1-617-555-0102', title: 'Procurement Manager', linkedin: 'linkedin.com/in/stephanieclark', companyName: 'TransitLogic Systems', clientId: civiclayer.id },

    // WellSpring Labs companies (8 companies, 12 contacts)
    { firstName: 'Jonathan', lastName: 'Lewis', email: 'jlewis@vitalitybenefits.example', phone: '+1-212-555-0101', title: 'CEO', linkedin: 'linkedin.com/in/jonathanlewis', companyName: 'Vitality Benefits', clientId: wellspring.id },
    { firstName: 'Ashley', lastName: 'Walker', email: 'awalker@vitalitybenefits.example', phone: '+1-212-555-0102', title: 'VP Sales', linkedin: 'linkedin.com/in/ashleywalker', companyName: 'Vitality Benefits', clientId: wellspring.id },
    { firstName: 'Ryan', lastName: 'Hall', email: 'rhall@carepath.example', phone: '+1-615-555-0101', title: 'COO', linkedin: 'linkedin.com/in/ryanhall', companyName: 'CarePath Wellness', clientId: wellspring.id },
    { firstName: 'Jessica', lastName: 'Allen', email: 'jallen@healthbridge.example', phone: '+1-215-555-0101', title: 'Founder', linkedin: 'linkedin.com/in/jessicaallen', companyName: 'HealthBridge Platform', clientId: wellspring.id },
    { firstName: 'Brandon', lastName: 'Young', email: 'byoung@mendrx.example', phone: '+1-314-555-0101', title: 'CFO', linkedin: 'linkedin.com/in/brandonyoung', companyName: 'MendRx Pharmacy', clientId: wellspring.id },
    { firstName: 'Megan', lastName: 'King', email: 'mking@thrivemh.example', phone: '+1-303-555-0102', title: 'HR Director', linkedin: 'linkedin.com/in/meganking', companyName: 'Thrive Mental Health', clientId: wellspring.id },
    { firstName: 'Tyler', lastName: 'Scott', email: 'tscott@pulseoh.example', phone: '+1-216-555-0101', title: 'Head of Operations', linkedin: 'linkedin.com/in/tylerscott', companyName: 'Pulse Occupational Health', clientId: wellspring.id },
    { firstName: 'Kayla', lastName: 'Green', email: 'kgreen@flexbenefits.example', phone: '+1-860-555-0101', title: 'Director of Partnerships', linkedin: 'linkedin.com/in/kaylagreen', companyName: 'FlexBenefits Admin', clientId: wellspring.id },
    { firstName: 'Justin', lastName: 'Adams', email: 'jadams@flexbenefits.example', phone: '+1-860-555-0102', title: 'VP Operations', linkedin: 'linkedin.com/in/justinadams', companyName: 'FlexBenefits Admin', clientId: wellspring.id },
    { firstName: 'Brittany', lastName: 'Baker', email: 'bbaker@wellnessiq.example', phone: '+1-608-555-0101', title: 'CEO', linkedin: 'linkedin.com/in/brittanybaker', companyName: 'WellnessIQ Analytics', clientId: wellspring.id },
    { firstName: 'Alexander', lastName: 'Nelson', email: 'anelson@healthbridge.example', phone: '+1-215-555-0102', title: 'Director of Strategy', linkedin: 'linkedin.com/in/alexandernelson', companyName: 'HealthBridge Platform', clientId: wellspring.id },
    { firstName: 'Samantha', lastName: 'Hill', email: 'shill@mendrx.example', phone: '+1-314-555-0102', title: 'Procurement Manager', linkedin: 'linkedin.com/in/samanthahill', companyName: 'MendRx Pharmacy', clientId: wellspring.id },
  ];

  // Create contacts by matching company name
  for (const contact of contactsData) {
    const company = companies.find(c => c.name === contact.companyName);
    if (company) {
      await prisma.contact.create({
        data: {
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          title: contact.title,
          linkedin: contact.linkedin,
          clientId: contact.clientId,
          companyId: company.id,
        },
      });
    }
  }

  console.log('✅ Created 36 contacts');

  // Fetch created contacts to link deals
  const contacts = await prisma.contact.findMany({
    include: { company: true },
  });

  // Deal data: 8 per client (24 total) distributed across stages
  const baseDate = new Date('2024-01-15');
  const dealsData = [
    // Northstar Climate (8 deals)
    { name: 'Aura Solar - Enterprise Platform License', value: 85000, stage: 'PROPOSAL', probability: 60, expectedCloseDays: 45, companyName: 'Aura Solar', contactEmail: 'mchen@aurasolar.example', clientId: northstar.id },
    { name: 'TerraGrid Energy - Grid Integration Pilot', value: 42000, stage: 'DISCOVERY', probability: 25, expectedCloseDays: 60, companyName: 'TerraGrid Energy', contactEmail: 'jokonkwo@terragrid.example', clientId: northstar.id },
    { name: 'CarbonSense Analytics - Carbon Accounting Expansion', value: 28500, stage: 'QUALIFIED', probability: 40, expectedCloseDays: 30, companyName: 'CarbonSense Analytics', contactEmail: 'dpark@carbonsense.example', clientId: northstar.id },
    { name: 'GreenHaven Materials - Sustainable Supply Chain', value: 115000, stage: 'NEGOTIATION', probability: 80, expectedCloseDays: 15, companyName: 'GreenHaven Materials', contactEmail: 'skim@greenhaven.example', clientId: northstar.id },
    { name: 'BlueOcean Carbon - Blue Carbon Credits Program', value: 19500, stage: 'LEAD', probability: 15, expectedCloseDays: 90, companyName: 'BlueOcean Carbon', contactEmail: 'mthompson@blueocean.example', clientId: northstar.id },
    { name: 'Windward Turbines - Wind Farm Monitoring Suite', value: 142000, stage: 'WON', probability: 100, expectedCloseDays: -10, companyName: 'Windward Turbines', contactEmail: 'lnguyen@windward.example', clientId: northstar.id },
    { name: 'Solaris Storage - Battery Management Platform', value: 67000, stage: 'DISCOVERY', probability: 30, expectedCloseDays: 75, companyName: 'Solaris Storage', contactEmail: 'jwu@solarisstorage.example', clientId: northstar.id },
    { name: 'EcoFlux Consulting - ESG Reporting Framework', value: 33000, stage: 'LOST', probability: 0, expectedCloseDays: -30, companyName: 'EcoFlux Consulting', contactEmail: 'tanderson@ecoflux.example', clientId: northstar.id },

    // CivicLayer (8 deals)
    { name: 'MuniWorks Platform - Municipal ERP Deployment', value: 125000, stage: 'PROPOSAL', probability: 65, expectedCloseDays: 40, companyName: 'MuniWorks Platform', contactEmail: 'cwilliams@muniworks.example', clientId: civiclayer.id },
    { name: 'TransitLogic Systems - Real-time Transit Analytics', value: 92000, stage: 'QUALIFIED', probability: 45, expectedCloseDays: 50, companyName: 'TransitLogic Systems', contactEmail: 'dmartinez@transitlogic.example', clientId: civiclayer.id },
    { name: 'PermitFlow - Permit Automation Suite', value: 56000, stage: 'DISCOVERY', probability: 35, expectedCloseDays: 65, companyName: 'PermitFlow', contactEmail: 'mtaylor@permitflow.example', clientId: civiclayer.id },
    { name: 'CivicSense Data - Civic Analytics Platform', value: 38000, stage: 'LEAD', probability: 20, expectedCloseDays: 120, companyName: 'CivicSense Data', contactEmail: 'kbrown@civicsense.example', clientId: civiclayer.id },
    { name: 'InfrastructureIQ - Bridge Monitoring Expansion', value: 78000, stage: 'NEGOTIATION', probability: 75, expectedCloseDays: 20, companyName: 'InfrastructureIQ', contactEmail: 'lwilson@infrastructureiq.example', clientId: civiclayer.id },
    { name: 'PublicRecord Hub - Digital Records Migration', value: 24000, stage: 'WON', probability: 100, expectedCloseDays: -5, companyName: 'PublicRecord Hub', contactEmail: 'smiller@publicrecord.example', clientId: civiclayer.id },
    { name: 'CityPulse IoT - Smart City Sensor Network', value: 155000, stage: 'PROPOSAL', probability: 55, expectedCloseDays: 55, companyName: 'CityPulse IoT', contactEmail: 'nmoore@citypulse.example', clientId: civiclayer.id },
    { name: 'GovSecure Identity - Digital Identity Platform', value: 198000, stage: 'DISCOVERY', probability: 30, expectedCloseDays: 80, companyName: 'GovSecure Identity', contactEmail: 'rwhite@govsecure.example', clientId: civiclayer.id },

    // WellSpring Labs (8 deals)
    { name: 'Vitality Benefits - Employee Benefits Platform', value: 89000, stage: 'PROPOSAL', probability: 60, expectedCloseDays: 35, companyName: 'Vitality Benefits', contactEmail: 'jlewis@vitalitybenefits.example', clientId: wellspring.id },
    { name: 'CarePath Wellness - Corporate Wellness Program', value: 45000, stage: 'QUALIFIED', probability: 40, expectedCloseDays: 45, companyName: 'CarePath Wellness', contactEmail: 'rhall@carepath.example', clientId: wellspring.id },
    { name: 'HealthBridge Platform - Health Navigation Expansion', value: 72000, stage: 'NEGOTIATION', probability: 85, expectedCloseDays: 10, companyName: 'HealthBridge Platform', contactEmail: 'jallen@healthbridge.example', clientId: wellspring.id },
    { name: 'MendRx Pharmacy - PBM Analytics Suite', value: 135000, stage: 'DISCOVERY', probability: 25, expectedCloseDays: 70, companyName: 'MendRx Pharmacy', contactEmail: 'byoung@mendrx.example', clientId: wellspring.id },
    { name: 'Thrive Mental Health - Mental Health Platform Pilot', value: 31000, stage: 'LEAD', probability: 15, expectedCloseDays: 100, companyName: 'Thrive Mental Health', contactEmail: 'mking@thrivemh.example', clientId: wellspring.id },
    { name: 'Pulse Occupational Health - Workplace Safety Compliance', value: 58000, stage: 'WON', probability: 100, expectedCloseDays: -15, companyName: 'Pulse Occupational Health', contactEmail: 'tscott@pulseoh.example', clientId: wellspring.id },
    { name: 'FlexBenefits Admin - Benefits Administration Modernization', value: 64000, stage: 'QUALIFIED', probability: 50, expectedCloseDays: 40, companyName: 'FlexBenefits Admin', contactEmail: 'kgreen@flexbenefits.example', clientId: wellspring.id },
    { name: 'WellnessIQ Analytics - Population Health Insights', value: 41000, stage: 'LOST', probability: 0, expectedCloseDays: -45, companyName: 'WellnessIQ Analytics', contactEmail: 'bbaker@wellnessiq.example', clientId: wellspring.id },
  ];

  // Create deals by matching company and contact
  for (const deal of dealsData) {
    const company = companies.find(c => c.name === deal.companyName);
    const contact = contacts.find(c => c.email === deal.contactEmail);
    if (company && contact) {
      const expectedClose = new Date(baseDate);
      expectedClose.setDate(expectedClose.getDate() + deal.expectedCloseDays);
      
      const createdAt = new Date(baseDate);
      createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30) - 5);

      await prisma.deal.create({
        data: {
          name: deal.name,
          value: deal.value,
          stage: deal.stage,
          probability: deal.probability,
          expectedClose: deal.expectedCloseDays > 0 ? expectedClose : new Date(baseDate.getTime() + deal.expectedCloseDays * 24 * 60 * 60 * 1000),
          clientId: deal.clientId,
          companyId: company.id,
          contactId: contact.id,
          createdAt,
          updatedAt: new Date(createdAt.getTime() + Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000),
          metadata: JSON.stringify({ source: 'Inbound' }),
        },
      });
    }
  }

  console.log('✅ Created 24 deals');

  // Fetch created deals and contacts to link activities
  const deals = await prisma.deal.findMany({
    include: { company: true, contact: true, client: true },
  });

  // Activity types from schema
  const activityTypes = [
    'EMAIL_SENT', 'EMAIL_OPENED', 'EMAIL_REPLIED', 'LINKEDIN_TASK',
    'CALL', 'MEETING', 'DEAL_CREATED', 'STAGE_CHANGED', 'NOTE'
  ];

  // Create 96 activities distributed across deals and clients
  // Each deal gets ~4 activities, spread over time
  const activityTemplates = [
    // Email activities
    { type: 'EMAIL_SENT', subjects: [
      'Proposal: Partnership Agreement',
      'Follow-up: Discovery Discussion',
      'Pricing Clarification',
      'Introduction to Procurement Team',
      'Next Steps Confirmation',
      'Technical Requirements Document',
      'Contract Terms Review',
      'Implementation Timeline',
    ], bodies: [
      'Sent the updated proposal with revised pricing terms.',
      'Following up on our discovery call from last week.',
      'Clarifying the pricing structure for the enterprise tier.',
      'Introducing our procurement specialist to your team.',
      'Confirming next steps and timeline for the pilot.',
      'Sharing the technical requirements document for review.',
      'Reviewing contract terms with legal team.',
      'Providing the implementation timeline and milestones.',
    ]},
    { type: 'EMAIL_OPENED', subjects: [
      'Proposal: Partnership Agreement',
      'Follow-up: Discovery Discussion',
      'Pricing Clarification',
      'Introduction to Procurement Team',
      'Next Steps Confirmation',
    ], bodies: ['', '', '', '', ''] },
    { type: 'EMAIL_REPLIED', subjects: [
      'Re: Proposal: Partnership Agreement',
      'Re: Follow-up: Discovery Discussion',
      'Re: Pricing Clarification',
      'Re: Next Steps Confirmation',
    ], bodies: [
      'Thanks for the proposal. We have a few questions about the implementation timeline.',
      'Appreciate the follow-up. Our team is reviewing internally.',
      'The pricing looks reasonable. Can we schedule a call to discuss?',
      'Next steps look good. Let\'s move forward with the pilot.',
    ]},
    // LinkedIn activities
    { type: 'LINKEDIN_TASK', subjects: [
      'LinkedIn Connection Request',
      'LinkedIn Follow-up Message',
      'LinkedIn Prospect Engagement',
    ], bodies: [
      'Sent connection request with personalized note.',
      'Followed up on LinkedIn after no response to connection request.',
      'Engaged with prospect\'s recent post on industry trends.',
    ]},
    // Call activities
    { type: 'CALL', subjects: [
      'Discovery Call',
      'Qualification Call',
      'Pricing Discussion',
      'Procurement Call',
      'Follow-up Call',
      'Technical Deep Dive Call',
      'Executive Alignment Call',
    ], bodies: [
      'Discussed business challenges and requirements.',
      'Qualified budget, authority, need, and timeline.',
      'Reviewed pricing options and contract terms.',
      'Discussed procurement process and requirements.',
      'Followed up on proposal questions.',
      'Deep dive into technical architecture and integration.',
      'Aligned on strategic value with executive stakeholders.',
    ], metadata: [
      '{"duration": 25}',
      '{"duration": 30}',
      '{"duration": 35}',
      '{"duration": 20}',
      '{"duration": 15}',
      '{"duration": 45}',
      '{"duration": 40}',
    ]},
    // Meeting activities
    { type: 'MEETING', subjects: [
      'Discovery Meeting',
      'Product Demonstration',
      'Executive Review',
      'Commercial Discussion',
      'Technical Workshop',
    ], bodies: [
      'Initial discovery meeting with key stakeholders.',
      'Live product demo tailored to use cases.',
      'Executive review of business case and ROI.',
      'Commercial terms and contract negotiation.',
      'Technical workshop with engineering teams.',
    ], metadata: [
      '{"duration": 60, "platform": "Zoom"}',
      '{"duration": 45, "platform": "Teams"}',
      '{"duration": 30, "platform": "Zoom"}',
      '{"duration": 60, "platform": "Teams"}',
      '{"duration": 90, "platform": "Zoom"}',
    ]},
    // Deal Created
    { type: 'DEAL_CREATED', subjects: [
      'Deal Created: New Opportunity',
    ], bodies: [
      'New deal created from inbound inquiry.',
    ]},
    // Stage Changed
    { type: 'STAGE_CHANGED', subjects: [
      'Stage Changed: LEAD → QUALIFIED',
      'Stage Changed: QUALIFIED → DISCOVERY',
      'Stage Changed: DISCOVERY → PROPOSAL',
      'Stage Changed: PROPOSAL → NEGOTIATION',
      'Stage Changed: NEGOTIATION → WON',
      'Stage Changed: PROPOSAL → LOST',
    ], bodies: [
      'Moved to qualified after discovery call.',
      'Advanced to discovery after qualification.',
      'Proposal sent, moving to proposal stage.',
      'Entered negotiation after proposal review.',
      'Deal closed won after successful negotiation.',
      'Deal lost to competitor after final review.',
    ], metadata: [
      '{"fromStage": "LEAD", "toStage": "QUALIFIED"}',
      '{"fromStage": "QUALIFIED", "toStage": "DISCOVERY"}',
      '{"fromStage": "DISCOVERY", "toStage": "PROPOSAL"}',
      '{"fromStage": "PROPOSAL", "toStage": "NEGOTIATION"}',
      '{"fromStage": "NEGOTIATION", "toStage": "WON"}',
      '{"fromStage": "PROPOSAL", "toStage": "LOST"}',
    ]},
    // Note activities
    { type: 'NOTE', subjects: [
      'Account Research Notes',
      'Buying Committee Update',
      'Competitive Context',
      'Internal Deal Note',
      'Procurement Process Notes',
    ], bodies: [
      'Researched company financials and recent news.',
      'Identified additional stakeholders in buying committee.',
      'Competitor X is also in the evaluation.',
      'Internal note: pricing approved by VP Sales.',
      'Procurement requires 3 quotes and security review.',
    ]},
  ];

  const activitiesData = [];
  const baseActivityDate = new Date('2024-01-01');

  for (const deal of deals) {
    // Each deal gets 3-5 activities
    const numActivities = 3 + (deal.id.charCodeAt(0) % 3);
    const dealCreatedAt = new Date(deal.createdAt);
    
    for (let i = 0; i < numActivities; i++) {
      const template = activityTypes[i % activityTypes.length];
      const templateData = activityTemplates.find(t => t.type === template) || activityTemplates[0];
      const subjectIndex = (deal.id.charCodeAt(i % deal.id.length) + i) % templateData.subjects.length;
      const bodyIndex = subjectIndex % templateData.bodies.length;
      const metadataIndex = templateData.metadata ? (subjectIndex % templateData.metadata.length) : 0;
      
      // Activity date: between deal creation and now, spread out
      const daysSinceCreated = Math.floor((new Date().getTime() - dealCreatedAt.getTime()) / (1000 * 60 * 60 * 24));
      const activityDayOffset = Math.min(i * 7 + (deal.id.charCodeAt(0) % 7), Math.max(0, daysSinceCreated - 1));
      const activityDate = new Date(dealCreatedAt.getTime() + activityDayOffset * 24 * 60 * 60 * 1000);
      
      // Add some hours/minutes variation
      activityDate.setHours(9 + (deal.id.charCodeAt(i) % 8), (deal.id.charCodeAt(i + 1) % 6) * 10);
      
      activitiesData.push({
        type: template,
        subject: templateData.subjects[subjectIndex],
        body: templateData.bodies[bodyIndex],
        metadata: templateData.metadata ? templateData.metadata[metadataIndex] : JSON.stringify({}),
        clientId: deal.clientId,
        dealId: deal.id,
        contactId: deal.contactId,
        createdAt: activityDate,
      });
    }
  }

  // Ensure we have exactly 96 activities (trim or pad)
  const targetActivities = 96;
  if (activitiesData.length > targetActivities) {
    activitiesData.length = targetActivities;
  } else if (activitiesData.length < targetActivities) {
    // Add extra activities to the last few deals
    const extraNeeded = targetActivities - activitiesData.length;
    const lastDeals = deals.slice(-3);
    for (let i = 0; i < extraNeeded; i++) {
      const deal = lastDeals[i % lastDeals.length];
      const template = activityTypes[(i + 5) % activityTypes.length];
      const templateData = activityTemplates.find(t => t.type === template) || activityTemplates[0];
      const subjectIndex = i % templateData.subjects.length;
      const bodyIndex = subjectIndex % templateData.bodies.length;
      
      const activityDate = new Date(baseActivityDate);
      activityDate.setDate(activityDate.getDate() + 60 + i);
      activityDate.setHours(10 + (i % 6), (i * 15) % 60);
      
      activitiesData.push({
        type: template,
        subject: templateData.subjects[subjectIndex] + ` (Follow-up ${i + 1})`,
        body: templateData.bodies[bodyIndex],
        metadata: templateData.metadata ? templateData.metadata[0] : JSON.stringify({}),
        clientId: deal.clientId,
        dealId: deal.id,
        contactId: deal.contactId,
        createdAt: activityDate,
      });
    }
  }

  // Create all activities
  for (const activity of activitiesData) {
    await prisma.activity.create({ data: activity });
  }

  console.log('✅ Created 96 activities');

  // Fetch created deals to link meetings
  const dealsForMeetings = await prisma.deal.findMany({
    include: { company: true, contact: true, client: true },
  });

  // Create 15 meetings with intelligence (5 per client)
  const meetingsData = [
    // Northstar Climate (5 meetings)
    {
      title: 'Aura Solar - Discovery Call',
      dealName: 'Aura Solar - Enterprise Platform License',
      type: 'Discovery Call',
      daysAfterBase: 10,
      durationMinutes: 45,
      platform: 'Zoom',
      source: 'Granola',
      summary: 'Marcus Chen (CEO) and Elena Rodriguez (VP Sales) walked through their current sales process challenges. They use a patchwork of spreadsheets and a legacy CRM that doesn\'t integrate with their email platform. The team of 12 reps spends 4+ hours/week on manual data entry.',
      painPoints: ['Fragmented sales reporting across tools', 'No visibility into rep activity and pipeline health', 'Manual data entry consuming 4+ hrs/week per rep', 'Inconsistent CRM data leading to forecast inaccuracies'],
      actionItems: ['Send platform overview deck', 'Schedule technical demo with engineering team', 'Provide ROI calculator for 12-rep team'],
      nextStep: 'Technical demo scheduled for next Tuesday 2pm EST',
      sentiment: 'positive',
      topics: ['Current CRM pain points', 'Team size and structure', 'Integration requirements', 'Budget range'],
    },
    {
      title: 'TerraGrid Energy - Product Demo',
      dealName: 'TerraGrid Energy - Grid Integration Pilot',
      type: 'Product Demo',
      daysAfterBase: 22,
      durationMinutes: 60,
      platform: 'Teams',
      source: 'Attio Call Intelligence',
      summary: 'James Okonkwo (COO) and Priya Sharma (Head of Ops) attended a live demo focused on grid integration workflows. They were impressed with the real-time monitoring capabilities but raised concerns about data migration from their existing SCADA system.',
      painPoints: ['SCADA data migration complexity', 'Need for real-time grid visibility', 'Current system lacks predictive analytics', 'Integration with existing OT/IT infrastructure'],
      actionItems: ['Share technical specs for SCADA integration', 'Provide data migration timeline estimate', 'Schedule follow-up with IT director'],
      nextStep: 'Technical review with IT team next Thursday',
      sentiment: 'neutral',
      topics: ['Grid integration workflows', 'SCADA system migration', 'Real-time monitoring', 'Predictive analytics'],
    },
    {
      title: 'CarbonSense Analytics - Pricing Discussion',
      dealName: 'CarbonSense Analytics - Carbon Accounting Expansion',
      type: 'Commercial Discussion',
      daysAfterBase: 35,
      durationMinutes: 30,
      platform: 'Zoom',
      source: 'Granola',
      summary: 'David Park (Founder) reviewed the proposal for the carbon accounting expansion. He liked the feature set but pushed back on the per-seat pricing model, requesting a usage-based alternative. He needs to present to his board next month.',
      painPoints: ['Per-seat pricing doesn\'t match variable usage', 'Board requires clear cost predictability', 'Current tools lack audit-ready reporting', 'Need for white-label client portal'],
      actionItems: ['Prepare usage-based pricing model', 'Create board-ready one-pager', 'Schedule executive review call'],
      nextStep: 'Send revised pricing model by Friday',
      sentiment: 'concerned',
      topics: ['Pricing model options', 'Board presentation requirements', 'Audit-ready reporting', 'White-label portal'],
    },
    {
      title: 'GreenHaven Materials - Procurement Review',
      dealName: 'GreenHaven Materials - Sustainable Supply Chain',
      type: 'Procurement Review',
      daysAfterBase: 48,
      durationMinutes: 60,
      platform: 'Teams',
      source: 'Attio Call Intelligence',
      summary: 'Sarah Kim (Director of Sustainability) and Jennifer Wu (Head of Procurement) walked through procurement requirements. They need 3 vendor quotes, SOC2 compliance, and a 90-day pilot clause. Legal review will add 2-3 weeks.',
      painPoints: ['Procurement requires 3 competitive quotes', 'SOC2 compliance mandatory', '90-day pilot clause required', 'Legal review adds 2-3 weeks to timeline'],
      actionItems: ['Provide SOC2 documentation', 'Submit formal quote with pilot terms', 'Introduce reference customer in sustainable materials'],
      nextStep: 'Submit final quote with pilot terms by Monday',
      sentiment: 'neutral',
      topics: ['Procurement process', 'SOC2 compliance', 'Pilot program structure', 'Reference customers'],
    },
    {
      title: 'Windward Turbines - Executive Review (Closed Won)',
      dealName: 'Windward Turbines - Wind Farm Monitoring Suite',
      type: 'Executive Review',
      daysAfterBase: 55,
      durationMinutes: 30,
      platform: 'Zoom',
      source: 'Granola',
      summary: 'Lisa Nguyen (VP Partnerships) and Robert Garcia (CFO) signed off on the wind farm monitoring suite. The executive team was convinced by the ROI projection of 3x within 18 months. Contract signed, onboarding begins next week.',
      painPoints: ['Multiple wind farms with no centralized monitoring', 'Reactive maintenance causing 15% downtime', 'No predictive failure analytics', 'Regulatory reporting is manual and error-prone'],
      actionItems: ['Kick off onboarding with implementation team', 'Schedule data migration workshop', 'Assign customer success manager'],
      nextStep: 'Onboarding kickoff call scheduled for Monday 10am',
      sentiment: 'positive',
      topics: ['Contract signing', 'Onboarding timeline', 'ROI validation', 'Customer success assignment'],
    },

    // CivicLayer (5 meetings)
    {
      title: 'MuniWorks Platform - Discovery Call',
      dealName: 'MuniWorks Platform - Municipal ERP Deployment',
      type: 'Discovery Call',
      daysAfterBase: 12,
      durationMinutes: 45,
      platform: 'Zoom',
      source: 'Granola',
      summary: 'Christopher Williams (CEO) and Patricia Davis (VP Sales) described their municipal ERP needs across 15 departments. Current system is 15 years old, on-premise only, and lacks mobile access for field workers. Budget approved for Q2.',
      painPoints: ['15-year-old legacy on-premise system', 'No mobile access for field workers', 'Siloed data across 15 departments', 'Manual reporting for state compliance'],
      actionItems: ['Send municipal ERP case studies', 'Schedule product demo for department heads', 'Provide implementation timeline for 15 departments'],
      nextStep: 'Product demo for department heads next Wednesday',
      sentiment: 'positive',
      topics: ['Legacy system replacement', 'Mobile field access', 'Department integration', 'State compliance reporting'],
    },
    {
      title: 'TransitLogic Systems - Technical Workshop',
      dealName: 'TransitLogic Systems - Real-time Transit Analytics',
      type: 'Technical Workshop',
      daysAfterBase: 28,
      durationMinutes: 90,
      platform: 'Teams',
      source: 'Attio Call Intelligence',
      summary: 'Daniel Martinez (COO) and Stephanie Clark (Procurement Manager) led a technical workshop with their engineering team. They need real-time GTFS-RT ingestion, API-first architecture, and SOC2 Type II. Their current vendor\'s API has 99.2% uptime SLA which is insufficient.',
      painPoints: ['Current vendor API only 99.2% uptime', 'Need real-time GTFS-RT data ingestion', 'API-first architecture required', 'SOC2 Type II certification mandatory'],
      actionItems: ['Share API documentation and SLA details', 'Provide SOC2 Type II attestation', 'Schedule security review with their CISO'],
      nextStep: 'Security review call with CISO in 2 weeks',
      sentiment: 'positive',
      topics: ['GTFS-RT integration', 'API architecture', 'SOC2 compliance', 'Uptime SLA requirements'],
    },
    {
      title: 'PermitFlow - Procurement Review',
      dealName: 'PermitFlow - Permit Automation Suite',
      type: 'Procurement Review',
      daysAfterBase: 40,
      durationMinutes: 45,
      platform: 'Zoom',
      source: 'Granola',
      summary: 'Michelle Taylor (Founder) and Kevin Brown (Head of Ops) reviewed procurement requirements. City procurement requires public bid process (RFP) which adds 60 days. They need FedRAMP moderate and integration with Tyler Technologies.',
      painPoints: ['Public RFP process adds 60 days', 'FedRAMP Moderate certification required', 'Integration with Tyler Technologies ERP', 'Multi-year contract approval needed'],
      actionItems: ['Initiate FedRAMP Moderate sponsorship', 'Provide Tyler Technologies integration spec', 'Prepare RFP response template'],
      nextStep: 'Submit FedRAMP sponsorship request this week',
      sentiment: 'concerned',
      topics: ['Public procurement process', 'FedRAMP requirements', 'ERP integration', 'RFP timeline'],
    },
    {
      title: 'InfrastructureIQ - Commercial Discussion',
      dealName: 'InfrastructureIQ - Bridge Monitoring Expansion',
      type: 'Commercial Discussion',
      daysAfterBase: 52,
      durationMinutes: 60,
      platform: 'Teams',
      source: 'Granola',
      summary: 'Laura Wilson (Director of Partnerships) negotiated terms for expanding bridge monitoring to 200 additional sensors. They want volume discount for 3-year commitment. Pushed for 20% discount; we countered at 15% with premium support included.',
      painPoints: ['Scaling from 50 to 250 sensors', 'Need predictable multi-year pricing', 'Current vendor lacks volume discounts', 'Sensor data integration with GIS systems'],
      actionItems: ['Finalize 3-year contract with 15% discount', 'Include premium support tier', 'Schedule GIS integration planning session'],
      nextStep: 'Send final contract for legal review',
      sentiment: 'positive',
      topics: ['Volume pricing', 'Multi-year commitment', 'Sensor scaling', 'GIS integration'],
    },
    {
      title: 'PublicRecord Hub - Executive Review (Closed Won)',
      dealName: 'PublicRecord Hub - Digital Records Migration',
      type: 'Executive Review',
      daysAfterBase: 58,
      durationMinutes: 30,
      platform: 'Zoom',
      source: 'Attio Call Intelligence',
      summary: 'Steven Miller (CEO) approved the digital records migration project. The 2.4M document migration will be phased over 6 months. They valued the automated OCR and classification features for FOIA compliance.',
      painPoints: ['2.4M documents in physical storage', 'FOIA requests take 10+ days to fulfill', 'No searchable digital archive', 'Compliance risk with current manual process'],
      actionItems: ['Kick off migration project', 'Assign project manager', 'Schedule phase 1 planning (500k docs)'],
      nextStep: 'Project kickoff scheduled for next Monday',
      sentiment: 'positive',
      topics: ['Contract approval', 'Migration phasing', 'OCR/classification', 'FOIA compliance'],
    },

    // WellSpring Labs (5 meetings)
    {
      title: 'Vitality Benefits - Discovery Call',
      dealName: 'Vitality Benefits - Employee Benefits Platform',
      type: 'Discovery Call',
      daysAfterBase: 8,
      durationMinutes: 50,
      platform: 'Zoom',
      source: 'Granola',
      summary: 'Jonathan Lewis (CEO) and Ashley Walker (VP Sales) described their need to consolidate 4 benefits vendors into one platform. 180K employees across 3 countries. Current admin spend is $2.4M/year. They want self-service portal and real-time eligibility.',
      painPoints: ['4 separate benefits vendors', '180K employees across 3 countries', '$2.4M annual admin spend', 'No self-service for employees', 'Manual eligibility verification'],
      actionItems: ['Send consolidation case study', 'Schedule platform demo for benefits team', 'Provide 3-country compliance matrix'],
      nextStep: 'Platform demo for benefits team next Thursday',
      sentiment: 'positive',
      topics: ['Vendor consolidation', 'Multi-country compliance', 'Self-service portal', 'Admin cost reduction'],
    },
    {
      title: 'CarePath Wellness - Product Demo',
      dealName: 'CarePath Wellness - Corporate Wellness Program',
      type: 'Product Demo',
      daysAfterBase: 20,
      durationMinutes: 45,
      platform: 'Teams',
      source: 'Granola',
      summary: 'Ryan Hall (COO) and Megan King (HR Director) attended a wellness platform demo. They liked the engagement gamification but need HIPAA compliance verification and integration with their Workday HRIS. Current vendor contract expires in 90 days.',
      painPoints: ['Current vendor contract expiring in 90 days', 'Need HIPAA compliance verification', 'Workday HRIS integration required', 'Low employee engagement with current platform'],
      actionItems: ['Provide HIPAA compliance documentation', 'Share Workday integration spec', 'Schedule pilot program design session'],
      nextStep: 'HIPAA compliance docs sent, pilot design session next week',
      sentiment: 'positive',
      topics: ['Wellness engagement', 'HIPAA compliance', 'Workday integration', 'Contract renewal timeline'],
    },
    {
      title: 'HealthBridge Platform - Pricing Negotiation',
      dealName: 'HealthBridge Platform - Health Navigation Expansion',
      type: 'Commercial Discussion',
      daysAfterBase: 38,
      durationMinutes: 60,
      platform: 'Zoom',
      source: 'Attio Call Intelligence',
      summary: 'Jessica Allen (Founder) and Alexander Nelson (Director of Strategy) negotiated the health navigation expansion. They want to add 50K members but budget is fixed. Discussed phased rollout: 20K now, 30K in Q3. Need to finalize by end of month.',
      painPoints: ['Budget fixed but need to add 50K members', 'Current navigation lacks provider quality scores', 'Member satisfaction scores declining', 'Need bilingual support (English/Spanish)'],
      actionItems: ['Prepare phased rollout proposal (20K + 30K)', 'Include bilingual support in scope', 'Finalize contract by month end'],
      nextStep: 'Send phased proposal by Wednesday',
      sentiment: 'neutral',
      topics: ['Phased rollout', 'Budget constraints', 'Provider quality scores', 'Bilingual support'],
    },
    {
      title: 'Pulse Occupational Health - Executive Review (Closed Won)',
      dealName: 'Pulse Occupational Health - Workplace Safety Compliance',
      type: 'Executive Review',
      daysAfterBase: 45,
      durationMinutes: 30,
      platform: 'Teams',
      source: 'Granola',
      summary: 'Tyler Scott (Head of Ops) and Justin Adams (VP Operations) signed the workplace safety compliance contract. OSHA reporting automation and incident management were key drivers. 12-site rollout begins in 2 weeks.',
      painPoints: ['Manual OSHA reporting across 12 sites', 'Incident response time averaging 4 hours', 'No centralized safety dashboard', 'Audit findings from last year unresolved'],
      actionItems: ['Kick off 12-site implementation', 'Assign dedicated implementation engineer', 'Schedule OSHA reporting training'],
      nextStep: 'Implementation kickoff in 2 weeks',
      sentiment: 'positive',
      topics: ['Contract signing', 'OSHA automation', '12-site rollout', 'Incident management'],
    },
    {
      title: 'WellnessIQ Analytics - Procurement Review (Lost Deal)',
      dealName: 'WellnessIQ Analytics - Population Health Insights',
      type: 'Procurement Review',
      daysAfterBase: 30,
      durationMinutes: 40,
      platform: 'Zoom',
      source: 'Attio Call Intelligence',
      summary: 'Brittany Baker (CEO) and Samantha Hill (Procurement Manager) informed us they selected a competitor. The competitor offered a bundled analytics + EHR integration package at 20% lower price. They valued our deeper analytics but budget drove the decision.',
      painPoints: ['Budget constraints forced vendor consolidation', 'Need EHR integration bundled with analytics', 'Current analytics lack predictive modeling', 'Population health reporting for 500K members'],
      actionItems: ['Request debrief for competitive intelligence', 'Keep relationship warm for future expansion', 'Share product roadmap for EHR integration'],
      nextStep: 'Schedule competitive debrief call',
      sentiment: 'concerned',
      topics: ['Competitive loss', 'Budget-driven decision', 'EHR integration bundling', 'Future roadmap'],
    },
  ];

  // Create meetings by matching deal
  for (const meeting of meetingsData) {
    const deal = dealsForMeetings.find(d => d.name === meeting.dealName);
    if (deal) {
      const startTime = new Date(baseDate);
      startTime.setDate(startTime.getDate() + meeting.daysAfterBase);
      startTime.setHours(10 + (Math.random() * 4), (Math.random() * 4) * 15);
      
      const endTime = new Date(startTime.getTime() + meeting.durationMinutes * 60 * 1000);
      
      // Store intelligence in metadata as JSON
      const metadata = JSON.stringify({
        type: meeting.type,
        source: meeting.source,
        summary: meeting.summary,
        painPoints: meeting.painPoints,
        actionItems: meeting.actionItems,
        nextStep: meeting.nextStep,
        sentiment: meeting.sentiment,
        topics: meeting.topics,
      });

      await prisma.meeting.create({
        data: {
          title: meeting.title,
          startTime,
          endTime,
          platform: meeting.platform,
          meetingUrl: `https://${meeting.platform.toLowerCase()}.example.com/j/${Math.random().toString(36).substring(7)}`,
          recordingUrl: Math.random() > 0.5 ? `https://recordings.example.com/${Math.random().toString(36).substring(7)}` : null,
          notes: '',
          metadata,
          clientId: deal.clientId,
          dealId: deal.id,
          contactId: deal.contactId,
          createdAt: startTime,
          updatedAt: startTime,
        },
      });
    }
  }

  console.log('✅ Created 15 meetings');

  // Prospect statuses from schema
  const prospectStatuses = ['NEW', 'ENRICHED', 'QUALIFIED', 'CONTACTED', 'ENGAGED', 'CONVERTED', 'DISQUALIFIED'];
  const prospectSources = ['Apollo', 'Clay', 'LinkedIn', 'Website', 'Referral', 'Manual Research'];

  // Create 30 prospects (10 per client)
  const prospectsData = [
    // Northstar Climate (10 prospects)
    { firstName: 'David', lastName: 'Martinez', email: 'dmartinez@solarpower.example', phone: '+1-303-555-0201', title: 'VP Engineering', company: 'SolarPower Inc', source: 'Apollo', status: 'QUALIFIED', score: 82, clientId: northstar.id, companyName: 'SolarPower Inc' },
    { firstName: 'Lisa', lastName: 'Anderson', email: 'landerson@greenenergy.example', phone: '+1-303-555-0202', title: 'Director of Operations', company: 'GreenEnergy Solutions', source: 'Clay', status: 'ENRICHED', score: 65, clientId: northstar.id, companyName: 'GreenEnergy Solutions' },
    { firstName: 'Michael', lastName: 'Thompson', email: 'mthompson@windtech.example', phone: '+1-720-555-0203', title: 'CTO', company: 'WindTech Systems', source: 'LinkedIn', status: 'NEW', score: 45, clientId: northstar.id, companyName: 'WindTech Systems' },
    { firstName: 'Sarah', lastName: 'Davis', email: 'sdavis@cleanpower.example', phone: '+1-303-555-0204', title: 'VP Sales', company: 'CleanPower Corp', source: 'Website', status: 'CONTACTED', score: 58, clientId: northstar.id, companyName: 'CleanPower Corp' },
    { firstName: 'James', lastName: 'Wilson', email: 'jwilson@solargrid.example', phone: '+1-720-555-0205', title: 'Head of Procurement', company: 'SolarGrid Technologies', source: 'Referral', status: 'ENGAGED', score: 74, clientId: northstar.id, companyName: 'SolarGrid Technologies' },
    { firstName: 'Emily', lastName: 'Brown', email: 'ebrown@renewable.example', phone: '+1-303-555-0206', title: 'Founder', company: 'Renewable Analytics', source: 'Manual Research', status: 'NEW', score: 38, clientId: northstar.id, companyName: 'Renewable Analytics' },
    { firstName: 'Robert', lastName: 'Garcia', email: 'rgarcia@ecotech.example', phone: '+1-720-555-0207', title: 'Director of Strategy', company: 'EcoTech Innovations', source: 'Apollo', status: 'QUALIFIED', score: 88, clientId: northstar.id, companyName: 'EcoTech Innovations' },
    { firstName: 'Jennifer', lastName: 'Martinez', email: 'jmartinez@gridworks.example', phone: '+1-303-555-0208', title: 'VP Operations', company: 'GridWorks Energy', source: 'Clay', status: 'ENRICHED', score: 71, clientId: northstar.id, companyName: 'GridWorks Energy' },
    { firstName: 'Christopher', lastName: 'Taylor', email: 'ctaylor@sunpower.example', phone: '+1-720-555-0209', title: 'CEO', company: 'SunPower Dynamics', source: 'LinkedIn', status: 'CONTACTED', score: 62, clientId: northstar.id, companyName: 'SunPower Dynamics' },
    { firstName: 'Amanda', lastName: 'White', email: 'awhite@cleanwatts.example', phone: '+1-303-555-0210', title: 'Director of Sustainability', company: 'CleanWatts Inc', source: 'Referral', status: 'ENGAGED', score: 79, clientId: northstar.id, companyName: 'CleanWatts Inc' },

    // CivicLayer (10 prospects)
    { firstName: 'Daniel', lastName: 'Johnson', email: 'djohnson@munitech.example', phone: '+1-202-555-0201', title: 'IT Director', company: 'MuniTech Solutions', source: 'Apollo', status: 'QUALIFIED', score: 85, clientId: civiclayer.id, companyName: 'MuniTech Solutions' },
    { firstName: 'Michelle', lastName: 'Williams', email: 'mwilliams@cityworks.example', phone: '+1-202-555-0202', title: 'Procurement Director', company: 'CityWorks Municipal', source: 'Clay', status: 'ENRICHED', score: 68, clientId: civiclayer.id, companyName: 'CityWorks Municipal' },
    { firstName: 'Kevin', lastName: 'Brown', email: 'kbrown@govtech.example', phone: '+1-703-555-0203', title: 'CIO', company: 'GovTech Innovations', source: 'LinkedIn', status: 'NEW', score: 42, clientId: civiclayer.id, companyName: 'GovTech Innovations' },
    { firstName: 'Laura', lastName: 'Jones', email: 'ljones@publicworks.example', phone: '+1-202-555-0204', title: 'VP Operations', company: 'PublicWorks Digital', source: 'Website', status: 'CONTACTED', score: 55, clientId: civiclayer.id, companyName: 'PublicWorks Digital' },
    { firstName: 'Steven', lastName: 'Miller', email: 'smiller@civiccloud.example', phone: '+1-703-555-0205', title: 'Head of IT', company: 'CivicCloud Systems', source: 'Referral', status: 'ENGAGED', score: 77, clientId: civiclayer.id, companyName: 'CivicCloud Systems' },
    { firstName: 'Rebecca', lastName: 'Davis', email: 'rdavis@muniserve.example', phone: '+1-202-555-0206', title: 'Founder', company: 'MuniServe Platform', source: 'Manual Research', status: 'NEW', score: 35, clientId: civiclayer.id, companyName: 'MuniServe Platform' },
    { firstName: 'Matthew', lastName: 'Wilson', email: 'mwilson@stateworks.example', phone: '+1-703-555-0207', title: 'Director of Digital', company: 'StateWorks Technology', source: 'Apollo', status: 'QUALIFIED', score: 90, clientId: civiclayer.id, companyName: 'StateWorks Technology' },
    { firstName: 'Nicole', lastName: 'Moore', email: 'nmoore@cityconnect.example', phone: '+1-202-555-0208', title: 'VP Strategy', company: 'CityConnect Inc', source: 'Clay', status: 'ENRICHED', score: 73, clientId: civiclayer.id, companyName: 'CityConnect Inc' },
    { firstName: 'Anthony', lastName: 'Taylor', email: 'ataylor@govdigital.example', phone: '+1-703-555-0209', title: 'CTO', company: 'GovDigital Solutions', source: 'LinkedIn', status: 'CONTACTED', score: 60, clientId: civiclayer.id, companyName: 'GovDigital Solutions' },
    { firstName: 'Stephanie', lastName: 'Anderson', email: 'sanderson@publicsector.example', phone: '+1-202-555-0210', title: 'Head of Procurement', company: 'PublicSector Tech', source: 'Referral', status: 'ENGAGED', score: 81, clientId: civiclayer.id, companyName: 'PublicSector Tech' },

    // WellSpring Labs (10 prospects)
    { firstName: 'Jonathan', lastName: 'Thomas', email: 'jthomas@healthfirst.example', phone: '+1-212-555-0201', title: 'Benefits Director', company: 'HealthFirst Benefits', source: 'Apollo', status: 'QUALIFIED', score: 87, clientId: wellspring.id, companyName: 'HealthFirst Benefits' },
    { firstName: 'Ashley', lastName: 'Jackson', email: 'ajackson@wellness.example', phone: '+1-212-555-0202', title: 'HR Director', company: 'Wellness Corporate', source: 'Clay', status: 'ENRICHED', score: 70, clientId: wellspring.id, companyName: 'Wellness Corporate' },
    { firstName: 'Ryan', lastName: 'White', email: 'rwhite@vitality.example', phone: '+1-646-555-0203', title: 'CFO', company: 'Vitality Health Systems', source: 'LinkedIn', status: 'NEW', score: 40, clientId: wellspring.id, companyName: 'Vitality Health Systems' },
    { firstName: 'Megan', lastName: 'Harris', email: 'mharris@benefits.example', phone: '+1-212-555-0204', title: 'VP People', company: 'BenefitsPlus Inc', source: 'Website', status: 'CONTACTED', score: 53, clientId: wellspring.id, companyName: 'BenefitsPlus Inc' },
    { firstName: 'Tyler', lastName: 'Martin', email: 'tmartin@careco.example', phone: '+1-646-555-0205', title: 'Head of Total Rewards', company: 'CareCo Solutions', source: 'Referral', status: 'ENGAGED', score: 76, clientId: wellspring.id, companyName: 'CareCo Solutions' },
    { firstName: 'Kayla', lastName: 'Thompson', email: 'kthompson@mindful.example', phone: '+1-212-555-0206', title: 'Founder', company: 'Mindful Benefits', source: 'Manual Research', status: 'NEW', score: 33, clientId: wellspring.id, companyName: 'Mindful Benefits' },
    { firstName: 'Justin', lastName: 'Garcia', email: 'jgarcia@healthnav.example', phone: '+1-646-555-0207', title: 'Director of Benefits', company: 'HealthNav Platform', source: 'Apollo', status: 'QUALIFIED', score: 91, clientId: wellspring.id, companyName: 'HealthNav Platform' },
    { firstName: 'Brittany', lastName: 'Martinez', email: 'bmartinez@wellbeing.example', phone: '+1-212-555-0208', title: 'VP Operations', company: 'WellBeing Tech', source: 'Clay', status: 'ENRICHED', score: 69, clientId: wellspring.id, companyName: 'WellBeing Tech' },
    { firstName: 'Alexander', lastName: 'Robinson', email: 'arobinson@employeecare.example', phone: '+1-646-555-0209', title: 'CEO', company: 'EmployeeCare Systems', source: 'LinkedIn', status: 'CONTACTED', score: 57, clientId: wellspring.id, companyName: 'EmployeeCare Systems' },
    { firstName: 'Samantha', lastName: 'Clark', email: 'sclark@hrtech.example', phone: '+1-212-555-0210', title: 'Director of HR Tech', company: 'HRTech Benefits', source: 'Referral', status: 'ENGAGED', score: 84, clientId: wellspring.id, companyName: 'HRTech Benefits' },
  ];

  // Create prospects by matching existing companies
  for (const prospect of prospectsData) {
    const createdAt = new Date(baseDate);
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 60));
    
    await prisma.prospect.create({
      data: {
        firstName: prospect.firstName,
        lastName: prospect.lastName,
        email: prospect.email,
        phone: prospect.phone,
        title: prospect.title,
        company: prospect.company,
        linkedin: `linkedin.com/in/${prospect.firstName.toLowerCase()}${prospect.lastName.toLowerCase()}`,
        source: prospect.source,
        status: prospect.status,
        score: prospect.score,
        clientId: prospect.clientId,
        createdAt,
        updatedAt: new Date(createdAt.getTime() + Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000),
        metadata: JSON.stringify({ 
          enrichmentSource: prospect.source,
          enrichmentDate: new Date(createdAt.getTime() + Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString(),
          intentSignal: prospect.score > 70 ? 'high' : prospect.score > 50 ? 'medium' : 'low',
        }),
      },
    });
  }

  console.log('✅ Created 30 prospects');

  const clientCount = await prisma.client.count();
  const companyCount = await prisma.company.count();
  const contactCount = await prisma.contact.count();
  const dealCount = await prisma.deal.count();
  const activityCount = await prisma.activity.count();
  const meetingCount = await prisma.meeting.count();
  const prospectCount = await prisma.prospect.count();

  console.log(`📊 Seed complete: ${clientCount} clients, ${companyCount} companies, ${contactCount} contacts, ${dealCount} deals, ${activityCount} activities, ${meetingCount} meetings, ${prospectCount} prospects`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });