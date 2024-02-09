var productNameEl = document.getElementById('productNameSelect');
var quantityEl = document.getElementById('quantityInput');
var priceEl = document.getElementById('priceInput');
var totalEl = document.getElementById('totalInput');
var dateEl = document.getElementById('date');
var invoiceNoEl = document.getElementById('InvoiceNo');
var GrandTotalEl = document.getElementById('grandTotal')
var discountEl = document.getElementById('discount')
var finalAmountEl = document.getElementById('finalAmount')
var finalAmountWordsEl = document.getElementById('finalAmountWords')
var saveEl = document.getElementById('Save');
var customerEl = document.getElementById('customerName');
var discountAmount = document.getElementById('discountInput');


// Function to get the value of a query parameter from the URL
function getQueryParamValue(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

let track = [];
var globalDate='';
var globalInvoiceNo='';
async function fetchInvoiceDetails() {
    // Fetch the id parameter from the URL
    const invoiceId = parseInt(getQueryParamValue('id'));

    if (!invoiceId) {
        console.error('Invoice id is missing in the URL');
        return;
    }
    try {
        const response = await fetch(`https://localhost:44341/api/Invoices/GetInvoiceDetails?id=${invoiceId}`)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        if(response.status===404){
            window.location.href='../Invoice/Invoice.html'
        }
        const data = await response.json();
        console.log('Invoice Product', data);
        // Assuming data is an array of products, iterate through the products
        for (let i = 0; i < data.length; i++) {

            const productName = data[i].productName;
            const quantity = data[i].quantity;
            const price = data[i].price;
            const total = quantity * price;
            track.push({
                productName: productName.toString(),
                quantity: quantity.toString(),
                price: price.toString()
            })
            const newRow = document.createElement('div');
            newRow.className = 'container addedProduct';




            const productNameElement = document.createElement('div');
            productNameElement.textContent = productName;
            productNameElement.classList = 'productNameElement commonclass';


            const quantityElement = document.createElement('div');
            quantityElement.textContent = quantity;
            quantityElement.classList = 'quantityElement commonclass';


            const priceElement = document.createElement('div');
            priceElement.textContent = price;
            priceElement.classList = 'priceElement commonclass';


            const totalElement = document.createElement('div');
            totalElement.textContent = total.toFixed(2);
            totalElement.classList = 'commonclass';

            const Imageparent = document.createElement('div');
            Imageparent.classList = 'commonclass img';

            const pencilElement = document.createElement('img');
            pencilElement.src = '../icons8-edit.svg';
            const ImageElement = document.createElement('img');
            ImageElement.src = '../delete-icon.svg';
            ImageElement.classList = 'removeclass';
            pencilElement.classList = 'removeclass';
            Imageparent.appendChild(ImageElement);
            Imageparent.appendChild(pencilElement);

            ImageElement.addEventListener('click', function () {
                const rowToRemove = this.closest('.addedProduct');
                const indexInTrack = track.findIndex(item =>
                    item.productName === rowToRemove.querySelector('.productNameElement').textContent &&
                    item.quantity === rowToRemove.querySelector('.quantityElement').textContent &&
                    item.price === rowToRemove.querySelector('.priceElement').textContent
                );

                // Remove the item from the track array based on its index
                if (indexInTrack !== -1) {
                    track.splice(indexInTrack, 1);
                }
                console.log(track);
                rowToRemove.remove();
                calculateGrandTotal();
            });
            pencilElement.addEventListener('click', function () {
                const rowToRemove = this.closest('.addedProduct');
                const productName = rowToRemove.querySelector('.productNameElement').textContent;
                const quantity = rowToRemove.querySelector('.quantityElement').textContent;
                const price = rowToRemove.querySelector('.priceElement').textContent;
                const indexInTrack = track.findIndex(item =>
                    item.productName === rowToRemove.querySelector('.productNameElement').textContent &&
                    item.quantity === rowToRemove.querySelector('.quantityElement').textContent &&
                    item.price === rowToRemove.querySelector('.priceElement').textContent
                );

                // Remove the item from the track array based on its index
                if (indexInTrack !== -1) {
                    track.splice(indexInTrack, 1);
                }
                productNameEl.value = productName;
                quantityEl.value = quantity;
                priceEl.value = price;
                totalEl.value = parseInt(quantity) * parseInt(price);
                rowToRemove.remove();
                console.log(track);
                calculateGrandTotal();
            });
            newRow.appendChild(productNameElement);
            newRow.appendChild(quantityElement);
            newRow.appendChild(priceElement);
            newRow.appendChild(totalElement);
            newRow.appendChild(Imageparent);

            const productListContainer = document.querySelector('.productListContainer');
            productListContainer.appendChild(newRow);

        }
        console.log(track);
        // calculateGrandTotal();

    }
    catch (error) {
        console.error('Error fetching Invoice details:', error.message);
    }
    // Now you can use the invoiceId in your fetch or other logic
    try {
        const response = await fetch(`https://localhost:44341/api/InvoiceLists/${invoiceId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Invoice Details:', data);
        customerEl.value = data.customerName;
        dateEl.value = data.date.substring(0, 10);
        globalDate=data.date.substring(0,10);
        invoiceNoEl.value = data.invoiceNo;
        globalInvoiceNo=data.invoiceNo;

        const totalElements = document.querySelectorAll('.addedProduct > div:nth-child(4)');
        let grandTotal = 0;

        totalElements.forEach(totalElement => {
            grandTotal += parseInt(totalElement.textContent);
        });
        GrandTotalEl.textContent = 'Grand Total : ' + grandTotal.toFixed(2);
        document.getElementById('discountInput').value = grandTotal - parseInt(data.total);
        finalAmountEl.textContent = (grandTotal - parseInt(discountAmount.value));
        const finalAmount = grandTotal - parseInt(discountAmount.value);
        const finalAmountWords = numberToWords(finalAmount);
        finalAmountWordsEl.textContent = 'Final Amount in Words: ' + (finalAmountWords);
    } catch (error) {
        console.error('Error fetching Invoice details:', error.message);
    }
}


const plusButton = document.querySelector('.plusbutton');
plusButton.addEventListener('click', addProductToList);

//Add Product
function addProductToList() {
    document.querySelector('.hide').style.display = 'none';
    const productName = productNameEl.value;
    const quantity = quantityEl.value;
    const price = priceEl.value;
    track.push({
        productName: productName,
        quantity: quantity,
        price: price
    })
    if (isNaN(quantity)) {
        document.querySelector('.hide').style.display = 'block';
        return;
    }
    if (!productName || !quantity || !price) {
        document.querySelector('.hide').style.display = 'block';
        return;
    }
    const total = parseInt(quantity) * parseInt(price);
    const newRow = document.createElement('div');
    newRow.className = 'container addedProduct';

    const productNameElement = document.createElement('div');
    productNameElement.textContent = productName;
    productNameElement.classList = 'productNameElement commonclass';

    const quantityElement = document.createElement('div');
    quantityElement.textContent = quantity;
    quantityElement.classList = 'quantityElement commonclass';

    const priceElement = document.createElement('div');
    priceElement.textContent = price;
    priceElement.classList = 'priceElement commonclass';

    const totalElement = document.createElement('div');
    totalElement.textContent = total.toFixed(2);
    totalElement.classList = 'commonclass';

    const Imageparent = document.createElement('div');
    Imageparent.classList = 'commonclass img';
    // Imageparent.classList='img';


    const pencilElement = document.createElement('img');
    pencilElement.src = '../icons8-edit.svg';
    const ImageElement = document.createElement('img');
    ImageElement.src = '../delete-icon.svg';
    ImageElement.classList = 'removeclass';
    pencilElement.classList = 'removeclass';


    Imageparent.appendChild(ImageElement);
    Imageparent.appendChild(pencilElement);

    ImageElement.addEventListener('click', function () {
        const rowToRemove = this.closest('.addedProduct');
        const indexInTrack = track.findIndex(item =>
            item.productName === rowToRemove.querySelector('.productNameElement').textContent &&
            item.quantity === rowToRemove.querySelector('.quantityElement').textContent &&
            item.price === rowToRemove.querySelector('.priceElement').textContent
        );
        console.log(track);
        // Remove the item from the track array based on its index
        if (indexInTrack !== -1) {
            track.splice(indexInTrack, 1);
        }
        rowToRemove.remove();
        calculateGrandTotal();
    });

    pencilElement.addEventListener('click', function () {
        const rowToRemove = this.closest('.addedProduct');
        const productName = rowToRemove.querySelector('.productNameElement').textContent;
        const quantity = rowToRemove.querySelector('.quantityElement').textContent;
        const price = rowToRemove.querySelector('.priceElement').textContent;
        const indexInTrack = track.findIndex(item =>
            item.productName === rowToRemove.querySelector('.productNameElement').textContent &&
            item.quantity === rowToRemove.querySelector('.quantityElement').textContent &&
            item.price === rowToRemove.querySelector('.priceElement').textContent
        );

        // Remove the item from the track array based on its index
        if (indexInTrack !== -1) {
            track.splice(indexInTrack, 1);
        }
        productNameEl.value = productName;
        quantityEl.value = quantity;
        priceEl.value = price;
        totalEl.value = parseInt(quantity) * parseInt(price);
        rowToRemove.remove();
        calculateGrandTotal();
        console.log(track);
    });


    ImageElement.classList = 'removeclass';
    newRow.appendChild(productNameElement);
    newRow.appendChild(quantityElement);
    newRow.appendChild(priceElement);
    newRow.appendChild(totalElement);
    newRow.appendChild(Imageparent);


    const productListContainer = document.querySelector('.productListContainer');
    productListContainer.appendChild(newRow);


    productNameEl.value = '';
    quantityEl.value = '';
    priceEl.value = '';
    totalEl.value = '';
    calculateGrandTotal();
    console.log(track);
}

//Converting number to word 
let ones = ["", "one ", "two ", "three ", "four ", "five ", "six ", "seven ", "eight ", "nine ", "ten ", "eleven ", "twelve ", "thirteen ", "fourteen ", "fifteen ", "sixteen ", "seventeen ", "eighteen ", "nineteen "];

let tens = ["", "", "twenty ", "thirty ", "forty ", "fifty ", "sixty ", "seventy ", "eighty ", "ninety "];

function ntow(n, sfx) {
    let s = "";
    if (n > 19)
        s += tens[Math.floor(n / 10)] + ones[n % 10];
    else
        s += ones[n];
    if (n)
        s += sfx;
    return s;
}

function numberToWords(n) {
    let res = "";
    res += ntow(Math.floor(n / 10000000), "crore ");
    res += ntow(Math.floor((n / 100000) % 100), "lakh ");
    res += ntow(Math.floor((n / 1000) % 100), "thousand ");
    res += ntow(Math.floor((n / 100) % 10), "hundred ");
    if (n > 100 && n % 100)
        res += "and ";
    res += ntow(n % 100, "");
    return res;
}



// Fetch product name
fetch('https://localhost:44341/api/Products')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {

        const productNameSelect = productNameEl;
        productNameSelect.innerHTML = '<option value="" selected>Select Product</option>';
        data.forEach(product => {
            const option = document.createElement('option');
            option.value = product.productName;
            option.textContent = product.productName;
            productNameSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error fetching product data:', error);
    });

productNameEl.addEventListener('change', function () {
    // document.querySelector('.hide').style.display='none';
    const selectedProductName = this.value;
    fetch('https://localhost:44341/api/Products')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const priceInput = priceEl;
            for (let i = 0; i < data.length; i++) {
                if (data[i].productName === selectedProductName) {
                    priceInput.value = data[i].price
                    getData();
                    break;
                }
            }
        })
        .catch(error => {
            console.error('Error fetching product data:', error);
        });
});
//--------------------------------------------------------Debouncing Event----------------------------------------------
const getData = () => {
    document.querySelector('.hide').style.display = 'none';
    if (parseInt(quantityEl.value) > 0) {
        if (priceEl.value != '') {
            totalEl.value = parseInt(priceEl.value) * parseInt(quantityEl.value);
        }
        else {
            document.querySelector('.hide').style.display = 'block';
            document.querySelector('.hide').textContent = 'Please Make Sure that You Select a Product First then add Quantity';
        }
    }
    else {
        document.querySelector('.hide').style.display = 'block';
        document.querySelector('.hide').textContent = 'Please Make Sure that your quantity should be greater than 0';
    }
}
const debounce = function (fn, d) {
    let timer;
    return function () {
        let context = this,
            args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => {
            getData.apply(context, arguments)
        }, d);
    }
}
const betterFunction = debounce(getData, 300);


//Calculate the GrandTotal
function calculateGrandTotal() {
    const totalElements = document.querySelectorAll('.addedProduct > div:nth-child(4)');
    let grandTotal = 0;

    totalElements.forEach(totalElement => {
        grandTotal += parseInt(totalElement.textContent);
    });

    GrandTotalEl.textContent = 'Grand Total : ' + grandTotal.toFixed(2);
    console.log(discountAmount.value);
    finalAmountEl.textContent = (grandTotal - parseInt(discountAmount.value));
    const finalAmount = grandTotal - parseInt(discountAmount.value);
    console.log(finalAmount);
    const finalAmountWords = numberToWords(finalAmount);
    console.log(finalAmountWords);
    finalAmountWordsEl.textContent = 'Final Amount in Words: ' + (finalAmountWords);
}
var discountInput = document.getElementById('discountInput');

discountInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        if (discountInput.value < 0) {
            return alert('Bad Request');
        }
        console.log(discountInput.value);
        recalculateGrandTotal();
    }
});

//Recalculating grandtotal after new discount amount 
function recalculateGrandTotal() {
    const totalElements = document.querySelectorAll('.addedProduct > div:nth-child(4)');
    let grandTotal = 0;
    totalElements.forEach(totalElement => {
        grandTotal += parseInt(totalElement.textContent);
    });
    GrandTotalEl.textContent = 'Grand Total : ' + grandTotal.toFixed(2);
    var discount = (discountInput.value === null ? 0 : discountInput.value);
    finalAmountEl.textContent = (grandTotal - discount);
    const finalAmount = grandTotal - discount;
    console.log(finalAmount);
    const finalAmountWords = numberToWords(finalAmount);
    console.log(finalAmountWords);
    finalAmountWordsEl.textContent = 'Final Amount in Words: ' + (finalAmountWords);
}
let products = [];
//------------------------------------------------------------------Save button ---------------------------------------------
saveEl.addEventListener('click', saveFunction);
async function saveFunction() {
    if (!customerEl.value.trim() || !dateEl.value || !invoiceNoEl.value || !finalAmountEl.textContent || parseInt(discountAmount.value) < 0) {
        alert('BadRequest');
        return;
    }
    const customerId = parseInt(getQueryParamValue('id'));
    const customerName = customerEl.value;
    const date = globalDate;
    const invoiceNo = globalInvoiceNo;
    const finalAmount = parseInt(finalAmountEl.textContent);

    const putData = {
        id: customerId,
        invoiceNo: invoiceNo,
        customerName: customerName,
        total: finalAmount,
        date: date,
        invoice: []
    };

    //------------------------------------------------------------Add new invoice list -----------------------------------------------------
    try {
        const putResponse = await fetch(`https://localhost:44341/api/InvoiceLists/${customerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(putData),
        });

        if (!putResponse.ok) {
            throw new Error(`HTTP error! Status: ${putResponse.status}`);
        }

        // Check if there is content in the response before parsing
        const contentType = putResponse.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const putDataJson = await putResponse.json();
            console.log('PUT request successful:', putDataJson);
        } else {
            console.log('PUT request successful (empty response)');
        }
    } catch (error) {
        console.error('Error making PUT request:', error);
    }

    //---------------------------------------------store Product in object then push----------------------------------
    const productContainers = document.querySelectorAll('.addedProduct');

    for (const container of productContainers) {
        const name = container.querySelector('div:nth-child(1)').textContent;
        const quantity = container.querySelector('div:nth-child(2)').textContent;
        const price = container.querySelector('div:nth-child(3)').textContent;
        const productId = await Inovicedata(name);

        products.push({
            productId: productId,
            quantity: quantity,
            price: price
        });
    }
    // for (var i = 0; i < track.length; i++) {
    //     const productId = await Inovicedata(track[i].productName);
    //     const quantity = track[i].quantity;
    //     const price = track[i].price;
    //     products.push({
    //         productId: productId,
    //         quantity: quantity,
    //         price: price
    //     })
    // }
    console.log(products);
    // //----------------------------------------------Delete------------------------------------------------------------------------------
    const invoiceIdToDelete = parseInt(getQueryParamValue('id'));
    await functionDelete(invoiceIdToDelete);
    // //-------------------------------------------------------Post---------------------------------------------
    setTimeout(async ()=>{
        for (let i = 0; i < products.length; i++) {
            const invoiceData = {
                invoiceId: invoiceIdToDelete,
                productId: parseInt(products[i].productId),
                quantity: parseInt(products[i].quantity),
                price: parseInt(products[i].price),
                "invoiceNavigation": null,
                "product": null
            };
           await InvoicePostData(invoiceData);
        }   
        window.location.href = '../Invoice/Invoice.html';
    },20)
}
//Post the data of list of Invoice
async function InvoicePostData(invoiceData) {
    try {
        const response = await fetch('https://localhost:44341/api/Invoices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(invoiceData),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log('Invoice data added successfully:', responseData);
    } catch (error) {
        console.error('Error adding invoice data:', error);
    }
}


// Get the Id from the productsName
async function Inovicedata(productsName) {
    try {
        const response = await fetch('https://localhost:44341/api/Products');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        for (let i = 0; i < data.length; i++) {
            if (productsName === data[i].productName) {
                return data[i].id;
            }
        }
    } catch (error) {
        console.error('Error fetching product data:', error);
    }
}

document.getElementById('Clear').addEventListener('click', function () {
    window.location.reload();
})

fetchInvoiceDetails();

async function functionDelete(invoiceIdToDelete) {
    fetch(`https://localhost:44341/api/Invoices/Invoice?id=${invoiceIdToDelete}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {

            console.log('Invoice deleted successfully:', data);
        })
        .catch(error => {
            console.error('Error deleting invoice:', error);
        });
}