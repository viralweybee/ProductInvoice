//Fetching Api data
FetchData();
async function FetchData() {
    try {
        const response = await fetch('https://localhost:44341/api/Products');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('API Data:', data);

        for (let i = 0; i < data.length; i++) {
            GetProductName(data[i].id, data[i].productName, data[i].price);
        }
        EditDelete_function(data);
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}
function GetProductName(id, partyName, price) {
    let table = document.getElementsByClassName('tbody')[0]
    let row = table.insertRow(-1);
    let c1 = row.insertCell(0);
    let c2 = row.insertCell(1);
    let c3 = row.insertCell(2);
    c1.innerText = id;
    c2.innerText = partyName;
    c3.innerText = price;
    let c4 = row.insertCell(3);
    //Edit button
    const para = document.createElement("button");
    para.id = `Edit${id}`
    para.classList.add('btn')
    para.classList.add('btn-outline-warning')
    const node = document.createTextNode(`Edit`);
    para.appendChild(node);
    c4.appendChild(para);
}

//Edit Delete button redirect to page on edit
function EditDelete_function(data) {
    let el = document.getElementsByClassName('tbody')[0]
    el.addEventListener('click', (e) => {
        if (e.target.tagName.toLowerCase() === 'button') {
            const buttonid = event.target.id;
            let Id1;
            if (buttonid.substring(0, 6) === 'Delete') {
                const DeletetextId = buttonid.substring(6);
            }
            if (buttonid.substring(0, 4) === 'Edit') {
                document.querySelector('.hide').style.display = 'none';
                document.querySelector('.hide1').style.display = 'none';
                Editflag = true;
                Id1 = parseInt(buttonid.substring(4));
                const selectedData = data.find(item => item.id === Id1);
                const modalTitle = document.querySelector('.modal-title');
                const productNameInput = document.querySelector('.modal-body input[type="text"]');

                modalTitle.textContent = `Edit Product - # ${Id1}`;
                productNameInput.value = selectedData.productName;
                document.getElementById('price').value = selectedData.price;
                $('#exampleModalCenter').modal('show');
            }
        }
    })
}
document.getElementById('addProduct').addEventListener('click', function () {
    document.getElementById('exampleModalLongTitle').textContent = 'Add Product';
    document.getElementById('productNameInput').value = '';
    document.getElementById('price').value = '';
    document.querySelector('.hide').style.display = 'none';
    document.querySelector('.hide1').style.display = 'none';

})
const saveButton = document.querySelector('.modal-footer button.btn-primary');
document.getElementById('addProduct').addEventListener('click', () => {
    Editflag = false;
})
var Editflag;

//SaveButton 
saveButton.addEventListener('click', async () => {
    if (Editflag) {
        try {
            const updatedProductName = document.getElementById('productNameInput').value;
            const updatedPrice = parseInt(document.getElementById('price').value);
            if (document.getElementById('price').value.trim() == '') {
                document.querySelector('.hide1').style.display = 'block';
                document.querySelector('.hide').style.display = 'none';
                document.querySelector('.hide1').textContent = "This filled is required";
                return;
            }
            if (updatedPrice <= 0) {
                document.querySelector('.hide1').style.display = 'block';
                document.querySelector('.hide').style.display = 'none';
                document.querySelector('.hide1').textContent = "Price should be greater than 0";
                return;
            }
            if (updatedProductName.trim() == '') {
                document.querySelector('.hide').style.display = 'block';
                document.querySelector('.hide').textContent = `This should not be empty`
                return;
            }
            const modalTitleElement = document.querySelector('.modal-title');
            const modalTitleText = modalTitleElement.textContent;
            const match = modalTitleText.match(/\d+/);
            const productNumber = match ? parseInt(match[0], 10) : null;
            console.log(productNumber);
            if (productNumber !== null) {
                const updatedParty = {
                    Id: productNumber,
                    Name: updatedProductName,
                    Price: updatedPrice,
                };
                const response = await fetch(`https://localhost:44341/api/Products/${productNumber}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedParty),
                });
                if (response.status === 500) {
                    document.querySelector('.hide1').style.display = 'none';
                    document.querySelector('.hide').style.display = 'block';
                    document.querySelector('.hide').textContent = `Make sure that this Product doesn't exists`
                    return;
                }
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const responseData = await response.text();
                const data = responseData ? JSON.parse(responseData) : null;

                if (response.status === 400) {
                    document.querySelector('.hide1').style.display = 'none';
                    document.querySelector('.hide').style.display = 'block';
                    document.querySelector('.hide').textContent = `Make sure that this Product doesn't exists`
                }
                else {
                    $('#exampleModalCenter').modal('hide');
                    location.reload();
                }
               
            } else {
                console.error('Invalid product number.');
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
        console.log(Editflag);
    }
    else {
        try {
            const updatedProductName = document.getElementById('productNameInput').value;
            const updatedPrice = parseInt(document.getElementById('price').value);
            if (document.getElementById('price').value.trim() == '') {
                document.querySelector('.hide1').style.display = 'block';
                document.querySelector('.hide').style.display = 'none';
                document.querySelector('.hide1').textContent = "This filled is required";
                return;
            }
            if (updatedPrice <= 0) {
                document.querySelector('.hide1').style.display = 'block';
                document.querySelector('.hide').style.display = 'none';
                document.querySelector('.hide1').textContent = "Price should be greater than 0";
            }
            if (updatedProductName.trim() == '') {
                document.querySelector('.hide').style.display = 'block';
                document.querySelector('.hide').textContent = `This should not be empty`
                return;
            }
            const addParty = {
                Name: updatedProductName,
                Price: updatedPrice
            }
            const response = await fetch(`https://localhost:44341/api/Products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(addParty),
            });
            if (response.status === 400) {
                document.querySelector('.hide1').style.display = 'none';
                document.querySelector('.hide').style.display = 'block';
                document.querySelector('.hide').textContent = `Make sure that this Product doesn't exists`
            }
            else {
                $('#exampleModalCenter').modal('hide');
                location.reload();
            }
           
        }
        catch (error) {
            console.error('Error updating product:', error);
        }
    }
});








