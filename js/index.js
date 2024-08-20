document.addEventListener('DOMContentLoaded', function () {
    // Initial display values
    const siteDropdown = document.getElementById('dropdownSites');
    const loggerDropdown = document.getElementById('dropdownLogger');
    
    // Set the initial site and logger
    const site = siteDropdown.value;
    const logger = loggerDropdown.value;

    // Function to fetch data from MongoDB
    function fetchData(site, logger) {
        let collectionPH = `${logger}_PH`;
        let collectionDO = `${logger}_DO`;

        // Fetch the latest PH data
        fetch(`/api/data?collection=${collectionPH}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const latestPH = data[0];
                    document.getElementById('ph').textContent = latestPH.value;
                }
            });

        // Fetch the latest DO data
        fetch(`/api/data?collection=${collectionDO}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const latestDO = data[0];
                    document.getElementById('do').textContent = latestDO.value;
                }
            });

        // Display selected site and logger
        document.getElementById('site').textContent = `Site: ${site}`;
        document.getElementById('logger').textContent = `Logger: ${logger}`;
    }

    // Fetch initial data
    fetchData(site, logger);

    // Event listeners for dropdowns
    siteDropdown.addEventListener('change', function () {
        fetchData(siteDropdown.value, loggerDropdown.value);
    });

    loggerDropdown.addEventListener('change', function () {
        fetchData(siteDropdown.value, loggerDropdown.value);
    });
});
