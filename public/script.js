var mode = 0;

window.onload = () => {
    createForm();
    getContactList();
}

createForm = () => {
    let root = document.getElementById("root");
    let form = document.createElement("form");
    form.setAttribute("class","m-3");

    let firstNameInput = document.createElement("input");
    firstNameInput.setAttribute("type","text");
    firstNameInput.setAttribute("id","firstname");
    firstNameInput.setAttribute("name","firstname");
    firstNameInput.setAttribute("class","form-control");
    let firstNameLabel = document.createElement("label");
    firstNameLabel.setAttribute("for","firstname");
    firstNameLabel.setAttribute("class","form-label");
    let firstNameText = document.createTextNode("First Name");
    firstNameLabel.appendChild(firstNameText);

    let lastNameInput = document.createElement("input");
    lastNameInput.setAttribute("type","text");
    lastNameInput.setAttribute("id","lastname");
    lastNameInput.setAttribute("name","lastname");
    lastNameInput.setAttribute("class","form-control");
    let lastNameLabel = document.createElement("label");
    lastNameLabel.setAttribute("for","lastname");
    lastNameLabel.setAttribute("class","form-label");
    let lastNameText = document.createTextNode("Last Name");
    lastNameLabel.appendChild(lastNameText);

    let emailInput = document.createElement("input");
    emailInput.setAttribute("type","email");
    emailInput.setAttribute("id","email");
    emailInput.setAttribute("name","email");
    emailInput.setAttribute("class","form-control");
    let emailLabel = document.createElement("label");
    emailLabel.setAttribute("for","email");
    emailLabel.setAttribute("class","form-label");
    let emailText = document.createTextNode("Email");
    emailLabel.appendChild(emailText);

    let phoneInput = document.createElement("input");
    phoneInput.setAttribute("type","tel");
    phoneInput.setAttribute("id","phone");
    phoneInput.setAttribute("name","phone");
    phoneInput.setAttribute("class","form-control");
    let phoneLabel = document.createElement("label");
    phoneLabel.setAttribute("for","phone");
    phoneLabel.setAttribute("class","form-label");
    let phoneText = document.createTextNode("Phone");
    phoneLabel.appendChild(phoneText);

    let submitButton = document.createElement("input");
    submitButton.setAttribute("type","submit");
    submitButton.setAttribute("id","submit-button");
    submitButton.setAttribute("class","btn btn-success");
    submitButton.setAttribute("value","Add");

    form.appendChild(firstNameLabel);
    form.appendChild(firstNameInput);
    form.appendChild(lastNameLabel);
    form.appendChild(lastNameInput);
    form.appendChild(emailLabel);
    form.appendChild(emailInput);
    form.appendChild(phoneLabel);
    form.appendChild(phoneInput);
    form.appendChild(submitButton);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        addContact();
    });

    root.appendChild(form);
}

addContact = async () => {
    const firstname = document.getElementById("firstname");
    const lastname = document.getElementById("lastname");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    let contact = {
        "firstname":firstname.value,
        "lastname":lastname.value,
        "email":email.value, 
        "phone":phone.value
    } 
    let url = "/api/contact"
    let request = {
        "method":"POST",
        "headers":{"Content-Type":"application/json"},
        "body":JSON.stringify(contact)
    }
    if(mode) {
        url = "/api/contact/"+mode;
        request = {
            "method":"PUT",
            "headers":{
                "Content-Type":"application/json"
            },
            "body":JSON.stringify(contact)
        }
    }
    const response = await fetch(url,request);
    if(response.ok) {
        firstname.value = "";
        lastname.value = "";
        email.value = "";
        phone.value = "";
        getContactList();
    } else {
        console.log("Server responded with a status "+response.status+" "+response.statusText);
    }
}

const getContactList = async () => {
    const response = await fetch("/api/contact");
    if(response.ok) {
        let list = await response.json();
        if(list) {
            populateTable(list);
        }
    } else {
        console.log("Server responded "+response.status+" " +response.statusText);
    }
}

const removeContact = async (id) => {
    let request = {
        "method":"DELETE"
    }
    const response = await fetch("/api/contact/"+id,request);
    if(response.ok) {
        getContactList();
    } else {
        console.log("Server resp. "+response.status+" "+response.statusText);
    }
}

editContact = (contact) => {
    const firstname = document.getElementById("firstname");
    const lastname = document.getElementById("lastname");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    firstname.value = contact.firstname;
    email.value = contact.email;
    lastname.value = contact.lastname;
    phone.value = contact.phone;
    mode = contact._id;
    const submitButton = document.getElementById("submit-button");
    submitButton.value = "Save";
}

const populateTable = (list) => {
    const root = document.getElementById("root");
    const oldTable = document.getElementById("table");
    if(oldTable) {
        root.removeChild(oldTable);
    }
    const table = document.createElement("table");
    table.setAttribute("id","table");
    table.setAttribute("class", "table table-striped");

    const header = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const firstNameHeader = document.createElement("th")
    const firstNameText = document.createTextNode("First Name");
    firstNameHeader.appendChild(firstNameText);

    const lastNameHeader = document.createElement("th")
    const lastNameText = document.createTextNode("Last Name");
    lastNameHeader.appendChild(lastNameText);

    const emailHeader = document.createElement("th")
    const emailText = document.createTextNode("Email");
    emailHeader.appendChild(emailText);

    const phoneHeader = document.createElement("th")
    const phoneText = document.createTextNode("Phone");
    phoneHeader.appendChild(phoneText);

    const removeHeader = document.createElement("th")
    const removeText = document.createTextNode("Remove");
    removeHeader.appendChild(removeText);

    const editHeader = document.createElement("th")
    const editText = document.createTextNode("Edit");
    editHeader.appendChild(editText);

    headerRow.append(firstNameHeader, lastNameHeader, emailHeader,
        phoneHeader, removeHeader, editHeader);
    header.appendChild(headerRow);
    table.appendChild(header);

    const body = document.createElement("tbody");
    for(let i=0;i<list.length;i++) {
        const tableRow = document.createElement("tr");
        for(x in list[i]) {
            if (x == "_id" || x == "__v") {
                continue;
            }
            const column = document.createElement("td");
            const info = document.createTextNode(list[i][x]);
            column.appendChild(info);
            tableRow.append(column);
        }
        const removeColumn = document.createElement("td");
        const removeButton = document.createElement("button");
        removeButton.setAttribute("class","btn btn-danger");
        const removeButtonText = document.createTextNode("Remove");
        removeButton.appendChild(removeButtonText);
        removeButton.addEventListener("click", (e) => {
            removeContact(list[i]._id);
        })
        const editColumn = document.createElement("td");
        const editButton = document.createElement("button");
        editButton.setAttribute("class","btn btn-secondary");
        const editButtonText = document.createTextNode("Edit");
        editButton.appendChild(editButtonText);
        editButton.addEventListener("click", (e) => {
            editContact(list[i]);
        })       
        removeColumn.appendChild(removeButton);
        editColumn.appendChild(editButton);
        tableRow.append(removeColumn, editColumn);
        body.appendChild(tableRow);
    }
    table.appendChild(body);
    root.appendChild(table);
}