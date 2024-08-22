function generateDummyData(model, min, max) {
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

// Generate dummy data for each collection
generateDummyData(PEN1_PH, 7.30, 7.90);  // pH range
generateDummyData(PEN1_DO, 4.30, 6.88);  // DO range
generateDummyData(PEN2_PH, 7.30, 7.90);
generateDummyData(PEN2_DO, 4.30, 6.88);
generateDummyData(PEN3_PH, 7.30, 7.90);
generateDummyData(PEN3_DO, 4.30, 6.88);
