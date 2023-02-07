
import { BillboardSide, CampaignStatus, Customer, PrismaClient } from '@prisma/client';
import dateFns from '../../src/front/imports/dateFns';
import dateService from '../../src/services/dateService';

const seedAsync = async (prisma: PrismaClient) => {

    if (await prisma.customer.count() === 0 && await prisma.campaign.count() === 0) {
        const billboardSides = await prisma.billboardSide.findMany();
        
        await prisma.customer.createMany({ data: [
            buildCustomer("Customer1"),
            buildCustomer("Customer2"),
            buildCustomer("Customer3"),
            buildCustomer("Lidl"),
            buildCustomer("Imone"),
            buildCustomer("Maxima"),
        ]});

        console.log('count', billboardSides.length);

        const customers = await prisma.customer.findMany();

        for (let i = 0; i < customers.length; i++) {
            console.log('i', i * 10, (i + 1) * 10);
            const sides = billboardSides.slice(i * 10, (i + 1) * 10);
            console.log('sides', customers[i], sides)
            await createCampaignOfCustomer(prisma, customers[i]!, sides);
        }

        for (let i = 0; i < customers.length; i++) {
            const offset = (customers.length + 1) * 10;
            const sides = billboardSides.slice(offset + i * 3, offset + (i + 1) * 3);
            console.log('sides', customers[i], sides)
            await createCampaignOfCustomer(prisma, customers[i]!, sides);
        }
    }
};

const createCampaignOfCustomer = async (prisma: PrismaClient, customer : Customer, delegatedSides : BillboardSide[]) => {
    const campaign = await prisma.campaign.create({ data: {
        customerId: customer.id,
        discountPercent: 3,
        name: `Kampanija ${customer.name}`,
        periodStart: dateFns.addWeeks(dateService.getCurrentCampaignDay(), 1),
        periodEnd: dateFns.addWeeks(dateService.getCurrentCampaignDay(), Math.floor(Math.random() * 10) + 1),
        requiresPrinting: true,
        sideAmount: delegatedSides.length,
        status: CampaignStatus.SELECTED,
    }});

    await prisma.billboardSideInCampaign.createMany({
        data: delegatedSides.map(side => ({
            billboardSideId: side.id,
            campaignId: campaign?.id!
        }))
    })
}

const buildCustomer = (customerName: string) => ({
    address: "Jonavos g. 7",
    companyCode: "123456789",
    VATCode: "123456789",
    contactPerson: "Vilius",
    email: "vilius.sabonis@ktu.edu",
    name: customerName,
    phone: "+3706666666",
});

const demoSeeder = {
    seedAsync,
};

export default demoSeeder;
