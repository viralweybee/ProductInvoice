let productArr = [];

// Function to fetch data from the InvoiceLists API
async function fetchInvoiceLists() {
    try {
        const response = await fetch('https://localhost:44341/api/InvoiceLists');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('InvoiceLists API Data:', data);
        document.querySelector('.tbody').innerHTML = '';
        for (let i = 0; i < data.length; i++) {
            fillInvoiceData(data[i].id, data[i].invoiceNo, data[i].customerName, data[i].total, data[i].date.substring(0, 10))
        }
    } catch (error) {
        console.error('Error fetching InvoiceLists data:', error.message);
    }
}
fetchInvoiceLists();
//Fill Datat into table 
function fillInvoiceData(id, invoiceNo, customerName, total, date) {
    let table = document.getElementsByClassName('tbody')[0]
    let row = table.insertRow(-1);
    let c1 = row.insertCell(0);
    let c2 = row.insertCell(1);
    let c3 = row.insertCell(2);
    let c4 = row.insertCell(3);
    let c5 = row.insertCell(4);
    c1.innerText = invoiceNo;
    c2.innerText = customerName;
    c3.innerText = total;
    c4.innerText = date
    // Edit button
    const editButton = document.createElement("button");
    editButton.id = `Edit${id}`;
    editButton.classList.add('btn');
    editButton.classList.add('btn-outline-warning');
    editButton.innerText = `Edit`;
    editButton.addEventListener('click', function () {

        location.href = `EditInvoice.html?id=${id}`;
    });
    c5.appendChild(editButton);
}
document.getElementById('add').addEventListener('click', Add);
function Add() {
    location.href = 'AddInvoice.html'
}

const dropdownElement = document.getElementsByClassName('displaydropdown')[0];
const selectProductElement = document.getElementById('selectProduct');
let flagButton = false;
const selectedProductsContainer = document.getElementById('selectedProductsContainer');
//Drop Down Toggle Logic
document.addEventListener('click', function (event) {
    if (event.target.className == 'displaydropdown' || event.target.className == 'productitem') {
        dropdownElement.style.display = 'block';
        selectProductElement.style.transform = `rotate(${180}deg)`
    }
    else if (event.target.id == 'dropdownProduct') {
        if (!flagButton) {
            dropdownElement.style.display = 'block';
            selectProductElement.style.transform = `rotate(${180}deg)`
            flagButton = true
        }
        else {
            dropdownElement.style.display = 'none';
            selectProductElement.style.transform = `rotate(${0}deg)`
            flagButton = false;
        }
    }
    else {
        flagButton = false;
        dropdownElement.style.display = 'none';
        selectProductElement.style.transform = `rotate(${0}deg)`
    }
});
async function FetchData() {
    try {
        const response = await fetch('https://localhost:44341/api/Products');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('API Data:', data);
        const displayDropdown = document.querySelector('.displaydropdown');
        displayDropdown.innerHTML = '';
        productArr = [];
        for (let i = 0; i < data.length; i++) {
            productArr.push({
                productName: data[i].productName,
                selected: false
            })
        }
        callProduct(productArr);
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}
function removeProduct(element) {
    const productName = element.parentElement.getAttribute('data-product');
    const selectedProductSpan = document.querySelector(`#selectedProductsContainer span[data-product="${productName}"]`);
    if (selectedProductSpan) {
        const productIndex = productArr.findIndex(product => product.productName === productName);
        if (productIndex !== -1) {
            productArr[productIndex].selected = false;
        }
        selectedProductSpan.remove();
    }
    const activeProducts = productArr.filter(p => p.selected).map(p => p.productName);
    const dateFunction = handleDateChange();
    console.log(activeProducts.length, dateFunction.length)
    if (activeProducts.length > 0 || dateFunction.length > 0) {
        searchApi(activeProducts, dateFunction);
    }
    else {
        fetchInvoiceLists();
    }


    callProduct(productArr)
}
function callProduct(productArr) {
    const displayDropdown = document.querySelector('.displaydropdown');
    displayDropdown.innerHTML = '';
    productArr.forEach(product => {
        const productSpan = document.createElement('span');
        productSpan.className = 'productitem';
        productSpan.textContent = product.productName;
        if (product.selected) {
            productSpan.style.backgroundColor = 'lightblue';
        }
        else {
            productSpan.style.backgroundColor = '#f0efef';
        }
        productSpan.addEventListener('click', () => {
            product.selected = !product.selected;
            if (product.selected) {
                const selectedProductSpan = document.createElement('span');
                selectedProductSpan.className = 'selectedProductItem';
                selectedProductSpan.setAttribute('data-product', product.productName);
                selectedProductSpan.innerHTML = `${product.productName} <img src='../close.png' class='closeIcon' onclick='removeProduct(this)'>`;
                selectedProductsContainer.appendChild(selectedProductSpan);
                productSpan.style.backgroundColor = 'lightblue';
            } else {
                // ActiveProduct.pop(product.productName);
                const selectedProductSpan = document.querySelector(`#selectedProductsContainer span[data-product="${product.productName}"]`);
                if (selectedProductSpan) {
                    selectedProductSpan.remove();
                }
                productSpan.style.backgroundColor = '#f0efef';
            }
            const activeProducts = productArr.filter(p => p.selected).map(p => p.productName);
            const dateFunction = handleDateChange();
            searchApi(activeProducts, dateFunction);
        });
        displayDropdown.appendChild(productSpan);

    });

}
FetchData();
function MultipleProductData(SelectedProduct) {
    var selectProductString = '';
    for (let i = 0; i < SelectedProduct.length; i++) {
        var ans = 'Products=';
        selectProductString += (ans + SelectedProduct[i]);
        if (i != SelectedProduct.length - 1) {
            selectProductString += '&';
        }
    }
    return selectProductString
}

async function searchApi(activeProducts, dateFunction) {
    var queryString = '';
    if (activeProducts.length > 0 && dateFunction.length > 0) {
        const product = MultipleProductData(activeProducts);
        const date = generateQueryString(dateFunction);
        queryString = `?${product}&${date}`
    }
    else if (activeProducts.length > 0) {
        const product = MultipleProductData(activeProducts);
        queryString = `?${product}`

    }
    else if (dateFunction.length > 0) {
        const date = generateQueryString(dateFunction);
        queryString = `?${date}`;

    }
    else {
        return fetchInvoiceLists();
    }
    console.log(queryString)
    try {
        const response = await fetch(`https://localhost:44341/api/InvoiceLists/SearchByProduct${queryString}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('API Data:', data);
        document.querySelector('.tbody').innerHTML = '';
        for (let i = 0; i < data.length; i++) {
            fillInvoiceData(data[i].id, data[i].invoiceNo, data[i].customerName, data[i].total, data[i].date.substring(0, 10))
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}


const startDateInput = document.querySelector('.startDate input');
const endDateInput = document.querySelector('.endDate input');

startDateInput.addEventListener('change', handleDateChange);
endDateInput.addEventListener('change', handleDateChange);


function handleDateChange() {
    let dateArr = [];
    if (startDateInput.value == '' && endDateInput.value == '') {
        return dateArr;
    }
    dateArr.push(startDateInput.value);
    dateArr.push(endDateInput.value);
    const activeProducts = productArr.filter(p => p.selected).map(p => p.productName);
    searchApi(activeProducts, dateArr);
    return dateArr
}
function generateQueryString(dateArr) {
    var queryString = '';
    if (dateArr[0] != '' && dateArr[1] != '') {
        queryString = `startDate=${dateArr[0]}&endDate=${dateArr[1]}`
    }
    else if (dateArr[0] != '') {
        queryString = `startDate=${dateArr[0]}`
    }
    else if (dateArr[1] != '') {
        queryString = `endDate=${dateArr[1]}`
    }
    return queryString;
}

document.getElementById('Reset').addEventListener('click', () => {
    window.location.reload();
})