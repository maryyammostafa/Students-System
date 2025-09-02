let formEle = document.querySelector("form"),
    formInputs = formEle.querySelectorAll("input"),
    formBtn = document.querySelector("form button"),
    id = 0,
    students = [],
    tBody = document.querySelector("tbody"),
    deleteModal = document.querySelector(".deleteModal"),
    editModal = document.querySelector(".editModal"),
    confirmDeleteBtn = document.querySelector(".deleteModal .delete"),
    saveEditBtn = document.querySelector(".editModal .save"),
    resetBtn = document.querySelector(".reset"),
    searchInput = document.querySelector("#Filtration input");

// LocalStorage
(function (){
    if(localStorage.getItem("students") == null){
        localStorage.setItem("students",JSON.stringify(students));
    }
    else{
        students = JSON.parse(localStorage.getItem("students"));
    }
    if(localStorage.getItem("id") == null){
        localStorage.setItem("id",id);
    }
    else{
        id = +localStorage.getItem("id");
    }
    showAllStudents(students);
})();
checkContent();

// Form submit
formEle.addEventListener("submit", (e) => {
    e.preventDefault();

    formEle.querySelector("input:focus")?.blur();
    for(let formInput of formInputs){
        if(formInput.dataset.valid === "false"){
            return 0;
        }
        if(formInput.value != ""){
            formInput.className = "form-control";
        }
    }

    if(formEle.dataset.type == "add"){
        addStudent();
    }
    else if(formEle.dataset.type == "edit"){
        editStudentInForm();
    }
    checkContent();
});

// When focus/blur on input
formInputs.forEach((formInput) =>{
    formInput.addEventListener("blur", ()=>{
        checkInput(formInput);
    });
    formInput.addEventListener("focus", ()=>{
        resetBtn.classList.remove("d-none");
    });
});

// Filtration
searchInput.addEventListener("keyup", ()=>{
    let searchValue = searchInput.value.toLowerCase(),
        filteredStudents = students.filter((student)=>{
            return student.id.toString().includes(searchValue) ||
                student.firstName.toLowerCase().includes(searchValue) ||
                student.lastName.toLowerCase().includes(searchValue) ||
                student.email.toLowerCase().includes(searchValue) ||
                student.age.includes(searchValue) ||
                student.phone.includes(searchValue) ;
        });
    showAllStudents(filteredStudents);
});

// Modal animation
deleteModal.addEventListener("click",()=>{
    deleteModal.querySelector(".box").classList.add("animate");
    deleteModal.querySelector(".box").addEventListener("animationend",()=>{
        deleteModal.querySelector(".box").classList.remove("animate");
    });
});
deleteModal.querySelector(".box").addEventListener("click",(e)=>{
    e.stopPropagation();
});
editModal.addEventListener("click",()=>{
    editModal.querySelector(".box").classList.add("animate");
    editModal.querySelector(".box").addEventListener("animationend",()=>{
        editModal.querySelector(".box").classList.remove("animate");
    });
});
editModal.querySelector(".box").addEventListener("click",(e)=>{
    e.stopPropagation();
});