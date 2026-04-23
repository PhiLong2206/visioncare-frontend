import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, RefreshCw, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  createSupplier,
  deleteSupplier,
  getSuppliers,
  updateSupplier,
} from "../../api/supplierAPI";
import ConfirmModal from "../../components/ConfirmModal";

function getArrayPayload(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

function mapSupplier(item) {
  return {
    id: item?.supplierId ?? item?.id,
    supplierName: item?.supplierName ?? item?.name ?? "",
    contactName: item?.contactName ?? item?.contactPerson ?? "",
    phone: item?.phone ?? item?.phoneNumber ?? "",
    email: item?.email ?? "",
    address: item?.address ?? "",
    isActive:
      item?.isActive ??
      item?.active ??
      String(item?.status || "").toLowerCase() !== "inactive",
    raw: item,
  };
}

const emptyForm = {
  supplierName: "",
  contactName: "",
  phone: "",
  email: "",
  address: "",
  isActive: true,
};

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    action: () => {},
  });

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await getSuppliers();
      setSuppliers(getArrayPayload(data).map(mapSupplier));
    } catch (error) {
      console.error("Fetch suppliers failed:", error);
      toast.error(error.message || "Khong tai duoc danh sach nha cung cap.");
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filteredSuppliers = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return suppliers;

    return suppliers.filter((supplier) =>
      [
        supplier.supplierName,
        supplier.contactName,
        supplier.phone,
        supplier.email,
        supplier.address,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword))
    );
  }, [search, suppliers]);

  const openCreateModal = () => {
    setEditingSupplier(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (supplier) => {
    setEditingSupplier(supplier);
    setForm({
      supplierName: supplier.supplierName,
      contactName: supplier.contactName,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      isActive: supplier.isActive,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSupplier(null);
    setForm(emptyForm);
  };

  const handleSubmit = async () => {
    if (!form.supplierName.trim()) {
      toast.error("Vui long nhap ten nha cung cap.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        supplierName: form.supplierName.trim(),
        contactName: form.contactName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        isActive: Boolean(form.isActive),
      };

      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, payload);
        toast.success("Da cap nhat nha cung cap.");
      } else {
        await createSupplier(payload);
        toast.success("Da tao nha cung cap.");
      }

      closeModal();
      await fetchSuppliers();
    } catch (error) {
      console.error("Save supplier failed:", error);
      toast.error(error.message || "Khong luu duoc nha cung cap.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (supplier) => {
    setConfirmModal({
      isOpen: true,
      title: "Vô hiệu hóa nhà cung cấp",
      message: `Bạn có chắc muốn vô hiệu hóa nhà cung cấp "${supplier.supplierName}"?`,
      confirmText: "Vô hiệu hóa",
      action: async () => {
        try {
          await deleteSupplier(supplier.id);
          toast.success("Đã vô hiệu hóa nhà cung cấp.");
          await fetchSuppliers();
        } catch (error) {
          console.error("Delete supplier failed:", error);
          toast.error(error.message || "Không xóa được nhà cung cấp.");
        }
      }
    });
  };

  return (
    <section>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight text-slate-900">
            Nha cung cap
          </h1>
          <p className="mt-2 text-[15px] text-slate-500">
            Quan ly nha cung cap dung cho nhap kho va pre-order
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tim nha cung cap..."
            className="h-12 w-64 rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-400"
          />
          <button
            type="button"
            onClick={fetchSuppliers}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-[15px] font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw size={18} />
            Tai lai
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 px-6 py-3 text-[15px] font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            <Plus size={20} />
            Them nha cung cap
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="px-7 py-6 text-[15px] font-semibold text-slate-500">
                  Ten nha cung cap
                </th>
                <th className="px-7 py-6 text-[15px] font-semibold text-slate-500">
                  Lien he
                </th>
                <th className="px-7 py-6 text-[15px] font-semibold text-slate-500">
                  Email
                </th>
                <th className="px-7 py-6 text-[15px] font-semibold text-slate-500">
                  Dia chi
                </th>
                <th className="px-7 py-6 text-[15px] font-semibold text-slate-500">
                  Trang thai
                </th>
                <th className="px-7 py-6 text-right text-[15px] font-semibold text-slate-500">
                  Thao tac
                </th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-7 py-10 text-center text-slate-500">
                    Dang tai danh sach nha cung cap...
                  </td>
                </tr>
              )}

              {!loading &&
                filteredSuppliers.map((supplier) => (
                  <tr
                    key={supplier.id}
                    className="border-b border-slate-100 transition last:border-b-0 hover:bg-slate-50/60"
                  >
                    <td className="px-7 py-7 text-[16px] font-semibold text-slate-900">
                      {supplier.supplierName}
                    </td>
                    <td className="px-7 py-7 text-[15px] text-slate-500">
                      <p>{supplier.contactName || "-"}</p>
                      <p className="mt-1">{supplier.phone || "-"}</p>
                    </td>
                    <td className="px-7 py-7 text-[15px] text-slate-500">
                      {supplier.email || "-"}
                    </td>
                    <td className="px-7 py-7 text-[15px] text-slate-500">
                      {supplier.address || "-"}
                    </td>
                    <td className="px-7 py-7">
                      <span
                        className={`inline-flex rounded-full px-4 py-2 text-[14px] font-semibold ${
                          supplier.isActive
                            ? "border border-green-200 bg-green-50 text-green-600"
                            : "border border-red-200 bg-red-50 text-red-600"
                        }`}
                      >
                        {supplier.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-7 py-7">
                      <div className="flex items-center justify-end gap-4">
                        <button
                          type="button"
                          onClick={() => openEditModal(supplier)}
                          className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-100"
                        >
                          <Pencil size={20} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(supplier)}
                          className="rounded-xl p-2 text-red-500 transition hover:bg-red-50"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!loading && filteredSuppliers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-7 py-10 text-center text-slate-500">
                    Khong co nha cung cap phu hop.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {editingSupplier ? "Cập nhật nhà cung cấp" : "Thêm nhà cung cấp"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormInput
                label="Tên nhà cung cấp"
                value={form.supplierName}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, supplierName: value }))
                }
              />
              <FormInput
                label="Người liên hệ"
                value={form.contactName}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, contactName: value }))
                }
              />
              <FormInput
                label="Số điện thoại"
                value={form.phone}
                onChange={(value) => setForm((prev) => ({ ...prev, phone: value }))}
              />
              <FormInput
                label="Email"
                value={form.email}
                onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
              />
              <div className="md:col-span-2">
                <FormInput
                  label="Địa chỉ"
                  value={form.address}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, address: value }))
                  }
                />
              </div>
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                />
                Đang hoạt động
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {submitting ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={() => {
          setConfirmModal({ ...confirmModal, isOpen: false });
          confirmModal.action();
        }}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
      />
    </section>
  );
}

function FormInput({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-400"
      />
    </label>
  );
}
