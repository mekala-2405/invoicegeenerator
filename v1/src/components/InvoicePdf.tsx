import React from "react";
import type { ItemDataType } from "./Item";

interface InvoicePdfProps {
  data: {
    companyName: string;
    companyAddress: string;
    billToName: string;
    billToAddress: string;
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    notes: string;
    terms: string;
    items: Array<ItemDataType>;
  } | null;
}

const DisplayText = ({ text }: { text: string }) => {
  return <div className="w-72 px-2 py-1.5 rounded-sm text-sm">{text}</div>;
};

const DisplayItem = ({ item }: { item: ItemDataType }) => {
  return (
    <div className="h-10 grid grid-cols-[5fr_1fr_1fr_1fr_1fr_1fr] text-black items-center font-bold">
      <div className="text-xs font-semibold p-2">{item.description}</div>
      <div className="text-xs font-semibold p-2 text-right">
        {item.qty.toFixed(2)}
      </div>
      <div className="text-xs font-semibold p-2 text-right">
        ₹{item.price.toFixed(2)}
      </div>
      <div className="text-xs font-semibold p-2 text-right">
        {item.discount.toFixed(2)}%
      </div>
      <div className="text-xs font-semibold p-2 text-right">
        {item.gst.toFixed(2)}%
      </div>
      <div className="text-xs font-semibold p-2 text-right">
        ₹
        {(
          item.qty *
          item.price *
          (1 - item.discount / 100) *
          (1 + item.gst / 100)
        ).toFixed(2)}
      </div>
    </div>
  );
};

export const InvoicePdf = (props: InvoicePdfProps) => {
  const def = {
    companyName: "Acme Pvt. Ltd.",
    companyAddress:
      "123 Business Road\nIndustrial Area\nHyderabad, TS - 500032",
    billToName: "Tech Solutions Inc.",
    billToAddress: "456 Software Street\nHiTech City\nHyderabad, TS - 500081",
    invoiceNumber: "2025-INV-042",
    invoiceDate: "2025-06-12",
    dueDate: "2025-06-30",
    notes:
      "Payment to be made via bank transfer.\nContact accounts@acme.com for queries.",
    terms:
      "Late payment will incur a 2% monthly interest.\nPlease adhere to the due date.",
    items: [
      {
        description: "Website Development Services",
        qty: 1,
        price: 30000,
        discount: 5,
        gst: 18,
      },
      {
        description: "Annual Hosting Charges",
        qty: 1,
        price: 8000,
        discount: 0,
        gst: 18,
      },
      {
        description: "SEO Optimization",
        qty: 1,
        price: 5000,
        discount: 10,
        gst: 18,
      },
    ],
  };

  if (!props.data || !props.data.items || props.data.items.length === 0) {
    return <div className="text-red-500">No data available</div>;
  }
  const calculateTotals = () => {
    let itemTotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    props.data.items.forEach((data) => {
      const { qty, price, discount, gst } = data;
      const baseAmount = qty * price;
      const discountAmount = baseAmount * (discount / 100);
      const amountAfterDiscount = baseAmount - discountAmount;
      const gstAmount = amountAfterDiscount * (gst / 100);

      itemTotal += amountAfterDiscount;
      totalDiscount += discountAmount;
      totalTax += gstAmount;
    });

    const totalAmount = itemTotal + totalTax;

    return {
      itemTotal,
      totalDiscount,
      totalTax,
      totalAmount,
    };
  };

  const { itemTotal, totalDiscount, totalTax, totalAmount } = calculateTotals();

  return (
    <div className="overflow-x-hidden h-[1122px] w-[793px] overflow-y-visible font-normal text-base overflow-hidden items-center flex flex-col text-black bg-[#ffffff]">
      <div className="h-4 bg-[#3b82f6] w-full"></div>
      <div className="w-full px-10 py-5 flex flex-col gap-4">
        <div className="flex w-full">
          <div className="flex flex-col w-1/2 gap-4">
            <div className="flex flex-col gap-2">
              <div className="text-3xl font-bold">{props.data.companyName}</div>
              <div className="text-base">
                {props.data.companyAddress.split("\n").map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="pt-10 flex flex-col gap-2">
              <div className="font-extrabold">Bill To:</div>
              <div className="text-3xl font-bold">{props.data.billToName}</div>
              <div className="text-base">
                {props.data.billToAddress.split("\n").map((line, idx) => (
                  <React.Fragment key={idx}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col w-1/2 gap-4 items-end">
            <div className="pb-10 text-[#000000] font-extrabold text-4xl">
              Invoice
            </div>
            <div className="flex gap-2 w-full justify-end">
              <div className="w-44 p-2">Invoice Number:</div>
              <div className="w-32 bg-[#f9fafb] px-2 py-1.5 rounded-sm text-sm">
                {props.data.invoiceNumber}
              </div>
            </div>
            <div className="flex gap-2 w-full justify-end">
              <div className="w-44 p-2">Invoice Date:</div>
              <div className="w-32 bg-[#f9fafb] px-2 py-1.5 rounded-sm text-sm">
                {props.data.invoiceDate}
              </div>
            </div>
            <div className="flex gap-2 w-full justify-end">
              <div className="w-44 p-2">Due Date:</div>
              <div className="w-32 bg-[#f9fafb] px-2 py-1.5 rounded-sm text-sm">
                {props.data.dueDate}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col">
          <div className="h-10 bg-[#172554] grid grid-cols-[5fr_1fr_1fr_1fr_1fr_1fr] text-white items-center font-bold">
            <div className="text-xs font-semibold p-2">Description</div>
            <div className="text-xs font-semibold p-2 text-right">Qty</div>
            <div className="text-xs font-semibold p-2 text-right">Price</div>
            <div className="text-xs font-semibold p-2 text-right">Discount</div>
            <div className="text-xs font-semibold p-2 text-right">Tax</div>
            <div className="text-xs font-semibold p-2 text-right">Amount</div>
          </div>
          {props.data.items.map((item, index) => (
            <DisplayItem key={index} item={item} />
          ))}
        </div>
        <div className="mt-10 flex flex-col items-end w-full">
          <div className="flex bg-[#e5e7eb] p-4 text-black w-80 justify-between border-b border-[#cbd5e1]">
            <div className="w-1/2">Item Total:</div>
            <div className="w-1/2 text-left font-bold">
              ₹{itemTotal.toFixed(2)}
            </div>
          </div>
          <div className="flex bg-[#e5e7eb] p-4 text-black w-80 justify-between border-b border-[#cbd5e1]">
            <div className="w-1/2">Discount Total:</div>
            <div className="w-1/2 text-left font-bold">
              ₹{totalDiscount.toFixed(2)}
            </div>
          </div>
          <div className="flex bg-[#e5e7eb] p-4 text-black w-80 justify-between border-b border-[#cbd5e1]">
            <div className="w-1/2">Tax:</div>
            <div className="w-1/2 text-left font-bold">
              ₹{totalTax.toFixed(2)}
            </div>
          </div>
          <div className="flex bg-[#e5e7eb] p-4 text-black w-80 justify-between border-b border-[#cbd5e1]">
            <div className="w-1/2">Total:</div>
            <div className="w-1/2 text-left font-bold">
              ₹{totalAmount.toFixed(2)}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          Notes:
          <div className="w-full bg-[#f9fafb] h-20 px-2 py-1.5 rounded-sm text-sm">
            {props.data.notes}
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          Terms and Conditions:
          <div className="w-full bg-[#f9fafb] h-20 px-2 py-1.5 rounded-sm text-sm">
            {props.data.terms}
          </div>
        </div>
      </div>
    </div>
  );
};
