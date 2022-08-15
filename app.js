/**  Selecting Items  **/
const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const list = document.querySelector(".grocery-list");
const container = document.querySelector(".grocery-container");
const clearBtn = document.querySelector(".clear-btn");

/** Edit Option **/
let editElement;
let editFlag = false;
let editID = "";

/** event Listners **/
// submit form
form.addEventListener("submit", addItem);
//clear button
clearBtn.addEventListener("click",() => {
    const items = document.querySelectorAll(".grocery-item");
    // console.log(items);

    //iterating over every article and deleting
    if(items.length>0){

        items.forEach( (items) => {
            list.removeChild(items);
        })
        // for(let i=0; i<items.length; i++){
        //     list.removeChild(items[i]);
        // }
    }
    container.classList.remove("show-container");
    displayAlert("all elements removed", "danger");
    setBackToDefault();
    localStorage.removeItem("list");
})

//load items
window.addEventListener("DOMContentLoaded", LoadFromStorage);

/** Functions **/
function addItem(e){
    e.preventDefault();
    // console.log(grocery.value);
    const value = grocery.value;

    //getting a unique id for every Element
    const id = new Date().getTime().toString();
    // console.log(id);

    if(value != "" && !editFlag){
        let newElmt = document.createElement("article");
        newElmt.classList.add("grocery-item");

        //adding the unique id
        // const attr = document.createAttribute("data-id");
        // attr.value = id;
        newElmt.setAttribute("data-id", id);

        //dynamically addding HTML
        newElmt.innerHTML = `
        <p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <img src="./edit.png" alt="edit" srcset="" />
              </button>
              <button type="button" class="delete-btn">
                <img src="./trash-bin.png" alt="delete" srcset="" />
              </button>
            </div>
        `;
        list.appendChild(newElmt);

        /*Setting up delete and edit buttons*/
        const deleteBtn = newElmt.querySelector(".delete-btn");
        const editBtn = newElmt.querySelector(".edit-btn");

        //adding event listners for the same
        deleteBtn.addEventListener("click", deleteItem);
        editBtn.addEventListener("click", editItem);
        /*end*/


        // console.log(newElmt);
        displayAlert("item added to the list", "sucess");
        container.classList.add("show-container");

        addToLocalStorage(id, value);
        setBackToDefault();
    }

    else if(value !="" && editFlag){
        //editing stage
        editElement.textContent = value;
        //edit local storage
        editLocalStorage(value);

        setBackToDefault();
        displayAlert("data updated", "sucess");
    }

    else{
        displayAlert("Value is Empty", "danger");
    }
}

//display alert
function displayAlert(text, action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    setTimeout(() => {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 1500);
}

//set back to default
function setBackToDefault(){
    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
}

//delete function
function deleteItem(e){
    const elmt = e.currentTarget.parentElement.parentElement;
    const id = elmt.dataset.id;
    // console.log(elmt);
    list.removeChild(elmt);

    if(list.children.length == 0){
        container.classList.remove("show-container");
    }
    displayAlert("element removed", "danger");
    setBackToDefault();

    removeFromLocalStorage(id);
}

//edit function
function editItem(e){
    const elmt = e.currentTarget.parentElement.parentElement;
    //getting the corresponding title
    editElement = e.currentTarget.parentElement.previousElementSibling;
    // console.log(elmt);
    // console.log(editElement.textContent);
    grocery.value = editElement.textContent;
    editFlag = true;
    editID = elmt.dataset.id;
    // console.log(editID);
    submitBtn.textContent = "edit";
}

/** LOCAL STORAGE **/
function getLocalStorage(){
    return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];
}

function addToLocalStorage(id, value){
    let obj = {
        // id: id, value: value
        // for ES6 no need
        id, value
    }

    let storage = getLocalStorage();
    storage.push(obj);
    // console.log(storage);
    localStorage.setItem("list" ,JSON.stringify(storage));
}

function removeFromLocalStorage(id){
    let storage = getLocalStorage();
    
    let arr = [];
    for(let i=0; i<storage.length; i++){
        if(storage[i].id != id) arr.push(storage[i]);
    }
    // console.log(arr);

    localStorage.setItem("list", JSON.stringify(arr));
}

function editLocalStorage(val){
    let storage = getLocalStorage();
    // console.log(editID);

    for(let i=0; i<storage.length; i++){
        // console.log(storage[i].id);
        if(storage[i].id == editID) {
            storage[i].value = val;
        }
    }
    // console.log(storage);
    localStorage.setItem("list", JSON.stringify(storage));
}

//loading function
function LoadFromStorage(){
    let storage = getLocalStorage();
    if(storage.length>0){
        for(let i=0; i<storage.length; i++){
            const value = storage[i].value;
            const id = storage[i].id;

            let newElmt = document.createElement("article");
            newElmt.classList.add("grocery-item");

            //adding the unique id
            // const attr = document.createAttribute("data-id");
            // attr.value = id;
            newElmt.setAttribute("data-id", id);

            //dynamically addding HTML
            newElmt.innerHTML = `
            <p class="title">${value}</p>
                <div class="btn-container">
                <button type="button" class="edit-btn">
                    <img src="./edit.png" alt="edit" srcset="" />
                </button>
                <button type="button" class="delete-btn">
                    <img src="./trash-bin.png" alt="delete" srcset="" />
                </button>
                </div>
            `;
            list.appendChild(newElmt);

            /*Setting up delete and edit buttons*/
            const deleteBtn = newElmt.querySelector(".delete-btn");
            const editBtn = newElmt.querySelector(".edit-btn");

            //adding event listners for the same
            deleteBtn.addEventListener("click", deleteItem);
            editBtn.addEventListener("click", editItem);
            /*end*/
        }
    container.classList.add("show-container");
    }
    // setBackToDefault();
}