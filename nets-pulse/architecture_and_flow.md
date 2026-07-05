# NETS Pulse — Architecture & Map Flow

This document details the software architecture, system flow, component dependencies, and user interaction pathways for the **NETS Pulse** mobile web-app simulator.

---

## 1. System Architecture Overview

NETS Pulse is built as a single-page simulated mobile application inside a Next.js App Router workspace, styled with custom CSS gradients and responsive design principles. 

```mermaid
graph TD
    subgraph Client [Client-Side App]
        AppShell["AppShell.tsx (Main Layout & State)"]
        PulseTab["PulseTab.tsx (Dashboard)"]
        MovesTab["MovesTab.tsx (Transactions)"]
        MapTab["MapTab.tsx (Interactive Map & Split)"]
        GoalsTab["GoalsTab.tsx (Goals & Badges)"]
        ProfileTab["ProfileTab.tsx (Rewards & Wrapped)"]
        
        AppShell --> PulseTab
        AppShell --> MovesTab
        AppShell --> MapTab
        AppShell --> GoalsTab
        AppShell --> ProfileTab
    end

    subgraph Modals [Modals & Drawers]
        SendReceiveModal["SendReceiveModal.tsx"]
        SmartReceiptModal["SmartReceiptModal.tsx"]
        TimeCapsuleModal["TimeCapsuleModal.tsx"]
        TitleEquipModal["TitleEquipModal.tsx"]
        VoucherClaimModal["VoucherClaimModal.tsx"]
        WrappedModal["WrappedModal.tsx"]
    end

    subgraph Data [Data Layer]
        MockData["mockData.ts (Mock States)"]
    end

    subgraph Server [Next.js API Routes]
        ItineraryAPI["/api/itinerary (GENZ AI Handler)"]
    end

    subgraph AI [External API Services]
        DeepSeek["GENZ Chat API (deepseek-chat)"]
    end

    %% Client to Modals Connection
    PulseTab -->|Triggers| SendReceiveModal
    MovesTab -->|Triggers| TimeCapsuleModal
    MapTab -->|Triggers| SmartReceiptModal
    ProfileTab -->|Triggers| TitleEquipModal
    ProfileTab -->|Triggers| WrappedModal
    ProfileTab -->|Triggers| VoucherClaimModal

    %% Data Connections
    PulseTab -.-> MockData
    MovesTab -.-> MockData
    MapTab -.-> MockData
    GoalsTab -.-> MockData
    ProfileTab -.-> MockData

    %% Server Flow
    MapTab -->|POST Location/Budget| ItineraryAPI
    ItineraryAPI -->|Request JSON Schema| DeepSeek
    DeepSeek -->|Returns Structured JSON| ItineraryAPI
    ItineraryAPI -->|Responds with Day Plan| MapTab
```

### Core Architecture Components

1. **App Shell Layer ([AppShell.tsx](file:///c:/Users/janni/OneDrive/Documents/GitHub/PolyFintech/nets-pulse/components/AppShell.tsx))**:
   - Manages active tab state (`activeTab`).
   - Renders the custom mobile chassis device frame with an interactive status bar (9:41 time, battery, wifi metrics) and bottom navigation bar.
2. **Sub-Tab Navigation Pages**:
   - [PulseTab.tsx](file:///c:/Users/janni/OneDrive/Documents/GitHub/PolyFintech/nets-pulse/components/tabs/PulseTab.tsx): Dashboard and quick-action launcher.
   - [MovesTab.tsx](file:///c:/Users/janni/OneDrive/Documents/GitHub/PolyFintech/nets-pulse/components/tabs/MovesTab.tsx): Spending charts (SVG Donut), categories, and scrollable transaction ledgers.
   - [MapTab.tsx](file:///c:/Users/janni/OneDrive/Documents/GitHub/PolyFintech/nets-pulse/components/tabs/MapTab.tsx): Core interactive map canvas, GENZ AI micro-itinerary state-machine, and the group split-ledger dashboard.
   - [GoalsTab.tsx](file:///c:/Users/janni/OneDrive/Documents/GitHub/PolyFintech/nets-pulse/components/tabs/GoalsTab.tsx): Gamification system checking streaks and boosting savings goals.
   - [ProfileTab.tsx](file:///c:/Users/janni/OneDrive/Documents/GitHub/PolyFintech/nets-pulse/components/tabs/ProfileTab.tsx): Equipped achievement titles, claims grid, and user stats.
3. **API Handler Routing ([route.ts](file:///c:/Users/janni/OneDrive/Documents/GitHub/PolyFintech/nets-pulse/app/api/itinerary/route.ts))**:
   - Handles the server-side proxy connection to the `deepseek-chat` model (branded as GENZ AI).
   - Validates environment variables (`DEEPSEEK_API_KEY`) and parses budget, preferences, and location to structure a strict system-level instructions context.
4. **Mock Database System ([mockData.ts](file:///c:/Users/janni/OneDrive/Documents/GitHub/PolyFintech/nets-pulse/lib/mockData.ts))**:
   - Holds centralized baseline definitions for items like user streaks, transaction logs, merchant coordinates, split groups, saving goals, and rewards.

---

## 2. Page & Navigation Flow (The App Map)

The following state flowchart demonstrates how a user moves between tabs, spawns modals, and updates their profile metadata (titles, balances, streaks) dynamically.

```mermaid
graph TD
    Launch([App Launch]) --> TabPulse[Pulse Tab]
    
    %% Navigation
    TabPulse <--> TabMoves[Moves Tab]
    TabMoves <--> TabMap[Map Tab]
    TabMap <--> TabGoals[Goals Tab]
    TabGoals <--> TabProfile[Profile Tab]
    TabProfile <--> TabPulse

    %% Pulse Tab Flow
    subgraph Pulse Flow
        TabPulse -->|Click Send| ModSend[Send Modal]
        TabPulse -->|Click Receive| ModRec[Receive Modal]
        TabPulse -->|Click Top Up| ModTop[Top Up Modal]
        
        ModSend -->|Select User & Amt| ConfSend[Confirm Screen]
        ConfSend -->|Click Send Now| SuccessSend[Done Screen]
        
        ModRec -->|Enter Req Amt| SuccessRec[QR Request Generated]
        
        ModTop -->|Select Preset/Custom Amt| ConfTop[Confirm Top Up]
        ConfTop -->|Click Add Funds| SuccessTop[Balance Updated]
    end

    %% Moves Tab Flow
    subgraph Moves Flow
        TabMoves -->|Click Time Capsule| ModCapsule[Time Capsule Modal]
        TabMoves -->|Type Search Query| FilterTxs[Filtered Transactions]
        TabMoves -->|Click Category Pill| FilterTxs
    end

    %% Map Tab Flow
    subgraph Map Flow
        TabMap -->|Change Filter Option| UpdateMapPins[Refresh Pin Glow/Sizes]
        TabMap -->|Click Map Pin| SetSelectedMerchant[Drawer Updates Selected Merchant]
        
        %% Drawer Buttons
        SetSelectedMerchant -->|Click Smart Receipt| ModReceipt[Smart Receipt Modal]
        SetSelectedMerchant -->|Click Split| DrawSplit[Group Split Drawer]
        SetSelectedMerchant -->|Click AI Itinerary| DrawItinerary[AI Itinerary Prompt Drawer]
    end

    %% Goals Tab Flow
    subgraph Goals Flow
        TabGoals -->|Click Toggle| GoalsTabState{Active View?}
        GoalsTabState -->|Goals| GoalsList[Check Progress & Goals]
        GoalsTabState -->|Badges| BadgesGrid[View unlocked/locked badges]
        
        GoalsList -->|Click Boost Save| BoostModal[Boost Amount Drawer]
        BoostModal -->|Confirm Amount| TriggerConfetti[Render Confetti particles & Bump Saved state]
        
        TabGoals -->|Click Add Icon +| AddGoalDrawer[Create Saving Goal Drawer]
        AddGoalDrawer -->|Submit Form| SaveGoal[Append New Goal & Run Confetti]
        
        TabGoals -->|Click Check In| IncStreak[Streak count incremented & Confetti run]
    end

    %% Profile Tab Flow
    subgraph Profile Flow
        TabProfile -->|Click Change Title| TitleModal[Title Equip Modal]
        TitleModal -->|Select Title| SetEquippedTitle[Header Title Updates]
        
        TabProfile -->|Click Payment Replay| WrappedModal[Wrapped slideshow modal]
        TabProfile -->|Click Unlocked Voucher| VoucherModal[Voucher Claim modal with QR code]
    end
```

---

## 3. Map Tab Sub-Flows

The **Map Tab** is the most complex component of the application. It houses three distinct sub-flows that connect visual feedback to back-end endpoints.

### Sub-Flow A: AI Micro-Itinerary State Machine
The AI itinerary guides the user from prompt creation to a mock transaction sequence at overseas merchants.

```mermaid
stateDiagram-v2
    [*] --> Prompt : Click "AI Itinerary" in Drawer
    Prompt --> Loading : Enter location, budget, vibes + Click "Generate"
    Loading --> Error : API call fails (Missing API Key / Timeout)
    Loading --> Result : Successfully returns GENZ JSON payload
    Error --> Prompt : Click "Try Again"
    
    Result --> Prompt : Click "Regenerate"
    Result --> Active : Select Stops + Click "Start Itinerary"
    
    state Active {
        [*] --> PayStop1
        PayStop1 --> Scanning : Click "Pay with NETS QR"
        Scanning --> Receipt1 : 1.5s timeout (Mock successful scan)
        Receipt1 --> PayStop2 : Close Smart Receipt (Increment index)
        PayStop2 --> Scanning2
        Scanning2 --> Completed : Final Stop Paid
    }
    
    Active --> Result : Click "Cancel Journey"
    Completed --> SplitBill : Click "Split Bill with Friends"
    Completed --> [*] : Click "Back to Map"
```

### Sub-Flow B: Group Split & Ledger Reconciliation
This flow details how costs are split and reconciled within a travel group.

```mermaid
flowchart TD
    StartSplit[Enter Group Split Drawer] --> LoadBill[Load paid bill amount]
    LoadBill --> ShowQR[Display stylized NETS QR Group Split Code]
    LoadBill --> CalcSplit[Calculate SGD cost per person = Total / 5]
    
    ShowQR --> ListBalances[Display Group Split Balances]
    ListBalances --> Ledger{Cloned Smart Ledger expanded?}
    
    Ledger -->|Yes| ShowItems[Show raw line-item breakdown + Save receipt button]
    Ledger -->|No| SummarizeItems[Display receipt totals & table summary]

    ListBalances --> Action{Reconciliation Action}
    Action -->|Record PayNow/Cash| MarkSettled[Update member status to Settled + Timestamp]
    Action -->|Undo Settlement| RollbackMember[Revert member status to Owes SGD]
    Action -->|Click Settle All via Bank Direct| SettleAll[Mark everyone settled + Settle Screen displays + Streak +1]
```

---

## 4. Key Data Models & Schemas

Here are the central JSON interfaces defined dynamically or read from `mockData.ts` to power client interactions.

### GENZ AI Itinerary API Response Schema
API Route: `/api/itinerary`
```typescript
interface AIResult {
  title: string;             // A catchy travel day title
  subtitle: string;          // Subheader describing the itinerary's vibe
  totalBudgetNote: string;   // Local price vs SGD estimate e.g. "≈ ฿1,680 ≈ SGD 60"
  currencySymbol: string;    // e.g. "฿", "¥", "RM"
  currencyCode: string;      // e.g. "THB", "JPY", "MYR"
  rateToSGD: number;         // e.g. 28 (exchange rate denominator)
  merchants: {
    id: number;
    icon: string;            // Emoji matching the category
    name: string;            // Name of the local merchant
    category: string;        // Shop type
    rating: number;          // 4.0 - 5.0 rating scale
    priceLocal: number;      // Itemized local price
    netsQr: boolean;         // Hardcoded true
  }[];
}
```

### Group Split Member Schema
```typescript
interface SplitGroupMember {
  id: number;
  name: string;
  avatar: string;
  color: string;             // Hex code for avatar badge styling
  owes: number;              // Owed SGD amount
  settled: boolean;          // Settlement checklist state
  method: string | null;     // Settle medium: PayNow, Cash, Bank Transfer, NETS QR
  settledAt: string | null;  // Timestamp
  note?: string;             // Remarks (e.g. "Paid at restaurant")
}
```

---

## 5. Architectural Recommendations

> [!TIP]
> **State Management Optimization**
> Currently, state updates (like adding a custom Goal, settling Split balances, or finishing an active AI Journey) live entirely in local component state. If the user shifts tabs, some modal-dependent flows might reset.
> To persist this data across tabs, consider migrating `USER`, `GOALS`, and `splitGroup` to a lightweight React Context Provider or state store (e.g., Zustand) mounted at the [AppShell.tsx](file:///c:/Users/janni/OneDrive/Documents/GitHub/PolyFintech/nets-pulse/components/AppShell.tsx) level.

> [!IMPORTANT]
> **API Key Safety**
> Ensure `DEEPSEEK_API_KEY` is kept secure. Never commit it to git. Maintain the current architecture where the key is only read within [route.ts](file:///c:/Users/janni/OneDrive/Documents/GitHub/PolyFintech/nets-pulse/app/api/itinerary/route.ts) on the server side, keeping the key invisible to client-side browsers.
