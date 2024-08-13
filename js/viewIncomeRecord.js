$(document).ready(function () {
    // Get income ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const incomeID = urlParams.get('id');

    if (incomeID) {
        // Fetch the income record details from the server
        fetch(`/get-income-record?id=${incomeID}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    // Display the expense ID
                    $('#incomeID').text(data.incomeID);

                    // Populate the form fields with the fetched data
                    $('#incomeItem').val(data.incomeItem);
                    $('#incomeAmount').val(data.incomeAmount);
                    $('#income-datetime-input').val(new Date(data.incomeRecDateTime).toISOString().slice(0, 16));
                    $('#incomeCategory').val(data.incomeCategory);
                    $('#remarks').val(data.remarks);

                    // Display images
                    if (data.imageKeys && data.imageKeys.length > 0) {
                        const fileList = $('#income-file-list');
                        fileList.empty();
                        data.imageKeys.forEach(key => {
                          const url = `https://ikanmeter.s3.ap-southeast-1.amazonaws.com/income-images/${key}`;
                          const listItem = `<li><a href="javascript:void(0);" onclick="openCenteredImage('${url}');"><img src="${url}" alt="Income Image" class="img-thumbnail"></a></li>`;
                            fileList.append(listItem);
                        });
                      }
                } else {
                    alert('Income record not found.');
                }
            })
            .catch(error => {
                console.error('Error fetching income record:', error);
                alert('Failed to load income record.');
            });
    } else {
        alert('No income ID provided in the URL.');
    }
});

// Function to open the image centered in a new tab
function openCenteredImage(imageUrl) {
    const newWindow = window.open("", "_blank", "width=800,height=600,scrollbars=no");
    newWindow.document.write(`
        <html>
        <head>
            <style>
                body, html {
                    height: 100%;
                    margin: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #000;
                }
                img {
                    max-width: 100%;
                    max-height: 100%;
                }
            </style>
        </head>
        <body>
            <img src="${imageUrl}" alt="Income Image">
        </body>
        </html>
    `);
    newWindow.document.close();
}