export default function ProvincePresence() {
    const provinces = ["Khyber Pakhtunkhwa", "Punjab", "Islamabad", "Sindh", "Baluchistan", "Gilgit Baltistan", "Azad Kashmir"];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-bcp-dark rounded-[2rem] p-10 md:p-16 text-center">
                    <h3 className="text-3xl md:text-4xl font-semibold text-white mb-12">
                        Province-Wise <span className="text-bcp-red">Presence</span>
                    </h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        {provinces.map((province, idx) => (
                            <div
                                key={idx}
                                className="bg-[#052229] border border-white/10 text-white px-8 py-4 rounded-xl font-medium hover:border-bcp-red hover:bg-[#072d36] transition-all cursor-default"
                            >
                                {province}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
