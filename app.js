function loadTasksFrom(categorie) {
    updateDomList();
}

function updateDomList() {
    dom_task_list.innerHTML = "";
    let tlist = task_list;
    if (searching) {
        searched = actions_forms[1].children[0].children[0].value || "";
        console.log("looking for", searched);
        tlist = tlist.filter(x => x.node.children[1].textContent.includes(searched));
    }
    

    if (selected_categorie === Categorie.NONE) {
        /*task_list.map(x => x.node)
        .forEach(x => {
            dom_task_list.appendChild(x);
        });*/
        tlist.filter(x => x.categorie === Categorie.TRAVAIL /*&& !x.done*/)
        .map(x => x.node)
        .forEach(x => {
            dom_task_list.appendChild(x);
        });
        tlist.filter(x => x.categorie === Categorie.LOISIRS /*&& !x.done*/)
        .map(x => x.node)
        .forEach(x => {
            dom_task_list.appendChild(x);
        });
        tlist.filter(x => x.categorie === Categorie.AUTRES /*&& !x.done*/)
        .map(x => x.node)
        .forEach(x => {
            dom_task_list.appendChild(x);
        });
    } else {
        tlist.filter(x => x.categorie === selected_categorie /*&& !x.done*/)
        .map(x => x.node)
        .forEach(x => {
            dom_task_list.appendChild(x);
        });
    }
    if (dom_task_list.children.length == 0) {
        let div = document.createElement("div");
        div.className = "m-2 text-center fs-3 text-secondary";
        div.textContent = "Vide";
        dom_task_list.appendChild(div);
    }
}

function createTask(content, categorie) {
    let root = document.createElement("div");
    let col1 = document.createElement("div");
    let checkbox = document.createElement("input");
    let col2 = document.createElement("div");
    let col3 = document.createElement("div");
    let button = document.createElement("button");

    root.id = "task-" + tcounter;
    root.className = "task-view border border-2 p-2 m-2 shadow-sm row";
    col1.className = "col-1";
    checkbox.className = "form-check-input";
    checkbox.type = "checkbox";
    checkbox.id = "fc-" + tcounter;
    col2.className = "col-10";
    col2.textContent = content;
    col3.className = "col-1";
    button.type = "button";
    button.className = "btn-close";
    button.ariaLabel = "Close";
    button.id = "cb-" + tcounter;

    checkbox.onclick = function() {
        let task = task_list.filter(x => x.node.id === root.id)[0];
        if (task.done) {
            task.node.children[1].classList.remove("text-decoration-line-through");
            task.done = false;
        } else {
            task.done = true;
            task.node.children[1].classList.add("text-decoration-line-through");
        }
        updateDomList();
    };
    button.onclick = function() {
        // TODO: Voir une meilleurs facon de l'enlever
        task_list = task_list.filter(x => x.node.id !== root.id);
        updateDomList();
    };
    
    col1.appendChild(checkbox);
    col3.appendChild(button);
    root.appendChild(col1);
    root.appendChild(col2);
    root.appendChild(col3);

    tcounter++;
    return {
        node: root,
        categorie: categorie,
        done: false
    };
}

const Categorie = {
    NONE: 0,
    TRAVAIL: 1,
    LOISIRS: 2,
    AUTRES: 3
}
let ajouter_btn = document.getElementById("ajouter-option");
let chercher_btn = document.getElementById("chercher-option");
let actions_forms = document.getElementById("actions-forms").children;
let dom_task_list = document.getElementById("task-list");
let selected_categorie = Categorie.TRAVAIL;
let searching = false;
let task_list = [
    /*{
        node: root, // node.id
        categorie: categorie,
        done: false
    }*/
]
let tcounter = 0;

// Choix de la tâche
document.getElementById('toutBtnRadio').onclick = function() {
    selected_categorie = Categorie.NONE;
    loadTasksFrom(Categorie.NONE);
};

document.getElementById('travailBtnRadio').onclick = function() {
    selected_categorie = Categorie.TRAVAIL;
    loadTasksFrom(Categorie.NONE);
};

document.getElementById('loisirsBtnRadio').onclick = function() {
    selected_categorie = Categorie.LOISIRS;
    loadTasksFrom(Categorie.NONE);
};

document.getElementById('autresBtnRadio').onclick = function() {
    selected_categorie = Categorie.AUTRES;
    loadTasksFrom(Categorie.NONE);
};

// Choix de l'action (Ajouter, chercher)
ajouter_btn.onclick = function() {
    if (chercher_btn.classList.contains('active')) {
        searching = false;
        chercher_btn.classList.remove('active');
        ajouter_btn.classList.add('active');
        actions_forms[0].classList.remove('d-none');
        actions_forms[1].classList.add('d-none');
        document.getElementById('toutBtnLabel').classList.add('d-none');
        document.getElementById('toutBtnRadio').classList.add('d-none');
        if (selected_categorie == Categorie.NONE) {
            selected_categorie = Categorie.AUTRES;
        }
    }
};

chercher_btn.onclick = function() {
    if (ajouter_btn.classList.contains('active')) {
        searching = true;
        ajouter_btn.classList.remove('active');
        chercher_btn.classList.add('active');
        actions_forms[1].classList.remove('d-none');
        actions_forms[0].classList.add('d-none');
        document.getElementById('toutBtnLabel').classList.remove('d-none');
        document.getElementById('toutBtnRadio').classList.remove('d-none');
    }
};

// Ajout de tâche
function ajouter() {
    let content = actions_forms[0].children[0].value || "";
    if (content.trim() !== "") {
        let newTask = createTask(content, selected_categorie);
        task_list.push(newTask);
        updateDomList();
        actions_forms[0].children[0].value = "";
    }
}
document.getElementById("ajouter-button").onclick = ajouter;
actions_forms[0].onkeydown = function(e) {
    if (e.key == "Enter") 
        ajouter();
}

// Chercher
function chercher() {
    let content = actions_forms[1].children[0].children[0].value || "";
    if (content.trim() !== "") {
        updateDomList();
    }
}
document.getElementById("chercher-button").onclick = chercher;
actions_forms[1].onkeydown = function(e) {
    if (e.key == "Enter") 
        chercher();
}