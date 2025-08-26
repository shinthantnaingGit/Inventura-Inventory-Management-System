"use client";
import React from "react";
import {
  BarChart3,
  Package,
  ShoppingCart,
  TicketPercent,
  Plus,
  Settings,
  Search,
  ArrowRight,
} from "lucide-react";

const DashBoardSection = () => {
  return (
    <section className="px-4 sm:px-6 lg:px-10 py-4 space-y-6">
      {/* Top bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Welcome to your Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Quick overview and shortcuts to manage your shop.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-64 hidden sm:block">
            <input
              type="text"
              placeholder="Search…"
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 pl-10 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search dashboard"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white text-sm font-medium px-4 py-2 hover:bg-blue-700 active:scale-[.98] focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="size-4" />
            New Item
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Settings"
            title="Settings"
          >
            <Settings className="size-4" />
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Orders"
          value="1,284"
          delta="+8.3% this week"
          icon={ShoppingCart}
          iconBg="bg-blue-100 dark:bg-blue-900/30"
        />
        <StatsCard
          title="Revenue"
          value="¥482,900"
          delta="+3.1% this week"
          icon={BarChart3}
          iconBg="bg-emerald-100 dark:bg-emerald-900/30"
        />
        <StatsCard
          title="Products"
          value="216"
          delta="5 low stock"
          icon={Package}
          iconBg="bg-amber-100 dark:bg-amber-900/30"
        />
        <StatsCard
          title="Active Vouchers"
          value="12"
          delta="2 expiring soon"
          icon={TicketPercent}
          iconBg="bg-fuchsia-100 dark:bg-fuchsia-900/30"
        />
      </div>

      {/* Main content */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Quick actions + recent activity */}
        <div className="space-y-6 xl:col-span-2">
          <Card>
            <CardHeader
              title="Quick Actions"
              subtitle="Common tasks to get things done fast"
              rightSlot={
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                >
                  View all <ArrowRight className="size-4" />
                </a>
              }
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <QuickAction label="Add Product" description="Create a new item" />
              <QuickAction label="Create Voucher" description="Discount code" />
              <QuickAction label="Import CSV" description="Bulk upload" />
              <QuickAction label="Manage Stock" description="Adjust quantities" />
              <QuickAction label="View Orders" description="Today’s orders" />
              <QuickAction label="Settings" description="Shop preferences" />
            </div>
          </Card>

          <Card>
            <CardHeader title="Recent Activity" subtitle="Latest updates across your store" />
            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
              {[
                { time: "10:21", text: "Order #10239 paid successfully." },
                { time: "09:05", text: "Voucher SPRING20 redeemed." },
                { time: "Yesterday", text: "Adjusted stock for Croissant × 20." },
              ].map((item, i) => (
                <li key={i} className="flex items-start justify-between gap-4 py-3">
                  <p className="text-sm text-gray-800 dark:text-gray-200">{item.text}</p>
                  <span className="shrink-0 text-xs text-gray-500">{item.time}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Announcements / tips */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Announcements" subtitle="What’s new" />
            <div className="space-y-4">
              <Announcement
                title="New dashboard theme"
                body="Try the refreshed look and improved accessibility."
              />
              <Announcement
                title="Inventory low-stock alert"
                body="Receive notifications when items fall below threshold."
              />
            </div>
          </Card>

          <Card>
            <CardHeader title="Tips" subtitle="Improve your workflow" />
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>Use CSV import to add products in bulk.</li>
              <li>Pin quick actions you use daily.</li>
              <li>Set voucher expiry to drive repeat purchases.</li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DashBoardSection;

/* ---------- Reusable bits ---------- */

function StatsCard({ title, value, delta, icon: Icon, iconBg }) {
  return (
    <div className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {value}
          </p>
        </div>
        <div
          className={`rounded-xl ${iconBg} p-3 ring-1 ring-black/5 dark:ring-white/10`}
          aria-hidden="true"
        >
          <Icon className="size-5 text-gray-700 dark:text-gray-200" />
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">{delta}</p>
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <div className="p-5">{children}</div>
    </div>
  );
}

function CardHeader({ title, subtitle, rightSlot }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
        )}
      </div>
      {rightSlot}
    </div>
  );
}

function QuickAction({ label, description }) {
  return (
    <button
      type="button"
      className="w-full text-left rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
      <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
    </button>
  );
}

function Announcement({ title, body }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{body}</p>
    </div>
  );
}
