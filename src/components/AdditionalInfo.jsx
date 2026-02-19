import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const BREED_DATA = {
    'Gir': {
        description: "Famous for its hardiness and milk production, the Gir is a distinct breed originating from India.",
        origin: "Gujarat, India",
        milk_capacity: "1,590 – 3,182 kg / lactation",
        weight_range: "385 – 545 kg",
        wikipedia_url: "https://en.wikipedia.org/wiki/Gyr_cattle"
    },
    'Kangayam': {
        description: "Known for its strength and draught power, the Kangayam is a popular breed for agricultural work.",
        origin: "Tamil Nadu, India",
        milk_capacity: "Moderate",
        weight_range: "350 - 450 kg",
        wikipedia_url: "https://en.wikipedia.org/wiki/Kangayam_cattle"
    },
    'Kankrej': {
        description: "Kankrej is an indigenous cattle breed of India, known for being powerful and good milk producers.",
        origin: "Rann of Kutch, Gujarat",
        milk_capacity: "1,400 – 1,800 kg / lactation",
        weight_range: "400 - 640 kg",
        wikipedia_url: "https://en.wikipedia.org/wiki/Kankrej_cattle"
    },
    'Undefined': {
        description: "Breed characteristics could not be confidently identified.",
        origin: "Unknown",
        milk_capacity: "N/A",
        weight_range: "N/A"
    }
};

const AdditionalInfo = ({ breedName }) => {
    const data = BREED_DATA[breedName] || BREED_DATA['Undefined'];

    if (!breedName || breedName === 'Undefined') return null;

    return (
        <motion.div
            className="info-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="card-header-info">
                <a
                    href={data.wikipedia_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="breed-title-link"
                >
                    <h3>About {breedName}</h3>
                </a>
                <a
                    href={data.wikipedia_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="learn-more-link"
                >
                    Learn more <ChevronRight size={16} />
                </a>
            </div>
            <p className="description">{data.description}</p>

            <div className="details-grid">
                <div className="detail-item">
                    <span className="label">Origin</span>
                    <span className="value">{data.origin}</span>
                </div>
                <div className="detail-item">
                    <span className="label">Milk Capacity</span>
                    <span className="value">{data.milk_capacity}</span>
                </div>
                <div className="detail-item">
                    <span className="label">Typical Weight</span>
                    <span className="value">{data.weight_range}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default AdditionalInfo;
