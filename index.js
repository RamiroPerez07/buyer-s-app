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

function getItemsFromLocalStorage(key){
    objectList = JSON.parse(localStorage.getItem(key)) || []
    return objectList ;
}

function saveItemsInLocalStorage(objectList,key){
    localStorage.setItem(key, JSON.stringify(objectList))
}

function renderProduct(product,index){
    return `
    <div class="row" data-id=${product.idProduct}>
        <div>${index+1}</div>
        <div>${product.idProduct}</div>
        <div>${product.name}</div>
    </div>
    `
}

function renderProducts(productList){
    const productTableHeader = `
        <div class= "header-row">
            <div>Fila</div>
            <div>ID</div>
            <div>Producto</div>
        </div>
    `;
    productTable.innerHTML = productTableHeader + productList.map((objProduct,index) => renderProduct(objProduct,index)).join("")
}

function renderPriceQuote(priceQuote,index){
    return `
    <div class="quote-row">
        <div>${index+1}</div>
        <div>${priceQuote.supplier}</div>
        <div>${priceQuote.brand}</div>
        <div>${priceQuote.obs}</div>
        <div>${priceQuote.price}</div>
        <div>${priceQuote.iva}</div>
        <div>${priceQuote.p_final}</div>
        <div>${priceQuote.date}</div>
    </div>
    `
}

function renderPriceQuotes(quoteList){
    const priceQuoteTableHeader = `
        <div class= "header-quote-row">
            <div>Fila</div>
            <div>Proveedor</div>
            <div>Marca</div>
            <div>Obs</div>
            <div>Precio</div>
            <div>IVA</div>
            <div>Final</div>
            <div>Fecha</div>
        </div>
    `;
    productDetailTable.innerHTML = priceQuoteTableHeader + quoteList.map((objQuote,index) => renderPriceQuote(objQuote,index)).join("")
}

function addProduct(event, productList){
    event.preventDefault();
    productList = getItemsFromLocalStorage("products")
    productList = [...productList, //traigo todos los productos de la lista
        { //agrego el nuevo producto
            idProduct: productList.length + 1,
            name: newProductNameInput.value.toString().toUpperCase(),
        }]
    saveItemsInLocalStorage(productList, "products");
    renderProducts(productList);
    newProductNameInput.value = ""; //reseteo el input
}

function deleteCurrentSelection(){
    currentSelectedRow = document.getElementsByClassName("selected-row")
    currentSelectedRow = [...currentSelectedRow]
    if (currentSelectedRow.length) currentSelectedRow[0].classList.remove("selected-row")
}

function selectProduct(event){
    deleteCurrentSelection()
    const tableRow = event.target.parentElement
    const clasesDeTablaProducto = tableRow.classList;
    if (clasesDeTablaProducto.contains("header-row") || !clasesDeTablaProducto.contains("row")){
        selectedProductIdInput.value = "";
        selectedProductNameInput.value = "";
        deleteCurrentSelection();
        return
    }
    clasesDeTablaProducto.add("selected-row")//pinto la row seleccionada
    productList = getItemsFromLocalStorage("products")
    selectedProduct = productList.find(objProduct => objProduct.idProduct == tableRow.dataset.id)
    selectedProductIdInput.value = selectedProduct.idProduct
    selectedProductNameInput.value = selectedProduct.name

    //muestro en la tabla de cotizaciones, todas las relacionadas a este producto
    deleteAllQuotes(); //elimino las cotizaciones actuales
    quoteList = getItemsFromLocalStorage("quotes"); // me traigo la lista
    quoteList = quoteList.filter(objQuote => objQuote.idProduct == selectedProduct.idProduct) //filtro por las seleccionadas
    renderPriceQuotes(quoteList);
}

function deleteAllQuotes(){
    productDetailTable.innerHTML = ""
}

function addQuote(event){
    event.preventDefault();
    quoteList = getItemsFromLocalStorage("quotes");
    quoteList = [...quoteList, //traigo todas las cotizaciones de la lista
        { //agrego la nueva cotización
            idQuote: quoteList.length + 1,
            idProduct: selectedProductIdInput.value,
            supplier: newProductSupplierInput.value.toString().toUpperCase(),
            brand: newProductBrandInput.value.toString().toUpperCase(),
            price: parseFloat(newProductPriceInput.value),
            iva: getIvaValue(newProductIvaInput)*100+"%",
            p_final: parseFloat(newProductPriceInput.value)*(1+getIvaValue(newProductIvaInput)),
            obs: newProductObsInput.value.toString().toUpperCase(),
            date: getCurrentDate(),
        }]

    saveItemsInLocalStorage(quoteList,"quotes");

    quoteList = quoteList.filter(objQuote => objQuote.idProduct == selectedProduct.idProduct)
    renderPriceQuotes(quoteList);
    clearInputs();
}

function clearInputs(){
    newProductIvaInput[0].checked = true;
    newProductPriceInput.value = "";
    newProductBrandInput.value = "";
    newProductObsInput.value = "";
    newProductSupplierInput.value = "";
}

function getIvaValue(inputs){
    const checkedInput = [...inputs].find(input => input.checked);
    return parseFloat(checkedInput.value);
}

function getCurrentDate(){
    date = new Date();
    d = date.getDate();
    m = date.getMonth() +1;
    y = date.getFullYear();
    return `${d.toString().padStart(2,"0")}/${m.toString().padStart(2,"0")}/${y}`
}

const init = () =>{
    const productList = getItemsFromLocalStorage("products");  //obtengo todos los productos del almacenamiento local
    renderProducts(productList);
    const quoteList = getItemsFromLocalStorage("quotes");
    renderPriceQuotes(quoteList);
    newProductForm.addEventListener("submit", addProduct);
    productTable.addEventListener("click", selectProduct);
    newQuoteForm.addEventListener("submit", addQuote);
}

init()