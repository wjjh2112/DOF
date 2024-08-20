document.getElementById('dropdownSites').addEventListener('change', fetchData);
document.getElementById('dropdownLogger').addEventListener('change', fetchData);

function fetchData() {
    const site = document.getElementById('dropdownSites').value;
    const logger = document.getElementById('dropdownLogger').value;
    const phCollection = `${logger}_PH`;
    const doCollection = `${logger}_DO`;

    if (site === "Penang") {
        fetchNewestData(phCollection, 'ph');
        fetchNewestData(doCollection, 'do');
    } else {
        // Handle other sites
        console.log("Other site selected: " + site);
    }
}

function fetchNewestData(collectionName, elementId) {
    // Replace with your actual API endpoint or MongoDB query
    fetch(`/api/collection/${collectionName}/newest`)
        .then(response => response.json())
        .then(data => {
            document.getElementById(elementId).textContent = data.value;
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Initial fetch on page load
fetchData();
