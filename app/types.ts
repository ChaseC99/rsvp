import type { 
    Event as PrismaEvent, 
    Attendee as PrismaAttendee,
    Supply as PrismaSupply, 
} from "@prisma/client";

export type Supply = Omit<PrismaSupply, "id" | "attendee" | "attendeeId">;

export type Attendee = Omit<PrismaAttendee, "supplies"> & {
    supplies: Supply[];
};

export type Event = Omit<PrismaEvent, "attendees"> & {
    attendees: Attendee[];
};