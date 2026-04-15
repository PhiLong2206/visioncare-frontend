import { useState } from "react";
import {
  SlidersHorizontal,
  Truck,
  Plus,
  CheckCircle2,
  Zap,
  PlusSquare,
  Pencil,
  Eye,
} from "lucide-react";

// --- Shipping Rules ---
const shippingRules = [
  {
    id: 1,
    icon: CheckCircle2,
    iconColor: "text-teal-500",
    title: "Standard Clinical Delivery",
    description: "Orders > $150.00  |  Ground Shipping  |  5-7 Days",
    active: true,
  },
  {
    id: 2,
    icon: Zap,
    iconColor: "text-amber-400",
    title: "Expedited Prescription",
    description: "Flat Rate $25.00  |  Air Shipping  |  1-2 Days",
    active: true,
  },
];

// --- Policy content sections ---
const policySections = [
  {
    type: "paragraph",
    content: (
      <>
        VisionCare provides a{" "}
        <strong className="text-slate-800">100% Satisfaction Guarantee</strong>{" "}
        on all prescription lenses. If your patient is unable to adapt to their
        new prescription within the first 30 days, we will offer a one-time lens
        remake at no additional cost.
      </>
    ),
  },
  {
    type: "callout",
    title: "Patient Adaptation Clause",
    content:
      "Remakes must be for the same frame. Any change in frame style or lens material may incur additional laboratory fees. This policy does not cover physical damage caused by the end user.",
  },
  {
    type: "paragraph",
    content: (
      <>
        Frames may be returned for a full refund within 14 days of receipt,
        provided they are in original "as-new" condition with all manufacturer
        packaging intact. A restocking fee of 15% applies to high-luxury
        boutique brands including <em>Iconic Vision</em> and <em>Prism Craft</em>.
      </>
    ),
  },
  {
    type: "heading",
    content: "Return Authorization Process",
  },
  {
    type: "list",
    items: [
      <>All returns must be initiated via the Clinical Portal <strong>*Order History*</strong> tab.</>,
      "A Return Merchandise Authorization (RMA) number will be generated immediately.",
      "VisionCare will provide a pre-paid shipping label for validated clinical errors.",
    ],
  },
];

// --- Parameter Input ---
function ParamInput({
  label,
  value,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-16 text-center text-lg font-extrabold text-slate-800 border border-slate-200 rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-slate-50"
        />
        <span className="text-sm font-semibold text-slate-500">{unit}</span>
      </div>
    </div>
  );
}

// --- Main ---
export default function Policies() {
  const [processingDays, setProcessingDays] = useState(3);
  const [returnWindow, setReturnWindow] = useState(30);
  const [rules, setRules] = useState(shippingRules);

  const toggleRule = (id: number) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
  };

  return (
    <div className="flex overflow-y-auto bg-slate-50 font-sans p-6">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Policy &amp; Business Rules
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-md leading-relaxed">
              Manage the clinical and operational guidelines for VisionCare.
              Define how we handle returns, warranties, and shipping logistics
              with editorial precision.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 transition shadow-sm">
              Discard Changes
            </button>
            <button className="px-4 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 transition shadow-md">
              Publish Changes
            </button>
          </div>
        </div>

        {/* Top Grid: Global Params + Shipping Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Global Parameters */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={15} className="text-teal-600" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Global Parameters
              </span>
            </div>
            <ParamInput
              label="Processing Days"
              value={processingDays}
              unit="Business Days"
              onChange={setProcessingDays}
            />
            <ParamInput
              label="Return Window"
              value={returnWindow}
              unit="Calendar Days"
              onChange={setReturnWindow}
            />
            <p className="text-[11px] text-slate-400 italic leading-relaxed mt-1">
              Changes to global parameters take effect immediately across all
              storefronts.
            </p>
          </div>

          {/* Active Shipping Rules */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck size={15} className="text-teal-600" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Active Shipping Rules
                </span>
              </div>
              <button className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 transition">
                <Plus size={13} />
                Add Rule
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {rules.map((rule) => {
                const Icon = rule.icon;
                return (
                  <div
                    key={rule.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition group"
                  >
                    <div className="shrink-0">
                      <Icon size={20} className={rule.iconColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 leading-tight">
                        {rule.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                        {rule.description}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className={`shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full transition ${
                        rule.active
                          ? "bg-teal-100 text-teal-700 hover:bg-teal-200"
                          : "bg-slate-200 text-slate-500 hover:bg-slate-300"
                      }`}
                    >
                      {rule.active ? "ACTIVE" : "OFF"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Refund Policy Editor */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* Editor Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2">
              <PlusSquare size={16} className="text-teal-600" />
              <span className="text-sm font-bold text-slate-700">
                Refund Policy Editor
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400">
                Last updated: 14 Oct 2023
              </span>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 transition">
                <Pencil size={12} />
                Edit
              </button>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition">
                <Eye size={12} />
                Preview
              </button>
            </div>
          </div>

          {/* Document Body */}
          <div className="px-7 py-6 space-y-4 text-slate-600 text-sm leading-relaxed">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Clinical Refund Standards
            </h2>

            {policySections.map((section, i) => {
              if (section.type === "paragraph") {
                return (
                  <p key={i} className="text-slate-600 leading-relaxed">
                    {section.content}
                  </p>
                );
              }

              if (section.type === "callout") {
                return (
                  <div
                    key={i}
                    className="border-l-4 border-teal-400 bg-slate-50 rounded-r-xl px-5 py-4"
                  >
                    <p className="text-sm font-bold text-slate-800 mb-1">
                      {section.title}
                    </p>
                    <p className="text-[13px] text-slate-500 leading-relaxed">
                      {section.content as string}
                    </p>
                  </div>
                );
              }

              if (section.type === "heading") {
                return (
                  <h3
                    key={i}
                    className="text-base font-extrabold text-slate-800 mt-2"
                  >
                    {section.content as string}
                  </h3>
                );
              }

              if (section.type === "list" && section.items) {
                return (
                  <ul key={i} className="space-y-2 list-none pl-0">
                    {section.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-slate-600">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              }

              return null;
            })}
          </div>
        </div>

      </div>
    </div>
  );
}