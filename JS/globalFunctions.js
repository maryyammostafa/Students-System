// Create
function getStudent(currentId){
    let student = { id : currentId };
    formInputs.forEach((formInput) =>{
        let inputName = formInput.name,
            inputValue = formInput.value;
        student[inputName] = inputValue;
    });
    return student;
}
let index = 0;
function showStudent(student){
    tBody.innerHTML += `
        <tr data-std-id="${student.id}" data-index="${index}">
            <th scope="row">${student.id}</th>
            <td>${student.firstName}</td>
            <td>${student.lastName}</td>
            <td>${student.email}</td>
            <td>${student.age}</td>
            <td>${student.phone}</td>
            <td>
                <button class="btn btn-info text-light me-2 edit" onclick="editStudent(${student.id},this,${index})">Edit</button>
                <button class="btn btn-primary me-2 d-none undo" onclick="undoEdit(this)">Undo</button>
                <button class="btn btn-danger delete" onclick="deleteStudent(${student.id},this)">Delete</button>
            </td>
        </tr>
    `;
    index++;
}
function showAllStudents(currentStudents){
    tBody.innerHTML = "";
    currentStudents.forEach((student)=>{
        showStudent(student);
    });
}

// Update and Checking
function checkInput(input){
    let inputName = input.name,
        inputValue = input.value,
        inputAlert = input.nextElementSibling,
        regex;

    if(inputName == "firstName" || inputName == "lastName"){
        regex = /^\s*[A-Za-z]{3,}\s*$/;
    }
    else if(inputName == "email"){
        regex = /^\s*[A-Za-z]+[A-Za-z0-9_\-\.]*@(gmail\.com|yahoo\.org)\s*$/;
    }
    else if(inputName == "age"){
        regex = /^\s*[1-9]{1}[0-9]?\s*$/;
    }
    else if(inputName == "phone"){
        regex = /^\s*(02)?01(0|1|2|5)[0-9]{8}\s*$/;
    }

    if(inputValue==""){
        inputAlert.textContent = "This field is required";
        inputAlert.classList.remove("d-none");
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        input.setAttribute("data-valid", false);
    }
    else if(!regex.test(inputValue)){
        inputAlert.textContent = "Invalid";
        inputAlert.classList.remove("d-none");
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        input.setAttribute("data-valid", false);
    }
    else{
        inputAlert.classList.add("d-none");
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        input.setAttribute("data-valid", true);
    }
}
function checkContent(){
    if (students.length == 0){
        document.querySelector(".warning").classList.remove("d-none");
    }
    else{
        document.querySelector(".warning").classList.add("d-none");
    }
}
function updateLocalStorage(){
    localStorage.setItem("students",JSON.stringify(students));
    localStorage.setItem("id",id);
}

// Open/Close Modal
function openDeleteModal(){
    deleteModal.classList.remove("closed");
}
function openEditModal(){
    editModal.classList.remove("closed");
}
function closeModal(that){
    deleteModal.classList.add("closed");
    editModal.classList.add("closed");
}

// Delete
function deleteStudent(studentId,that){
    openDeleteModal();
    confirmDeleteBtn.onclick = function (){
        students = students.filter((student) => { return student.id != studentId});
        updateLocalStorage();
        that.parentElement.parentElement.remove();
        checkContent();
        closeModal();
    };
}

// Add/Edit
function editStudent(studentId, that, index){
    resetForm();
    let student = students.filter((student) => {return student.id === studentId})[0];
    formInputs.forEach((formInput)=>{
        formInput.value = student[formInput.name];
        formInput.dataset.valid="true";
    });
    formEle.dataset.type = "edit";
    formBtn.className = "btn btn-info text-light w-100";
    formBtn.textContent = "Edit";
    that.classList.add("d-none");
    that.nextElementSibling.classList.remove("d-none");
    resetBtn.classList.remove("d-none");
    formEle.setAttribute("data-std-id",student.id);
    formEle.setAttribute("data-index",index);
    disableButtons(true);
}
function editStudentInForm(){
    openEditModal();
    saveEditBtn.onclick = function (){
    let updatedStudentId = +formEle.getAttribute("data-std-id"),
        updatedStudentIndex = students.findIndex((student) => { return student.id == updatedStudentId}),
        updatedStudent = getStudent(updatedStudentId);
    students[updatedStudentIndex] = updatedStudent;
    updateLocalStorage();
    tBody.querySelector(`tr[data-std-id="${updatedStudentId}"]`).innerHTML = `
        <th scope="row">${updatedStudent.id}</th>
        <td>${updatedStudent.firstName}</td>
        <td>${updatedStudent.lastName}</td>
        <td>${updatedStudent.email}</td>
        <td>${updatedStudent.age}</td>
        <td>${updatedStudent.phone}</td>
        <td>
            <button class="btn btn-info text-light me-2 edit" onclick="editStudent(${updatedStudent.id},this,${updatedStudentIndex})">Edit</button>
            <button class="btn btn-primary me-2 d-none undo" onclick="undoEdit(this)">Undo</button>
            <button class="btn btn-danger delete" onclick="deleteStudent(${updatedStudent.id},this)">Delete</button>
        </td>
    `;
    tBody.querySelector(`tr[data-std-id="${updatedStudentId}"]`).classList.add("table-success");
    setTimeout(()=>{
        tBody.querySelector(`tr[data-std-id="${updatedStudentId}"]`).classList.remove("table-success");
    },1500);
    resetForm();
    closeModal();
    }
}
function undoEdit(that){
    resetForm();
    formEle.dataset.type = "add";
    formBtn.className = "btn btn-success w-100";
    formBtn.textContent = "Add";
    that.previousElementSibling.classList.remove("d-none");
    that.classList.add("d-none");
}
function addStudent(){
    let newStudent = getStudent(++id);
    students.push(newStudent);
    updateLocalStorage();
    showStudent(newStudent);
    resetForm();
}

function disableButtons(condition){
    let deleteBtns = document.querySelectorAll("td button.delete"),
        editBtns = document.querySelectorAll("td button.edit");
    for(let deleteBtn of deleteBtns){
        deleteBtn.disabled = condition;
    }
    for(let editBtn of editBtns){
        editBtn.disabled = condition;
    }
}

// Reset
function resetForm(){
    formEle.reset();
    formInputs.forEach((formInput)=>{
        formInput.dataset.valid="false";
        formInput.nextElementSibling.classList.add("d-none");
        formInput.className = "form-control";
    });
    formEle.dataset.type = "add";
    formBtn.className = "btn btn-success w-100";
    formBtn.textContent = "Add";
    resetBtn.classList.add("d-none");
    disableButtons(false);
    tBody.querySelector(`tr[data-index="${formEle.getAttribute("data-index")}"] td button.undo`)?.classList.add("d-none");
    tBody.querySelector(`tr[data-index="${formEle.getAttribute("data-index")}"] td button.edit`)?.classList.remove("d-none");
}