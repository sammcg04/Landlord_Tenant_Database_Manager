//Set up express
const express = require("express");
const cors = require('cors');
var app = express();
var bodyParser = require('body-parser')
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:4000', // Allow requests from this origin
    methods: ['GET', 'POST','DELETE','PATCH'], // Allow only specified HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow only specified headers
  }));


//Set up mongoose
const mongoose = require("mongoose");
const uri = "mongodb+srv://sammcg04:Sammcgrath2004%3F%3F@cs230.5qrtbgb.mongodb.net/renting?retryWrites=true&w=majority&appName=CS230";
//Import Schemas
const tenants = require("./Models/tenant");
const landlords = require("./Models/landlord");
const contracts = require("./Models/contract");
const addresses = require("./Models/address");

mongoose.connect(uri);
const connection = mongoose.connection;
connection.once("open", function(){
    console.log("Connected to Renting Database");
})

//// Tenant routes:

/*{
  "title": "Mr",
  "firstName": "Jack",
  "lastName": "Smith",
  "phoneNumber": "777-777-7777",
  "emailAddress": "jack.smith@example.com",
  "homeAddress": "663fc46529608a5c9bb34494"
}
*/
app.post('/tenant', async (req, res) => {
    try {
      const { title, firstName, lastName, phoneNumber, emailAddress, homeAddress } = req.body;
  
      let processedTitle;
      if (title[1] && title[1].trim() !== '') {
        processedTitle = title[1]; // Use the custom title
      } else {
        processedTitle = title[0]; // Use the selected title option
      }
      // Create the new tenant
      const newTenant = await tenants.create({
        title: processedTitle,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        emailAddress: emailAddress,
        homeAddress: homeAddress,
      });
  
      console.log('New tenant created successfully:', newTenant);
      res.status(200).send('Tenant added successfully');
    } catch (error) {
      console.error('Failed to create tenant due to error:', error.message);
      res.status(500).send('Failed to create tenant due to error: ' + error.message);
    }
  });
 /*{
  "firstName": "Jack",
  "lastName": "Smith"
}
*/ 
  app.get('/tenant', async (req, res) => {
    try {
        const { firstName, lastName } = req.query; // Retrieve query parameters

        // Find the tenant by first and last name
        const tenant = await tenants.findOne({ firstName: firstName, lastName: lastName });
        if (!tenant) {
            return res.status(404).send('Tenant not found');
        }

        // Find the address associated with the tenant's homeAddress
        const address = await addresses.findById(tenant.homeAddress);
        if (!address) {
            return res.status(404).send('Address not found');
        }

        // Combine tenant and address details
        const tenantWithAddress = {
            tenant: tenant,
            address: address
        };

        // Send the combined details as response
        res.status(200).json(tenantWithAddress);
    } catch (error) {
        console.error('Failed to fetch tenant and address:', error.message);
        res.status(500).send('Failed to fetch tenant and address');
    }
});
/*
{
    "tenantFind":{
    "firstName": "Jack",
    "lastName": "Smith"
    },
    "tenantUpdate": {
    "title": "Ms",
    "firstName": "Emma"
    }
}*/
app.patch("/tenant", async function (req, res) {
    try {
        const { firstName, lastName } = req.body.tenantFind;

        // Validate first and last name format
        if (!isValidName(firstName) || !isValidName(lastName)) {
            return res.status(400).send("Invalid first or last name format");
        }

        const { tenantFind, tenantUpdate } = req.body;
        const updatedTenant = await tenants.findOneAndUpdate(tenantFind, tenantUpdate);
        console.log("Tenant updated successfully:", updatedTenant);
        res.status(200).send("Tenant updated successfully");
    } catch (e) {
        console.log("Failed to update tenant due to error: " + e.message);
        res.status(500).send("Failed to update tenant due to error: " + e.message);
    }
});
/*
{
    "firstName": "Jack",
    "lastName": "Smith"
    }*/
app.delete("/tenant", async function (req, res) {
    try {
        const { firstName, lastName } = req.query;

        // Find the tenant by first and last name
        const deletedTenant = await tenants.findOneAndDelete({ firstName: firstName, lastName: lastName });
        if (!deletedTenant) {
            return res.status(404).send('Tenant not found');
        }

        console.log("Tenant deleted successfully:", deletedTenant);
        res.status(200).send("Tenant deleted successfully");
    } catch (e) {
        console.log("Failed to delete tenant due to error: " + e.message);
        res.status(500).send("Failed to delete tenant due to error: " + e.message);
    }
});




// Landlord routes:
/*{
    "title": "Mrs",
    "firstName": "Eleanor",
    "lastName": "Parker",
    "phoneNumber": "888-888-8888",
    "emailAddress": "eleanor.parker@example.com",
    "homeAddress": "663fc45529608a5c9bb3448e",
    "dateOfBirth": "1980-03-15",
    "councilPermission": true,
    "contactPermission": false
  }*/
app.post("/landlord", async function (req, res) {
    try {
        console.log("Request Body:", req.body); // Log the entire request body

        // Access the parsed request body
        const { title, firstName, lastName, phoneNumber, emailAddress, homeAddressId, dateOfBirth, councilPermission, contactPermission } = req.body;

        // Process the title field to ensure it's a single string value
        let processedTitle;
        if (title[1] && title[1].trim() !== '') {
            processedTitle = title[1]; // Use the custom title
        } else {
            processedTitle = title[0]; // Use the selected title option
        }

        // Create the new landlord
        const newLandlord = await landlords.create({
            title: processedTitle, // Use the processed title value
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            emailAddress: emailAddress,
            homeAddress: homeAddressId,
            dateOfBirth: dateOfBirth,
            councilPermission: councilPermission,
            contactPermission: contactPermission
        });

        console.log("New landlord created successfully:", newLandlord);
        res.status(200).send("Landlord added successfully");
    } catch (e) {
        console.log("Failed to create landlord due to error:", e.message);
        res.status(500).send("Failed to create landlord due to error: " + e.message);
    }
});
/*{
    "firstName": "Eleanor",
    "lastName": "Parker"
  }*/
app.get("/landlord", async function (req, res) {
    try {
        const { firstName, lastName } = req.query; // Retrieve query parameters

        // Find the landlord by first and last name
        const landlord = await landlords.findOne({ firstName: firstName, lastName: lastName });
        if (!landlord) {
            return res.status(404).send('Landlord not found');
        }

        // Find the address associated with the landlord's homeAddress
        const address = await addresses.findById(landlord.homeAddress);
        if (!address) {
            return res.status(404).send('Address not found');
        }

        // Combine landlord and address details
        const landlordWithAddress = {
            landlord: landlord,
            address: address
        };

        // Send the combined details as response
        res.status(200).json(landlordWithAddress);
    } catch (error) {
        console.error('Failed to fetch landlord and address:', error.message);
        res.status(500).send('Failed to fetch landlord and address');
    }
});
/*
{
    "landlordFind":{
    "firstName": "Eleanor",
    "lastName": "Parker"
    },
    "landlordUpdate": {
    "title": "Ms",
    "firstName": "Emma"
    }
}*/
app.patch("/landlord", async function (req, res) {
    try {
        const { firstName, lastName } = req.body.landlordFind;

        // Validate first and last name format
        if (!isValidName(firstName) || !isValidName(lastName)) {
            return res.status(400).send("Invalid first or last name format");
        }

        const { landlordFind, landlordUpdate } = req.body;
        const updatedLandlord = await Landlord.findOneAndUpdate(landlordFind, landlordUpdate);
        console.log("Landlord updated successfully:", updatedLandlord);
        res.status(200).send("Landlord updated successfully");
    } catch (e) {
        console.log("Failed to update landlord due to error: " + e.message);
        res.status(500).send("Failed to update landlord due to error: " + e.message);
    }
});
/*
{
    "firstName": "Eleanor",
    "lastName": "Parker"
    }*/
app.delete("/landlord", async function (req, res) {
    try {
        const { firstName, lastName } = req.body;

        // Validate first and last name format
        if (!isValidName(firstName) || !isValidName(lastName)) {
            return res.status(400).send("Invalid first or last name format");
        }

        const deletedLandlord = await Landlord.findOneAndDelete({ firstName: firstName, lastName: lastName });
        if (!deletedLandlord) {
            return res.status(404).send("Landlord not found");
        }

        console.log("Landlord deleted successfully:", deletedLandlord);
        res.status(200).send("Landlord deleted successfully");
    } catch (e) {
        console.log("Failed to delete landlord due to error: " + e.message);
        res.status(500).send("Failed to delete landlord due to error: " + e.message);
    }
});





// Contract routes:
/*{
  "contractDate": new Date(),
  "propertyAddress": "663fc45529608a5c9bb3448e",
  "tenants": ["ID From Example Tenant"],
  "landlord": "ID From Example Landlord",
  "feeMonthly": 1500,
  "propertyDoorNumber": "Apt 101",
  "contractLength": "1 year",
  "propertyType": "Apartment"
}*/
app.post("/contract", async function (req, res) {
    try {
        const { contractDate, propertyAddress, tenants, landlord, feeMonthly, propertyDoorNumber, contractLength, propertyType } = req.body;

        // Check if the number of tenants is less than 4
        if (tenants.length > 4) {
            return res.status(400).send("Cannot create a contract with more than 4 tenants");
        }

        // Assuming propertyAddress is an object with required fields
        const newContract = await contracts.create({
            contractDate: contractDate,
            propertyAddress: propertyAddress,
            tenants: tenants,
            landlord: landlord,
            feeMonthly: feeMonthly,
            propertyDoorNumber: propertyDoorNumber,
            contractLength: contractLength,
            propertyType: propertyType
        });

        console.log("New contract added to Database:", newContract);
        res.status(201).send("Contract added successfully");
    } catch (e) {
        console.log("Failed to create contract due to error: " + e.message);
        res.status(500).send("Failed to create contract due to error: " + e.message);
    }
});
/*{
  "landlord": "ID From Example Landlord"
}*/
app.get("/contract", async function (req, res) {
    try {
        const { tenants, landlord } = req.body;

        // Constructing the query object based on the provided parameters
        if (landlord) {
            query.landlord = landlord; // Searching for contracts with the provided landlord
        }

        // Finding contracts based on the constructed query
        const foundContracts = await Contract.find(query);

        console.log("Contracts Retrieved:");
        console.log(foundContracts);

        res.json(foundContracts);
    } catch (e) {
        console.log("Failed to retrieve contracts due to error: " + e.message);
        res.status(500).send("Failed to retrieve contracts due to error: " + e.message);
    }
});
/*{
    contractFind:{"landlord": "ID From Example Landlord"},
    contractUpdate:{
        "feeMonthly": 1200,
        "contractLength": "2 year",
    }
}*/
app.patch("/contract", async function (req, res) {
    try {
        const { contractFind, contractUpdate } = req.body;
        const updatedContract = await Contract.findOneAndUpdate(contractFind, contractUpdate);
        console.log("Contract updated successfully:", updatedContract);
        res.status(200).send("Contract updated successfully");
    } catch (e) {
        console.log("Failed to update contract due to error: " + e.message);
        res.status(500).send("Failed to update contract due to error: " + e.message);
    }
});
/*{
  "landlord": "ID From Example Landlord"
}*/
app.delete("/contract", async function (req, res) {
    try {
        const deletedContracts = await Contract.deleteMany(req.body);
        console.log(deletedContracts);
        res.status(200).send("Contracts deleted successfully");
    } catch (e) {
        console.log("Failed to delete contracts due to error: " + e.message);
        res.status(500).send("Failed to delete contracts due to error: " + e.message);
    }
});



//Adress Routes: These were just to populate
app.post("/address", async function(req, res){
    try{
        const newAddress = await addresses.create(req.body);
        res.status(201).send("address added successfully");
        console.log("New address added to Database:");
        console.log(newAddress);
    } catch(e) {
        res.send("Failed to create adddress due to error: " + e.message);
        console.log("Failed to create address due to error: " + e.message);
    }
});

app.get("/address", async function(req, res){
    try{
        const addressRetrieved = await addresses.find(req.body);
        console.log("Class Retrieved:");
        console.log(addressRetrieved);
        res.json(addressRetrieved);
    } catch(e) {
        console.log("Failed to retrieve classes due to error: " + e.message);
        res.send("Failed to retrieve classes due to error: " + e.message);
    }
});

app.patch("/address", async function(req, res){
    try{
        const preUpdateAddress = await addresses.findOneAndUpdate(req.body.addressInfo, req.body.updatedInfo);
        console.log("Class before update:");
        console.log(preUpdateAddress);

        const updatedClass = await classes.findOne(req.body.addressInfo);
        console.log("Class after update:");
        console.log(updatedAddress);
        res.json(updatedAddress);
    } catch(e) {
        console.log("Failed to update class due to error: " + e.message);
        res.send("Failed to update class due to error: " + e.message);
    }
});

app.delete("/address", async function(req, res){
    try{
        const deleted = await addresses.deleteMany(req.body);
        console.log(deleted);
        res.send(deleted);
    } catch(e) {
        console.log("Failed to delete class due to error: " + e.message);
        res.send("Failed to delete class due to error: " + e.message);
    }
});









// Listen on port 4000
app.listen(4000, function () {
    console.log("Listening at http://localhost:4000");
});