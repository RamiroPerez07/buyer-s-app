//variables
const newProductForm = document.getElementById("new-product-form")
const newQuoteForm = document.getElementById("new-quote-form")
const newProductNameInput = document.getElementById("new-product-name")
const selectedProductIdInput = document.getElementById("selected-product-id")
const selectedProductNameInput = document.getElementById("selected-product-name")
const newProductSupplierInput = document.getElementById("new-product-supplier")
const newProductPriceInput = document.getElementById("new-product-price")
const newProductIvaInput = document.getElementsByName("iva")
const newProductBrandInput = document.getElementById("new-product-brand")
const newProductObsInput = document.getElementById("new-product-obs")
//tablas
const productTable = document.getElementById("product-table")
const productDetailTable = document.getElementById("product-quotes-detail-table")
//busqueda por palabra clave
const searchProductInput = document.getElementById("product-search-input")
//botones de eliminacion de producto
const deleteProductBtns= document.getElementsByClassName("delete-product")
const deleteQuoteBtns = document.getElementsByClassName("delete-quote")


// form validation

const checkTextInput = (input) => {
  let valid = false; // por defecto va a ser false
  const content = input.value.trim();  // trim() va a eliminar los espacios en blanco
  // verificamos si el campo esta ok o no
  if(isEmpty(content)){ // si esta vacio
    showError(input, "* El campo es obligatorio") // va a mostrar mi mensaje de error
  } else {
    clearError(input); // va a mostrar mi mensaje de exito
    valid = true;
  }
  return valid
}

const checkProductSelectedInput = (input) =>{
    let valid = false;
    const content = input.value.trim();
    if(isEmpty(content)){
        showError(input, "* Debes seleccionar un producto de la lista.")
    }else{
        clearError(input);
        valid=true;
    }
    return valid;
}

const isEmpty = (value) => value === "";

const showError = (input, message) => {
    const formField = input.parentElement;
    formField.classList.add("error")
    const error = formField.querySelector("small");
    error.textContent = message;
}
const clearError = (input) => {
    const formField = input.parentElement;
    formField.classList.remove("error")
    const error = formField.querySelector("small");
    error.textContent = "";
}


// const isValidForm = () => checkTextInput(nameInput) && checkTextInput(surnameInput) && checkPhone(phoneInput) && checkPhone(emailInput) && checkPhone(dateInput);

const isValidQuoteForm = () => {
    return(
        checkProductSelectedInput(selectedProductIdInput) &&
        checkProductSelectedInput(selectedProductNameInput) &&
        checkTextInput(newProductSupplierInput) &&
        checkTextInput(newProductPriceInput) &&
        checkTextInput(newProductBrandInput)
    )   
}


const isValidProductForm = () => {
    return checkTextInput(newProductNameInput)
}