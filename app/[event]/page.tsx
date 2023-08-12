type Event = {
    title: string
    date: string
    description: string
    location: string
    attendees: Attendee[]
    changelog: string[]
}

type Supply = {
    item: string
    quantity: number
}

type Attendee = {
    name: string
    guests?: string[]
    supplies?: Supply[]
}

async function loadEvent(): Promise<Event> {

    return new Promise((resolve) => {
        const event: Event = {
            title: 'VolleyBAYll',
            date: '2021-01-01',
            description: 'My Event Description',
            location: 'Las Palmas Park, Sunnyvale, CA',
            attendees: [
                { name: 'Chase', supplies: [{ item: 'Ball', quantity: 1 }], guests: ['Kasey']  },
                { name: 'Ashwin', supplies: [{ item: 'Ball', quantity: 1 }, { item: 'Net', quantity: 1}], guests: ['Vivian'] },
                { name: 'Jiwan', supplies: [{ item: 'Ball', quantity: 1 }, { item: 'Net', quantity: 2}]  }
            ],
            changelog: [],
        }
        resolve(event)
    })
}

export default async function Event() {
    const event = await loadEvent();
    const { title, date, description, location, attendees, changelog } = event;

    const supplies = Object.values(attendees.reduce((acc, attendee) => {
        if (!attendee.supplies) return acc;

        attendee.supplies.forEach((supply) => {
            const { item, quantity } = supply;
            if (acc[item]) {
                acc[item].quantity += 1;
            } else {
                acc[item] = {item, quantity};
            }
        });
        return acc;
    }, {} as Record<string, Supply>));



    return (
        <div>
            <h1>{title}</h1>
            <div>
                <h3>{location}</h3>
                <h3>{date}</h3>
            </div>

            <button>RSVP</button>

            <div>
                <h2>Attending</h2>
                <ul>
                    {attendees.map(({name}) => (
                        <li key={name}>{name}</li>
                    ))}
                </ul>
            </div>

            <div>
                <h2>Supplies</h2>
                <ul>
                    {supplies.map(({item, quantity}) => (
                        <li key={item}>{item} - {quantity}</li>
                    ))}
                </ul>
            </div>

            {changelog && (
                <div>
                    <h2>Changelog</h2>
                    <ul>
                        {changelog.map((change) => (
                            <li key={change}>{change}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}