"use client";
import Image from "next/image";
import AdminListTable from "@/components/admin/AdminListTable";

const Orders = () => {
  const orders = Array.from({ length: 10 }, (_, index) => ({
    id: `order-${index + 1}`,
    title: "Samsung Galaxy S23 x 1, Apple Airpods Pro 2nd Gen x 2",
    itemCount: 2,
    customer: "Urban",
    address: "Main Street, Main Road, 123 Colony, City, State",
    phone: "98473764721",
    total: "$1630.97",
    method: "COD",
    date: "2/7/2025",
    payment: "Pending",
  }));

  return (
    <AdminListTable
      title="Orders"
      columns={[
        { key: "order", label: "Order" },
        { key: "address", label: "Address" },
        { key: "total", label: "Total" },
        { key: "status", label: "Status" },
      ]}
      rows={orders}
      searchPlaceholder="Search by order or customer"
      searchBy={(order) => `${order.title} ${order.customer} ${order.phone}`}
      renderRow={(order) => (
        <tr key={order.id} className="border-b border-slate-200 hover:bg-indigo-50/30 transition-colors">
          <td className="px-5 py-4">
            <div className="flex gap-5 items-start">
              <div className="bg-slate-100 flex items-center border-slate-300 border justify-center w-20 h-20 rounded-md">
                <Image src="/Order.svg" alt="Order" width={40} height={40} className="object-contain" />
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-sm text-slate-800">{order.title}</h1>
                <span className="text-xs text-slate-500">Items {order.itemCount}</span>
              </div>
            </div>
          </td>
          <td className="px-5 py-4 font-normal text-sm text-slate-700">
            <h1 className="uppercase font-medium">{order.customer}</h1>
            <h2>{order.address}</h2>
            <h2>{order.phone}</h2>
          </td>
          <td className="px-5 py-4 font-medium text-sm text-slate-900">
            <h1>{order.total}</h1>
          </td>
          <td className="px-5 py-4 font-normal text-sm text-slate-700">
            <ul>
              <li className="font-medium">
                Method: <span className="font-normal">{order.method}</span>
              </li>
              <li className="font-medium">
                Date: <span className="font-normal">{order.date}</span>
              </li>
              <li className="font-medium">
                Payment: <span className="font-normal">{order.payment}</span>
              </li>
            </ul>
          </td>
        </tr>
      )}
      containerClassName="w-full"
    />
  );
};
export default Orders;
