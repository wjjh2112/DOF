document.addEventListener("DOMContentLoaded", function() {
    // Set current date and time in the datetime input
    var dateTimeInput = document.getElementById('income-datetime-input');
    var currentDateTime = new Date();
    var formattedDateTime = currentDateTime.toISOString().slice(0, 16); // Format the date and time for input[type="datetime-local"]
    dateTimeInput.value = formattedDateTime;
    dateTimeInput.readOnly = true; // Make the input read-only

    // Handle file upload functionality
    const fileArray = [];
    const fileUpload = document.getElementById('income-file-upload');
    const fileListUl = document.getElementById('income-file-list');

    fileUpload.addEventListener('change', handleFileSelect);

    function handleFileSelect(event) {
        const newFiles = Array.from(event.target.files);
        const validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];

        const validFiles = newFiles.filter(file => {
            if (!validExtensions.includes(file.type)) {
                alert(`${file.name} is not a valid file type. Only JPEG, JPG, and PNG are allowed.`);
                return false;
            }
            return true;
        });

        fileArray.push(...validFiles);
        updateFileList();
    }

    function updateFileList() {
        fileListUl.innerHTML = '';

        if (fileArray.length === 0) {
            const placeholderLi = document.createElement('li');
            placeholderLi.id = 'placeholder-li';
            const placeholderLabel = document.createElement('label');
            placeholderLabel.setAttribute('for', 'file-upload');
            placeholderLabel.className = 'add-images-placeholder';
            placeholderLabel.innerHTML = '<span data-i18n="clickAddFiles"></span>';
            placeholderLi.appendChild(placeholderLabel);
            fileListUl.appendChild(placeholderLi);
        } else {
            fileArray.forEach((file, index) => {
                const li = document.createElement('li');

                const a = document.createElement('a');
                a.href = URL.createObjectURL(file);
                a.target = '_blank';
                a.rel = 'noopener noreferrer';

                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.onload = function() {
                    URL.revokeObjectURL(this.src);
                };

                a.appendChild(img);

                const removeButton = document.createElement('button');
                removeButton.textContent = 'X';
                removeButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    fileArray.splice(index, 1);
                    updateFileList();
                });

                li.appendChild(a);
                li.appendChild(removeButton);
                fileListUl.appendChild(li);
            });

            // Append the Add Images button at the end
            const addButtonLi = document.createElement('li');
            addButtonLi.id = 'add-button-li';
            const addButton = document.createElement('label');
            addButton.setAttribute('for', 'file-upload');
            addButton.className = 'add-images-label';
            addButton.innerHTML = '<span>+</span> Add';
            addButtonLi.appendChild(addButton);
            fileListUl.appendChild(addButtonLi);
        }

        updateFileInput();
    }

    function updateFileInput() {
        const dt = new DataTransfer();
        fileArray.forEach(file => dt.items.add(file));
        fileUpload.files = dt.files;
    }

    // Form submission handler
    document.getElementById('addIncomeRecordForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(this);

        fetch('/submit-income', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Income record submitted successfully!');
                window.location.href = '/Accounting-Income'; // Redirect to another page or refresh
            } else {
                alert('Error submitting income record: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error submitting income record: ' + error.message);
        });
    });
});
