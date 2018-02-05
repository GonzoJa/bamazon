var prompt = require('prompt');
var mysql = require('mysql');
var fs = require("fs");
var inquirer = ("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});



var bamazonWelcome = "";

var customerOrder = {
    id: "",
    item:"",
    quantity:"",
    total:"",
}



connection.connect(function(err){
        if (err){
            console.error('There was as error connecting: ' + err.stack);
            return;
        }
        console.log(' WELCOME TO BAMAZON ');
    }
);

updateStock();

function updateStock(){
    connection.query(
        'SELECT * FROM products',
        
        function(err, res){
            if (err) throw err;
        
            products = [];

            products = res;

            bamazonWelcome = 'choose a product from the catalog: \n';

            for (var i = 0, l = products.length; i < l; i++) {
                bamazonWelcome +=
                '(' + (products[i].item_id) + ')/'+ products[i].product_name + ' - ' + '$' + products[i].product_price.toFixed(2) + '\n';

            };

            prompt.start();

            promptOrder();
        
        });
};

function promptOrder(){
    var getItemQty = [
        {
            name: 'item',
            description: bamazonWelcome,
            require: true,
            message: 'Please choose from 1 ' + 'to' + products.length + '. \n',
            confirm: function(value){
                value = parseInt(value);
                return value > 0 && value <= products.length
            }
        },
        {
            name: 'qty',
            description: "Enter quanity",
            require: true,
        }
    ];
    prompt.get(getItemQty, function(err,result){

        customerOrder.id = result.item;
        customerOrder.item = products[customerOrder.id - 1].product_name;
        customerOrder.qty = result.qty;

        console.log('Your order: ' + '(' + customerOrder.id + ') / ' + customerOrder.item + ', ' + customerOrder.qty);
    });
};

function promptConfirm() {
    var confirmItemQty = [
      {
        name: 'confirm',
        message: 'Confirm quantity Y/N',
        required: true,
        warning: 'Y or N only!',
        validator: /^(?:y|Y|n|N)$/,
      }
    ];
    prompt.get(confirmItemQty, function(err,result){
      result.confirm = result.confirm.toUpperCase();
   
      if (result.confirm == "Y") {
   
        if (customerOrder.qty > products[customerOrder.id - 1].qty) {
   
          console.log('Sorry, insufficient quantity. \n');
          promptOrder();
   
        } else {
          customerOrder.total = customerOrder.qty * products[customerOrder.id - 1].product_price;
          console.log('Order total: $' + customerOrder.total.toFixed(2));
          confirmOrder();
        }
        
      }
      else if (result.confirm == "N") {
        console.log('Order cancelled. \n');
        promptOrder();
      }
    });
   };
   
   // Prompt customer to confirm purchase
   function confirmOrder() {
    var promptConfirm = [
      {
        name: 'confirm',
        message: 'Confirm purchase Y/N',
        required: true,
        warning: 'Y or N only!',
        validator: /^(?:y|Y|n|N)$/,
      }
    ];
    prompt.get(promptConfirm, function(err,result){
      result.confirm = result.confirm.toUpperCase();
      if (result.confirm == "Y") {
        makeOrder();
      } else if (result.confirm == "N") {
        console.log('Order cancelled. Thanks for visiting! \n');
        
        promptOrder();
      }
    });
   };
   
   // Update database
   function makeOrder() {
   
    // Deduct order quantity
    var remainingQty = products[customerOrder.id - 1].qty - customerOrder.qty;
    
    // Update in database
    connection.myConnection.query(
   
      'UPDATE products SET qty = ' + remainingQty + ' WHERE item_id = ' + customerOrder.id, 
   
      function(err, res){
        if (err) throw err;
   
        console.log('Thanks for your order! \n');
   
        updateStock();
   
    });
   };

