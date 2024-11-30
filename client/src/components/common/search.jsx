import { useState } from "react";

export default function Search({data, keysToSearch, onFilteredData}) {
    const [searchTerm, setSearchterm] = useState("");

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchterm(term);

        const filtered = data.filter(item => 
            keysToSearch.some(key => 
                item[key]?.toString().toLowerCase().includes(term)
            )
        );
        onFilteredData(filtered);
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <input type="text" placeholder="Buscar..." value={searchTerm}
        onChange={handleSearch} className="input-search"
            />
        </div>
    );
}