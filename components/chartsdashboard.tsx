/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import useSWR from "swr";
// import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import {
  CookingPot,
  Calendar,
  Package,
  DollarSign,
  Palette,
  GraduationCap,
  Menu,
  Bell,
  Search,
  User,
} from "lucide-react";
import RecipeChart from "./charts/RecipeChart";
import VideoScheduleChart from "./charts/VideoScheduleChart";
import InventoryChart from "./charts/InventoryChart";
import FinancialChart from "./charts/FinancialChart";
import CreativeToolsChart from "./charts/CreativeToolsChart";
import EducationChart from "./charts/EducationChart";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data, error } = useSWR("/api/dashboard", fetcher);

  if (error) return <div>Failed to load dashboard data</div>;
  if (!data) return <div>Loading...</div>;

  const {
    recipes,
    videoEvents,
    inventory,
    transactions,
    videoTemplates,
    educationalResources,
  } = data;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-white w-64 min-h-screen p-4 ${
          sidebarOpen ? "" : "hidden"
        } md:block`}
      >
        <nav className="mt-8">
          <a
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900"
            href="#"
          >
            <CookingPot className="inline-block mr-2" /> Recipes
          </a>
          <a
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900"
            href="#"
          >
            <Calendar className="inline-block mr-2" /> Schedule
          </a>
          <a
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900"
            href="#"
          >
            <Package className="inline-block mr-2" /> Inventory
          </a>
          <a
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900"
            href="#"
          >
            <DollarSign className="inline-block mr-2" /> Finances
          </a>
          <a
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900"
            href="#"
          >
            <Palette className="inline-block mr-2" /> Creative Tools
          </a>
          <a
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900"
            href="#"
          >
            <GraduationCap className="inline-block mr-2" /> Education
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-lg">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-800 ml-4">
                Content Creator ERP Dashboard
              </h1>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-200 text-gray-700 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:shadow-outline"
                />
                <div className="absolute top-0 left-0 mt-3 ml-3">
                  <Search className="h-4 w-4 text-gray-500" />
                </div>
              </div>
              <Button variant="ghost" size="icon" className="ml-4">
                <Bell className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon" className="ml-4">
                <User className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Total Recipes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{recipes?.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Videos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">
                    {
                      videoEvents.filter((e: any) => new Date(e.date) > new Date())
                        .length
                    }
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Low Stock Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">
                    {inventory.filter((i: any) => i.quantity < 5).length}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recipe Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecipeChart recipes={recipes} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Video Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <VideoScheduleChart events={videoEvents} />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <InventoryChart inventory={inventory} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Financial Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <FinancialChart transactions={transactions} />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Creative Tools Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <CreativeToolsChart templates={videoTemplates} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Educational Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <EducationChart resources={educationalResources} />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
