"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, RefreshCw } from "lucide-react";
import Footer from "@/components/Footer";
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
  bankDeepDive:
    "https://public.tableau.com/views/CustomDataVisualization/Dashboard",
  peerComparison:
    "https://public.tableau.com/views/CustomDataVisualization/Dashboardperbank",
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
        getSummaryDataAsync: () => Promise<any>;
      }>;
      getSummaryDataAsync: () => Promise<any>;
    };
  };
}

export default function CustomDataVisualization() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("bankDeepDive");
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
    bankDeepDive: "Bank Deep Dive",
    peerComparison: "Peer Comparison",
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
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => setVizError("Failed to load Tableau library");
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

  const handleReload = () => {
    if (!scriptLoaded) return;
    mountViz(activeTab);
  };

  return (
    <div className="h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
      <Sidebar />
      <main className="w-full flex-1 lg:pl-[280px] min-h-screen">
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-[100px] opacity-60"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-orange-50 rounded-full blur-[100px] opacity-60"></div>
        </div>

        <div className="relative z-10 px-4 lg:px-8 py-4 pt-24">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#14213D]">
                Custom{" "}
                <span className="text-[#F48C25]">Data Visualization</span>
              </h1>
              <p className="text-gray-500 text-sm">
                In-depth bank analysis and peer comparisons
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
            {Object.entries(tabLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 whitespace-nowrap ${
                  activeTab === key
                    ? "bg-[#14213D] text-white shadow-lg shadow-blue-900/20 translate-y-[-2px]"
                    : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 p-3 h-[calc(100vh-280px)] min-h-[500px] relative overflow-hidden group">
            {(!vizLoaded || !scriptLoaded) && !vizError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-blue-600 text-xs">
                    %
                  </div>
                </div>
                <span className="mt-4 text-[#14213D] font-bold">
                  {!scriptLoaded
                    ? "Initializing Engine..."
                    : "Rendering Visualization..."}
                </span>
              </div>
            )}

            {vizError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                  <RefreshCw className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-red-500 font-semibold mb-4">{vizError}</p>
                <button
                  onClick={handleReload}
                  className="px-6 py-2 bg-[#14213D] text-white rounded-xl hover:bg-black transition-all font-bold"
                >
                  Retry Connection
                </button>
              </div>
            )}

            <RestrictedViz isFirstTab={activeTab === "bankDeepDive"}>
              <div
                ref={containerRef}
                className="w-full h-full [&>tableau-viz]:w-full [&>tableau-viz]:h-full [&>tableau-viz]:block"
              />
            </RestrictedViz>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}
