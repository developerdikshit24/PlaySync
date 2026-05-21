import  { useState } from 'react';
import { formatParagraphs } from '../utils/formatParagraphs';

const Description = ({ text }) => {
    const [expanded, setExpanded] = useState(false);
    const toggleExpanded = () => setExpanded(!expanded);

    const formatted = formatParagraphs(text);

    return (
        <div className="md:p-4 p-2 my-2 md:my-4 bg-base-200 rounded-box shadow-lg">
            <div className={`text-base-content/85 md:text-base text-[10px] transition-all duration-300 ${expanded ? '' : 'line-clamp-1'}`}>
                {formatted.map((p, i) => (
                    <p
                        key={i}
                        dangerouslySetInnerHTML={{ __html: p }}
                        className="mb-1"
                    />
                ))}
            </div>

            <button
                className="mt-2 text-base-content/65 text-[10px] md:text-sm"
                onClick={toggleExpanded}
            >
                {expanded ? 'Show less' : 'Show more'}
            </button>
        </div>
    );
};

export default Description;
