import { Waves, Droplet, Flame, Compass } from "lucide-react"

export const SERVICES_DATA = [
    {
        id: "asthi-visarjan",
        title: "Asthi Visarjan",
        shortDesc: "Immersion of the mortal remains into the holy Ganges.",
        fullDesc: "According to Vedic traditions, the immersion of ashes in the sacred waters of the Ganges helps the departed soul disconnect from worldly ties and progress peacefully towards Moksha (liberation). Our verified Teerth Purohits perform the entire ritual respectfully on your behalf.",
        icon: Waves,
        href: "/booking?service=asthi-visarjan",
        features: ["Performed at Dashashwamedh Ghat or Har Ki Pauri", "Strict adherence to Vedic texts", "Full video proof provided"],
        priceUSD: 299
    },
    {
        id: "pind-daan",
        title: "Pind Daan",
        shortDesc: "Offerings made to ancestors to grant them eternal peace.",
        fullDesc: "Pind Daan is a solemn ritual of offering food (Pind) to the ancestors. It is believed to satisfy their unfulfilled desires, relieving them of earthly bindings and bringing their blessings upon the family. This vital rite brings peace to the lineage.",
        icon: Droplet,
        href: "/booking?service=pind-daan",
        features: ["Guided by experienced local Pandits", "Includes Sankalp with your family details", "Option to join live via Zoom"],
        priceUSD: 349
    },
    {
        id: "shraddh",
        title: "Shraddh",
        shortDesc: "Annual acts of reverence to honor departed loved ones.",
        fullDesc: "Shraddh is performed annually on the specific Tithi (lunar date) of a loved one's departure. It is an act of deep reverence and gratitude, ensuring that the ancestors are remembered and honored, which in turn brings prosperity and harmony to the family.",
        icon: Flame,
        href: "/booking?service=shraddh",
        features: ["Scheduled exactly on the required Tithi", "Includes Brahmin Bhojan (feeding of priests)", "Compassionate end-to-end support"],
        priceUSD: 249
    },
    {
        id: "tarpan",
        title: "Tarpan",
        shortDesc: "Sacred water offerings to satisfy the souls of forefathers.",
        fullDesc: "Tarpan involves offering sacred water mingled with black sesame seeds, Kusha grass, and barley. It is performed to satiate the thirst of the ancestors. A profoundly simple yet powerful ritual of remembrance and respect across generations.",
        icon: Compass,
        href: "/booking?service=tarpan",
        features: ["Can be performed from afar", "Accompanied by authentic Sanskrit chanting", "Photographic evidence provided"],
        priceUSD: 199
    }
]

export const LOCATIONS_DATA = [
    {
        id: "varanasi",
        name: "Varanasi",
        desc: "Dashashwamedh Ghat"
    },
    {
        id: "haridwar",
        name: "Haridwar",
        desc: "Har Ki Pauri"
    },
    {
        id: "prayagraj",
        name: "Prayagraj",
        desc: "Triveni Sangam"
    }
]
