function onSubmit(event) {
  event.preventDefault();
  const isUpdate = document
    .getElementById("submitInformation")
    .getAttribute("isUpdate");
  const element = document.querySelectorAll(
    ".form-element input[type='text'], .form-element select, .form-element textarea"
  );
  const data = {};
  for (let i = 0; i < element.length; i++) {
    const getValue = element[i].value.trim();
    const getName = element[i].name;
    const isError = errorHandler(getValue, getName);
    if (!isError) {
      data[getName] = getValue;
    }
  }
  if (Object.keys(data).length) {
    updateLocalStorageData(data, isUpdate);
    document.getElementById("clear").click();
    onLoadBody();
  }
}

function updateLocalStorageData(data, isUpdate) {
  const getData = getStorageLocalData();
  if (isUpdate !== "null") {
    getData[isUpdate] = data;
  } else {
    getData.push(data);
  }
  setStorageLocalData(getData);
  setActionButton("Send Information", null);
}

function setStorageLocalData(dataItem) {
  localStorage.setItem("DATA", JSON.stringify(dataItem));
}

function getStorageLocalData() {
  let store = localStorage.getItem("DATA");
  if (store) {
    const localData = JSON.parse(store);
    if (Array.isArray(localData)) {
      return localData;
    }
    return [localData];
  }
  return [];
}

function errorHandler(getValue, getName) {
  let errorElement = document.getElementsByClassName("error-" + getName);
  if (!getValue && errorElement.length) {
    errorElement[0].style.display = "block";
    return true;
  }
  errorElement[0].style.display = "none";
  return false;
}

function onChangeHandler(event) {
  const name = event.target.name;
  const value = event.target.value;
  errorHandler(value, name);
}

function onLoadBody() {
  const storeData = getStorageLocalData();
  if (storeData) {
    document.getElementById("tableData").style.display = "block";
    let container = "";
    for (let i = 0; i < storeData.length; i++) {
      container += `<tr><td>${i + 1}</td>
                        <td>${storeData[i].name}</td>
                        <td>${storeData[i].fatherName}</td>
                        <td>${storeData[i].motherName}</td>
                        <td>${storeData[i].course}</td>
                        <td>${storeData[i].phone}</td>
                        <td>${storeData[i].address}</td>
                        <td class='action-btn'><button id='delete' class='delete' onclick='deleteHandler(${i});'>Delete</button> || <button id='update' class='update' onclick='updateInformation(${i})'>Update</button></td></tr>`;
    }
    document.getElementById("tableBodyData").innerHTML = container;
  }
}

function deleteHandler(index) {
  if (confirm("Do you want to delete")) {
    const data = getStorageLocalData();
    if (data.length > index) {
      data.splice(index, 1);
      setStorageLocalData(data);
      onLoadBody();
    }
  }
}

function updateInformation(index) {
  const data = getStorageLocalData();
  if (data.length > index) {
    const getItem = data[index];
    const element = document.querySelectorAll(
      ".form-element input[type='text'], .form-element select, .form-element textarea"
    );
    for (let i = 0; i < element.length; i++) {
      if (getItem[element[i].name]) {
        element[i].value = getItem[element[i].name];
      }
    }
    setActionButton("Update Information", index);
  }
}

function setActionButton(text, index) {
  const actionElement = document.getElementById("submitInformation");
  actionElement.innerText = text;
  actionElement.setAttribute("isUpdate", index);
}

document.addEventListener("DOMContentLoaded", function () {
  onLoadBody();
});
