require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const Order = require("../models/Order");

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
    unitPrice: 5.000,
    discountPercentage: 5,
    focBuyQty: 10,
    focFreeQty: 1,
    availableQty: 90,
    reservedQty: 0,
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
    discountPercentage: 10,
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
    discountPercentage: 5,
    availableQty: 60,
    status: "Active",
  },

  {
    // Kept Inactive on purpose so the "order inactive product" scenario
    // can be demonstrated against real seed data.
    productCode: "P020",
    productName: "Azithromycin 500mg",
    genericName: "Azithromycin",
    brand: "Cipla",
    category: "Tablet",
    unitPrice: 5.500,
    availableQty: 55,
    status: "Inactive",
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
  },

  {
    // Completes the Paracetamol variation set (Tablet / Syrup / Drops)
    // from the assessment example.
    productCode: "P031",
    productName: "Paracetamol Drops",
    genericName: "Paracetamol",
    brand: "Julphar",
    category: "Drops",
    unitPrice: 2.100,
    discountPercentage: 0,
    availableQty: 65,
    status: "Active",
  },
];

const customers = [
  {
    customerCode: "C001",
    customerName: "Muscat Medical Center",
    contactPerson: "Ahmed Al Balushi",
    mobileNumber: "91234567",
    address: {
      country: "Oman",
      city: "Muscat",
      area: "Al Khuwair",
      zipcode: "133",
      googleMapUrl: "https://maps.google.com/?q=23.5859,58.4059",
    },
    creditLimit: 5000,
    outstandingAmount: 500,
    status: "Active",
  },

  {
    customerCode: "C002",
    customerName: "Oman Pharmacy",
    contactPerson: "Salim Al Riyami",
    mobileNumber: "92345678",
    address: {
      country: "Oman",
      city: "Muscat",
      area: "Ruwi",
      zipcode: "112",
      googleMapUrl: "https://maps.google.com/?q=23.5933,58.5450",
    },
    creditLimit: 7000,
    outstandingAmount: 1200,
    status: "Active",
  },

  {
    customerCode: "C003",
    customerName: "Nizwa Healthcare",
    contactPerson: "Mohammed Al Hinai",
    mobileNumber: "93456789",
    address: {
      country: "Oman",
      city: "Nizwa",
      area: "Firq",
      zipcode: "611",
      googleMapUrl: "https://maps.google.com/?q=22.9333,57.5333",
    },
    creditLimit: 4000,
    outstandingAmount: 0,
    status: "Active",
  },

  {
    customerCode: "C004",
    customerName: "Muscat Pharmacy LLC",
    contactPerson: "Khalid Al Harthy",
    mobileNumber: "94567891",
    address: {
      country: "Oman",
      city: "Muscat",
      area: "Al Ghubra",
      zipcode: "130",
      googleMapUrl: "https://maps.google.com/?q=23.5897,58.4000",
    },
    creditLimit: 8000,
    outstandingAmount: 750,
    status: "Active",
  },

  {
    customerCode: "C005",
    customerName: "Salalah Medical Supplies",
    contactPerson: "Saeed Al Mahrooqi",
    mobileNumber: "95678912",
    address: {
      country: "Oman",
      city: "Salalah",
      area: "Al Saada",
      zipcode: "211",
      googleMapUrl: "https://maps.google.com/?q=17.0151,54.0924",
    },
    creditLimit: 10000,
    outstandingAmount: 1800,
    status: "Active",
  },

  {
    customerCode: "C006",
    customerName: "Sohar Healthcare Center",
    contactPerson: "Nasser Al Rashdi",
    mobileNumber: "96789123",
    address: {
      country: "Oman",
      city: "Sohar",
      area: "Al Hambar",
      zipcode: "311",
      googleMapUrl: "https://maps.google.com/?q=24.3470,56.7290",
    },
    creditLimit: 6000,
    outstandingAmount: 300,
    status: "Active",
  },

  {
    // Inactive customer for testing the "inactive customer" order scenario.
    customerCode: "C007",
    customerName: "Barka Community Pharmacy",
    contactPerson: "Yusuf Al Habsi",
    mobileNumber: "97891234",
    address: {
      country: "Oman",
      city: "Barka",
      area: "Al Bahayis",
      zipcode: "320",
      googleMapUrl: "https://maps.google.com/?q=23.7060,57.8890",
    },
    creditLimit: 4500,
    outstandingAmount: 0,
    status: "Inactive",
  },

  {
    customerCode: "C008",
    customerName: "Royal Hospital Pharmacy",
    contactPerson: "Fatma Al Busaidi",
    mobileNumber: "98912345",
    address: {
      country: "Oman",
      city: "Muscat",
      area: "Bowsher",
      zipcode: "133",
      googleMapUrl: "https://maps.google.com/?q=23.5650,58.4200",
    },
    creditLimit: 15000,
    outstandingAmount: 2500,
    status: "Active",
  },
];

// Sample sales orders. Lines are written as { code, qty } and the totals
// (discount / FOC / VAT) are computed the exact same way the order
// controller does, so the seeded data stays consistent with live orders.
const orderBlueprints = [
  {
    booking: "SO-20260001",
    customer: "C001",
    salesPerson: "Rashid Al Saadi",
    deliveryInDays: 3,
    remarks: "Urgent stock replenishment",
    lines: [
      { code: "P001", qty: 50 },
      { code: "P017", qty: 20 },
    ],
  },
  {
    booking: "SO-20260002",
    customer: "C002",
    salesPerson: "Hilal Al Amri",
    deliveryInDays: 5,
    remarks: "",
    lines: [
      { code: "P004", qty: 30 },
      { code: "P019", qty: 15 },
    ],
  },
  {
    booking: "SO-20260003",
    customer: "C003",
    salesPerson: "Rashid Al Saadi",
    deliveryInDays: 2,
    remarks: "Diabetic care order",
    lines: [
      { code: "P010", qty: 40 },
      { code: "P011", qty: 25 },
    ],
  },
  {
    booking: "SO-20260004",
    customer: "C004",
    salesPerson: "Maryam Al Zadjali",
    deliveryInDays: 4,
    remarks: "",
    lines: [
      { code: "P005", qty: 60 },
      { code: "P021", qty: 40 },
    ],
  },
  {
    booking: "SO-20260005",
    customer: "C005",
    salesPerson: "Hilal Al Amri",
    deliveryInDays: 7,
    remarks: "Cold chain - insulin",
    lines: [
      { code: "P009", qty: 20 },
      { code: "P025", qty: 10 },
    ],
  },
  {
    booking: "SO-20260006",
    customer: "C006",
    salesPerson: "Maryam Al Zadjali",
    deliveryInDays: 6,
    remarks: "",
    lines: [
      { code: "P027", qty: 100 },
      { code: "P028", qty: 80 },
    ],
  },
  {
    booking: "SO-20260007",
    customer: "C001",
    salesPerson: "Rashid Al Saadi",
    deliveryInDays: 3,
    remarks: "Antihistamine restock",
    lines: [
      { code: "P023", qty: 50 },
      { code: "P024", qty: 40 },
    ],
  },
  {
    booking: "SO-20260008",
    customer: "C008",
    salesPerson: "Salim Al Habsi",
    deliveryInDays: 2,
    remarks: "Hospital monthly supply",
    lines: [
      { code: "P018", qty: 30 },
      { code: "P017", qty: 25 },
    ],
  },
  {
    booking: "SO-20260009",
    customer: "C002",
    salesPerson: "Hilal Al Amri",
    deliveryInDays: 5,
    remarks: "",
    lines: [
      { code: "P013", qty: 40 },
      { code: "P014", qty: 30 },
    ],
  },
  {
    booking: "SO-20260010",
    customer: "C004",
    salesPerson: "Maryam Al Zadjali",
    deliveryInDays: 4,
    remarks: "Eye care + syrups",
    lines: [
      { code: "P008", qty: 45 },
      { code: "P003", qty: 20 },
    ],
  },
];

const round = (n) => Math.round(n * 1000) / 1000;

const VAT_PERCENTAGE = Number(process.env.VAT_PERCENTAGE || 5);

const buildOrder = (blueprint, productMap, customerMap) => {
  let grossAmount = 0;
  let totalDiscount = 0;
  let totalFOC = 0;

  const items = blueprint.lines.map(({ code, qty }) => {
    const product = productMap[code];

    const itemGross = qty * product.unitPrice;

    const discountAmount =
      (itemGross * (product.discountPercentage || 0)) / 100;

    let focQty = 0;

    if (product.focBuyQty > 0 && product.focFreeQty > 0) {
      focQty =
        Math.floor(qty / product.focBuyQty) * product.focFreeQty;
    }

    const lineTotal = itemGross - discountAmount;

    grossAmount += itemGross;
    totalDiscount += discountAmount;
    totalFOC += focQty;

    return {
      product: product._id,
      quantity: qty,
      focQuantity: focQty,
      rate: product.unitPrice,
      discount: round(discountAmount),
      lineTotal: round(lineTotal),
    };
  });

  const netAmount = grossAmount - totalDiscount;
  const vatAmount = (netAmount * VAT_PERCENTAGE) / 100;
  const grandTotal = netAmount + vatAmount;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + blueprint.deliveryInDays);

  return {
    bookingNumber: blueprint.booking,
    customer: customerMap[blueprint.customer]._id,
    salesPerson: blueprint.salesPerson,
    orderDate: new Date(),
    deliveryDate,
    remarks: blueprint.remarks,
    items,
    grossAmount: round(grossAmount),
    totalDiscount: round(totalDiscount),
    totalFOC,
    netAmount: round(netAmount),
    vatPercentage: VAT_PERCENTAGE,
    vatAmount: round(vatAmount),
    grandTotal: round(grandTotal),
    status: "Confirmed",
  };
};

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    await Product.deleteMany();
    await Customer.deleteMany();
    await Order.deleteMany();

    console.log("🗑  Old data removed");

    const insertedProducts = await Product.insertMany(products);
    const insertedCustomers = await Customer.insertMany(customers);

    // index by code so the order builder can look products/customers up
    const productMap = {};
    insertedProducts.forEach((p) => {
      productMap[p.productCode] = p;
    });

    const customerMap = {};
    insertedCustomers.forEach((c) => {
      customerMap[c.customerCode] = c;
    });

    const orders = orderBlueprints.map((bp) =>
      buildOrder(bp, productMap, customerMap)
    );

    await Order.insertMany(orders);

    console.log(`✅ ${products.length} products inserted`);
    console.log(`✅ ${customers.length} customers inserted`);
    console.log(`✅ ${orders.length} orders inserted`);

    console.log("🎉 Seed completed");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
