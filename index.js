

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
        <div class="delete-product">🧹</div>
    </div>
    `
}

function renderProducts(productList){
    const productTableHeader = `
        <div class= "header-row">
            <div>Fila</div>
            <div>ID</div>
            <div>Producto</div>
            <div></div>
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
        <div class="delete-quote" data-q=${priceQuote.idQuote} data-p=${priceQuote.idProduct}>🧹</div>
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
            <div></div>
        </div>
    `;
    productDetailTable.innerHTML = priceQuoteTableHeader + quoteList.map((objQuote,index) => renderPriceQuote(objQuote,index)).join("")
}

function verifyIfProductAlreadyExist(product, productList){
    return productList.some(objProduct => objProduct.name.toString()===product)
}

function addProduct(event){
    event.preventDefault();
    if(!isValidProductForm()) return
    const productName = newProductNameInput.value.toString().toUpperCase()
    let productList = getItemsFromLocalStorage("products")
    if(verifyIfProductAlreadyExist(productName, productList)){
        showError(newProductNameInput, "* El producto ya existe")
        return
    } 
    let maxId = Math.max(...productList.map(objProduct => objProduct.idProduct))
    productList = [...productList, //traigo todos los productos de la lista
        { //agrego el nuevo producto
            idProduct: maxId==-Infinity ? 1: maxId+1,
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
    const tableField = event.target
    if (tableField.classList.contains("delete-product")) deleteProduct(tableField)
    const tableRow = event.target.parentElement
    const rowClassTableProduct = tableRow.classList;
    if (rowClassTableProduct.contains("header-row") || !rowClassTableProduct.contains("row")){
        selectedProductIdInput.value = "";
        selectedProductNameInput.value = "";
        deleteCurrentSelection();
        return
    }
    rowClassTableProduct.add("selected-row")//pinto la row seleccionada
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
    if(!isValidQuoteForm()) return
    quoteList = getItemsFromLocalStorage("quotes");
    let maxIdQuote = Math.max(...quoteList.map(objQuote => objQuote.idQuote))
    quoteList = [...quoteList, //traigo todas las cotizaciones de la lista
        { //agrego la nueva cotización
            idQuote: maxIdQuote==-Infinity ? 1: maxIdQuote+1,
            idProduct: parseInt(selectedProductIdInput.value),
            supplier: newProductSupplierInput.value.toString().toUpperCase(),
            brand: newProductBrandInput.value.toString().toUpperCase(),
            price: Math.round(parseFloat(newProductPriceInput.value)*100)/100,
            iva: getIvaValue(newProductIvaInput)*100+"%",
            p_final: Math.round(parseFloat(newProductPriceInput.value)*(1+getIvaValue(newProductIvaInput))*100)/100,
            obs: newProductObsInput.value.toString().toUpperCase(),
            date: getCurrentDate(),
        }]

    saveItemsInLocalStorage(quoteList,"quotes");

    quoteList = quoteList.filter(objQuote => objQuote.idProduct == selectedProductIdInput.value)
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

function deleteAllProducts(){
    productTable.innerHTML = ""
}

function searchProductByKeyword(keyword){
    //deleteAllProducts(); //reseteo la tabla para arrojar los nuevos resultados
    const productList = getItemsFromLocalStorage("products")
    const resulltOfSearch = productList.filter(objProduct => objProduct.name.toString().includes(keyword.toString().toUpperCase()))
    renderProducts(resulltOfSearch);
}

function deleteProduct(tableField){
    const productList = getItemsFromLocalStorage("products");
    const quoteList = getItemsFromLocalStorage("quotes");
    let newProductList = productList.filter(objProduct => objProduct.idProduct != tableField.parentElement.dataset.id) //no solo borro los productos sino tambien las cotizaciones
    let newQuoteList = quoteList.filter(objQuote => objQuote.idProduct != tableField.parentElement.dataset.id)
    saveItemsInLocalStorage(newProductList,"products");
    saveItemsInLocalStorage(newQuoteList, "quotes");
    deleteAllQuotes();
    deleteAllProducts();
    renderProducts(newProductList);
    
}

function selectQuote(event){
    if (event.target.classList.contains("delete-quote")) deleteQuote(event)
}

function deleteQuote(event){
    const quoteList = getItemsFromLocalStorage("quotes");
    let newQuoteList = quoteList.filter(objQuote => {
        console.log("producto "+objQuote.idProduct + "coti " + objQuote.idQuote )
        console.log(objQuote.idProduct != event.target.dataset.p && objQuote.idQuote != event.target.dataset.q)
        console.log(objQuote.idProduct != event.target.dataset.p);
        console.log(event.target.dataset.q)
        return objQuote.idProduct != event.target.dataset.p && objQuote.idQuote != event.target.dataset.q;
    })
    saveItemsInLocalStorage(newQuoteList, "quotes");
}

const init = () =>{
    const productList = getItemsFromLocalStorage("products");  //obtengo todos los productos del almacenamiento local
    renderProducts(productList);
    // const quoteList = getItemsFromLocalStorage("quotes");  //al principio no muestro la lista porque no hay nada seleccionado
    // renderPriceQuotes(quoteList);
    newProductForm.addEventListener("submit", addProduct);
    productTable.addEventListener("click", selectProduct );
    productDetailTable.addEventListener("click", selectQuote)
    newQuoteForm.addEventListener("submit", addQuote);
    searchProductInput.addEventListener("input", function(){searchProductByKeyword(searchProductInput.value)})
    //funciones de eliminación
}

init()