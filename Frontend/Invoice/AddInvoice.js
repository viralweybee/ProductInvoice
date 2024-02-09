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
discountAmount.value = 0;

const plusButton = document.querySelector('.plusbutton');
plusButton.addEventListener('click', addProductToList);


//Add Product
let track = [];
function addProductToList() {
    document.querySelector('.hide').style.display = 'none';
    const productName = productNameEl.value;
    const quantity = quantityEl.value;
    const price = priceEl.value;
    track.push({
        productName: productName,
        quantity: quantity,
        price: price
    });

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
    const pencilElement = document.createElement('img');
    pencilElement.src = '../icons8-edit.svg';
    const ImageElement = document.createElement('img');
    ImageElement.src = '../delete-icon.svg';
    ImageElement.classList = 'removeclass';
    pencilElement.classList = 'removeclass';
    Imageparent.appendChild(ImageElement);
    Imageparent.appendChild(pencilElement);


    ImageElement.addEventListener('click', function () {

        const rowToRemove = ImageElement.closest('.addedProduct');
        const indexInTrack = track.findIndex(item => 
            item.productName === rowToRemove.querySelector('.productNameElement').textContent &&
            item.quantity === rowToRemove.querySelector('.quantityElement').textContent &&
            item.price === rowToRemove.querySelector('.priceElement').textContent
        );
    
        // Remove the item from the track array based on its index
        if (indexInTrack !== -1) {
            track.splice(indexInTrack, 1);
        }
        rowToRemove.remove();
        calculateGrandTotal();
        console.log(track);

    });
    pencilElement.addEventListener('click', function () {
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
      
        const productName = rowToRemove.querySelector('.productNameElement').textContent;
        const quantity = rowToRemove.querySelector('.quantityElement').textContent;
        const price = rowToRemove.querySelector('.priceElement').textContent;

        productNameEl.value = productName;
        quantityEl.value = quantity;
        priceEl.value = price;
        rowToRemove.remove();
        console.log(track);
        calculateGrandTotal();
    });

    ImageElement.src = '../delete-icon.svg';
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

//Invoice No. Generator
var globalInvoiceNo;
dateEl.addEventListener('change', function () {
    const selectedDate = dateEl.value;
    fetch(`https://localhost:44341/api/Invoices/InvoiceNo?date=${selectedDate}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            invoiceNoEl.value = data;
            globalInvoiceNo=data;
        })
        .catch(error => {
            console.error('Error fetching invoice number:', error);
        });
});
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

//onchange fetch price 
productNameEl.addEventListener('change', function () {
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
                }
            }
        })
        .catch(error => {
            console.error('Error fetching product data:', error);
        });
});

//Calculate the GrandTotal
function calculateGrandTotal() {
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
var discountInput = document.getElementById('discountInput');
discountInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        console.log(discountInput.value);
        if (discountInput.value < 0) {
            return alert('Bad Request');
        }
        calculateGrandTotal();
    }
});
//Convert a number to word
let ones = ["", "one ", "two ", "three ", "four ", "five ", "six ", "seven ", "eight ", "nine ", "ten ", "eleven ", "twelve ", "thirteen ", "fourteen ", "fifteen ", "sixteen ", "seventeen ", "eighteen ", "nineteen "];
let tens = ["", "", "twenty ", "thirty ", "forty ", "fifty ", "sixty ", "seventy ", "eighty ", "ninety "];
function ntow(n, suffix) {
    let s = "";
    if (n > 19)
        s += tens[Math.floor(n / 10)] + ones[n % 10];
    else
        s += ones[n];
    if (n)
        s += suffix;
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
//Get the Id from the productsName
async function Inovicedata(productsName) {
    try {
        const response = await fetch('https://localhost:44341/api/Products');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        for (let i = 0; i < data.length; i++) {
            if (productsName === data[i].productName) {
                return data[i].id;
            }
        }
    } catch (error) {
        console.error('Error fetching product data:', error);
    }
}
saveEl.addEventListener('click', async () => {
    // Invoice List
    if (!customerEl.value.trim() || !dateEl.value || !invoiceNoEl.value || !finalAmountEl.textContent || parseInt(discountAmount.value) < 0) {
        alert('BadRequest');
        return;
    }
    //I want to write here
    const invoiceListData = {
        invoiceNo: invoiceNoEl.value,
        customerName: customerEl.value,
        total: parseInt(finalAmountEl.textContent),
        date: dateEl.value,
        invoice: []
    };
    await SaveInvoiceList(invoiceListData);
    var InvoiceId;
    try {
        const response = await fetch('https://localhost:44341/api/InvoiceLists');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('InvoiceLists API Data:', data);
        for (let i = 0; i < data.length; i++) {
            if (data[i].invoiceNo == invoiceNoEl.value) {
                InvoiceId = data[i].id;
                break;
            }
        }
    } catch (error) {
        console.error('Error fetching InvoiceLists data:', error.message);
    }
    // Invoice
    try {
        const InvoiceData = await SaveInvoice();
        let data = InvoiceData;
        console.log(data);
        for (let i = 0; i < data.length; i++) {
            const productId1 = await Inovicedata(data[i].name);
            var quantity1 = parseInt(data[i].quantity);
            const invoiceData = {
                invoiceId: InvoiceId,
                productId: productId1,
                quantity: quantity1,
                price: parseInt(data[i].price),
                "invoiceNavigation": null,
                "product": null
            };
            await InvoicePostData(invoiceData);
        }
        window.location.href = '../Invoice/Invoice.html';
    } catch (error) {
        console.error('Error processing invoice:', error);
    }
});

//Post Data on InvoiceList
async function SaveInvoiceList(invoiceData) {
    try {
        const response = await fetch('https://localhost:44341/api/InvoiceLists', {
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
        console.log('Invoice saved successfully:', responseData);
    } catch (error) {
        console.error('Error saving invoice:', error);
    }
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


//List of all the adding value of product 
function SaveInvoice() {
    return new Promise((resolve, reject) => {
        var htmlContent = document.getElementsByClassName('productListContainer')[0].innerHTML;
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        var productContainers = tempDiv.querySelectorAll('.addedProduct');
        var productList = [];
        productContainers.forEach(function (container) {
            var name = container.querySelector('div:nth-child(1)').textContent;
            var quantity = container.querySelector('div:nth-child(2)').textContent;
            var price = container.querySelector('div:nth-child(3)').textContent;
            var total = container.querySelector('div:nth-child(4)').textContent;

            productList.push({
                'name': name,
                'quantity': quantity,
                'price': price,
                'total': total,
            });
        });
        resolve(productList); // Resolve the Promise with the productList
    });
}
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

document.getElementById('Clear').addEventListener('click', function () {
    window.location.reload();
})