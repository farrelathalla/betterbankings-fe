"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Lock, Download, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import AnalysisBox from "@/components/AnalysisBox";
import RestrictedViz from "@/components/RestrictedViz";
import { lockScrollPosition } from "@/lib/scrollLock";

// Declare Tableau types for TypeScript
declare global {
  interface Window {
    tableau: {
      VizLoadErrorEvent: unknown;
    };
  }
}

// The workbook is loaded once; tabs switch dashboards inside the same session.
// Requires "Show Sheets as Tabs" on the published workbook.
const tableauUrls: Record<string, string> = {
  PassThroughRate:
    "https://public.tableau.com/views/BankingIndustryData-Separated/PassThroughRate",
};

// Sheet names are resolved from the workbook by matching the view name in the
// URL (case/space/symbol-insensitive), e.g. "CreditFundingRates" -> "Credit & Funding Rates".
const normalizeSheetName = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]/g, "");

interface TableauVizElement extends HTMLElement {
  workbook?: {
    activateSheetAsync: (sheetName: string) => Promise<unknown>;
    publishedSheetsInfo: Array<{ name: string }>;
    activeSheet: {
      sheetType: string;
      worksheets?: Array<{
        getSummaryDataAsync: () => Promise<TableauDataTable>;
      }>;
      getSummaryDataAsync: () => Promise<TableauDataTable>;
    };
  };
}

interface TableauDataTable {
  columns: Array<{ fieldName: string }>;
  data: Array<Array<{ formattedValue?: string; value?: unknown }>>;
}

export default function PassThroughRatePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("PassThroughRate");
  const [isDownloading, setIsDownloading] = useState(false);
  const [vizLoaded, setVizLoaded] = useState(false);
  const [vizReady, setVizReady] = useState(false);
  const [vizError, setVizError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const vizRef = useRef<TableauVizElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeTabRef = useRef(activeTab);
  const shownTabRef = useRef(activeTab);
  const interactiveRef = useRef(false);
  const switchTokenRef = useRef(0);

  const tabLabels: Record<string, string> = {
    PassThroughRate: "Pass Through Rate",
  };

  // Load Tableau JS API once on mount
  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src*="tableau.embedding"]',
    );

    if (existingScript) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js";
    script.type = "module";
    script.async = true;

    script.onload = () => {
      setScriptLoaded(true);
    };

    script.onerror = () => {
      setVizError("Failed to load Tableau library");
    };

    document.head.appendChild(script);
  }, []);

  // Switch dashboard inside the already-loaded workbook (no reload).
  // Falls back to a fresh viz if the sheet can't be activated.
  const switchSheet = useCallback(
    async (tab: string) => {
      const viz = vizRef.current;
      const token = ++switchTokenRef.current;
      const unlockScroll = lockScrollPosition();
      shownTabRef.current = tab;
      setVizReady(false);

      try {
        if (!viz?.workbook) throw new Error("Workbook not available");
        const wanted = normalizeSheetName(tableauUrls[tab].split("/").pop() ?? "");
        const sheet = viz.workbook.publishedSheetsInfo.find(
          (info) => normalizeSheetName(info.name) === wanted,
        );
        if (!sheet) throw new Error(`Sheet not found for tab "${tab}"`);
        await viz.workbook.activateSheetAsync(sheet.name);
        unlockScroll();
        if (token !== switchTokenRef.current) return;
        setTimeout(() => {
          if (token === switchTokenRef.current) setVizReady(true);
        }, 1000);
      } catch (error) {
        console.error("Error switching Tableau sheet:", error);
        unlockScroll(0);
        if (token === switchTokenRef.current) mountViz(tab);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Create the <tableau-viz> element. Only used for the first load, retry,
  // and as a fallback; normal tab changes go through switchSheet.
  const mountViz = useCallback(
    (tab: string) => {
      const container = containerRef.current;
      if (!container) return;

      container.innerHTML = "";
      switchTokenRef.current++;
      shownTabRef.current = tab;
      interactiveRef.current = false;
      setVizLoaded(false);
      setVizReady(false);
      setVizError(null);

      const vizElement = document.createElement(
        "tableau-viz",
      ) as TableauVizElement;
      vizElement.setAttribute("id", "tableauViz");
      vizElement.setAttribute("src", tableauUrls[tab]);
      vizElement.setAttribute("hide-tabs", "true");
      vizElement.setAttribute("toolbar", "bottom");
      vizElement.style.width = "100%";
      vizElement.style.height = "100%";
      vizElement.style.display = "block";

      vizElement.addEventListener("firstinteractive", () => {
        interactiveRef.current = true;
        vizRef.current = vizElement;
        setVizLoaded(true);

        // User clicked another tab while the workbook was still loading
        if (activeTabRef.current !== tab) {
          switchSheet(activeTabRef.current);
          return;
        }
        setTimeout(() => {
          setVizReady(true);
        }, 2000);
      });

      vizRef.current = vizElement;
      container.appendChild(vizElement);
    },
    [switchSheet],
  );

  // Mount once when the script is ready; afterwards just switch sheets
  useEffect(() => {
    activeTabRef.current = activeTab;
    const container = containerRef.current;
    if (!container || !scriptLoaded) return;

    const existing = container.querySelector(
      "tableau-viz",
    ) as TableauVizElement | null;

    // First load, or the container was remounted (e.g. by RestrictedViz)
    if (!existing) {
      mountViz(activeTab);
      return;
    }

    vizRef.current = existing;
    if (shownTabRef.current === activeTab) return;
    // Still loading: firstinteractive will pick up the latest tab
    if (!interactiveRef.current) return;

    switchSheet(activeTab);
  }, [activeTab, scriptLoaded, mountViz, switchSheet]);

  // Download filtered data as CSV
  const handleDownload = useCallback(async () => {
    if (!vizRef.current || !vizReady) {
      alert("Please wait for the dashboard to fully load.");
      return;
    }

    setIsDownloading(true);

    try {
      const viz = vizRef.current;
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const workbook = viz.workbook;
      if (!workbook) {
        throw new Error("Workbook not available");
      }

      const activeSheet = workbook.activeSheet;
      let dataTable: TableauDataTable | null = null;

      if (activeSheet.sheetType === "dashboard") {
        const worksheets = activeSheet.worksheets;
        if (worksheets && worksheets.length > 0) {
          dataTable = await worksheets[0].getSummaryDataAsync();
        }
      } else {
        dataTable = await activeSheet.getSummaryDataAsync();
      }

      if (!dataTable) {
        alert("Could not retrieve data from the visualization.");
        setIsDownloading(false);
        return;
      }

      const columns = dataTable.columns;
      const data = dataTable.data;
      const headers = columns.map((col) => col.fieldName);
      let csvContent = headers.join(",") + "\n";

      data.forEach((row) => {
        const rowData = row.map((cell) => {
          const value = cell.formattedValue || String(cell.value) || "";
          if (
            value.toString().includes(",") ||
            value.toString().includes('"')
          ) {
            return `"${value.toString().replace(/"/g, '""')}"`;
          }
          return value;
        });
        csvContent += rowData.join(",") + "\n";
      });

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${activeTab}_filtered_data_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading data:", error);
      alert(
        "Error downloading data. This may be due to permissions on the Tableau dashboard.",
      );
    } finally {
      setIsDownloading(false);
    }
  }, [vizReady, activeTab]);

  const handleReload = () => {
    if (!scriptLoaded) return;
    mountViz(activeTab);
  };

  return (
    <div className="h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="w-full flex-1 lg:pl-[280px] min-h-screen">
        {/* Background Gradients */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-[100px] opacity-60"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-orange-50 rounded-full blur-[100px] opacity-60"></div>
        </div>

        <div className="relative z-10 px-4 lg:px-8 py-4 pt-24">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 ">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#14213D]">
                Pass Through Rate{" "}
                <span className="text-[#F48C25]">Dashboard</span>
              </h1>
              <p className="text-gray-500 text-sm">
                Explore pass through rate data, trends, and key performance
                indicators
              </p>
            </div>

            {/* Download Button */}
            <div className="flex items-center gap-3">
              {vizReady && (
                <span className="text-xs text-green-600 font-medium">
                  ✓ Ready
                </span>
              )}
              {vizLoaded && !vizReady && (
                <span className="text-xs text-amber-600 font-medium">
                  ⏳ Loading...
                </span>
              )}
              {user ? (
                <button
                  onClick={handleDownload}
                  disabled={isDownloading || !vizReady}
                  className="px-4 py-2 bg-gradient-to-r from-[#1B2B4B] to-[#355189] text-white rounded-lg font-semibold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download CSV
                    </>
                  )}
                </button>
              ) : (
                <Link
                  href="/auth"
                  className="px-4 py-2 bg-gradient-to-r from-[#1B2B4B] to-[#355189] text-white rounded-lg font-semibold text-sm hover:opacity-90 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Sign in to Download
                </Link>
              )}
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto pb-2">
            {Object.entries(tabLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
                  activeTab === key
                    ? "bg-gradient-to-r from-[#1B2B4B] to-[#355189] text-white shadow-lg"
                    : "bg-white text-[#64748B] hover:bg-gray-50 border border-[#E1E7EF]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tableau Container - Fixed height, no internal scroll */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#E1E7EF] p-2 overflow-hidden relative">
            {(!vizLoaded || !scriptLoaded) && !vizError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                <Loader2 className="w-10 h-10 animate-spin text-[#355189] mb-3" />
                <span className="text-[#64748B] font-medium">
                  {!scriptLoaded
                    ? "Loading Tableau..."
                    : "Loading dashboard..."}
                </span>
              </div>
            )}
            {vizError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                <p className="text-red-500 mb-4">{vizError}</p>
                <button
                  onClick={handleReload}
                  className="px-4 py-2 bg-[#355189] text-white rounded-lg hover:bg-[#1B2B4B] transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
              </div>
            )}
            <RestrictedViz isFirstTab={activeTab === "PassThroughRate"}>
              <div
                ref={containerRef}
                className="w-full h-full [&>tableau-viz]:w-full [&>tableau-viz]:h-full [&>tableau-viz]:block [&>tableau-viz]:overflow-hidden"
                style={{ overflow: "hidden" }}
              />
            </RestrictedViz>
          </div>

          {/* Analysis Box */}
          <AnalysisBox page="industry/pass-through-rate" tabKey={activeTab} />
        </div>
      </main>
    </div>
  );
}
