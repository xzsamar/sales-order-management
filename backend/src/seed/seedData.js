require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const products = [
  {
    productCode: "P001",
    productName: "Paracetamol 500mg",
    genericName: "Paracetamol",
    brand: "GSK",
    category: "Tablet",
    unitPrice: 1.250,
    discountPercentage: 5,
    focBuyQty: 10,
    focFreeQty: 1,
    availableQty: 100,
    reservedQty: 0,
    status: "Active",
  },

  {
    productCode: "P002",
    productName: "Paracetamol 650mg",
    genericName: "Paracetamol",
    brand: "Cipla",
    category: "Tablet",
    unitPrice: 1.500,
    discountPercentage: 5,
    focBuyQty: 10,
    focFreeQty: 1,
    availableQty: 80,
    reservedQty: 0,
    status: "Active",
  },

  {
    productCode: "P003",
    productName: "Paracetamol Syrup",
    genericName: "Paracetamol",
    brand: "Sun Pharma",
    category: "Syrup",
    unitPrice: 2.750,
    discountPercentage: 20,
    focBuyQty: 0,
    focFreeQty: 0,
    availableQty: 50,
    reservedQty: 0,
    status: "Active",
  },

  {
    productCode: "P004",
    productName: "Amoxicillin 500mg",
    genericName: "Amoxicillin",
    brand: "Pfizer",
    category: "Capsule",
    unitPrice: 3.500,
    discountPercentage: 15,
    focBuyQty: 20,
    focFreeQty: 2,
    availableQty: 75,
    reservedQty: 0,
    status: "Active",
  },

  {
    productCode: "P005",
    productName: "Vitamin C Tablets",
    genericName: "Vitamin C",
    brand: "Nature's Bounty",
    category: "Supplement",
    unitPrice: 2.250,
    discountPercentage: 5,
    focBuyQty: 0,
    focFreeQty: 0,
    availableQty: 120,
    reservedQty: 0,
    status: "Active",
  },

  {
    productCode: "P006",
    productName: "Cough Syrup",
    genericName: "Cough Relief",
    brand: "Benadryl",
    category: "Syrup",
    unitPrice: 2.500,
    discountPercentage: 0,
    focBuyQty: 0,
    focFreeQty: 0,
    availableQty: 70,
    reservedQty: 0,
    status: "Active",
  },

  {
    productCode: "P007",
    productName: "Premium Cough Syrup",
    genericName: "Cough Relief",
    brand: "Julphar",
    category: "Syrup",
    unitPrice: 3.000,
    discountPercentage: 0,
    focBuyQty: 0,
    focFreeQty: 0,
    availableQty: 120,
    reservedQty: 0,
    status: "Active",
  },

  {
    productCode: "P008",
    productName: "Eye Drops",
    genericName: "Artificial Tears",
    brand: "Refresh",
    category: "Drops",
    unitPrice: 1.800,
    discountPercentage: 15,
    focBuyQty: 20,
    focFreeQty: 2,
    availableQty: 90,
    reservedQty: 0,
    status: "Active",
  },

  {
    productCode: "P009",
    productName: "Insulin Injection",
    genericName: "Insulin",
    brand: "Novo Nordisk",
    category: "Injection",
    unitPrice: 8.500,
    discountPercentage: 10,
    focBuyQty: 10,
    focFreeQty: 2,
    availableQty: 40,
    reservedQty: 0,
    status: "Active",
  },

  {
    productCode: "P010",
    productName: "Diabetes Tablets",
    genericName: "Metformin",
    brand: "Merck",
    category: "Tablet",
    unitPrice: 5.000,
    discountPercentage: 5,
    focBuyQty: 10,
    focFreeQty: 1,
    availableQty: 60,
    reservedQty: 0,
    status: "Active",
  },
    {
  productCode: "P011",
  productName: "Metformin 500mg",
  genericName: "Metformin",
  brand: "Cipla",
  category: "Tablet",
  unitPrice: 4.500,
  unitPrice: 5.000,
    discountPercentage: 5,
    focBuyQty: 10,
    focFreeQty: 1,
    availableQty: 60,
  availableQty: 90,
  status: "Active",
},

{
  productCode: "P012",
  productName: "Metformin XR 500mg",
  genericName: "Metformin",
  brand: "Sun Pharma",
  category: "Tablet",
  unitPrice: 5.250,
  availableQty: 80,
  status: "Active",
},

{
  productCode: "P013",
  productName: "Amlodipine 5mg",
  genericName: "Amlodipine",
  brand: "Pfizer",
  category: "Tablet",
  unitPrice: 3.250,
  availableQty: 120,
  status: "Active",
},

{
  productCode: "P014",
  productName: "Amlodipine 10mg",
  genericName: "Amlodipine",
  brand: "Julphar",
  category: "Tablet",
  unitPrice: 3.750,
  availableQty: 100,
  status: "Active",
},

{
  productCode: "P015",
  productName: "Atorvastatin 10mg",
  genericName: "Atorvastatin",
  brand: "Pfizer",
  category: "Tablet",
  unitPrice: 4.250,
  availableQty: 85,
  status: "Active",
},

{
  productCode: "P016",
  productName: "Atorvastatin 20mg",
  genericName: "Atorvastatin",
  brand: "Cipla",
  category: "Tablet",
  unitPrice: 5.000,
  availableQty: 75,
  status: "Active",
},

{
  productCode: "P017",
  productName: "Omeprazole 20mg",
  genericName: "Omeprazole",
  brand: "GSK",
  category: "Capsule",
  unitPrice: 2.800,
  availableQty: 110,
  status: "Active",
},

{
  productCode: "P018",
  productName: "Omeprazole 40mg",
  genericName: "Omeprazole",
  brand: "Julphar",
  category: "Capsule",
  unitPrice: 3.500,
  availableQty: 90,
  status: "Active",
},

{
  productCode: "P019",
  productName: "Azithromycin 250mg",
  genericName: "Azithromycin",
  brand: "Pfizer",
  category: "Tablet",
  unitPrice: 4.000,
  availableQty: 60,
  status: "Active",
},

{
  productCode: "P020",
  productName: "Azithromycin 500mg",
  genericName: "Azithromycin",
  brand: "Cipla",
  category: "Tablet",
  unitPrice: 5.500,
  availableQty: 55,
  status: "Active",
},

{
  productCode: "P021",
  productName: "Vitamin D3",
  genericName: "Vitamin D",
  brand: "Nature's Bounty",
  category: "Supplement",
  unitPrice: 3.200,
  availableQty: 150,
  status: "Active",
},

{
  productCode: "P022",
  productName: "Vitamin D3 Forte",
  genericName: "Vitamin D",
  brand: "Now Foods",
  category: "Supplement",
  unitPrice: 4.000,
  availableQty: 120,
  status: "Active",
},

{
  productCode: "P023",
  productName: "Cetirizine 10mg",
  genericName: "Cetirizine",
  brand: "Sun Pharma",
  category: "Tablet",
  unitPrice: 1.500,
  availableQty: 140,
  status: "Active",
},

{
  productCode: "P024",
  productName: "Cetirizine Plus",
  genericName: "Cetirizine",
  brand: "Cipla",
  category: "Tablet",
  unitPrice: 1.800,
  availableQty: 130,
  status: "Active",
},

{
  productCode: "P025",
  productName: "Salbutamol Inhaler",
  genericName: "Salbutamol",
  brand: "GSK",
  category: "Inhaler",
  unitPrice: 6.500,
  availableQty: 40,
  status: "Active",
},

{
  productCode: "P026",
  productName: "Salbutamol Evohaler",
  genericName: "Salbutamol",
  brand: "Julphar",
  category: "Inhaler",
  unitPrice: 6.000,
  availableQty: 45,
  status: "Active",
},

{
  productCode: "P027",
  productName: "Ibuprofen 200mg",
  genericName: "Ibuprofen",
  brand: "Abbott",
  category: "Tablet",
  unitPrice: 1.250,
  availableQty: 180,
  status: "Active",
},

{
  productCode: "P028",
  productName: "Ibuprofen 400mg",
  genericName: "Ibuprofen",
  brand: "Cipla",
  category: "Tablet",
  unitPrice: 1.750,
  availableQty: 160,
  status: "Active",
},

{
  productCode: "P029",
  productName: "Diclofenac Gel",
  genericName: "Diclofenac",
  brand: "Novartis",
  category: "Gel",
  unitPrice: 2.950,
  availableQty: 70,
  status: "Active",
},

{
  productCode: "P030",
  productName: "Diclofenac Tablets",
  genericName: "Diclofenac",
  brand: "Sun Pharma",
  category: "Tablet",
  unitPrice: 2.500,
  availableQty: 90,
  status: "Active",
}

];

const customers = [
  {
    customerCode: "C001",
    customerName: "Muscat Medical Center",
    contactPerson: "Ahmed Al Balushi",
    mobileNumber: "91234567",
    creditLimit: 5000,
    outstandingAmount: 500,
    status: "Active",
  },

  {
    customerCode: "C002",
    customerName: "Oman Pharmacy",
    contactPerson: "Salim Al Riyami",
    mobileNumber: "92345678",
    creditLimit: 7000,
    outstandingAmount: 1200,
    status: "Active",
  },

  {
    customerCode: "C003",
    customerName: "Nizwa Healthcare",
    contactPerson: "Mohammed Al Hinai",
    mobileNumber: "93456789",
    creditLimit: 4000,
    outstandingAmount: 0,
    status: "Active",
  },
    {
  customerCode: "C004",
  customerName: "Muscat Pharmacy LLC",
  contactPerson: "Khalid Al Harthy",
  mobileNumber: "94567891",
  creditLimit: 8000,
  outstandingAmount: 750,
  status: "Active",
},

{
  customerCode: "C005",
  customerName: "Salalah Medical Supplies",
  contactPerson: "Saeed Al Mahrooqi",
  mobileNumber: "95678912",
  creditLimit: 10000,
  outstandingAmount: 1800,
  status: "Active",
},

{
  customerCode: "C006",
  customerName: "Sohar Healthcare Center",
  contactPerson: "Nasser Al Rashdi",
  mobileNumber: "96789123",
  creditLimit: 6000,
  outstandingAmount: 300,
  status: "Active",
},

{
  customerCode: "C007",
  customerName: "Barka Community Pharmacy",
  contactPerson: "Yusuf Al Habsi",
  mobileNumber: "97891234",
  creditLimit: 4500,
  outstandingAmount: 0,
  status: "Active",
},

{
  customerCode: "C008",
  customerName: "Royal Hospital Pharmacy",
  contactPerson: "Fatma Al Busaidi",
  mobileNumber: "98912345",
  creditLimit: 15000,
  outstandingAmount: 2500,
  status: "Active",
}
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    await Product.deleteMany();
    await Customer.deleteMany();

    console.log("🗑 Old data removed");

    await Product.insertMany(products);
    await Customer.insertMany(customers);

    console.log(
      `✅ ${products.length} products inserted`
    );

    console.log(
      `✅ ${customers.length} customers inserted`
    );

    console.log("🎉 Seed completed");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();