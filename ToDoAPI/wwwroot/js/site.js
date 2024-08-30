const uri = '/api/ToDoItems';
const caturi = '/api/Categories'
let todos = [];
let categories = []

function getCategories() {
    fetch(caturi)
        .then(response => response.json())
        .then(data => _displayCategories(data))
        .catch(error => console.error('Unable to get categories.', error));
}

function getItems() {
    fetch(caturi)
        .then(response => response.json())
        .then(data => _displayCategories(data))
        .catch(error => console.error('Unable to get categories.', error))
        .then(() => fetch(uri)
            .then(response => response.json())
            .then(data => _displayItems(data))
            .catch(error => console.error('Unable to get items.', error)));
}

function _displayCategories(data) {
    let selOpt = document.getElementById('add-category-todo');
    selOpt.innerHTML = '';

    const tBody = document.getElementById('categories');
    tBody.innerHTML = '';

    const button = document.createElement('button');

    data.forEach(item => {
        let opt = document.createElement('option');
        opt.value = item.id;
        opt.innerHTML = item.name;
        selOpt.appendChild(opt);


        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', 'displayEditFormCat(' + item.id + ')');

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', 'deleteCat(' + item.id + ')');

        let tr = tBody.insertRow();

        let td2 = tr.insertCell(0);
        let textNode = document.createTextNode(item.name);
        td2.appendChild(textNode);

        let td3 = tr.insertCell(1);
        td3.appendChild(editButton);

        let td4 = tr.insertCell(2);
        td4.appendChild(deleteButton);
    });

    categories = data;
    console.log(categories);
}
function displayEditFormCat(id) {
    const item = categories.find(item => item.id === id);

    document.getElementById('edit-name-cat').value = item.name;
    document.getElementById('edit-id-cat').value = item.id;
    document.getElementById('editFormCat').style.display = 'block';
}
function addCategory() {
    const addNameTextbox = document.getElementById('add-name-cat');
    const item = {
        name: addNameTextbox.value.trim()
    };

    fetch(caturi, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getItems();
            addNameTextbox.value = '';
        })
        .catch(error => console.error('Unable to add category.', error));
}
function deleteCat(id) {
    // ToDO
    fetch(caturi + '/' + id, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete category.', error));
    todos.forEach(item => {
        if (item.categoryId === id) {
            fetch(uri + '/' + item.id, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(() => getItems())
                .catch(error => console.error('Unable to delete items.', error));
        }
    })
}
function updateCategory() {
    const itemId = document.getElementById('edit-id-cat').value;
    const item = {
        id: parseInt(itemId, 10),
        name: document.getElementById('edit-name-cat').value.trim(),
    };

    fetch(caturi + '/' + itemId, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to update category.', error));

    closeInput();

    return false;
}

function addItem() {
    const addNameTextbox = document.getElementById('add-name');
    const selOpt = document.getElementById('add-category-todo');
    const item = {
        name: addNameTextbox.value.trim(),
        isComplete: false,
        categoryId: parseInt(selOpt.options[selOpt.selectedIndex].value, 10)
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getItems();
            addNameTextbox.value = '';
        })
        .catch(error => console.error('Unable to add item.', error));
}

function deleteItem(id) {
    // ToDO
    fetch(uri + '/' + id, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item.', error));

}

function displayEditForm(id) {
    const item = todos.find(item => item.id === id);
    const cat = categories.find(cat => cat.id === item.categoryId)
    document.getElementById('edit-category').innerHTML = '';

    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-isComplete').checked = item.isComplete;
    categories.forEach(item => {
        let opt = document.createElement('option');
        opt.value = item.id;
        opt.selected = cat.id == item.id;
        opt.innerHTML = item.name;
        document.getElementById('edit-category').appendChild(opt);
    })
    document.getElementById('editForm').style.display = 'block';
}

function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const optCat = document.getElementById('edit-category');
    const item = {
        id: parseInt(itemId, 10),
        name: document.getElementById('edit-name').value.trim(),
        isComplete: document.getElementById('edit-isComplete').checked,
        categoryId: parseInt(optCat.options[optCat.selectedIndex].value, 10)
    };

    fetch(uri + '/' + itemId, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        
        .then(() => getItems())
        .catch(error => console.error('Unable to update item.', error));

    closeInput();

    return false;
}

function closeInput() {
    document.getElementById('editForm').style.display = 'none';
    document.getElementById('editFormCat').style.display = 'none';
}

function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'to-do' : 'to-dos';
    document.getElementById('counter').innerHTML = itemCount + ' ' + name;
    // DoTo
}

function _displayItems(data) {
    const tBody = document.getElementById('todos');
    tBody.innerHTML = '';

    _displayCount(data.length);

    const button = document.createElement('button');

    data.forEach(item => {
        let isCompleteCheckbox = document.createElement('input');
        isCompleteCheckbox.type = 'checkbox';
        isCompleteCheckbox.disabled = true;
        isCompleteCheckbox.checked = item.isComplete;

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', 'displayEditForm(' + item.id + ')');

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', 'deleteItem(' + item.id + ')');

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        td1.appendChild(isCompleteCheckbox);

        let td2 = tr.insertCell(1);
        let textNode = document.createTextNode(item.name);
        td2.appendChild(textNode);

        let td5 = tr.insertCell(2);
        const cat = categories.find(cat => cat.id === item.categoryId);
        let textNode2 = document.createTextNode(cat.name);
        td5.appendChild(textNode2);

        let td3 = tr.insertCell(3);
        td3.appendChild(editButton);

        let td4 = tr.insertCell(4);
        td4.appendChild(deleteButton);
    });

    todos = data;
}
