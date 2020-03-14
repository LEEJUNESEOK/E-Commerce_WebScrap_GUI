
const checkForEmpty = (inputs) => {

    let check = false;

    Array.from(inputs).forEach(input => {
        if(input.value.length < 2){
            check = true;
            return;
        }
    });

    return check;
}

const mainContainerChooser = () => {

    let inputs = document.getElementsByClassName("user-input-field");

    if(checkForEmpty(inputs)){
        alert(`You can't leave above fields empty...`);
        return;
    }

    let websiteURL = inputs[0].value;
    
    fetch(`/mainProducts`,{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json;charset=utf-8'
        },
        body : JSON.stringify({
            url : websiteURL,
        })
    }).then((data)=>{
        data.json().then((d)=>{
            document.getElementById("main-container").value = d;
        })
    });

}

const productDetailChooser = () => {

    let inputs = document.getElementsByClassName("main-container-chooser");
    
    if(checkForEmpty(inputs)){
        alert(`You can't leave above fields empty...`);
        return;
    }

}

const saveMetaData = () => {

    let user_inputs = document.getElementsByClassName("user-input-field");
    let input_mainContainer = document.getElementById("main-container");
    let input_individualProduct = document.getElementById("individual-product");
    let input_productImages = document.getElementById("input-product-image");
    let input_productPagination = document.getElementById("input-product-pagination");
    let input_cols = document.getElementById("columns").getElementsByTagName("input");
    
    let inputFieldsToCheck = [...user_inputs,input_mainContainer,
        input_individualProduct,input_productImages,...input_cols]

    if(checkForEmpty(inputFieldsToCheck)){
        alert(`You can't leave above fields empty...`);
        return;
    }

    let dataToSend = {
        productCatalogURL : user_inputs[0].value,
        productSecondPageURL  : user_inputs[1].value,
        productSingleURL  : user_inputs[2].value,
        productBrandName  : user_inputs[3].value,
        productCatalog : input_mainContainer.value,
        productSingleContainer : input_individualProduct.value,
        productImagesContainer : input_productImages.value,
        productPagination : input_productPagination.value,
        cols : {

        }
    }

    
    let temp_cols = [];
    Array.from(input_cols).forEach((i_col)=>{
        let name  = i_col.parentElement.getElementsByClassName("btn-choose")[0].getAttribute("data-val");
        let val = i_col.value;

        temp_cols.push(
            {name,val}
        )

    }); 

    dataToSend.cols = {
        ...temp_cols
    }
    

    fetch(`/saveMetaData`,{
        method  : 'POST',
        headers : {
            'Content-type' : 'application/json;charset=utf-8'
        },
        body : JSON.stringify({
           dataToSend
        })
    }).then((res)=>{
        
        if(res.status == 200){ 
            
            res.json().then((d)=>{

                alert(`Successfully Saved and Loaded Metadata!`);
                document.getElementById("metadata-input").setAttribute("disabled",true);
                document.getElementsByClassName("custom-file-label")[0].innerText = d;
                let btn  = document.getElementById("btn-load-metadata");
                btn.innerText = `Loaded Data`;
                btn.setAttribute("disabled",true);

            });

        }
        else if(res.status == 204){
            
            let custom_path ;
            custom_path = prompt(`We couldn't detect the url of the website\nenter the custom path`);

            fetch(`/saveMetaData?custom_path=${custom_path}`,{
                method : 'POST',
                headers : {
                    'Content-type' : 'application/json;charset=utf-8'
                },
                body : JSON.stringify({
                    dataToSend
                })
            }).then((data)=>{
                if(data.status == 200){

                    alert(`Successfully Saved and Loaded Metadata!`);
                    document.getElementById("metadata-input").setAttribute("disabled",true);
                    document.getElementsByClassName("custom-file-label")[0].innerText = d;
                    let btn  = document.getElementById("btn-load-metadata");
                    btn.innerText = `Loaded Data`;
                    btn.setAttribute("disabled",true);

                }
                else{
                    console.log(`error occured`);
                    alert(`Error occured saving metadata`);
                }
            }).catch((err)=>{
                alert(`Error occured!`);
                console.log(err);
            })           

        }
    }).catch((err)=>{
        alert(`Error occured!`);
        console.log(err);
    })

}

const addColumn = (event) => {
    
    let {keyCode} = event;

    if(keyCode == 13){
        
        let {value} = event.target;
        event.target.value = "";
        event.target.focus();

        // Creating element for the following entered columns

        let row = document.createElement("div");
        row.setAttribute("class","row");

        let sku = `DEM-${Math.floor(Math.random() * 999)}`;

        row.innerHTML = `
            
            <div class="col-6">
                <p>Enter ${value}</p>
            </div>

            <div class="col-6">
                <div class="form-group">
                    <button class="btn btn-sec btn-choose" onClick="productDetailLink(event)" data-sku="${sku}" data-val="${value}">
                        <i class="fas fa-map-marker-alt"></i>
                    </button>
                    <input type="text" class="form-control" />
                    <button class="btn btn-red btn-right btn-delete " onClick="delCol(event)" data-sku="${sku}">
                        <i class="far fa-trash-alt"></i>
                    </button> 
                </div>
            </div>

        

        `;

        let colElem = document.getElementById("columns");
        colElem.appendChild(row);

    }

}

const delCol = (event) => {
    
    let {target} = event;
    let {nodeName} = target;
    let elem;

    if(nodeName == "BUTTON"){
        elem = target;
    }
    else{
        elem = event.currentTarget;
    }

    let colElem = document.getElementById("columns");
    let rowElem = colElem.getElementsByClassName("btn-danger");
    
    for(let i=0 ; i<rowElem.length ; i++ ){
        
        if(rowElem[i].getAttribute("data-sku") == elem.getAttribute("data-sku")){
            //rowElem.removeChild(rowElem.childNodes[i]);
            colElem.removeChild(colElem.childNodes[i]);
        }
    }

//    colElem.removeChild()

}

const individualProduct = () => {
    
    let inputs = document.getElementsByClassName("user-input-field");

    if(checkForEmpty(inputs)){
        alert(`You can't leave above fields empty...`);
        return;
    }

    let websiteURL = inputs[0].value;
    
    fetch(`/individualProduct`,{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json;charset=utf-8'
        },
        body : JSON.stringify({
            url : websiteURL,
        })
    }).then((data)=>{
        
        data.json().then((d)=>{
            document.getElementById("individual-product").value = d;
        });
    });

}

const productDetailLink = (e) => {

    let {target , currentTarget} = e;
    let {nodeName} = target;
    let elem ;

    if(nodeName == "BUTTON"){
        elem = target;
    }
    else{
        elem = currentTarget;
    }


    let inputs = document.getElementsByClassName("user-input-field");
    
    if(checkForEmpty(inputs)){
        alert(`You can't leave above fields empty...`);
        return;
    }

    let websiteURL = inputs[0].value;
    let brandName = inputs[1].value;
    let demoProductURL = inputs[2].value;

    let col_val , sku;

    col_val = elem.getAttribute("data-val");
    sku = elem.getAttribute("data-sku");


    fetch(`/productDetail`,{
        method : 'POST',
        headers : {
            'Content-type' : 'application/json;charset=utf-8'
        },
        body : JSON.stringify({
            col : col_val,
            url : demoProductURL,
        })
    }).then((data)=>{
        data.json().then((d)=>{
           
            let elem = document.getElementById("columns").getElementsByClassName("btn-choose");
            
            Array.from(elem).forEach((e)=>{
                if(e.getAttribute("data-sku") == sku ){
                    e.parentElement.getElementsByTagName("input")[0].value = d;
                }
            });
            

        })
    })


}

let products_scraped = [];
let urlsToScrap = ["http://designer-discreet.ru/product/bottega-vaenta-clutch/"];
let currentImagesToDownload = undefined;

const scrapProducts = () => {

    let status = document.getElementById("scraping-status");
    let metadata_loaded = document.getElementById("metadata-input").hasAttribute("disabled");
    console.log('called again');
    if(metadata_loaded != true){
        alert(`Please Load the metadata first, then scrap the products`);
        return;
    }

    /*********************************************************************
        Checking whether the start and end page are populated or not
        if yes then go on otherwise alert the user that they are empty
    **********************************************************************/

    let s_page = document.getElementById("start-page").value;
    let e_page = document.getElementById("end-page").value;

    if(s_page.length == 0 || e_page.length == 0){
        alert(`Please enter the start and end page you want to scrap`);
        return;
    }

    let button = document.getElementById("scrap-products-btn");

    /***********************************************************************
        Checking that either the button has following attributes or not
        if it have all the attributes the it means that we have to scrape
        the given pages if it misses any one attributes then first of all 
        we have to find the pages-count
    ************************************************************************/
/*

    if(button.hasAttribute("data-page") == false || button.hasAttribute("data-start") == false ||
        button.hasAttribute("data-end") == false || button.hasAttribute("data-count") == false ||
        button.hasAttribute("data-action") == false){

        console.log(`finding pages count`);
        status.innerText = `Finding Pages Count`;
        fetch(`/findPagesCount`).then((res)=>{
            
            if(res.status == 200){
                console.log(res);
                res.json().then((d)=>{
                    console.log(`Total Pages are : ${d.val}`);
                    status.innerText = `Total Pages are : ${d.val}`;
                    button.setAttribute("data-page",s_page);
                    button.setAttribute("data-start",s_page);
                    button.setAttribute("data-end",e_page);
                    button.setAttribute("data-count",d.val);
                    scrapProducts();

                });
            }
            
            
        }).catch((err)=>{
            status.innerText = `Error occured, finding pages count. Please check console or try again`;
            console.log(err);
        });


    }
*/
    let page = parseInt(button.getAttribute("data-page"));
    let startPage = parseInt(button.getAttribute("data-start"));
    let endPage = parseInt(button.getAttribute("data-end"));
    let count = parseInt(button.getAttribute("data-count"));
    let action = button.getAttribute("data-action");

    if(action == "scrapURLs"){

        if(page >= startPage && page <= endPage && page <= count){
        
            console.log(`sending request for page : ${page}`);
            status.innerText = `scraping page(${page}) of ${endPage}`;
    
            fetch(`/scrapURLs?page=${page}`,
            {
                method : 'POST',
                
            }).then((res)=>{
                console.log(res);
                if(res.status == 200){
                    res.json().then((data)=>{
                        console.log(`successfully scraped ${data.length} URLS from page : ${page} `);
                        status.innerText = `successfully scraped ${data.length} URLS from page : (${page}) \nTiming Out for 10secs`;
                        console.log(`timing out for 10sec`);
                        //products_scraped.push(...data);
                        urlsToScrap.push(...data);
                        setTimeout(()=>{
                            button.setAttribute("data-action","scrapProduct");
                            button.setAttribute("data-product-scraped","0");
                            scrapProducts();
                        },10000);
        
                    });
                }
                else if(res.status == 500){
                    status.innerText = `Error occured while finding pages count, Please check server console or try again`;
                }
                
            }).catch((err)=>{
                console.log(`error : ${err}`);
            })
    
        }

    }
    else if(action == "scrapProduct"){
        
        console.log(`Scraping Product Details`);

        let productSeq = parseInt(button.getAttribute("data-product-scraped"));
        
        if(urlsToScrap.length >= 1 && productSeq <= urlsToScrap.length-1 ){
            
            console.log(`==> product being scraped : ${urlsToScrap[productSeq]}`);

            fetch(`/scrapProductDetails`,{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json;charset=utf-8'
                },
                body : JSON.stringify({link : urlsToScrap[productSeq]})
            }).then((res)=>{
                
                console.log(`product successfully scraped`);
                res.json().then((data)=>{
                    products_scraped.push([...data]);
                    console.log(`timing out for 10secs, iimage scraping will start automatically`);
                    setTimeout(()=>{
                        button.setAttribute("data-action","scrapImages");
                        scrapProducts();
                    },10000);             
                });

            }).catch((err)=>{
                
            });

        }

    }
    else if(action == "scrapImages"){
        
        console.log(`scraping product images`);
        let productSeq = parseInt(button.getAttribute("data-product-scraped"));
        
        if(urlsToScrap.length >= 1 && productSeq <= urlsToScrap.length-1 ){
            fetch(`/scrapImages`,{
                method  : 'POST',
                headers : {
                    'Content-type' : 'application/json;charset=utf-8' 
                },
                body : JSON.stringify({link : urlsToScrap[productSeq] })
            }).then((res)=>{
                
                res.json().then((imageRes)=>{
                    console.log(`successfully scraped product images, it will be downloaded automatically after 10secs`);
                    currentImagesToDownload = [...imageRes]
                    setTimeout(()=>{
                        button.setAttribute("data-action","downloadImages");
                        scrapProducts();
                    },10000)

                });
                
            }).catch((err)=>{
    
            })
        }
        

    }
    else if(action == "downloadImages"){
        
        if(currentImagesToDownload != undefined){
            
            console.log(`sending request for downloading images....`);

            fetch(`/downloadImages`,{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json;charset=utf-8'
                },
                body : JSON.stringify({links : currentImagesToDownload ,})
            }).then((res)=>{
                console.log(`Images Downloaded Successfully`);

                setTimeout(()=>{

                },10000)
            }).catch((err)=>{
                
            })


        }
        
        

    }
    

    

}

const handleScrapRequest = (e) => {

    let elem = e.target;
    let start = document.getElementById("start-page");
    let end = document.getElementById("end-page");
    
    start = start.value;
    end = end.value;

    if(elem.getAttribute("data-first")){

        elem.removeAttribute("data-first");
        elem.setAttribute("data-start",start)
        elem.setAttribute("data-end",end);
        elem.setAttribute("data-page",start);
        scrapProducts();
    }
    else if(!elem.getAttribute("data-first")){
        scrapProducts();
    }
    


}

const loadMetaData = () => {
    
    let path = document.getElementById("metadata-input").value;
    
    fetch('/loadMetaData',{
        method : 'POST',
        headers : {
            'Content-type' : 'application/json;charset=utf-8'
        },
        body : JSON.stringify({
            path
        })
    }).then((res)=>{
        if(res.status == 200){
            let btn = document.getElementById("metadata-btn");
            btn.setAttribute("disabled",true);
            btn.innerText = "Loaded Metadata";
        }
    }).catch((err)=>{
        alert(`Error occured while loading metadata`);
        console.log(err);
    })

}

let data = [
   ["Bottega Vaenta Butter","$389.00","Categories Bags Bottega Veneta",`Description Product code #191213-20 100% Genuine Leather Matching Quality of Original Louis Vuitton Production (imported from Europe) Comes with dust bag, authentication cards, box, shopping bag and pamphlets. Receipts are only included upon request. Counter Quality Replica (True Mirror Image Replica) Dimensions: 31.5x37x10 Our Guarantee: The handbag you receive will look exactly as pictured on our professionally shot photos on our website (of our own stock) in terms of quality and description! Order from Designer Discreet and experience the difference today! Receive 15% off when you pay through Moneygram, Western Union, or wire transfer.`]
]


const viewScrapedProducts = () => {
    
    let tableHeadData = document.getElementById("columns").getElementsByTagName("p");

    //for Column Names

    let headers = [];

    let temp_head_string = `<tr>`;
    Array.from(tableHeadData).forEach((hd)=>{
        temp_head_string += `<th>${hd.innerText}</th>`
    });

    temp_head_string += `</tr>`;

    // Body Content

    let bodyContent = [];

    for(let i=0 ; i<data.length ; i++){
        let temp_row = `<tr>`;
        for(let j=0 ; j<data[i].length ; j++){
            temp_row += `<td>${data[i][j]}</td>`
        }
        temp_row += `</tr>`
        bodyContent.push(temp_row);
    }

    let temp_body_string = ``;

    Array.from(bodyContent).forEach((bd)=>{
        temp_body_string += bd;
    })


    let temp_html = `<table class="table table-striped table-bordered" style="text-align:center">
        <thead>
            ${temp_head_string}
        </thead>
        <tbody>
            ${temp_body_string}
        </tbody>
    </table>`


    document.getElementById("product-data").innerHTML = temp_html;


}

const fillModal = (imagePaths) => {

    let modal_body = document.getElementById("modal-product-images");
    modal_body.innerHTML = "";
    let temp_images_html = ``;
    
    for(let i=0 ; i<imagePaths.length ; i++){
    
        let temp_html = `
            <div class="col-3 modal-img-main-con" onclick="productImageSelect(event)" oncontextmenu="featuredImageSelect(event)" data-clicked="no" >
                <div class="col-img" style="background-image:url('${imagePaths[i]}')"></div>
            </div>
        `;
    
        temp_images_html += temp_html;
    
    }
    
    modal_body.innerHTML = temp_images_html;
    
}


fillModal(["https://officialchansneakers.com/image/cache/catalog/d_social_login/48-570x570.jpeg",
"https://officialchansneakers.com/image/cache/catalog/d_social_login/44-570x570.jpeg",
"https://officialchansneakers.com/image/cache/catalog/Adidas/16-570x570.JPG",
"https://officialchansneakers.com/image/cache/catalog/d_social_login/27-570x570.jpeg"])

const productImageSelect = (e) => {
    
    let elem = e.currentTarget;
    let clicked = elem.getAttribute("data-clicked");
    
    if(clicked == "yes"){

        elem.setAttribute("data-clicked","no");
        console.log(elem.children);
        
        for(let i=0 ; i<elem.children.length ; i++){
            
            if(elem.children[i].getAttribute("class") == "checked"){
                elem.removeChild(elem.children[i]);
            }
        }


    }
    else if(clicked == "no"){
        
        elem.setAttribute("data-clicked","yes");
        let html_text = `<div class="checked"><i class="fas fa-check"></i></div>`;
        elem.innerHTML += html_text;

    }


}

let hasFeaturedImage = false;

const featuredImageSelect = (e) => {
    
    e.preventDefault();

    let elem = e.currentTarget;
    let atr_check = elem.hasAttribute("data-featured");

    //for showing featured image
    if(atr_check == false && hasFeaturedImage == false){

        elem.setAttribute("data-featured",true);
        let temp_html = `<div class="featured"><i class="fas fa-bahai fa-lg"></i></div>`;
        elem.innerHTML += temp_html;
        hasFeaturedImage = true;

    } //for hiding the featured image
    else if(atr_check == true && hasFeaturedImage == true){
        
        elem.removeAttribute("data-featured");
        hasFeaturedImage = false;
        
        for(let i=0 ; i<elem.children.length ; i++ ){
            if(elem.children[i].getAttribute("class") == "featured"){
                elem.removeChild(elem.children[i]);
            }
        }


    }
    

}


const productImages = () => {
    
    let product_link = document.getElementsByClassName("user-input-field")[2].value;

    if(product_link.length < 2){
        alert("Please enter the individual product link to continue...");
        return;
    }

    fetch(`/productImages`,{
        method : 'POST',
        headers : {
            'Content-type' : 'application/json;charset=utf-8'
        },
        body : JSON.stringify({
            url : product_link
        })
    }).then((res)=>{
        
        res.json().then((data)=>{
            document.getElementById("input-product-image").value = data;
        })
    }).catch((err)=>{
        console.log(`error occured while getting product featured image..`);
    })


    
}


const applyAction = () => {
    
    //finding which action the user selects

    let user_action = document.getElementById("action-select").selectedIndex;

    let user_inputted_data = document.getElementById("user-input-field").value;
    let col_to_edit = document.getElementById("col-select").selectedIndex;

    let table_container = document.getElementById("product-data");
    let data_rows = table_container.getElementsByTagName("tbody")[0].getElementsByTagName("tr");


    for(let i=0 ; i<data_rows.length ; i++){

        let data_cols = data_rows[i].getElementsByTagName("td");
        let {innerText} = data_cols[col_to_edit];

        if(user_action == 0){
            data_cols[col_to_edit].innerText = `${innerText} ${user_inputted_data}`;
        }
        else if(user_action == 1){
            data_cols[col_to_edit].innerText = `${user_inputted_data} ${innerText}`;
        }
        else if(user_action == 2){

            let regEx = new RegExp(user_inputted_data,'gi');

            if(innerText.match(regEx)){
                
                let replace_text = prompt(`Enter new text you want to replace with\nEnter [null] to just remove the text or click CANCEL`);
                
                if(replace_text == "null" || replace_text == null){
                    data_cols[col_to_edit].innerText = innerText.replace(regEx,"");
                }
                else{
                    data_cols[col_to_edit].innerText = innerText.replace(regEx,replace_text);
                }
                
            }
            

        }
        else if(user_action == 3){
            
            let existing_symbol = prompt(`For an ideal mathematical calculation make sure that the field doesn't have any symbol or any other characters\nTo neglect symbol please enter the symbol so that we can neglect that\nEnter cancel if it doesn't have any symbol`);

            if(existing_symbol != null || existing_symbol != "null"){
                
                let d_op = ``;

                Array.from(innerText).forEach((it)=>{
                   if(it != existing_symbol){
                       d_op += it;
                   }
               })
              
                let ind = user_inputted_data.indexOf("_");
               
                if(ind == 0){
                    let new_exp = user_inputted_data.substr(1,user_inputted_data.length - 1);
                    let ans = eval(`${d_op} ${new_exp}`);
                    data_cols[col_to_edit].innerText = `${existing_symbol}${ans}`;
                }
                else if(ind == user_inputted_data.length - 1){
                    let new_exp = user_inputted_data.substr(0,user_inputted_data.length - 1);
                    let ans = eval(`${new_exp} ${d_op}`);
                    data_cols[col_to_edit].innerText = `${existing_symbol}${ans}`;
                }


            
            }
            
        }

    }


}

const something = () => {
    
    let s_page = document.getElementById("second-page").value;
    let url = {};

    if(s_page.match(/\?/gi)){
        
        url.type = "query";

        if(s_page.match(/page=[0-9]{1,5}/gi)){
            
            url.symbol = "page";
        }
        else if(s_page.match(/p=[0-9]{1,5}/gi)){
            
            url.symbol = "p";            
        }

    }
    else if(s_page.match(/\/page\//gi)){
        
        url = {
            type : "id",
            symbol : "page"
        }
    }
    else if(s_page.match(/\/p\//gi)){
        
        url = {
            type : "id",
            symbol : "p"
        }
    }
    else{
        alert(`We're unable to analyse the route path of the website...`);
        let custom_path  = prompt(`Please enter the custom path `);
        url = {
            type : "custom",
            symbol : custom_path
        }
    }
    
    console.log(url);

}

const readData = (that) => {
    
    let {value} = that;
    let index = value.lastIndexOf(`\\`) +1;
    let val = value.substring(index,value.length);


    let reader = new FileReader();

    reader.onload = (e) => {

        fetch(`/loadMetaData`,{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json;charset=utf-8'
            },
            body : JSON.stringify({
                data : e.target.result
            })
        }).then((res)=>{

            if(res.status === 200){

                alert(`Successfully Loaded MetaData`);
                document.getElementsByClassName("custom-file-label")[0].innerText = val;
                document.getElementById("metadata-input").setAttribute("disabled",true);
                let btn = document.getElementById("btn-load-metadata");
                btn.setAttribute("disabled",true);
                btn.innerText = `Loaded Data`;

            }
            else{
                alert(`ERROR OCCURED!`);
            }

        }).catch((err)=>{
            console.log(`error occured`);
            console.log(err);
            alert(`ERROR OCCURED`);
        })

    }
    
    reader.readAsText(that.files[0]);


}


const paginationContainer = () => {

    let catalogURL = document.getElementsByClassName("user-input-field")[0].value;

    fetch(`/catalogPagination`,{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json;charset=utf-8'
        },
        body : JSON.stringify({
            url : catalogURL
        })
    }).then((res)=>{
        res.json().then((data)=>{
            document.getElementById("input-product-pagination").value = data;
        });
    }).catch((err)=>{
        alert(`Error Occured!`);
        console.log(err);
    })




}