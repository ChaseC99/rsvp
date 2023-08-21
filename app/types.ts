import type { 
    Event as PrismaEvent, 
    Attendee as PrismaAttendee,
    Supply as PrismaSupply, 
} from "@prisma/client";

export type Supply = Omit<PrismaSupply, "attendee">;

export type Attendee = Omit<PrismaAttendee, "supplies"> & {
    supplies: PrismaSupply[];
};

export type Event = Omit<PrismaEvent, "attendees"> & {
    attendees: Attendee[];
};