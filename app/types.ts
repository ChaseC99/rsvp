export type Event = {
    title: string
    date: string
    description: string
    location: string
    attendees: Attendee[]
    changelog: string[]
}

export type Supply = {
    item: string
    quantity: number
}

export type Attendee = {
    name: string
    guests?: string[]
    supplies?: Supply[]
}