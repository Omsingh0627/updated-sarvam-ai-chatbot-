/* =========================
   ELEMENTS
========================= */

const ragUploadBtn =
document.getElementById(
"rag-upload-btn"
);

const ragFileInput =
document.getElementById(
"rag-file-input"
);

const knowledgeList =
document.getElementById(
"knowledge-list"
);

/* =========================
   LOAD KNOWLEDGE BASE
========================= */

async function loadKnowledgeBase(){

try{

const response =
await fetch(
"http://127.0.0.1:8000/documents"
);

const data =
await response.json();

renderKnowledgeBase(
data.documents || []
);

}catch(err){

console.log(
"Knowledge Load Error:",
err
);

}

}

/* =========================
   RENDER KNOWLEDGE BASE
========================= */

function renderKnowledgeBase(documents){

knowledgeList.innerHTML = "";

if(documents.length === 0){

knowledgeList.innerHTML = `

<div class="knowledge-empty">
No documents uploaded
</div>

`;

return;

}

documents.forEach(doc=>{

const item =
document.createElement("div");

item.classList.add(
"knowledge-item"
);

item.innerHTML = `

<div class="knowledge-name">
📄 ${doc}
</div>

<button
class="delete-knowledge"
data-doc="${doc}"
>
✕
</button>

`;

knowledgeList.appendChild(
item
);

});

/* DELETE BUTTONS */

document
.querySelectorAll(
".delete-knowledge"
)
.forEach(btn=>{

btn.onclick = async()=>{

const filename =
btn.dataset.doc;

try{

await fetch(

`http://127.0.0.1:8000/delete/${filename}`,

{
method:"DELETE"
}

);

loadKnowledgeBase();

}catch(err){

console.log(
"Delete Error:",
err
);

}

};

});

}

/* =========================
   UPLOAD BUTTON
========================= */

ragUploadBtn.onclick = ()=>{

ragFileInput.click();

};

/* =========================
   FILE UPLOAD
========================= */

ragFileInput.onchange =
async()=>{

const file =
ragFileInput.files[0];

if(!file) return;

const formData =
new FormData();

formData.append(
"file",
file
);

/* LOADING UI */

ragUploadBtn.innerHTML =
"Uploading...";

/* SEND TO PYTHON RAG */

try{

const response =
await fetch(
"http://127.0.0.1:8000/upload",
{
method:"POST",
body:formData
}
);

const data =
await response.json();

console.log(data);

/* SUCCESS */

ragUploadBtn.innerHTML =
"✅ Uploaded";

setTimeout(()=>{

ragUploadBtn.innerHTML =
"+ Upload Knowledge";

},2000);

/* RELOAD KNOWLEDGE */

loadKnowledgeBase();

}catch(err){

console.log(
"Upload Error:",
err
);

ragUploadBtn.innerHTML =
"❌ Upload Failed";

setTimeout(()=>{

ragUploadBtn.innerHTML =
"+ Upload Knowledge";

},2000);

}

};

/* =========================
   DRAG & DROP
========================= */

const ragSection =
document.querySelector(
".rag-section"
);

ragSection.addEventListener(
"dragover",
e=>{

e.preventDefault();

ragSection.style.border =
"1px solid #2954ff";

}
);

ragSection.addEventListener(
"dragleave",
()=>{

ragSection.style.border =
"1px solid #1f1f1f";

}
);

ragSection.addEventListener(
"drop",
async e=>{

e.preventDefault();

ragSection.style.border =
"1px solid #1f1f1f";

const file =
e.dataTransfer.files[0];

if(!file) return;

const formData =
new FormData();

formData.append(
"file",
file
);

try{

ragUploadBtn.innerHTML =
"Uploading...";

await fetch(
"http://127.0.0.1:8000/upload",
{
method:"POST",
body:formData
}
);

ragUploadBtn.innerHTML =
"✅ Uploaded";

setTimeout(()=>{

ragUploadBtn.innerHTML =
"+ Upload Knowledge";

},2000);

loadKnowledgeBase();

}catch(err){

console.log(err);

}

}
);

/* =========================
   INITIAL LOAD
========================= */

loadKnowledgeBase();