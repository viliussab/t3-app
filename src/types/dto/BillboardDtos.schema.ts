import { Area, Billboard, BillboardSide, BillboardType } from "@prisma/client";

export type BillboardDto = Billboard & {
    type: BillboardType;
    area: Area;
    sides: BillboardSide[];
}

export type BillboardUniqueSideDto = Billboard & {
    type: BillboardType;
    area: Area;
    side: BillboardSide;
}
