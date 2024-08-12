$(document).ready(function () {
    // Get expense ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const expenseID = urlParams.get('id');

    if (expenseID) {
        // Fetch the expense record details from the server
        fetch(`/get-expense-record?id=${expenseID}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    // Populate the form fields with the fetched data
                    $('#expenseItem').val(data.expenseItem);
                    $('#expenseAmount').val(data.expenseAmount);
                    $('#expense-datetime-input').val(new Date(data.expRecDateTime).toISOString().slice(0, 16));
                    $('#expCategory').val(data.expCategory);
                    $('#remarks').val(data.remarks);

                    // Display images
                    if (data.imageURLs && data.imageURLs.length > 0) {
                        const fileList = $('#expense-file-list');
                        fileList.empty();

                        data.imageURLs.forEach(url => {
                            const listItem = `<li><a href="${url}" target="_blank"><img src="${url}" alt="Expense Image" class="img-thumbnail"></a></li>`;
                            fileList.append(listItem);
                        });
                    }
                } else {
                    alert('Expense record not found.');
                }
            })
            .catch(error => {
                console.error('Error fetching expense record:', error);
                alert('Failed to load expense record.');
            });
    } else {
        alert('No expense ID provided in the URL.');
    }
});
