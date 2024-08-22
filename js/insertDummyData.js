function generateDummyData(tankPrefix, type, min, max) {
    const model = getModel(tankPrefix, type);
    const dummyData = [];
    for (let i = 0; i < 10; i++) {
        dummyData.push({
            payload: (Math.random() * (max - min) + min).toFixed(2)
        });
    }
    model.insertMany(dummyData, (err, docs) => {
        if (err) {
            console.error(`Error inserting dummy data into ${model.collection.collectionName}:`, err);
        } else {
            console.log(`Inserted dummy data into ${model.collection.collectionName}`);
        }
    });
}

// Generate dummy data for each tank and type with min and max ranges
const tanks = ['PEN1', 'PEN2', 'PEN3'];
const dataRanges = {
    PH: { min: 7.35, max: 7.45 },
    DO: { min: 6.50, max: 8.00 }
};

tanks.forEach(tank => {
    Object.keys(dataRanges).forEach(type => {
        const { min, max } = dataRanges[type];
        generateDummyData(tank, type, min, max);
    });
});
